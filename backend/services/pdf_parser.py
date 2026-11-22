import fitz  # PyMuPDF
from typing import List, Dict

def extract_text_by_page(pdf_path: str) -> List[Dict]:
    """
    Extract text from each page of a PDF.
    Returns a list of dicts: { page_number, text }
    """
    doc = fitz.open(pdf_path)
    pages = []

    for page_num in range(len(doc)):
        page = doc[page_num]
        text = page.get_text("text").strip()
        if text:  # skip empty pages
            pages.append({
                "page_number": page_num + 1,
                "text": text
            })

    doc.close()
    return pages
