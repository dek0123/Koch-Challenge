import xml.etree.ElementTree as ET
import xml.dom.minidom as minidom
import re
from pathlib import Path



def find_first_match(text, patterns):
    """
    Searches the text for the first match of a list of regular expression patterns.
    
    Returns the first captured group (group 1) or 'Unbekannt' if no match is found.
    """
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            return match.group(1).strip()
    return "Unbekannt"


def get_project_number(text):
    """
    Searches the text for a 6-digit project number using predefined patterns.

    First tries to find structured entries like '**Project No.:** 123456'.
    If no match is found, it falls back to any generic 6-digit number in the text.
    """
    projekt_nr = find_first_match(text, [
        r"\*\*Projekt[-\s]?Nr\.?:\*\*\s*(\d{6})",
        r"\*\*Projektnummer:?\*\*\s*(\d{6})",
        r"\*\*Objekt\:\*\*\s*(\d{6})"
    ])
    if projekt_nr == "Unbekannt":
        # Fallback auf generische 6-stellige Zahl
        match = re.search(r"\b\d{6}\b", text)
        if match:
            return match.group(0)
    
    return projekt_nr



def get_xml(json, markdown): #json should be an list
    """
    Generates an XML file from the provided JSON data and Markdown text.

    Extracts project information from the Markdown and writes the structured data into an XML file.
    Returns the path to the generated XML file.
    """
    # projekt_nr = find_first_match(markdown, [
    #     r"\*\*Projekt[-\s]?Nr\.?:\*\*\s*(.+)",
    #     r"\*\*Projektnummer:?\*\*\s*(.+)",
    #     r"\*\*Objekt\:\*\* (.+)"
    # ])
    projekt_nr = get_project_number(markdown)

    objekt = find_first_match(markdown, [
        r"\*\*Objekt\:\*\* (.+)",
        r"\*\*Projektbezeichnung\:\*\* (.+)"
    ])




    # XML-structur creation
    root = ET.Element("order")
    ET.SubElement(root, "customerId").text = projekt_nr
    ET.SubElement(root, "commission").text = objekt
    ET.SubElement(root, "type").text = "A"
    ET.SubElement(root, "shippingConditionId").text = "2"
    items = ET.SubElement(root, "items")




    for entry in json:  #change for real data
        item = ET.SubElement(items, "item")
        ET.SubElement(item, "sku").text = str(entry["sku"])
        ET.SubElement(item, "name").text = str(entry["name"])
        ET.SubElement(item, "text").text = str(entry["text"]).replace("\n", "<br/>").strip()
        ET.SubElement(item, "quantity").text = str(entry["quantity"])
        ET.SubElement(item, "quantityUnit").text = str(entry["quantityUnit"])
        ET.SubElement(item, "price").text = ""  # empty string is okay
        ET.SubElement(item, "priceUnit").text = "€"
        ET.SubElement(item, "purchasePrice").text = str(entry["purchasePrice"])
        ET.SubElement(item, "commission").text = f"LV-POS. {entry['commision']}"


    # Pretty Print mit minidom
    rough_string = ET.tostring(root, encoding="utf-8")
    reparsed = minidom.parseString(rough_string)
    pretty_xml = reparsed.toprettyxml(indent="   ")


    new_output_data = Path(__file__).parent / ".." / "gui" / "xml" / "output.xml"
    new_output_data = new_output_data.resolve()


    with open(new_output_data, "w", encoding="utf-8") as f:
        f.write(pretty_xml)

    return new_output_data

    # # XML save
    # tree = ET.ElementTree(root)
    # tree.write("ausgabe.xml", encoding="utf-8", xml_declaration=True)
