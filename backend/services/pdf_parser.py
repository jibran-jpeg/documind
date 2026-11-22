import re
import pymupdf
import numpy as np
from typing import List, Dict

_ocr_engine = None


def _get_ocr_engine():
    """
    Lazy singleton for RapidOCR configured for fast, accurate slide/scanned-page OCR on CPU.
    """
    global _ocr_engine
    if _ocr_engine is not None:
        return _ocr_engine

    try:
        from rapidocr_onnxruntime import RapidOCR

        engine = RapidOCR()
        engine.use_angle_cls = False
        for op in getattr(engine.text_detector, "preprocess_op", []):
            if hasattr(op, "limit_side_len"):
                op.limit_side_len = 360
        if hasattr(engine.text_detector, "postprocess_op"):
            engine.text_detector.postprocess_op.dilation_kernel = np.ones(
                (2, 14), dtype=np.uint8
            )
        if hasattr(engine, "text_recognizer"):
            engine.text_recognizer.rec_image_shape = [3, 32, 320]
            engine.text_recognizer.rec_batch_num = 16
        _ocr_engine = engine
    except Exception:
        _ocr_engine = False

    return _ocr_engine


def _clean_text_lines(raw_text: str) -> str:
    """
    Clean extracted text: fix soft-hyphen line breaks, collapse horizontal padding,
    and preserve meaningful paragraph/table structure.
    """
    if not raw_text:
        return ""

    # Join words split across lines with trailing hyphens (e.g. "inter-\nnational")
    text = re.sub(r"([A-Za-z])-\r?\n\s*([a-z])", r"\1\2", raw_text)

    lines: List[str] = []
    for raw_line in text.splitlines():
        cleaned = " ".join(raw_line.split())
        if cleaned:
            # Merge standalone bullet markers with the following line if possible
            if lines and lines[-1] in {"•", "-", "▪", "◦", "*"}:
                lines[-1] = f"{lines[-1]} {cleaned}"
            else:
                lines.append(cleaned)
        elif lines and lines[-1] != "":
            lines.append("")

    return "\n".join(lines).strip()


def _extract_tables_text(page: pymupdf.Page) -> str:
    """
    Extract structured tables from a page so multi-column rows stay aligned.
    """
    try:
        finder = page.find_tables()
        if not finder or not finder.tables:
            return ""
        table_blocks: List[str] = []
        for tbl in finder.tables:
            rows = tbl.extract()
            if not rows or len(rows) < 2:
                continue
            formatted_rows: List[str] = []
            for row in rows:
                cells = [
                    " ".join((cell or "").split())
                    for cell in row
                ]
                if any(cells):
                    formatted_rows.append(" | ".join(c for c in cells if c))
            if len(formatted_rows) >= 2:
                table_blocks.append("\n".join(formatted_rows))
        return "\n\n".join(table_blocks)
    except Exception:
        return ""


def _extract_form_widgets(page: pymupdf.Page) -> str:
    """
    Extract filled PDF form fields/widgets if present on the page.
    """
    try:
        widgets = list(page.widgets() or [])
        if not widgets:
            return ""
        pairs: List[str] = []
        for w in widgets:
            label = (w.field_label or w.field_name or "").strip()
            val = str(w.field_value or "").strip()
            if label and val:
                pairs.append(f"{label}: {val}")
            elif val:
                pairs.append(val)
        return "\n".join(pairs)
    except Exception:
        return ""


def _ocr_page_if_needed(page: pymupdf.Page, existing_text: str) -> str:
    """
    Run local OCR when a page is scanned or contains slide images/diagrams
    with little or no selectable text.
    """
    ocr = _get_ocr_engine()
    if not ocr:
        return ""

    try:
        pix = page.get_pixmap(dpi=68)
        img_bytes = pix.tobytes("jpeg")
        res, _ = ocr(img_bytes, unclip_ratio=1.85)
        if not res:
            return ""

        existing_norm = re.sub(r"[^a-z0-9]+", "", existing_text.lower())
        ocr_lines: List[str] = []
        for item in res:
            line = " ".join(str(item[1]).split())
            if not line or len(line) < 2:
                continue
            line_norm = re.sub(r"[^a-z0-9]+", "", line.lower())
            if line_norm and line_norm in existing_norm:
                continue
            ocr_lines.append(line)

        return "\n".join(ocr_lines).strip()
    except Exception:
        return ""


def extract_text_by_page(pdf_path: str) -> List[Dict]:
    """
    Comprehensively extract text from every page of a PDF (A to Z):
    1. Layout-sorted native text (handles multi-column resumes, textbooks, slides)
    2. Structured table extraction when tables exist
    3. Interactive form fields/widgets
    4. Automatic local OCR fallback for scanned pages or image-based lecture slides
    Returns a list of dicts: { page_number, text }
    """
    doc = pymupdf.open(pdf_path)
    pages: List[Dict] = []

    try:
        for page_num in range(len(doc)):
            page = doc[page_num]

            # 1. Native layout-sorted text
            raw_sorted = page.get_text("text", sort=True)
            cleaned_text = _clean_text_lines(raw_sorted)

            # Fallback to block extraction if sort=True yielded nothing
            if not cleaned_text:
                blocks = page.get_text("blocks") or []
                blocks_sorted = sorted(blocks, key=lambda b: (round(b[1], 1), round(b[0], 1)))
                block_text = "\n".join(
                    str(b[4]).strip() for b in blocks_sorted if len(b) > 4 and str(b[4]).strip()
                )
                cleaned_text = _clean_text_lines(block_text)

            # 2. Form fields / widgets
            widgets_text = _extract_form_widgets(page)
            if widgets_text:
                cleaned_text = f"{cleaned_text}\n{widgets_text}".strip()

            # 3. Structured tables (append if table rows add structured context)
            if len(cleaned_text) < 2500:
                table_text = _extract_tables_text(page)
                if table_text and len(table_text) > len(cleaned_text) * 0.5:
                    # Replace or supplement when page is predominantly a table
                    if "|" not in cleaned_text:
                        cleaned_text = f"{cleaned_text}\n\n[Structured Table]\n{table_text}".strip()

            # 4. Automatic OCR for scanned PDFs or image-heavy lecture slides
            images_on_page = page.get_images(full=True)
            if (len(cleaned_text) < 160 and len(images_on_page) > 0) or len(cleaned_text) == 0:
                ocr_text = _ocr_page_if_needed(page, cleaned_text)
                if ocr_text:
                    cleaned_text = (
                        f"{cleaned_text}\n{ocr_text}".strip()
                        if cleaned_text
                        else ocr_text
                    )

            if cleaned_text:
                pages.append({
                    "page_number": page_num + 1,
                    "text": cleaned_text,
                })
    finally:
        doc.close()

    return pages
