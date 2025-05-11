from utils.extract_json import get_json
from utils.parse_pdf import parse
from utils.json_to_xml import get_xml
from utils.explain import highlight_words_in_pdf
import os
from pathlib import Path



def main(leistungsverzeichnis: str):
    """
    takes a Leistungsverzeichnis and converts into XML file

    Args:
        leistungsverzeichnis (str): path to the Leistungsverzeichnis pdf
    """
    name = Path(leistungsverzeichnis).stem
    out_dir.parent.mkdir(parents=True, exist_ok=True)
    out_dir = fr"data/output/{name}.md"

    markdown = parse(leistungsverzeichnis, out_dir)
    jsons = get_json(markdown)
    names = [jsons[i]["name"] for i in range(len(jsons))]
    xml = get_xml(jsons, markdown)
    out_pdf = fr"data/output/{name}_highlighted.pdf"
    highlight_words_in_pdf(leistungsverzeichnis, out_pdf, names)

    return xml, out_pdf