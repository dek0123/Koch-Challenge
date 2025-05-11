from model import response
import json
import re

prompt_get_context = "Extrahieren alle Produkte mit ihrer Positionsnummer. Übernehme als Description den gesamten Text des Produkts"

prompt_get_json = """
Du bist ein Arbeiter der für die Firma Koch Produkte aus dem folgenden Leistungsverzeichnis identifizieren soll, die KOCH anbietet.


Hier sind die Produkte von KOCH:
### Elemente

- Holztüren, Holzzargen - Divers-Artikelnr.: 620001
- Stahltüren, Stahlzargen, Rohrrahmentüren - Divers-Artikelnr.: 670001
- Haustüren - Divers-Artikelnr.: 660001
- Glastüren - Divers-Artikelnr.: 610001
- Tore - Divers-Artikelnr.: 680001
- Zusätzliche Infos:
  - Türblatt ist maßgebend (Häufig Holztürblatt mit Stahlzarge im LV - dann auf 620001)
  - Verglasungen --> Zarge maßgebend (Häufig Festverglasungen mit Stahlzarge - dann auf 670001)

### Zubehör

- Beschläge - Divers-Artikelnr.: 240001
- Türstopper - Divers-Artikelnr.: 330001
- Lüftungsgitter - Divers-Artikelnr.: 450001
- Türschließer - Divers-Artikelnr.: 290001
- Schlösser / E-Öffner - Divers-Artikelnr.: 360001

### Dienstleistungen

- Wartung - Artikelnr.: DL8110016
- Stundenlohnarbeiten - Artikelnr.: DL5010008
- Sonstige Arbeiten (z.B. Baustelleneinrichtung, Aufmaß, Mustertürblatt, etc.) - Artikelnr.: DL5019990

Bringe die gefundenen Produkte in diese JSON Formatierung: 
matching_structure = {
        "sku": "Divers-Artikelnr.,
        "name": NAME OF THE PRODUCT,
        "text": DESCRIPTION,
        "quantity": STÜCKZAHL,
        "quantityUnit" : "Stk",
        "priceUnit" : CURRENCY,
        "purchasePrice": "",
        "commision": POS NUMBER
}

Gebe nur liste von JSONS in der Form zurück. KEIN Text.

Hier das Leistungsverzeichnis: 
""" 

def get_json(file_path):
    """
    use a LLM to get context Information for each product and create JSON Files for the items

    Args:
        file_path: path to Markdown file of parsed pdf 
    """
    with open(file_path, "r", encoding="utf-8") as f:
        LV = f.read()

    # use prompt and gpt o3 to get the context of the LV, which are the
    # position Nr and the information around
    context = response(LV, prompt_get_context)

    # get Features like SKU, Name etc in JSON format by the LLM
    jsons = response(context, prompt_get_json)

    match = re.search(r'\[\s*\{.*?\}\s*\]', jsons, re.DOTALL)
    if match:
        try:
            return json.loads(match.group())
        except json.JSONDecodeError:
            print("Found JSON-like text but could not decode.")
            return None
    else:
        print("No JSON array found in the text.")
        return None

    