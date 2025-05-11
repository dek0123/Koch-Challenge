// data.js - Data loading and processing

let orders = [];
let currentOrderIndex = 0;
let currentOrder = null;
let xmlFolder = 'xml';

/**
 * Load XML files list from the xml folder
 */
function loadXmlFilesList() {
  // Fetch directory listing
  fetch('xml/')
    .then(response => response.text())
    .then(data => {
      // Parse directory listing
        console.log("HELLO");
      const parser = new DOMParser();
      const htmlDoc = parser.parseFromString(data, 'text/html');
      const fileLinks = htmlDoc.querySelectorAll('a');

      ordersList.innerHTML = '';

      const xmlFiles = [];
      fileLinks.forEach(link => {
        const fileName = link.textContent;
        if (fileName.endsWith('.xml')) {
          xmlFiles.push({
            name: fileName,
            path: `xml/${fileName}`
          });
        }
      });

      // Display the files in the sidebar
      xmlFiles.forEach((file, index) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#';
        a.classList.add('has-icon');
        a.dataset.path = file.path;
        a.innerHTML = `
          <span class="icon"><i class="fas fa-file-code"></i></span>
          <span class="menu-item-label">${file.name}</span>
        `;
        a.addEventListener('click', (e) => {
          e.preventDefault();
          loadXmlFile(file.path, index);
        });

        li.appendChild(a);
        ordersList.appendChild(li);
      });

      // Load the first XML file by default
      if (xmlFiles.length > 0) {
        loadXmlFile(xmlFiles[0].path, 0);
      }
    })
    .catch(error => {
      console.error('Error loading XML files list:', error);
      ordersList.innerHTML = `
        <li><a href="#" class="has-error">
          <span class="icon"><i class="fas fa-exclamation-triangle"></i></span>
          <span class="menu-item-label">Fehler beim Laden der Dateien</span>
        </a></li>
      `;
    });
}

/**
 * Auto-categorize items based on SKU
 * @param {Object} item - The item to categorize
 */
function autoCategorizeItem(item) {
  const sku = item.sku.trim();

  // Element types
  if (sku.includes('620001')) {
    item.category = 'door';
    item.elementType = 'holztueren';
  } else if (sku.includes('670001')) {
    item.category = 'door';
    // Check text to determine if it's Stahltüren, Stahlzargen, or Rohrrahmentüren
    const lowerText = (item.name + ' ' + item.text).toLowerCase();
    if (lowerText.includes('stahlzarge') || lowerText.includes('stahlzargen')) {
      item.elementType = 'stahlzargen';
    } else if (lowerText.includes('rohrrahmen')) {
      item.elementType = 'rohrrahmentueren';
    } else {
      item.elementType = 'stahltueren';
    }
  } else if (sku.includes('660001')) {
    item.category = 'door';
    item.elementType = 'haustueren';
  } else if (sku.includes('610001')) {
    item.category = 'door';
    // Glastüren don't have a specific elementType in the existing list,
    // so we'll add them to a generic type
    item.elementType = 'other';
  } else if (sku.includes('680001')) {
    item.category = 'door';
    item.elementType = 'tore';
  }
  // Accessories
  else if (sku.includes('240001')) {
    item.category = 'accessory';
    // Beschläge
  } else if (sku.includes('330001')) {
    item.category = 'accessory';
    // Türstopper
  } else if (sku.includes('450001')) {
    item.category = 'accessory';
    // Lüftungsgitter
  } else if (sku.includes('290001')) {
    item.category = 'accessory';
    // Türschließer
  } else if (sku.includes('360001')) {
    item.category = 'accessory';
    // Schlösser / E-Öffner
  }
  // Services
  else if (sku.includes('DL8110016')) {
    item.category = 'service';
    // Wartung
  } else if (sku.includes('DL5010008')) {
    item.category = 'service';
    // Stundenlohnarbeiten
  } else if (sku.includes('DL5019990')) {
    item.category = 'service';
    // Sonstige Arbeiten
  }

  // If no specific category was determined, try to infer from name/text
  if (!item.category) {
    const lowerText = (item.name + ' ' + item.text).toLowerCase();
    if (lowerText.includes('tür') || lowerText.includes('fenster') || lowerText.includes('tor')) {
      item.category = 'door';

      // Try to determine element type
      if (lowerText.includes('holz')) {
        item.elementType = 'holztueren';
      } else if (lowerText.includes('stahl')) {
        if (lowerText.includes('zarge')) {
          item.elementType = 'stahlzargen';
        } else {
          item.elementType = 'stahltueren';
        }
      } else if (lowerText.includes('rohrrahmen')) {
        item.elementType = 'rohrrahmentueren';
      } else if (lowerText.includes('haus')) {
        item.elementType = 'haustueren';
      } else if (lowerText.includes('tor')) {
        item.elementType = 'tore';
      } else if (lowerText.includes('fluchtweg')) {
        item.elementType = 'fluchtweg';
      } else {
        item.elementType = 'other';
      }
    } else if (lowerText.includes('beschlag') || lowerText.includes('stopper') ||
              lowerText.includes('gitter') || lowerText.includes('schließer') ||
              lowerText.includes('schloss') || lowerText.includes('öffner')) {
      item.category = 'accessory';
    } else if (lowerText.includes('wartung') || lowerText.includes('stundenlohn') ||
              lowerText.includes('aufmaß') || lowerText.includes('einrichtung')) {
      item.category = 'service';
    } else {
      // Default category if nothing else matches
      item.category = 'accessory';
    }
  }
}

/**
 * Load and parse an XML file
 * @param {string} filePath - Path to the XML file
 * @param {number} index - Index in the orders array
 */
function loadXmlFile(filePath, index) {
    orderTitle.textContent = 'Lade Auftrag...';
    orderItems.innerHTML = `
    <tr>
      <td colspan="11" class="has-text-centered">
        <span class="icon"><i class="fas fa-spinner fa-spin"></i></span> Lade Auftragspositionen...
      </td>
    </tr>
  `;

    // Load the actual XML file
    fetch(filePath)
        .then(response => response.text())
        .then(xmlText => {
            // Parse the XML file
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

            // Convert XML to JavaScript object
            const order = {
                id: xmlDoc.querySelector('id')?.textContent || '',
                commission: xmlDoc.querySelector('commission')?.textContent || '',
                type: xmlDoc.querySelector('type')?.textContent || '',
                shippingConditionId: xmlDoc.querySelector('shippingConditionId')?.textContent || '',
                items: []
            };

            // Parse items from XML
            const itemElements = xmlDoc.querySelectorAll('item');
            itemElements.forEach((itemEl, i) => {
                const item = {
                    id: i + 1,
                    sku: itemEl.querySelector('sku')?.textContent || '',
                    name: itemEl.querySelector('name')?.textContent || '',
                    text: itemEl.querySelector('text')?.textContent || '',
                    quantity: parseInt(itemEl.querySelector('quantity')?.textContent || '0'),
                    quantityUnit: itemEl.querySelector('quantityUnit')?.textContent || '',
                    price: parseFloat(itemEl.querySelector('price')?.textContent || '0'),
                    priceUnit: itemEl.querySelector('priceUnit')?.textContent || '',
                    commission: itemEl.querySelector('commission')?.textContent || '',
                    category: itemEl.querySelector('category')?.textContent || '',
                    elementType: itemEl.querySelector('elementType')?.textContent || '',
                    features: []
                };

                // Auto-categorize based on SKU
                autoCategorizeItem(item);

                // Parse features
                const featuresEl = itemEl.querySelector('features');
                if (featuresEl) {
                    const featureElements = featuresEl.querySelectorAll('feature');
                    featureElements.forEach(featureEl => {
                        item.features.push(featureEl.textContent);
                    });
                }

                // Auto-detect features based on text content
                const autoFeatures = autoDetectFeatures(item);

                // Add auto-detected features if they aren't already included
                autoFeatures.forEach(feature => {
                    if (!item.features.includes(feature)) {
                        item.features.push(feature);
                    }
                });

                order.items.push(item);
            });

            // Update the current order and display it
            if (orders[index]) {
                orders[index] = order;
            } else {
                orders.push(order);
            }

            currentOrderIndex = index;
            currentOrder = order;

            // Update UI
            orderTitle.textContent = `Auftrag: ${order.commission} (${order.id})`;
            updateCounts();
            renderItems();
            updatePagination();

            // Update active file in sidebar
            document.querySelectorAll('#ordersList a').forEach((a, i) => {
                if (i === index) {
                    a.classList.add('is-active');
                } else {
                    a.classList.remove('is-active');
                }
            });
        })
        .catch(error => {
            console.error('Error loading XML file:', error);
            orderTitle.textContent = 'Fehler beim Laden des Auftrags';
            orderItems.innerHTML = `
        <tr>
          <td colspan="11" class="has-text-centered">
            Fehler beim Laden der Auftragsdaten.
          </td>
        </tr>
      `;
        });
}

/**
 * Auto-detect features based on item text and name
 * @param {Object} item - The item to analyze
 * @returns {Array} - Array of detected features
 */
function autoDetectFeatures(item) {
    // Keywords to check for each feature
    const featureKeywords = {
        'brandschutz': ['brand', 'feuer', 'feuerschutz', 't30', 't60', 't90', 'ei30', 'ei60', 'ei90'],
        'rauchschutz': ['rauch', 'rs'],
        'nassraum': ['nass', 'naß', 'feucht', 'bad', 'wc', 'sanitär', 'dusche', 'shower'],
        'feuchtraum': ['feucht', 'bad', 'wc', 'sanitär', 'dusche', 'shower'],
        'schallschutz': ['schall', 'lärm', 'akustik', 'db', 'dezibel'],
        'klimaklasse': ['klima', 'klimaklasse'],
        'barrierefreiheit': ['barrierefrei', 'behindertengerecht', 'rollstuhl'],
        'einbruchschutz': ['einbruch', 'schutz', 'rc', 'wk', 'sicherheit'],
        'waermedaemmung': ['wärme', 'daemm', 'dämm', 'isolier', 'therm']
    };

    // Combine name and text for searching
    const searchText = (item.name + ' ' + item.text).toLowerCase();

    // Detected features
    const detectedFeatures = [];

    // Check for each feature
    for (const [feature, keywords] of Object.entries(featureKeywords)) {
        // If any keyword is found in the search text, add the feature
        if (keywords.some(keyword => searchText.includes(keyword))) {
            detectedFeatures.push(feature);
        }
    }

    return detectedFeatures;
}
/**
 * Load the order list in the sidebar
 */
function loadOrdersList() {
  ordersList.innerHTML = '';

  orders.forEach((order, index) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#';
    a.classList.add('has-icon');
    a.innerHTML = `
      <span class="icon"><i class="fas fa-file-code"></i></span>
      <span class="menu-item-label">${order.commission}</span>
    `;
    a.addEventListener('click', (e) => {
      e.preventDefault();
      loadOrder(index);
    });

    if (index === currentOrderIndex) {
      a.classList.add('is-active');
    }

    li.appendChild(a);
    ordersList.appendChild(li);
  });
}

/**
 * Auto-detect features based on item text and name
 * @param {Object} item - The item to analyze
 * @returns {Array} - Array of detected features
 */
function autoDetectFeatures(item) {
    // Keywords to check for each feature
    const featureKeywords = {
        'brandschutz': ['brand', 'feuer', 'feuerschutz', 't30', 't60', 't90', 'ei30', 'ei60', 'ei90'],
        'rauchschutz': ['rauch', 'rs'],
        'nassraum': ['nass', 'naß', 'feucht', 'bad', 'wc', 'sanitär', 'dusche', 'shower'],
        'feuchtraum': ['feucht', 'bad', 'wc', 'sanitär', 'dusche', 'shower'],
        'schallschutz': ['schall', 'lärm', 'akustik', 'db', 'dezibel'],
        'klimaklasse': ['klima', 'klimaklasse'],
        'barrierefreiheit': ['barrierefrei', 'behindertengerecht', 'rollstuhl'],
        'einbruchschutz': ['einbruch', 'schutz', 'rc', 'wk', 'sicherheit'],
        'waermedaemmung': ['wärme', 'daemm', 'dämm', 'isolier', 'therm', 'waerme']
    };

    // Combine name and text for searching
    const searchText = (item.name + ' ' + item.text).toLowerCase();

    // Detected features
    const detectedFeatures = [];

    // Check for each feature
    for (const [feature, keywords] of Object.entries(featureKeywords)) {
        // If any keyword is found in the search text, add the feature
        if (keywords.some(keyword => searchText.includes(keyword))) {
            detectedFeatures.push(feature);
        }
    }

    return detectedFeatures;
}

/**
 * Convert current order to XML format
 * @returns {string} XML string representation of the order
 */
function orderToXml() {
  if (!currentOrder) return '';

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<order>\n';

  // Add order properties
  xml += `  <id>${escapeXml(currentOrder.id)}</id>\n`;
  xml += `  <commission>${escapeXml(currentOrder.commission)}</commission>\n`;
  xml += `  <type>${escapeXml(currentOrder.type)}</type>\n`;
  xml += `  <shippingConditionId>${escapeXml(currentOrder.shippingConditionId)}</shippingConditionId>\n`;

  xml += '  <items>\n';

  // Add items
  currentOrder.items.forEach(item => {
    xml += '    <item>\n';
    xml += `      <sku>${escapeXml(item.sku)}</sku>\n`;
    xml += `      <name>${escapeXml(item.name)}</name>\n`;
    xml += `      <text>${escapeXml(item.text)}</text>\n`;
    xml += `      <quantity>${item.quantity}</quantity>\n`;
    xml += `      <quantityUnit>${escapeXml(item.quantityUnit)}</quantityUnit>\n`;
    xml += `      <price>${item.price}</price>\n`;
    xml += `      <priceUnit>${escapeXml(item.priceUnit)}</priceUnit>\n`;
    xml += `      <commission>${escapeXml(item.commission)}</commission>\n`;
    xml += `      <category>${escapeXml(item.category)}</category>\n`;
    xml += `      <elementType>${escapeXml(item.elementType || '')}</elementType>\n`;

    // Add features
    if (item.features && item.features.length > 0) {
      xml += '      <features>\n';
      item.features.forEach(feature => {
        xml += `        <feature>${escapeXml(feature)}</feature>\n`;
      });
      xml += '      </features>\n';
    }

    xml += '    </item>\n';
  });

  xml += '  </items>\n';
  xml += '</order>';

  return xml;
}

/**
 * Escape special characters for XML
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeXml(text) {
  if (!text) return '';
  return text.toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Save current order as XML file
 */
function saveXmlFile() {
  if (!currentOrder) {
    alert('Kein Auftrag geladen!');
    return;
  }

  const xml = orderToXml();
  const filename = `order_${currentOrder.commission || currentOrder.id}.xml`;

  // Create a blob from the XML string
  const blob = new Blob([xml], { type: 'application/xml' });

  // Create a temporary link element
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;

  // Append to the document, click it, and remove it
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}