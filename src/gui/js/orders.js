// orders.js - Order management

/**
 * Load order data and display it
 * @param {number} index - Index of the order in the orders array
 */
function loadOrder(index) {
  currentOrderIndex = index;
  currentOrder = orders[index];
  currentPage = 1;
  currentFilter = 'all';
  currentFeatureFilters = [];
  searchValue = '';
  searchInput.value = '';
  
  // Update UI
  orderTitle.textContent = `Auftrag: ${currentOrder.commission} (${currentOrder.id})`;
  updateCounts();
  renderItems();
  updatePagination();
  
  // Update active order in sidebar
  document.querySelectorAll('#ordersList a').forEach((a, i) => {
    if (i === index) {
      a.classList.add('is-active');
    } else {
      a.classList.remove('is-active');
    }
  });
  
  // Update category filters
  categoryFilters.forEach(filter => {
    if (filter.dataset.filter === 'all') {
      filter.classList.add('filter-active');
    } else {
      filter.classList.remove('filter-active');
    }
  });
  
  // Reset feature filters
  featureFilters.forEach(filter => {
    filter.classList.remove('is-active');
  });
}

/**
 * Update item counts in dashboard
 */
function updateCounts() {
  const counts = {
    element: 0,
    accessory: 0,
    service: 0,
    total: currentOrder.items.length,
    elementTypes: {
      holztueren: 0,
      stahltueren: 0,
      rohrrahmentueren: 0,
      tore: 0,
      stahlzargen: 0,
      drehtuerantriebe: 0,
      haustueren: 0,
      fluchtweg: 0,
      other: 0
    }
  };
  
  let totalOrderPrice = 0;
  
  currentOrder.items.forEach(item => {
    // Calculate total price
    totalOrderPrice += item.price * item.quantity;
    
    // Count by main category
    if (item.category === 'door' || item.category === 'window') {
      counts.element++;
      
      // Count by element type
      if (item.elementType && counts.elementTypes[item.elementType] !== undefined) {
        counts.elementTypes[item.elementType]++;
      } else {
        counts.elementTypes.other++;
      }
    } else if (item.category === 'accessory') {
      counts.accessory++;
    } else if (item.category === 'service') {
      counts.service++;
    }
  });
  
  // Update dashboard counters
  elementsCount.textContent = counts.element;
  accessoriesCount.textContent = counts.accessory;
  servicesCount.textContent = counts.service;
  totalItems.textContent = counts.total;
  totalPriceTag.textContent = totalOrderPrice.toLocaleString('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) + ' €';
  
  // Update element types summary
  elementTypesSummary.innerHTML = '';
  let hasElements = false;
  
  for (const [type, count] of Object.entries(counts.elementTypes)) {
    if (count > 0) {
      hasElements = true;
      const tag = document.createElement('span');
      tag.className = 'tag is-light mr-1 mb-1';
      tag.innerHTML = `${getElementTypeLabel(type)}: ${count}`;
      elementTypesSummary.appendChild(tag);
    }
  }
  
  if (!hasElements) {
    const tag = document.createElement('span');
    tag.className = 'tag is-light';
    tag.textContent = 'Keine Elemente';
    elementTypesSummary.appendChild(tag);
  }
}

/**
 * Render items in the table based on current filters and pagination
 */
function renderItems() {
  orderItems.innerHTML = '';
  
  const filteredItems = currentOrder.items.filter(item => {
    // Check main category filter (all, element, accessory, service)
    let matchesCategory;
    if (currentFilter === 'all') {
      matchesCategory = true;
    } else if (currentFilter === 'element') {
      // Elements include doors, windows, and any other structural components
      matchesCategory = item.category === 'door' || item.category === 'window' || 
                        (item.elementType && item.elementType !== '');
    } else {
      matchesCategory = item.category === currentFilter;
    }
    
    // Check element type filter if applicable
    const matchesElementType = currentElementType === 'all' || 
                             (item.elementType && item.elementType === currentElementType);
    
    // Check feature filters
    const matchesFeatures = currentFeatureFilters.length === 0 || 
      currentFeatureFilters.every(feature => item.features && item.features.includes(feature));
    
    // Check search term
    const matchesSearch = searchValue === '' || 
      item.name.toLowerCase().includes(searchValue.toLowerCase()) || 
      item.sku.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.commission.toLowerCase().includes(searchValue.toLowerCase());
    
    return matchesCategory && matchesElementType && matchesFeatures && matchesSearch;
  });
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredItems.length);
  const displayedItems = filteredItems.slice(startIndex, endIndex);
  
  if (displayedItems.length === 0) {
    orderItems.innerHTML = `
      <tr>
        <td colspan="10" class="has-text-centered">
          Keine Ergebnisse gefunden.
        </td>
      </tr>
    `;
    return;
  }
  
  displayedItems.forEach((item, index) => {
    const tr = document.createElement('tr');
    tr.classList.add(`category-${item.category}`);
    
    const totalPrice = (item.price * item.quantity).toFixed(2);
    
    // Generate feature badges
    let featureBadges = '';
    if (item.features && item.features.length > 0) {
      item.features.forEach(feature => {
        if (featureIcons[feature]) {
          featureBadges += `<span class="feature-badge" title="${featureLabels[feature]}"><span class="feature-icon">${featureIcons[feature]}</span></span>`;
        }
      });
    }
    
    // Add element type badge if available
    if (item.elementType && item.elementType !== '') {
      const elementTypeLabel = getElementTypeLabel(item.elementType);
      featureBadges += `<span class="feature-badge is-primary" title="${elementTypeLabel}"><span class="feature-icon">${getElementTypeIcon(item.elementType)}</span> ${elementTypeLabel}</span>`;
    }
    
    tr.innerHTML = `
      <td data-label="Position">${index + 1 + startIndex}</td>
      <td data-label="Artikel-Nr." class="editable-cell" data-field="sku" data-id="${item.id}">${item.sku}</td>
      <td data-label="Name" class="editable-cell" data-field="name" data-id="${item.id}">${item.name}</td>
      <td data-label="Menge" class="editable-cell" data-field="quantity" data-id="${item.id}">${item.quantity}</td>
      <td data-label="Einheit" class="editable-cell" data-field="quantityUnit" data-id="${item.id}">${item.quantityUnit}</td>
      <td data-label="Preis" class="editable-cell" data-field="price" data-id="${item.id}">${item.price.toFixed(2)}</td>
      <td data-label="Einheit">${item.priceUnit}</td>
      <td data-label="Gesamt">${totalPrice} ${item.priceUnit}</td>
      <td data-label="Eigenschaften">${featureBadges}</td>
      <td class="is-actions-cell">
        <div class="buttons is-right">
          <button class="button is-small is-primary edit-button" data-id="${item.id}" type="button">
            <span class="icon"><i class="fas fa-pencil-alt"></i></span>
          </button>
          <button class="button is-small is-danger delete-button" data-id="${item.id}" type="button">
            <span class="icon"><i class="fas fa-trash"></i></span>
          </button>
        </div>
      </td>
    `;
    
    orderItems.appendChild(tr);
  });
  
  // Add event listeners to editable cells and buttons
  document.querySelectorAll('.editable-cell').forEach(cell => {
    cell.addEventListener('click', () => {
      const id = parseInt(cell.dataset.id);
      const item = currentOrder.items.find(item => item.id === id);
      openEditModal(item);
    });
  });
  
  document.querySelectorAll('.edit-button').forEach(button => {
    button.addEventListener('click', () => {
      const id = parseInt(button.dataset.id);
      const item = currentOrder.items.find(item => item.id === id);
      openEditModal(item);
    });
  });
  
  document.querySelectorAll('.delete-button').forEach(button => {
    button.addEventListener('click', () => {
      const id = parseInt(button.dataset.id);
      const item = currentOrder.items.find(item => item.id === id);
      openDeleteModal(item);
    });
  });
  
  updatePagination();
}

/**
 * Update pagination controls
 */
function updatePagination() {
  pagination.innerHTML = '';
  
  const filteredItems = currentOrder.items.filter(item => {
    const matchesCategory = currentFilter === 'all' || 
                           (currentFilter === 'element' ? 
                           (item.category === 'door' || item.category === 'window') : 
                           item.category === currentFilter);
    const matchesElementType = currentElementType === 'all' || 
                             (item.elementType && item.elementType === currentElementType);
    const matchesFeatures = currentFeatureFilters.length === 0 || 
      currentFeatureFilters.every(feature => item.features && item.features.includes(feature));
    const matchesSearch = searchValue === '' || 
      item.name.toLowerCase().includes(searchValue.toLowerCase()) || 
      item.sku.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.commission.toLowerCase().includes(searchValue.toLowerCase());
    
    return matchesCategory && matchesElementType && matchesFeatures && matchesSearch;
  });
  
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  
  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'button' + (i === currentPage ? ' is-active' : '');
    button.textContent = i;
    button.addEventListener('click', () => {
      currentPage = i;
      renderItems();
    });
    
    pagination.appendChild(button);
  }
  
  paginationInfo.textContent = `Seite ${currentPage} von ${totalPages || 1}`;
}
