# Koch-Challenge

The Koch-Challenge is a hackathon project for the automated extraction, classification and conversion of service specifications into structured offer data for ERP systems.

## Table of Contents

1. [Installation](#installation)  
    1. [Clone repository](#1-repository-clone)  
    2. [Create & activate virtual environment](#2-create--activate--virtual--environment)  
    3. [Install dependencies](#3-install-dependencies)  
2. [Project information](#project-information)  
    1. [Goal of the project](#goal-of-the-project)  
    2. [Project structure](#project-structure)  
    3. [Product & service catalog](#product--service-catalog)  
    4. [Example XML format](#example-xml-format)  
    5. [Further requirements](#further-requirements)  

---

## Installation


### 1. clone repository

```bash
git clone https://github.com/dek0123/Koch-Challenge.git
cd ...
```

### 2. create & activate virtual environment

```bash
...
```

### 3. install dependencies

```bash
pip install -r requirements.txt
````

---

## Project information

**Project team**: Josua Ehret, Finn Rehm, Dionys Müller, Dejan Tankoski

**Project period**: 09.05 to 11.05 Hackathon 2025

### Aim of the project

The aim of this project is to develop a system that automatically analyzes and structures service specifications. The system should receive a PDF document or text file, recognize and classify the products and services it contains and convert them into an XML output file that can be imported directly into an ERP system. In addition, a user-friendly interface will be developed to facilitate importing, previewing, editing and exporting.



### Project structure

```mermaid
├── data/
│ ├── database/
│ │ └── sku_database.sqlite
│ ├── input/
│ │ ├── catalog.csv
│ │ └── examples/
│ └── output/
│   └── [XML files]
│
├── docs/
│ └── [documentation]
│
└── src/
  ├── document_parser.py
  ├── product_classifier.py
  ├── xml_generator.py
  └── interface.py
```

- **/data**: Data and product catalog  
- **/docs**: Documentation and guidelines  
- **/src**: Source code for parser, classifier and interface...
- **/output**: Exported XML files  

### Product & service catalog

#### Elements

| Group | Item number |
|---------------------------------|----------------|
| Timber doors, timber frames | 620001 |
| Steel doors, steel frames, tubular frames | 670001 |
| Front doors | 660001 |
| Glass doors | 610001 |
| Gates | 680001 |


*Note: The door leaf is decisive for the classification.

#### Accessories

| Type | Article number |
|------------------|----------------|
| Fittings | 240001 |
| Door stoppers | 330001 |
| Ventilation grilles | 450001 |
| Door closers | 290001 |
| Locks / openers | 360001 |

#### Services

| Service | Item number |
|------------------------------------------|----------------|
| Maintenance | DL8110016 |
| Hourly work | DL5010008 |
| Other services (e.g. measurement, samples) | DL5019990 |

### Example XML format


```xml
<?xml version="1.0" encoding="UTF-8"? >
<order>
 <customerId>XXX-CUSTOMERID</customerId>
 <commission>XXX control room</commission>
 <type>A</type>
 <shippingConditionId>2</shippingConditionId>
 <items>
 <item>
 <sku>620001</sku>
 <name>Office door with steel U-frame (0, 76 x 2.135 m)</name>
 <text>Hörmann VarioFix steel frame for masonry or TRB<br/>
         - Handle height 1050 mm<br/>
         - Meter markings<br/>
         - Mouth width edge 15 mm<br/>
         - Galvanized sheet steel, material thickness 1.5 mm<br/>
         - Hörmann BaseLine HPL door leaf<br/>
         - Door weight approx. 18.1 kg/m²<br/>
         - Door thickness approx. 40.7 mm</text>
 <quantity>1</quantity>
 <quantity unit>pc</quantity unit>
 <price>695.00</price>
 <price unit>€</price unit>
 <commission>LV-POS. 1.1.10</commission>
 </item>
 </items>
</order>
```

### Further requirements

- Requirements such as sound insulation, fire protection, climate class, etc. are recognized and displayed in groups.
- A list of the product groups including page references is created: 
 e.g. 50 wooden doors (p. 7-15), 10 steel doors (p. 16-20), 60 fittings (p. 21-23)
- Optional items are listed separately and are not included in the main down payment.
- Special surcharges and additional services (e.g. HPL coating) are shown separately.
- Recommendations for passing on to manufacturers/partners are issued.
- **Optional**: Live PDF editor with direct editing of offer texts

---


*Created as part of the Hackathon 2025 hackathon.*# Koch-Challange
