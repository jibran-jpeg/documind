from langchain_groq import ChatGroq
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.prompts import ChatPromptTemplate
from db.chroma_client import get_chroma_client, get_or_create_collection
from config import GROQ_API_KEY, TOP_K_RESULTS
from typing import List, Dict

embeddings_model = HuggingFaceEmbeddings(
    model_name="all-MiniLM-L6-v2"
)

llm = ChatGroq(
    model="llama-3.1-8b-instant",
    temperature=0,
    api_key=GROQ_API_KEY
)

SYSTEM_PROMPT = """You are a precise document assistant. Answer the user's question using ONLY the context provided below.

Rules:
- Only use information from the provided context
- If the answer is not in the context, say "I could not find this information in the document"
- Be concise and direct
- Do not make up or infer information not present in the context

Context:
{context}
"""

def retrieve_and_answer(question: str, document_id: str) -> Dict:
    """
    1. Embed the question
    2. Search ChromaDB for top-k similar chunks
    3. Build prompt with retrieved context
    4. Get LLM answer
    5. Return answer + source pages
    """

    # Step 1: Embed question
    question_vector = embeddings_model.embed_query(question)

    # Step 2: Search ChromaDB
    client = get_chroma_client()
    collection = get_or_create_collection(client, document_id)

    results = collection.query(
        query_embeddings=[question_vector],
        n_results=TOP_K_RESULTS,
        include=["documents", "metadatas", "distances"]
    )

    if not results["documents"][0]:
        return {
            "answer": "No relevant content found in the document.",
            "sources": []
        }

    # Step 3: Build context from retrieved chunks
    retrieved_chunks = results["documents"][0]
    retrieved_metadatas = results["metadatas"][0]

    context = "\n\n---\n\n".join(retrieved_chunks)

    # Step 4: Generate answer with LLM
    prompt = ChatPromptTemplate.from_messages([
        ("system", SYSTEM_PROMPT),
        ("human", "{question}")
    ])

    chain = prompt | llm
    response = chain.invoke({
        "context": context,
        "question": question
    })

    # Step 5: Extract unique source pages
    source_pages = list(set([
        meta["page_number"] for meta in retrieved_metadatas
    ]))
    source_pages.sort()

    return {
        "answer": response.content,
        "sources": source_pages
    }
