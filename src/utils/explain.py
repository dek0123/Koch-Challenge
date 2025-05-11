import fitz  

def highlight_words_in_pdf(input_path, output_path, words_to_highlight):
    doc = fitz.open(input_path)
    for page in doc:
        for word in words_to_highlight:
            text_instances = page.search_for(word)
            for inst in text_instances:
                highlight = page.add_highlight_annot(inst)
                highlight.update()
    doc.save(output_path, garbage=4, deflate=True)