// filters.js - Filtering functionality

let currentFilter = 'all';
let currentElementType = 'all';
let currentFeatureFilters = [];
let searchValue = '';
let currentPage = 1;
let itemsPerPage = 10;

/**
 * Set up filter event listeners
 */
function setupFilterListeners() {
  // Search input
  searchInput.addEventListener('input', () => {
    searchValue = searchInput.value;
    currentPage = 1;
    renderItems();
  });
  
  // Category filters
  categoryFilters.forEach(filter => {
    filter.addEventListener('click', (e) => {
      e.preventDefault();
      currentFilter = filter.dataset.filter;
      currentPage = 1;
      
      categoryFilters.forEach(f => f.classList.remove('filter-active'));
      filter.classList.add('filter-active');
      
      renderItems();
    });
  });
  
  // Element type filters in sidebar
  document.querySelectorAll('#elementTypeFilters a').forEach(filter => {
    filter.addEventListener('click', (e) => {
      e.preventDefault();
      currentElementType = filter.dataset.filter;
      currentPage = 1;
      
      document.querySelectorAll('#elementTypeFilters a').forEach(f => {
        f.classList.remove('is-active');
      });
      filter.classList.add('is-active');
      
      // Also set the main filter to elements
      currentFilter = 'element';
      categoryFilters.forEach(f => {
        f.classList.remove('filter-active');
        if (f.dataset.filter === 'element') {
          f.classList.add('filter-active');
        }
      });
      
      renderItems();
    });
  });
  
  // Element type filters in main section
  document.querySelectorAll('#elementTypesFilter .element-type-label').forEach(label => {
    label.addEventListener('click', () => {
      const elementType = label.dataset.elementType;
      
      document.querySelectorAll('#elementTypesFilter .element-type-label').forEach(l => {
        l.classList.remove('is-active');
      });
      label.classList.add('is-active');
      
      currentElementType = elementType;
      
      // Also update sidebar element type filter
      document.querySelectorAll('#elementTypeFilters a').forEach(f => {
        f.classList.remove('is-active');
        if (f.dataset.filter === elementType) {
          f.classList.add('is-active');
        }
      });
      
      // Set main filter to elements if we're filtering by element type
      if (elementType !== 'all') {
        currentFilter = 'element';
        categoryFilters.forEach(f => {
          f.classList.remove('filter-active');
          if (f.dataset.filter === 'element') {
            f.classList.add('filter-active');
          }
        });
      }
      
      currentPage = 1;
      renderItems();
    });
  });
  
  // Feature filters
  featureFilters.forEach(filter => {
    filter.addEventListener('click', () => {
      const feature = filter.dataset.filter;
      
      if (filter.classList.contains('is-active')) {
        // Remove from active filters
        filter.classList.remove('is-active');
        currentFeatureFilters = currentFeatureFilters.filter(f => f !== feature);
      } else {
        // Add to active filters
        filter.classList.add('is-active');
        currentFeatureFilters.push(feature);
      }
      
      currentPage = 1;
      renderItems();
    });
  });
}
