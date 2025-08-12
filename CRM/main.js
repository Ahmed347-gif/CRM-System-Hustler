// CRM System - Main JavaScript File
// This file contains all the logic for customer management, product tracking, and data persistence

// Global variables
let customers = [];
let products = {
    total: 0,
    sold: 0,
    price: 0,
    capital: 0
};

// DOM elements
const customerForm = document.getElementById('customerForm');
const updateProductsBtn = document.getElementById('updateProductsBtn');
const searchNameBtn = document.getElementById('searchNameBtn');
const searchPhoneBtn = document.getElementById('searchPhoneBtn');
const editModal = document.getElementById('editModal');
const deleteModal = document.getElementById('deleteModal');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const editCustomerForm = document.getElementById('editCustomerForm');

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
});

/**
 * Initialize the application by loading data and updating UI
 */
function initializeApp() {
    loadDataFromStorage();
    updateStatistics();
    updateProductSummary();
    renderCustomersTable();
    populateProductFields();
}

/**
 * Set up all event listeners for the application
 */
function setupEventListeners() {
    // Customer form submission
    customerForm.addEventListener('submit', handleAddCustomer);
    
    // Product update button
    updateProductsBtn.addEventListener('click', handleUpdateProducts);
    
    // Search buttons
    searchNameBtn.addEventListener('click', () => searchCustomers('name'));
    searchPhoneBtn.addEventListener('click', () => searchCustomers('phone'));
    
    // Modal close buttons
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    // Edit customer form submission
    editCustomerForm.addEventListener('submit', handleEditCustomer);
    
    // Confirm delete button
    confirmDeleteBtn.addEventListener('click', handleConfirmDelete);
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
}

/**
 * Load data from localStorage
 */
function loadDataFromStorage() {
    const storedCustomers = localStorage.getItem('crm_customers');
    const storedProducts = localStorage.getItem('crm_products');
    
    if (storedCustomers) {
        customers = JSON.parse(storedCustomers);
    }
    
    if (storedProducts) {
        products = JSON.parse(storedProducts);
    }
}

/**
 * Save data to localStorage
 */
function saveDataToStorage() {
    localStorage.setItem('crm_customers', JSON.stringify(customers));
    localStorage.setItem('crm_products', JSON.stringify(products));
}

/**
 * Handle adding a new customer
 */
function handleAddCustomer(event) {
    event.preventDefault();
    
    const customerData = {
        id: Date.now().toString(),
        name: document.getElementById('customerName').value.trim(),
        phone: document.getElementById('customerPhone').value.trim(),
        address: document.getElementById('customerAddress').value.trim(),
        email: document.getElementById('customerEmail').value.trim() || 'N/A',
        category: document.getElementById('customerCategory').value,
        notes: document.getElementById('customerNotes').value.trim() || '',
        dateAdded: new Date().toISOString()
    };
    
    // Validate required fields
    if (!customerData.name || !customerData.phone || !customerData.address) {
        showMessage('Please fill in all required fields.', 'error');
        return;
    }
    
    // Check if phone number already exists
    if (customers.some(customer => customer.phone === customerData.phone)) {
        showMessage('A customer with this phone number already exists.', 'error');
        return;
    }
    
    // Add customer to array
    customers.push(customerData);
    
    // Save to localStorage and update UI
    saveDataToStorage();
    updateStatistics();
    renderCustomersTable();
    
    // Reset form
    customerForm.reset();
    
    showMessage('Customer added successfully!', 'success');
}

/**
 * Handle updating products and capital
 */
function handleUpdateProducts() {
    const totalProducts = parseInt(document.getElementById('totalProducts').value) || 0;
    const productsSold = parseInt(document.getElementById('productsSold').value) || 0;
    const capitalAmount = parseFloat(document.getElementById('capitalAmount').value) || 0;
    const productPrice = parseFloat(document.getElementById('productPrice').value) || 0;
    
    // Validate inputs
    if (totalProducts < 0 || productsSold < 0 || capitalAmount < 0 || productPrice < 0) {
        showMessage('Please enter valid positive numbers.', 'error');
        return;
    }
    
    if (productsSold > totalProducts) {
        showMessage('Products sold cannot exceed total products.', 'error');
        return;
    }
    
    // Update products object
    products = {
        total: totalProducts,
        sold: productsSold,
        price: productPrice,
        capital: capitalAmount
    };
    
    // Save to localStorage and update UI
    saveDataToStorage();
    updateStatistics();
    updateProductSummary();
    
    showMessage('Products and capital updated successfully!', 'success');
}

/**
 * Search customers by name or phone
 */
function searchCustomers(searchType) {
    let searchValue = '';
    let searchField = '';
    
    if (searchType === 'name') {
        searchValue = document.getElementById('searchByName').value.trim();
        searchField = 'name';
    } else {
        searchValue = document.getElementById('searchByPhone').value.trim();
        searchField = 'phone';
    }
    
    if (!searchValue) {
        showMessage(`Please enter a ${searchType} to search.`, 'error');
        return;
    }
    
    // Search for customers
    const searchResults = customers.filter(customer => 
        customer[searchField].toLowerCase().includes(searchValue.toLowerCase())
    );
    
    displaySearchResults(searchResults, searchType, searchValue);
}

/**
 * Display search results
 */
function displaySearchResults(results, searchType, searchValue) {
    const searchResultsDiv = document.getElementById('searchResults');
    const searchResultsContent = document.getElementById('searchResultsContent');
    
    if (results.length === 0) {
        searchResultsContent.innerHTML = `
            <p>No customers found with ${searchType}: "${searchValue}"</p>
        `;
    } else {
        let resultsHTML = `<p>Found ${results.length} customer(s) with ${searchType}: "${searchValue}"</p>`;
        resultsHTML += '<div class="search-results-table">';
        resultsHTML += '<table><thead><tr><th>Name</th><th>Phone</th><th>Address</th><th>Email</th></tr></thead><tbody>';
        
        results.forEach(customer => {
            resultsHTML += `
                <tr>
                    <td>${customer.name}</td>
                    <td>${customer.phone}</td>
                    <td>${customer.address}</td>
                    <td>${customer.email}</td>
                </tr>
            `;
        });
        
        resultsHTML += '</tbody></table></div>';
        searchResultsContent.innerHTML = resultsHTML;
    }
    
    searchResultsDiv.style.display = 'block';
}

/**
 * Render the customers table
 */
function renderCustomersTable() {
    const tableBody = document.getElementById('customersTableBody');
    
    if (customers.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" class="text-center">No customers found. Add your first customer above.</td></tr>';
        return;
    }
    
    let tableHTML = '';
    customers.forEach(customer => {
        tableHTML += `
            <tr>
                <td>${customer.name}</td>
                <td>${customer.phone}</td>
                <td>${customer.address}</td>
                <td>${customer.email}</td>
                <td>${customer.category || 'Regular'}</td>
                <td>
                    <button class="btn btn-edit" onclick="editCustomer('${customer.id}')">Edit</button>
                    <button class="btn btn-delete" onclick="deleteCustomer('${customer.id}')">Delete</button>
                </td>
            </tr>
        `;
    });
    
    tableBody.innerHTML = tableHTML;
}

/**
 * Edit customer function
 */
function editCustomer(customerId) {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;
    
    // Populate edit form
    document.getElementById('editCustomerId').value = customer.id;
    document.getElementById('editCustomerName').value = customer.name;
    document.getElementById('editCustomerPhone').value = customer.phone;
    document.getElementById('editCustomerAddress').value = customer.address;
    document.getElementById('editCustomerEmail').value = customer.email === 'N/A' ? '' : customer.email;
    document.getElementById('editCustomerCategory').value = customer.category || 'Regular';
    document.getElementById('editCustomerNotes').value = customer.notes || '';
    
    // Show edit modal
    editModal.style.display = 'block';
}

/**
 * Handle edit customer form submission
 */
function handleEditCustomer(event) {
    event.preventDefault();
    
    const customerId = document.getElementById('editCustomerId').value;
    const customerIndex = customers.findIndex(c => c.id === customerId);
    
    if (customerIndex === -1) return;
    
    // Update customer data
    customers[customerIndex] = {
        ...customers[customerIndex],
        name: document.getElementById('editCustomerName').value.trim(),
        phone: document.getElementById('editCustomerPhone').value.trim(),
        address: document.getElementById('editCustomerAddress').value.trim(),
        email: document.getElementById('editCustomerEmail').value.trim() || 'N/A',
        category: document.getElementById('editCustomerCategory').value,
        notes: document.getElementById('editCustomerNotes').value.trim() || '',
        lastModified: new Date().toISOString()
    };
    
    // Save to localStorage and update UI
    saveDataToStorage();
    updateStatistics();
    renderCustomersTable();
    
    // Close modal
    editModal.style.display = 'none';
    
    showMessage('Customer updated successfully!', 'success');
}

/**
 * Delete customer function
 */
function deleteCustomer(customerId) {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;
    
    // Store customer info for confirmation
    window.customerToDelete = customer;
    
    // Show delete confirmation modal
    deleteModal.style.display = 'block';
}

/**
 * Handle confirm delete
 */
function handleConfirmDelete() {
    if (!window.customerToDelete) return;
    
    const customerIndex = customers.findIndex(c => c.id === window.customerToDelete.id);
    if (customerIndex !== -1) {
        customers.splice(customerIndex, 1);
        
        // Save to localStorage and update UI
        saveDataToStorage();
        updateStatistics();
        renderCustomersTable();
        
        showMessage('Customer deleted successfully!', 'success');
    }
    
    // Close modal and clear reference
    deleteModal.style.display = 'none';
    window.customerToDelete = null;
}

/**
 * Update statistics dashboard
 */
function updateStatistics() {
    document.getElementById('totalCustomers').textContent = customers.length;
    document.getElementById('totalProductsSold').textContent = products.sold;
    document.getElementById('availableFunds').textContent = formatCurrency(products.sold * products.price);
    document.getElementById('totalCapital').textContent = formatCurrency(products.capital);
}

/**
 * Update product summary section
 */
function updateProductSummary() {
    document.getElementById('availableProducts').textContent = products.total;
    document.getElementById('displayProductsSold').textContent = products.sold;
    document.getElementById('remainingProducts').textContent = Math.max(0, products.total - products.sold);
}

/**
 * Populate product fields with current values
 */
function populateProductFields() {
    document.getElementById('totalProducts').value = products.total;
    document.getElementById('productsSold').value = products.sold;
    document.getElementById('capitalAmount').value = products.capital;
    document.getElementById('productPrice').value = products.price;
}

/**
 * Format currency to local format
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

/**
 * Show message to user
 */
function showMessage(message, type = 'success') {
    // Remove existing messages
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    // Insert at top of container
    const container = document.querySelector('.container');
    container.insertBefore(messageDiv, container.firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

/**
 * Close edit modal
 */
function closeEditModal() {
    editModal.style.display = 'none';
}

/**
 * Close delete modal
 */
function closeDeleteModal() {
    deleteModal.style.display = 'none';
    window.customerToDelete = null;
}

/**
 * Clear all data (for testing purposes)
 */
function clearAllData() {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
        customers = [];
        products = {
            total: 0,
            sold: 0,
            price: 0,
            capital: 0
        };
        
        localStorage.removeItem('crm_customers');
        localStorage.removeItem('crm_products');
        
        updateStatistics();
        updateProductSummary();
        renderCustomersTable();
        populateProductFields();
        
        showMessage('All data cleared successfully!', 'success');
    }
}

/**
 * Export data to JSON file
 */
function exportData() {
    const data = {
        customers: customers,
        products: products,
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `crm_data_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
}

/**
 * Import data from JSON file
 */
function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            if (data.customers && data.products) {
                customers = data.customers;
                products = data.products;
                
                saveDataToStorage();
                updateStatistics();
                updateProductSummary();
                renderCustomersTable();
                populateProductFields();
                
                showMessage('Data imported successfully!', 'success');
            } else {
                showMessage('Invalid data format. Please select a valid CRM export file.', 'error');
            }
        } catch (error) {
            showMessage('Error reading file. Please ensure it\'s a valid JSON file.', 'error');
        }
    };
    
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
}

// Add utility functions to global scope for HTML onclick handlers
window.editCustomer = editCustomer;
window.deleteCustomer = deleteCustomer;
window.closeEditModal = closeEditModal;
window.closeDeleteModal = closeDeleteModal;
window.clearAllData = clearAllData;
window.exportData = exportData;
window.importData = importData;

// Navigation functions
window.openReportsPage = function() {
    window.location.href = 'reports.html';
};

window.openSettingsPage = function() {
    window.location.href = 'settings.html';
};

// Generate sample data function
window.generateSampleData = function() {
    if (confirm('This will generate sample customer data. Continue?')) {
        const sampleCustomers = [
            {
                id: Date.now().toString(),
                name: 'John Smith',
                phone: '+1-555-0101',
                address: '123 Main St, New York, NY 10001',
                email: 'john.smith@email.com',
                category: 'VIP',
                notes: 'Premium customer, prefers phone contact',
                dateAdded: new Date().toISOString()
            },
            {
                id: (Date.now() + 1).toString(),
                name: 'Sarah Johnson',
                phone: '+1-555-0102',
                address: '456 Oak Ave, Los Angeles, CA 90210',
                email: 'sarah.j@email.com',
                category: 'Regular',
                notes: 'Interested in new products',
                dateAdded: new Date().toISOString()
            },
            {
                id: (Date.now() + 2).toString(),
                name: 'Mike Wilson',
                phone: '+1-555-0103',
                address: '789 Pine Rd, Chicago, IL 60601',
                email: 'mike.wilson@email.com',
                category: 'Corporate',
                notes: 'Bulk orders, corporate account',
                dateAdded: new Date().toISOString()
            }
        ];
        
        customers = sampleCustomers;
        products = {
            total: 100,
            sold: 25,
            price: 29.99,
            capital: 5000
        };
        
        saveDataToStorage();
        updateStatistics();
        updateProductSummary();
        renderCustomersTable();
        populateProductFields();
        
        showMessage('Sample data generated successfully!', 'success');
    }
};
