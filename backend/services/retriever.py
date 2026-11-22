import re
from typing import List, Dict, Set, Tuple
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from db.chroma_client import get_chroma_client, get_existing_collection
from config import GROQ_API_KEY, GROQ_MODEL, TOP_K_RESULTS

# Maximum total characters sent in a single LLM prompt (~10,000-11,000 tokens),
# leaving ample headroom for comprehensive answers without hitting rate limits.
MAX_CONTEXT_CHARS = 38000

STOPWORDS = {
    "the", "and", "for", "with", "that", "this", "from", "are", "was", "were",
    "have", "has", "had", "what", "when", "where", "which", "who", "how", "why",
    "can", "could", "would", "should", "about", "into", "your", "their", "there",
    "here", "document", "file", "pdf", "page", "pages", "tell", "give", "show",
    "explain", "list", "please", "does", "did", "not", "but", "all", "any",
    "more", "some", "than", "then", "them", "they", "been", "being", "also",
}

SUMMARY_PATTERNS = re.compile(
    r"\b(summar(?:y|ize|ise)|overview|key\s+points|main\s+points|takeaways|"
    r"highlights|complete|everything|all\s+topics|a\s+to\s+z|whole|entire|"
    r"outline|table\s+of\s+contents|syllabus|breakdown|brief|abstract|"
    r"conclusion|what\s+is\s+this\s+(?:document|pdf|file|lecture|paper)\s+about)\b",
    re.IGNORECASE,
)

PAGE_QUERY_PATTERN = re.compile(
    r"\bpages?\s*(\d+)(?:\s*(?:-|to|through|and|,)\s*(\d+))?\b",
    re.IGNORECASE,
)

llm = ChatGroq(
    model=GROQ_MODEL,
    temperature=0.1,
    api_key=GROQ_API_KEY,
)

SYSTEM_PROMPT = """You are DocuMind, an expert, high-precision document analysis and Q&A assistant.
Answer the user's question thoroughly and accurately using ONLY the document context provided below.

Document Metadata:
- Total Extracted Pages: {total_pages}
- Retrieval Mode: {retrieval_mode}

Strict Rules:
1. Grounding & Accuracy:
   - Rely strictly on the facts, numbers, formulas, names, dates, and definitions present in the provided context.
   - Never invent or fabricate facts outside the document.
   - If the user asks a broad or summary question (e.g., "Summarize", "Explain from A to Z", "List all skills/topics/questions"), synthesize a comprehensive, complete answer covering EVERY major section, page range, or topic shown in the context from start to finish. Do not leave out sections.
   - If the user asks a specific question, answer it directly, completely, and include all relevant supporting details from the context.
   - Only say "I could not find this information in the document." if the context genuinely contains nothing related to the question.
2. Language Adaptation:
   - Respond in the language appropriate to the user's query (English by default, or Urdu/Roman Urdu if the user explicitly asks in Urdu/Roman Urdu).
3. Formatting & Citations:
   - Organize multi-part answers, lists, or summaries under clear Markdown headings (`### Heading Name`).
   - Use crisp bullet points with bold lead-in labels where helpful: `- **Topic / Label:** Detailed explanation. [Page 1]`
   - Always cite the source page(s) using `[Page X]` placed AFTER the period at the end of the sentence or bullet (e.g., `...as shown in the regression formula. [Page 22]`).
   - Never write multi-page ranges inside a single bracket like `[Page 1-3]`; instead write `[Page 1] [Page 2]`.

Context from Document:
{context}
"""


def _extract_query_terms(question: str) -> List[str]:
    words = re.findall(r"[a-z0-9+#.-]{2,}", question.lower())
    return [w for w in words if w not in STOPWORDS]


def _extract_requested_pages(question: str, max_page: int) -> List[int]:
    pages: Set[int] = set()
    for match in PAGE_QUERY_PATTERN.finditer(question):
        start_p = int(match.group(1))
        end_p = int(match.group(2)) if match.group(2) else start_p
        if start_p > end_p:
            start_p, end_p = end_p, start_p
        for p in range(max(1, start_p), min(max_page, end_p) + 1):
            pages.add(p)
    return sorted(pages)


def _lexical_score(text: str, query_terms: List[str], raw_question: str) -> float:
    if not query_terms:
        return 0.0
    lower_text = text.lower()
    score = 0.0
    matched_unique = 0
    for term in query_terms:
        count = lower_text.count(term)
        if count > 0:
            matched_unique += 1
            weight = 3.0 if len(term) >= 5 else 1.8
            score += weight * (1.0 + min(count, 4) * 0.25)
    # Bonus when multiple distinct query keywords appear in the same chunk
    if matched_unique > 1:
        score *= 1.0 + 0.2 * (matched_unique - 1)
    # Phrase bonus
    q_clean = " ".join(query_terms[:4])
    if len(q_clean) >= 6 and q_clean in lower_text:
        score += 6.0
    return score


def _strip_chunk_header(doc_text: str) -> str:
    return re.sub(r"^\[Page\s+\d+(?:\s+of\s+\d+)?\]\s*\n?", "", doc_text).strip()


def _select_full_coverage_chunks(
    items: List[Dict], char_budget: int
) -> Tuple[List[Dict], str]:
    """
    When the entire document fits inside char_budget, return ALL chunks in
    exact page/chunk order. If the document is larger than char_budget,
    proportionally sample across every single page from Page 1 to Page N
    so the summary covers the entire document A-to-Z.
    """
    items_sorted = sorted(
        items,
        key=lambda x: (
            x["meta"].get("page_number", 1),
            x["meta"].get("chunk_index", 0),
        ),
    )
    total_chars = sum(len(x["text"]) + 24 for x in items_sorted)

    if total_chars <= char_budget:
        return items_sorted, "Complete Document (100% Full-Text Coverage)"

    # Group chunks by page so every page gets represented in A-to-Z order
    by_page: Dict[int, List[Dict]] = {}
    for it in items_sorted:
        p = int(it["meta"].get("page_number", 1))
        by_page.setdefault(p, []).append(it)

    num_pages = max(len(by_page), 1)
    per_page_budget = max(int(char_budget / num_pages), 280)

    selected: List[Dict] = []
    used_chars = 0

    for p in sorted(by_page.keys()):
        page_chunks = by_page[p]
        page_text_combined = "\n".join(_strip_chunk_header(c["text"]) for c in page_chunks)
        if len(page_text_combined) > per_page_budget:
            # Take beginning and end of the page to preserve headings + conclusions
            half = max((per_page_budget - 20) // 2, 100)
            trimmed = (
                page_text_combined[:half].strip()
                + " ... "
                + page_text_combined[-half:].strip()
            )
        else:
            trimmed = page_text_combined

        entry = {
            "id": page_chunks[0]["id"],
            "text": trimmed,
            "meta": page_chunks[0]["meta"],
        }
        if used_chars + len(trimmed) <= char_budget + 1500:
            selected.append(entry)
            used_chars += len(trimmed)

    return selected, f"Full-Document A-to-Z Stratified Coverage ({num_pages} Pages)"


def retrieve_and_answer(question: str, document_id: str) -> Dict:
    """
    Adaptive Hybrid RAG + Full-Context Retrieval Engine:
    1. Fetches all chunks from the session-scoped ChromaDB collection.
    2. For small/medium PDFs (<= 38,000 chars total), passes the ENTIRE document
       in page order so the LLM never misses any fact, table, or section.
    3. For large PDFs:
       - If the user asks for a summary/overview/A-to-Z breakdown, builds a
         stratified representation across every page from Page 1 to Page N.
       - If the user asks about specific page(s), retrieves all chunks from those pages
         plus top semantic/lexical matches.
       - Otherwise runs Hybrid Search (Chroma semantic vector similarity + BM25-style
         keyword scoring + neighboring chunk window expansion) and sorts selected
         chunks in reading order.
    """
    client = get_chroma_client()
    try:
        collection = get_existing_collection(client, document_id)
    except Exception:
        raise LookupError("Document collection not found for this session")

    total_chunks = collection.count()
    if total_chunks == 0:
        return {
            "answer": "No relevant content found in the document.",
            "sources": [],
        }

    # Fetch all chunks and metadata for the document
    all_data = collection.get(include=["documents", "metadatas"])
    all_docs = all_data.get("documents") or []
    all_metas = all_data.get("metadatas") or []
    all_ids = all_data.get("ids") or []

    items: List[Dict] = []
    for doc_id, doc_text, meta in zip(all_ids, all_docs, all_metas):
        items.append({
            "id": doc_id,
            "text": _strip_chunk_header(doc_text or ""),
            "raw_text": doc_text or "",
            "meta": meta or {"page_number": 1, "chunk_index": 0},
        })

    items.sort(
        key=lambda x: (
            int(x["meta"].get("page_number", 1)),
            int(x["meta"].get("chunk_index", 0)),
        )
    )

    all_pages = sorted({int(x["meta"].get("page_number", 1)) for x in items})
    max_page = max(all_pages) if all_pages else 1
    total_pages = len(all_pages)
    total_doc_chars = sum(len(x["text"]) + 20 for x in items)

    requested_pages = _extract_requested_pages(question, max_page)
    is_summary_query = bool(SUMMARY_PATTERNS.search(question))

    selected_items: List[Dict] = []
    retrieval_mode = "Hybrid Semantic + Lexical Retrieval"

    # Case 1: The entire document fits comfortably inside our context window!
    # Pass 100% of the document in reading order so accuracy is A-to-Z complete.
    if total_doc_chars <= MAX_CONTEXT_CHARS and not requested_pages:
        selected_items = items
        retrieval_mode = f"Complete A-to-Z Document Context ({total_pages} Pages)"

    # Case 2: User asked for specific page(s) (e.g., "What is on page 12?" or "Pages 5 to 8")
    elif requested_pages:
        page_set = set(requested_pages)
        selected_items = [
            it for it in items if int(it["meta"].get("page_number", 1)) in page_set
        ]
        if not selected_items:
            selected_items, retrieval_mode = _select_full_coverage_chunks(
                items, MAX_CONTEXT_CHARS
            )
        else:
            retrieval_mode = f"Direct Page Inspection (Page {', '.join(map(str, requested_pages))})"

    # Case 3: Large PDF + Summary / Overview / A-to-Z query
    elif is_summary_query:
        selected_items, retrieval_mode = _select_full_coverage_chunks(
            items, MAX_CONTEXT_CHARS
        )

    # Case 4: Large PDF + Specific question -> Hybrid Vector + Lexical + Neighbor Expansion
    else:
        n_query = min(max(TOP_K_RESULTS * 2, 24), total_chunks)
        vec_results = collection.query(
            query_texts=[question],
            n_results=n_query,
            include=["documents", "metadatas", "distances"],
        )

        vec_ranks: Dict[str, int] = {}
        vec_distances: Dict[str, float] = {}
        if vec_results and vec_results.get("ids") and vec_results["ids"][0]:
            for rank_idx, cid in enumerate(vec_results["ids"][0]):
                vec_ranks[cid] = rank_idx
                dist = (
                    vec_results["distances"][0][rank_idx]
                    if vec_results.get("distances")
                    else 0.5
                )
                vec_distances[cid] = float(dist)

        query_terms = _extract_query_terms(question)

        scored_indices: List[Tuple[float, int]] = []
        for idx, it in enumerate(items):
            cid = it["id"]
            # Semantic score via Reciprocal Rank Fusion + cosine similarity
            if cid in vec_ranks:
                rank = vec_ranks[cid]
                dist = vec_distances.get(cid, 0.5)
                sem_score = (1.0 / (10 + rank)) * 25.0 + max(0.0, 1.0 - dist) * 4.0
            else:
                sem_score = 0.0

            lex_score = _lexical_score(it["text"], query_terms, question)
            combined_score = sem_score + lex_score
            scored_indices.append((combined_score, idx))

        scored_indices.sort(key=lambda x: x[0], reverse=True)

        chosen_indices: Set[int] = set()
        used_chars = 0

        # Always include top matches and their immediate neighboring chunks on the same page
        for score, idx in scored_indices:
            if len(chosen_indices) >= TOP_K_RESULTS and used_chars >= MAX_CONTEXT_CHARS * 0.75:
                break
            if score <= 0 and len(chosen_indices) >= 6:
                break

            for candidate_idx in (idx, idx - 1, idx + 1):
                if 0 <= candidate_idx < len(items) and candidate_idx not in chosen_indices:
                    # Only expand to neighbor if on the same or adjacent page
                    if candidate_idx != idx:
                        p_main = int(items[idx]["meta"].get("page_number", 1))
                        p_cand = int(items[candidate_idx]["meta"].get("page_number", 1))
                        if abs(p_main - p_cand) > 1:
                            continue
                    c_len = len(items[candidate_idx]["text"]) + 24
                    if used_chars + c_len <= MAX_CONTEXT_CHARS:
                        chosen_indices.add(candidate_idx)
                        used_chars += c_len

        if not chosen_indices:
            chosen_indices = set(range(min(len(items), TOP_K_RESULTS)))

        # Sort chosen chunks in natural document reading order
        selected_items = [items[i] for i in sorted(chosen_indices)]
        retrieval_mode = f"Hybrid Vector + Keyword Retrieval ({len(selected_items)} chunks)"

    # Group consecutive selected chunks by page for clean, non-repetitive context
    page_blocks: List[str] = []
    current_page = None
    current_texts: List[str] = []
    cited_pages_ordered: List[int] = []

    for it in selected_items:
        p = int(it["meta"].get("page_number", 1))
        if p not in cited_pages_ordered:
            cited_pages_ordered.append(p)
        if p != current_page:
            if current_page is not None and current_texts:
                page_blocks.append(
                    f"=== [Page {current_page}] ===\n" + "\n\n".join(current_texts)
                )
            current_page = p
            current_texts = [it["text"]]
        else:
            current_texts.append(it["text"])

    if current_page is not None and current_texts:
        page_blocks.append(
            f"=== [Page {current_page}] ===\n" + "\n\n".join(current_texts)
        )

    context = "\n\n---\n\n".join(page_blocks)
    if len(context) > MAX_CONTEXT_CHARS + 4000:
        context = context[: MAX_CONTEXT_CHARS + 4000]

    prompt = ChatPromptTemplate.from_messages([
        ("system", SYSTEM_PROMPT),
        ("human", "{question}"),
    ])

    chain = prompt | llm
    response = chain.invoke({
        "total_pages": total_pages,
        "retrieval_mode": retrieval_mode,
        "context": context,
        "question": question,
    })

    answer_text = (response.content or "").strip()

    # Extract explicit page citations from the generated answer if present,
    # otherwise return the retrieved source pages
    explicit_pages = sorted({
        int(m.group(1))
        for m in re.finditer(r"\[Page[\s\u00a0\u202f]+(\d+)\]", answer_text, re.IGNORECASE)
        if 1 <= int(m.group(1)) <= max_page
    })

    source_pages = explicit_pages if explicit_pages else sorted(set(cited_pages_ordered))[:12]

    return {
        "answer": answer_text,
        "sources": source_pages,
    }
