from utils.extract_json import get_json
from utils.parse_pdf import parse
from utils.json_to_xml import get_xml
from utils.explain import highlight_words_in_pdf
from pathlib import Path
import argparse


def main(leistungsverzeichnis: str):
    """
    takes a Leistungsverzeichnis and converts it into an XML file
    """
    name = Path(leistungsverzeichnis).stem
    out_dir = Path(f"data/output/{name}.md")
    out_dir.parent.mkdir(parents=True, exist_ok=True)

    markdown = parse(leistungsverzeichnis, str(out_dir))
    jsons = get_json(markdown)
    names = [entry["name"] for entry in jsons]
    xml = get_xml(jsons, markdown)

    out_pdf = f"data/output/{name}_highlighted.pdf"
    highlight_words_in_pdf(leistungsverzeichnis, out_pdf, names)

    return xml, out_pdf


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Convert Leistungsverzeichnis PDF to XML and highlight elements.")
    parser.add_argument("pdf_path", help="Path to the Leistungsverzeichnis PDF file")
    args = parser.parse_args()

    xml_output, highlighted_pdf = main(args.pdf_path)
    print("XML and highlighted PDF created:")
    print("XML Output:", xml_output)
    print("Highlighted PDF:", highlighted_pdf)
