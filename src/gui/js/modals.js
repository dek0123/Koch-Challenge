// modals.js - Modal dialog handling

/**
 * Set up modal event listeners
 */
function setupModalListeners() {
  // Add Item button
  addItemBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openAddModal();
  });

  // Submit button
  submitButton.addEventListener('click', (e) => {
    e.preventDefault();
    submitModal.classList.add('is-active');
  });

  // Edit modal
  closeModalBtn.addEventListener('click', () => {
    editModal.classList.remove('is-active');
  });

  saveItemBtn.addEventListener('click', saveItem);

  cancelModalBtn.addEventListener('click', () => {
    editModal.classList.remove('is-active');
  });

  // Delete modal
  closeDeleteModalBtn.addEventListener('click', () => {
    deleteModal.classList.remove('is-active');
  });

  confirmDeleteBtn.addEventListener('click', deleteItem);

  cancelDeleteModalBtn.addEventListener('click', () => {
    deleteModal.classList.remove('is-active');
  });

  // Submit modal
  closeSubmitModalBtn.addEventListener('click', () => {
    submitModal.classList.remove('is-active');
  });

  confirmSubmitBtn.addEventListener('click', () => {
    // Here you would normally send the data to your ERP system
    // For demo purposes, we'll just show a notification
    submitModal.classList.remove('is-active');
    alert('Daten wurden erfolgreich an das ERP-System gesendet.');
  });

  cancelSubmitModalBtn.addEventListener('click', () => {
    submitModal.classList.remove('is-active');
  });

  // Close modals when clicking on background
  document.querySelectorAll('.modal-background').forEach(background => {
    background.addEventListener('click', () => {
      editModal.classList.remove('is-active');
      deleteModal.classList.remove('is-active');
      submitModal.classList.remove('is-active');
    });
  });
}

/**
 * Open modal for adding a new item
 */
function openAddModal() {
  // Clear form fields
  document.getElementById('edit-id').value = '';
  document.getElementById('edit-sku').value = '';
  document.getElementById('edit-name').value = '';
  document.getElementById('edit-text').value = '';
  document.getElementById('edit-quantity').value = '1';
  document.getElementById('edit-quantityUnit').value = 'Stk';
  document.getElementById('edit-price').value = '0.00';
  document.getElementById('edit-priceUnit').value = '€';
  document.getElementById('edit-commission').value = currentOrder.commission || '';
  document.getElementById('edit-category').value = 'door';

  // Clear checkboxes
  document.querySelectorAll('#edit-features input[type="checkbox"]').forEach(checkbox => {
    checkbox.checked = false;
  });

  // Update modal title
  document.querySelector('#edit-modal .modal-card-title').textContent = 'Neue Position hinzufügen';

  // Show modal
  editModal.classList.add('is-active');
}

/**
 * Open edit modal with item data
 * @param {Object} item - Item to edit
 */
function openEditModal(item) {
  // Update modal title
  document.querySelector('#edit-modal .modal-card-title').textContent = 'Position bearbeiten';

  document.getElementById('edit-id').value = item.id;
  document.getElementById('edit-sku').value = item.sku;
  document.getElementById('edit-name').value = item.name;
  document.getElementById('edit-text').value = item.text.replace(/<br\/>/g, '\n').replace(/<[^>]*>/g, '');
  document.getElementById('edit-quantity').value = item.quantity;
  document.getElementById('edit-quantityUnit').value = item.quantityUnit;
  document.getElementById('edit-price').value = item.price;
  document.getElementById('edit-priceUnit').value = item.priceUnit;
  document.getElementById('edit-commission').value = item.commission;
  document.getElementById('edit-category').value = item.category;

  // Set feature checkboxes
  document.querySelectorAll('#edit-features input[type="checkbox"]').forEach(checkbox => {
    checkbox.checked = item.features && item.features.includes(checkbox.value);
  });

  editModal.classList.add('is-active');
}

/**
 * Open delete confirmation modal
 * @param {Object} item - Item to delete
 */
function openDeleteModal(item) {
  document.getElementById('delete-id').value = item.id;
  document.getElementById('delete-item-name').textContent = item.name;

  deleteModal.classList.add('is-active');
}

/**
 * Save edited or new item
 */
function saveItem() {
  const idValue = document.getElementById('edit-id').value;
  const isNewItem = idValue === '';

  // Format text with <br/> for newlines
  let text = document.getElementById('edit-text').value;
  text = text.replace(/\n/g, '<br/>');

  // Get selected features
  const features = [];
  document.querySelectorAll('#edit-features input[type="checkbox"]:checked').forEach(checkbox => {
    features.push(checkbox.value);
  });

  const newItem = {
    sku: document.getElementById('edit-sku').value,
    name: document.getElementById('edit-name').value,
    text: text,
    quantity: parseInt(document.getElementById('edit-quantity').value),
    quantityUnit: document.getElementById('edit-quantityUnit').value,
    price: parseFloat(document.getElementById('edit-price').value),
    priceUnit: document.getElementById('edit-priceUnit').value,
    commission: document.getElementById('edit-commission').value,
    category: document.getElementById('edit-category').value,
    features: features
  };

  if (isNewItem) {
    // Add new item
    newItem.id = currentOrder.items.length > 0 ?
      Math.max(...currentOrder.items.map(item => item.id)) + 1 : 1;
    currentOrder.items.push(newItem);
  } else {
    // Update existing item
    const id = parseInt(idValue);
    const index = currentOrder.items.findIndex(item => item.id === id);

    if (index === -1) return;

    currentOrder.items[index] = {
      ...currentOrder.items[index],
      ...newItem
    };
  }

  editModal.classList.remove('is-active');
  updateCounts();
  renderItems();
}

/**
 * Delete item
 */
function deleteItem() {
  const id = parseInt(document.getElementById('delete-id').value);
  const index = currentOrder.items.findIndex(item => item.id === id);

  if (index === -1) return;

  currentOrder.items.splice(index, 1);

  deleteModal.classList.remove('is-active');
  updateCounts();
  renderItems();
}