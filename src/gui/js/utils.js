// utils.js - Utility functions

/**
 * Feature icons mapping
 */
const featureIcons = {
  'schallschutz': '<i class="fas fa-volume-mute"></i>',
  'einbruchschutz': '<i class="fas fa-shield-alt"></i>',
  'brandschutz': '<i class="fas fa-fire-extinguisher"></i>',
  'rauchschutz': '<i class="fas fa-smoking-ban"></i>',
  'nassraum': '<i class="fas fa-shower"></i>',
  'feuchtraum': '<i class="fas fa-tint"></i>',
  'klimaklasse': '<i class="fas fa-thermometer-half"></i>',
  'aussentueren': '<i class="fas fa-door-open"></i>',
  'pfosten-riegel': '<i class="fas fa-project-diagram"></i>',
  'waermedaemmung': '<i class="fas fa-temperature-low"></i>',
  'strahlenschutz': '<i class="fas fa-radiation"></i>',
  'barrierefreiheit': '<i class="fas fa-universal-access"></i>',
  'einfachfalz': '<i class="fas fa-align-left"></i>',
  'stumpf': '<i class="fas fa-minus"></i>',
  'doppelfalz': '<i class="fas fa-align-justify"></i>'
};

/**
 * Feature labels
 */
const featureLabels = {
  'schallschutz': 'Schallschutz',
  'einbruchschutz': 'Einbruchschutz',
  'brandschutz': 'Brandschutz',
  'rauchschutz': 'Rauchschutz',
  'nassraum': 'Nassraum',
  'feuchtraum': 'Feuchtraum',
  'klimaklasse': 'Klimaklasse',
  'aussentueren': 'Außentüren',
  'pfosten-riegel': 'Pfosten-Riegel',
  'waermedaemmung': 'Wärmedämmung',
  'strahlenschutz': 'Strahlenschutz',
  'barrierefreiheit': 'Barrierefreiheit',
  'einfachfalz': 'Einfachfalz',
  'stumpf': 'Stumpf',
  'doppelfalz': 'Doppelfalz'
};

/**
 * Get element type label
 * @param {string} type - Element type
 * @returns {string} Label for the element type
 */
function getElementTypeLabel(type) {
  const labels = {
    'holztueren': 'Holztüren',
    'stahltueren': 'Stahltüren',
    'rohrrahmentueren': 'Rohrrahmentüren',
    'tore': 'Tore',
    'stahlzargen': 'Stahlzargen',
    'drehtuerantriebe': 'Drehtürantriebe',
    'haustueren': 'Haustüren',
    'fluchtweg': 'Fluchtwegssicherung',
    'other': 'Sonstige'
  };
  
  return labels[type] || type;
}

/**
 * Get element type icon
 * @param {string} type - Element type
 * @returns {string} HTML for the element type icon
 */
function getElementTypeIcon(type) {
  const icons = {
    'holztueren': '<i class="fas fa-door-closed"></i>',
    'stahltueren': '<i class="fas fa-door-open"></i>',
    'rohrrahmentueren': '<i class="fas fa-grip-lines"></i>',
    'tore': '<i class="fas fa-warehouse"></i>',
    'stahlzargen': '<i class="fas fa-border-style"></i>',
    'drehtuerantriebe': '<i class="fas fa-sync-alt"></i>',
    'haustueren': '<i class="fas fa-home"></i>',
    'fluchtweg': '<i class="fas fa-running"></i>',
    'other': '<i class="fas fa-question"></i>'
  };
  
  return icons[type] || '<i class="fas fa-question"></i>';
}

/**
 * Get human-readable category label
 * @param {string} category - Category
 * @returns {string} Label for the category
 */
function getCategoryLabel(category) {
  const labels = {
    door: 'Tür',
    window: 'Fenster',
    accessory: 'Zubehör',
    service: 'Service'
  };
  
  return labels[category] || category;
}
