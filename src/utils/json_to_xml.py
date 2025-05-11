import xml.etree.ElementTree as ET
import xml.dom.minidom as minidom
import re
from pathlib import Path



def find_first_match(text, patterns):
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            return match.group(1).strip()
    return "Unbekannt"



def get_xml(json, markdown): #json should be an list
    projekt_nr = find_first_match(markdown, [
        r"\*\*Projekt[-\s]?Nr\.?:\*\*\s*(.+)",
        r"\*\*Projektnummer:?\*\*\s*(.+)",
        r"\*\*Objekt\:\*\* (.+)"
    ])
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


    new_output_data = Path(__file__).parent / ".." / "src" / "gui" / "xml" / "output.xml"
    new_output_data = new_output_data.resolve()


    with open(new_output_data, "w", encoding="utf-8") as f:
        f.write(pretty_xml)

    return new_output_data

    # # XML save
    # tree = ET.ElementTree(root)
    # tree.write("ausgabe.xml", encoding="utf-8", xml_declaration=True)
