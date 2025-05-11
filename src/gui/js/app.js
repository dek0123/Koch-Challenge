// app.js - Main application initialization

// DOM elements - These need to be globally accessible
let orderTitle;
let orderItems;
let elementsCount;
let accessoriesCount;
let servicesCount;
let totalItems;
let totalPriceTag;
let elementTypesSummary;
let pagination;
let paginationInfo;
let searchInput;
let ordersList;
let prevOrderBtn;
let nextOrderBtn;
let refreshButton;
let submitButton;
let saveXmlButton; // New button for saving XML
let addItemBtn; // New button for adding items
let toggleSidebarBtn;
let darkModeToggle;
let asideMenu;
let app;
let editModal;
let closeModalBtn;
let saveItemBtn;
let cancelModalBtn;
let deleteModal;
let closeDeleteModalBtn;
let confirmDeleteBtn;
let cancelDeleteModalBtn;
let submitModal;
let closeSubmitModalBtn;
let confirmSubmitBtn;
let cancelSubmitModalBtn;
let categoryFilters;
let featureFilters;
let asideMobileToggle;
let navbarMenuToggle;
let navbarMenu;

/**
 * Initialize the application
 */
function init() {
  // Initialize DOM elements
  initDOMElements();

  // Set up event listeners
  setupUIListeners();
  setupFilterListeners();
  setupModalListeners();

  // Load XML files
  loadXmlFilesList();
}

/**
 * Initialize DOM element references
 */
function initDOMElements() {
  orderTitle = document.getElementById('orderTitle');
  orderItems = document.getElementById('orderItems');
  elementsCount = document.getElementById('elementsCount');
  accessoriesCount = document.getElementById('accessoriesCount');
  servicesCount = document.getElementById('servicesCount');
  totalItems = document.getElementById('totalItems');
  totalPriceTag = document.getElementById('totalPriceTag');
  elementTypesSummary = document.getElementById('elementTypesSummary');
  pagination = document.getElementById('pagination');
  paginationInfo = document.getElementById('paginationInfo');
  searchInput = document.getElementById('searchInput');
  ordersList = document.getElementById('ordersList');
  prevOrderBtn = document.getElementById('prevOrderBtn');
  nextOrderBtn = document.getElementById('nextOrderBtn');
  refreshButton = document.getElementById('refreshButton');
  submitButton = document.getElementById('submitButton');
  saveXmlButton = document.getElementById('saveXmlButton'); // New button for saving XML
  addItemBtn = document.getElementById('addItemBtn'); // New button for adding items
  toggleSidebarBtn = document.querySelector('.toggle-sidebar-icon');
  darkModeToggle = document.getElementById('darkModeToggle');
  asideMenu = document.querySelector('.aside');
  app = document.querySelector('#app');

  // Modals
  editModal = document.getElementById('edit-modal');
  closeModalBtn = document.getElementById('closeModalBtn');
  saveItemBtn = document.getElementById('saveItemBtn');
  cancelModalBtn = document.getElementById('cancelModalBtn');
  deleteModal = document.getElementById('delete-modal');
  closeDeleteModalBtn = document.getElementById('closeDeleteModalBtn');
  confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
  cancelDeleteModalBtn = document.getElementById('cancelDeleteModalBtn');
  submitModal = document.getElementById('submit-modal');
  closeSubmitModalBtn = document.getElementById('closeSubmitModalBtn');
  confirmSubmitBtn = document.getElementById('confirmSubmitBtn');
  cancelSubmitModalBtn = document.getElementById('cancelSubmitModalBtn');

  // Filter elements
  categoryFilters = document.querySelectorAll('#categoryFilters a');
  featureFilters = document.querySelectorAll('#featureFilters .icon-box');

  // Mobile elements
  asideMobileToggle = document.querySelector('.jb-aside-mobile-toggle');
  navbarMenuToggle = document.querySelector('.jb-navbar-menu-toggle');
  navbarMenu = document.querySelector('#navbar-menu');
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);