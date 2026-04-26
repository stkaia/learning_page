import fitz  # PyMuPDF
import sys
import re

pdf_path = sys.argv[1]

try:
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
    
    print("Extraction successful. Total characters:", len(text))
    
    # Save the full text for my own review
    with open("extracted_pdf_text.txt", "w", encoding="utf-8") as f:
        f.write(text)
        
    # Search for "FiSi"
    fisi_blocks = []
    # Simple split by some delimiter (e.g., double newline or "Aufgabe")
    blocks = re.split(r'Aufgabe|AUFGABE', text)
    
    for block in blocks:
        if 'FiSi' in block or 'fisi' in block.lower():
            fisi_blocks.append(block.strip())
            
    print(f"Found {len(fisi_blocks)} blocks containing 'FiSi'.")
    for i, b in enumerate(fisi_blocks[:5]):
        print(f"--- Block {i} ---")
        print(b[:500]) # print first 500 chars of block
        
except Exception as e:
    print("Error:", e)
