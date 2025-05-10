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
  
  const targetId = label.id.replace('Label', '');
  const targetList = document.getElementById(targetId + 'Filters');
  
  if (!targetList) {
    console.warn(`Element with ID "${targetId}Filters" not found`);
    return; // Exit if the element doesn't exist
  }
  
  if (forceCollapse || !label.classList.contains('is-collapsed')) {
    // Collapse
    label.classList.add('is-collapsed');
    targetList.classList.add('is-collapsed');
  } else {
    // Expand
    label.classList.remove('is-collapsed');
    targetList.classList.remove('is-collapsed');
  }
}
