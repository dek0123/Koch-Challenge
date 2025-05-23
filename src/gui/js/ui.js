// ui.js - UI-related functions

let isDarkMode = false;

/**
 * Set up UI-related event listeners
 */
function setupUIListeners() {
  // Toggle sidebar
  toggleSidebarBtn.addEventListener('click', toggleSidebar);
  
  // Toggle dark mode
  darkModeToggle.addEventListener('change', toggleDarkMode);
  
  // Save XML button
  saveXmlButton.addEventListener('click', (e) => {
    e.preventDefault();
    saveXmlFile();
  });

  // Collapsible sections in sidebar
  document.querySelectorAll('.menu-label').forEach(label => {
    if (label.id) { // Only apply to menu labels with IDs (the ones we want to be collapsible)
      label.addEventListener('click', () => {
        toggleSectionCollapse(label);
      });
    }
  });

  // Set initial collapse state
  // We'll start with Element-Typen and Produkteigenschaften collapsed
  if (document.getElementById('elementTypesLabel')) {
    toggleSectionCollapse(document.getElementById('elementTypesLabel'), true);
  }
  if (document.getElementById('featuresLabel')) {
    toggleSectionCollapse(document.getElementById('featuresLabel'), true);
  }

  // Order navigation
  prevOrderBtn.addEventListener('click', () => {
    if (currentOrderIndex > 0) {
      loadOrder(currentOrderIndex - 1);
    }
  });

  nextOrderBtn.addEventListener('click', () => {
    if (currentOrderIndex < orders.length - 1) {
      loadOrder(currentOrderIndex + 1);
    }
  });

  // Refresh button
  refreshButton.addEventListener('click', (e) => {
    e.preventDefault();
    renderItems();
  });

  // Setup mobile navigation toggle
  if (asideMobileToggle) {
    asideMobileToggle.addEventListener('click', function () {
      asideMenu.classList.toggle('is-expanded');
      app.classList.toggle('has-aside-expanded');
    });
  }

  if (navbarMenuToggle) {
    navbarMenuToggle.addEventListener('click', function () {
      navbarMenu.classList.toggle('is-active');
    });
  }
}

/**
 * Toggle sidebar fold/unfold
 */
function toggleSidebar() {
  asideMenu.classList.toggle('is-folded');
  const toggleIcon = document.querySelector('.toggle-sidebar-icon i');
  if (asideMenu.classList.contains('is-folded')) {
    toggleIcon.classList.remove('fa-chevron-left');
    toggleIcon.classList.add('fa-chevron-right');
  } else {
    toggleIcon.classList.remove('fa-chevron-right');
    toggleIcon.classList.add('fa-chevron-left');
  }
}

/**
 * Toggle dark mode
 */
function toggleDarkMode() {
  isDarkMode = !isDarkMode;
  if (isDarkMode) {
    document.body.classList.add('is-dark-mode');
    document.querySelector('.theme-icon i').classList.remove('fa-moon');
    document.querySelector('.theme-icon i').classList.add('fa-sun');
  } else {
    document.body.classList.remove('is-dark-mode');
    document.querySelector('.theme-icon i').classList.remove('fa-sun');
    document.querySelector('.theme-icon i').classList.add('fa-moon');
  }
}

/**
 * Toggle a section collapse/expand
 * @param {HTMLElement} label - The label element
 * @param {boolean} forceCollapse - Whether to force collapse
 */
function toggleSectionCollapse(label, forceCollapse = false) {
  if (!label || !label.id) return; // Safety check

  // Use correct mapping for the target element ID
  let targetElementId;
  if (label.id === 'elementTypesLabel') {
    targetElementId = 'elementTypeFilters'; // Note: not elementTypesFilters
  } else if (label.id === 'featuresLabel') {
    targetElementId = 'featureFilters'; // Note: not featuresFilters
  } else if (label.id === 'categoryLabel') {
    targetElementId = 'categoryFilters';
  } else {
    // Fallback to the previous logic
    const baseId = label.id.replace('Label', '');
    targetElementId = baseId + 'Filters';
  }

  const targetElement = document.getElementById(targetElementId);

  if (!targetElement) {
    console.warn(`Element with ID "${targetElementId}" not found`);
    return; // Exit if the element doesn't exist
  }

  if (forceCollapse || !targetElement.classList.contains('is-hidden')) {
    // Collapse - hide the element
    targetElement.classList.add('is-hidden');
    const icon = label.querySelector('.icon i');
    if (icon) {
      icon.classList.remove('fa-chevron-down');
      icon.classList.add('fa-chevron-right');
    }
  } else {
    // Expand - show the element
    targetElement.classList.remove('is-hidden');
    const icon = label.querySelector('.icon i');
    if (icon) {
      icon.classList.remove('fa-chevron-right');
      icon.classList.add('fa-chevron-down');
    }
  }
}