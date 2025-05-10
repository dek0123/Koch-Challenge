from utils.model import response
from utils.extract_json import get_json
from utils.parse_pdf import parse
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
    xml = get_xml(jsons, markdown)


    return xml