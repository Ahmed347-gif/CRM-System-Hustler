// Settings Page JavaScript
// This file handles all the configuration and settings functionality

// Initialize settings when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeSettings();
    loadSettings();
    loadCategories();
});

/**
 * Initialize the settings page
 */
function initializeSettings() {
    // Set up event listeners
    setupSettingsEventListeners();
    
    // Load default settings if none exist
    loadDefaultSettings();
}

/**
 * Set up settings event listeners
 */
function setupSettingsEventListeners() {
    // Company info form
    if (document.getElementById('companyName')) {
        document.getElementById('companyName').addEventListener('change', saveCompanyInfo);
    }
    
    // Localization form
    if (document.getElementById('language')) {
        document.getElementById('language').addEventListener('change', saveLocalization);
    }
    
    // Category management
    if (document.getElementById('newCategory')) {
        document.getElementById('newCategory').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addCategory();
            }
        });
    }
}

/**
 * Load default settings
 */
function loadDefaultSettings() {
    const defaultSettings = {
        company: {
            name: '',
            address: '',
            phone: '',
            email: ''
        },
        localization: {
            language: 'en',
            currency: 'USD',
            timezone: 'UTC'
        },
        categories: ['Regular', 'VIP', 'Premium', 'Wholesale', 'Corporate'],
        fields: {
            notes: true,
            tags: true,
            birthday: false,
            socialMedia: false
        },
        notifications: {
            email: true,
            browser: true,
            lowStock: false,
            birthday: false
        },
        security: {
            sessionTimeout: 30,
            maxLoginAttempts: 5,
            dataEncryption: true,
            auditLog: true
        },
        backup: {
            autoBackup: 'weekly',
            retention: 30
        },
        performance: {
            cacheSize: 100,
            maxSearchResults: 100,
            lazyLoading: true,
            compression: true
        },
        developer: {
            debugMode: false,
            consoleLogs: false,
            performanceMonitoring: false
        },
        export: {
            format: 'json',
            encoding: 'utf8'
        },
        import: {
            validation: 'moderate',
            duplicateHandling: 'skip'
        }
    };
    
    // Save default settings if none exist
    if (!localStorage.getItem('crm_settings')) {
        localStorage.setItem('crm_settings', JSON.stringify(defaultSettings));
    }
}

/**
 * Load settings from localStorage
 */
function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('crm_settings') || '{}');
    
    // Load company information
    if (settings.company) {
        document.getElementById('companyName').value = settings.company.name || '';
        document.getElementById('companyAddress').value = settings.company.address || '';
        document.getElementById('companyPhone').value = settings.company.phone || '';
        document.getElementById('companyEmail').value = settings.company.email || '';
    }
    
    // Load localization settings
    if (settings.localization) {
        document.getElementById('language').value = settings.localization.language || 'en';
        document.getElementById('currency').value = settings.localization.currency || 'USD';
        document.getElementById('timezone').value = settings.localization.timezone || 'UTC';
    }
    
    // Load field settings
    if (settings.fields) {
        document.getElementById('enableNotes').checked = settings.fields.notes !== false;
        document.getElementById('enableTags').checked = settings.fields.tags !== false;
        document.getElementById('enableBirthday').checked = settings.fields.birthday === true;
        document.getElementById('enableSocialMedia').checked = settings.fields.socialMedia === true;
    }
    
    // Load notification settings
    if (settings.notifications) {
        document.getElementById('emailNotifications').checked = settings.notifications.email !== false;
        document.getElementById('browserNotifications').checked = settings.notifications.browser !== false;
        document.getElementById('lowStockAlerts').checked = settings.notifications.lowStock === true;
        document.getElementById('customerBirthdayReminders').checked = settings.notifications.birthday === true;
    }
    
    // Load security settings
    if (settings.security) {
        document.getElementById('sessionTimeout').value = settings.security.sessionTimeout || 30;
        document.getElementById('maxLoginAttempts').value = settings.security.maxLoginAttempts || 5;
        document.getElementById('enableDataEncryption').checked = settings.security.dataEncryption !== false;
        document.getElementById('enableAuditLog').checked = settings.security.auditLog !== false;
    }
    
    // Load backup settings
    if (settings.backup) {
        document.getElementById('autoBackup').value = settings.backup.autoBackup || 'weekly';
        document.getElementById('backupRetention').value = settings.backup.retention || 30;
    }
    
    // Load performance settings
    if (settings.performance) {
        document.getElementById('cacheSize').value = settings.performance.cacheSize || 100;
        document.getElementById('maxSearchResults').value = settings.performance.maxSearchResults || 100;
        document.getElementById('enableLazyLoading').checked = settings.performance.lazyLoading !== false;
        document.getElementById('enableCompression').checked = settings.performance.compression !== false;
    }
    
    // Load developer settings
    if (settings.developer) {
        document.getElementById('enableDebugMode').checked = settings.developer.debugMode === true;
        document.getElementById('enableConsoleLogs').checked = settings.developer.consoleLogs === true;
        document.getElementById('enablePerformanceMonitoring').checked = settings.developer.performanceMonitoring === true;
    }
    
    // Load export/import settings
    if (settings.export) {
        document.getElementById('exportFormat').value = settings.export.format || 'pdf';
        document.getElementById('exportEncoding').value = settings.export.encoding || 'utf8';
    }
    
    if (settings.import) {
        document.getElementById('importValidation').value = settings.import.validation || 'moderate';
        document.getElementById('duplicateHandling').value = settings.import.duplicateHandling || 'skip';
    }
}

/**
 * Load categories from localStorage
 */
function loadCategories() {
    const settings = JSON.parse(localStorage.getItem('crm_settings') || '{}');
    const categories = settings.categories || ['Regular', 'VIP', 'Premium', 'Wholesale', 'Corporate'];
    
    const categoryList = document.getElementById('categoryList');
    if (!categoryList) return;
    
    let categoryHTML = '';
    categories.forEach(category => {
        categoryHTML += `
            <div class="category-item">
                <span class="category-name">${category}</span>
                <div class="category-actions">
                    <button class="edit-cat" onclick="editCategory('${category}')">Edit</button>
                    <button class="delete-cat" onclick="deleteCategory('${category}')">Delete</button>
                </div>
            </div>
        `;
    });
    
    categoryList.innerHTML = categoryHTML;
}

/**
 * Save company information
 */
function saveCompanyInfo() {
    const companyInfo = {
        name: document.getElementById('companyName').value,
        address: document.getElementById('companyAddress').value,
        phone: document.getElementById('companyPhone').value,
        email: document.getElementById('companyEmail').value
    };
    
    const settings = JSON.parse(localStorage.getItem('crm_settings') || '{}');
    settings.company = companyInfo;
    
    localStorage.setItem('crm_settings', JSON.stringify(settings));
    showSettingsMessage('Company information saved successfully!', 'success');
}

/**
 * Save localization settings
 */
function saveLocalization() {
    const localization = {
        language: document.getElementById('language').value,
        currency: document.getElementById('currency').value,
        timezone: document.getElementById('timezone').value
    };
    
    const settings = JSON.parse(localStorage.getItem('crm_settings') || '{}');
    settings.localization = localization;
    
    localStorage.setItem('crm_settings', JSON.stringify(settings));
    showSettingsMessage('Localization settings saved successfully!', 'success');
}

/**
 * Save field settings
 */
function saveFieldSettings() {
    const fields = {
        notes: document.getElementById('enableNotes').checked,
        tags: document.getElementById('enableTags').checked,
        birthday: document.getElementById('enableBirthday').checked,
        socialMedia: document.getElementById('enableSocialMedia').checked
    };
    
    const settings = JSON.parse(localStorage.getItem('crm_settings') || '{}');
    settings.fields = fields;
    
    localStorage.setItem('crm_settings', JSON.stringify(settings));
    showSettingsMessage('Field settings saved successfully!', 'success');
}

/**
 * Save notification settings
 */
function saveNotificationSettings() {
    const notifications = {
        email: document.getElementById('emailNotifications').checked,
        browser: document.getElementById('browserNotifications').checked,
        lowStock: document.getElementById('lowStockAlerts').checked,
        birthday: document.getElementById('customerBirthdayReminders').checked
    };
    
    const settings = JSON.parse(localStorage.getItem('crm_settings') || '{}');
    settings.notifications = notifications;
    
    localStorage.setItem('crm_settings', JSON.stringify(settings));
    showSettingsMessage('Notification settings saved successfully!', 'success');
}

/**
 * Save security settings
 */
function saveSecuritySettings() {
    const security = {
        sessionTimeout: parseInt(document.getElementById('sessionTimeout').value),
        maxLoginAttempts: parseInt(document.getElementById('maxLoginAttempts').value),
        dataEncryption: document.getElementById('enableDataEncryption').checked,
        auditLog: document.getElementById('enableAuditLog').checked
    };
    
    const settings = JSON.parse(localStorage.getItem('crm_settings') || '{}');
    settings.security = security;
    
    localStorage.setItem('crm_settings', JSON.stringify(settings));
    showSettingsMessage('Security settings saved successfully!', 'success');
}

/**
 * Save performance settings
 */
function savePerformanceSettings() {
    const performance = {
        cacheSize: parseInt(document.getElementById('cacheSize').value),
        maxSearchResults: parseInt(document.getElementById('maxSearchResults').value),
        lazyLoading: document.getElementById('enableLazyLoading').checked,
        compression: document.getElementById('enableCompression').checked
    };
    
    const settings = JSON.parse(localStorage.getItem('crm_settings') || '{}');
    settings.performance = performance;
    
    localStorage.setItem('crm_settings', JSON.stringify(settings));
    showSettingsMessage('Performance settings saved successfully!', 'success');
}

/**
 * Save export settings
 */
function saveExportSettings() {
    const exportSettings = {
        format: document.getElementById('exportFormat').value,
        encoding: document.getElementById('exportEncoding').value
    };
    
    const settings = JSON.parse(localStorage.getItem('crm_settings') || '{}');
    settings.export = exportSettings;
    
    localStorage.setItem('crm_settings', JSON.stringify(settings));
    showSettingsMessage('Export settings saved successfully!', 'success');
}

/**
 * Save import settings
 */
function saveImportSettings() {
    const importSettings = {
        validation: document.getElementById('importValidation').value,
        duplicateHandling: document.getElementById('duplicateHandling').value
    };
    
    const settings = JSON.parse(localStorage.getItem('crm_settings') || '{}');
    settings.import = importSettings;
    
    localStorage.setItem('crm_settings', JSON.stringify(settings));
    showSettingsMessage('Import settings saved successfully!', 'success');
}

/**
 * Add new category
 */
function addCategory() {
    const newCategoryInput = document.getElementById('newCategory');
    const categoryName = newCategoryInput.value.trim();
    
    if (!categoryName) {
        showSettingsMessage('Please enter a category name.', 'error');
        return;
    }
    
    const settings = JSON.parse(localStorage.getItem('crm_settings') || '{}');
    if (!settings.categories) {
        settings.categories = [];
    }
    
    if (settings.categories.includes(categoryName)) {
        showSettingsMessage('Category already exists.', 'error');
        return;
    }
    
    settings.categories.push(categoryName);
    localStorage.setItem('crm_settings', JSON.stringify(settings));
    
    // Reload categories
    loadCategories();
    
    // Clear input
    newCategoryInput.value = '';
    
    showSettingsMessage('Category added successfully!', 'success');
}

/**
 * Edit category
 */
function editCategory(oldName) {
    const newName = prompt('Enter new name for category:', oldName);
    
    if (newName && newName.trim() && newName !== oldName) {
        const settings = JSON.parse(localStorage.getItem('crm_settings') || '{}');
        if (settings.categories) {
            const index = settings.categories.indexOf(oldName);
            if (index !== -1) {
                settings.categories[index] = newName.trim();
                localStorage.setItem('crm_settings', JSON.stringify(settings));
                
                // Reload categories
                loadCategories();
                showSettingsMessage('Category updated successfully!', 'success');
            }
        }
    }
}

/**
 * Delete category
 */
function deleteCategory(categoryName) {
    if (confirm(`Are you sure you want to delete the category "${categoryName}"?`)) {
        const settings = JSON.parse(localStorage.getItem('crm_settings') || '{}');
        if (settings.categories) {
            const index = settings.categories.indexOf(categoryName);
            if (index !== -1) {
                settings.categories.splice(index, 1);
                localStorage.setItem('crm_settings', JSON.stringify(settings));
                
                // Reload categories
                loadCategories();
                showSettingsMessage('Category deleted successfully!', 'success');
            }
        }
    }
}

/**
 * Save categories
 */
function saveCategories() {
    const settings = JSON.parse(localStorage.getItem('crm_settings') || '{}');
    const categoryElements = document.querySelectorAll('.category-name');
    
    settings.categories = Array.from(categoryElements).map(el => el.textContent);
    localStorage.setItem('crm_settings', JSON.stringify(settings));
    
    showSettingsMessage('Categories saved successfully!', 'success');
}

/**
 * Create backup
 */
function createBackup() {
    const backupData = {
        customers: JSON.parse(localStorage.getItem('crm_customers') || '[]'),
        products: JSON.parse(localStorage.getItem('crm_products') || '{}'),
        settings: JSON.parse(localStorage.getItem('crm_settings') || '{}'),
        backupDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(backupData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `crm_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showSettingsMessage('Backup created successfully!', 'success');
}

/**
 * Restore backup
 */
function restoreBackup() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const backupData = JSON.parse(e.target.result);
                    
                    if (backupData.customers && backupData.products) {
                        localStorage.setItem('crm_customers', JSON.stringify(backupData.customers));
                        localStorage.setItem('crm_products', JSON.stringify(backupData.products));
                        
                        if (backupData.settings) {
                            localStorage.setItem('crm_settings', JSON.stringify(backupData.settings));
                        }
                        
                        showSettingsMessage('Backup restored successfully! Please refresh the page.', 'success');
                    } else {
                        showSettingsMessage('Invalid backup file format.', 'error');
                    }
                } catch (error) {
                    showSettingsMessage('Error reading backup file.', 'error');
                }
            };
            reader.readAsText(file);
        }
    };
    
    input.click();
}

/**
 * Clean up old data
 */
function cleanupOldData() {
    const days = parseInt(document.getElementById('cleanupOldRecords').value);
    
    if (confirm(`This will remove customer records older than ${days} days. Continue?`)) {
        const customers = JSON.parse(localStorage.getItem('crm_customers') || '[]');
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        
        const filteredCustomers = customers.filter(customer => 
            new Date(customer.dateAdded) > cutoffDate
        );
        
        localStorage.setItem('crm_customers', JSON.stringify(filteredCustomers));
        
        showSettingsMessage(`Cleanup completed. Removed ${customers.length - filteredCustomers.length} old records.`, 'success');
    }
}

/**
 * Reset system
 */
function resetSystem() {
    if (confirm('This will reset ALL data and settings. This action cannot be undone. Continue?')) {
        localStorage.clear();
        showSettingsMessage('System reset successfully. Please refresh the page.', 'success');
    }
}

/**
 * Export system logs
 */
function exportSystemLogs() {
    const logs = {
        exportDate: new Date().toISOString(),
        message: 'System logs export feature is under development.'
    };
    
    const dataStr = JSON.stringify(logs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `system_logs_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showSettingsMessage('System logs exported successfully!', 'success');
}

/**
 * Test system
 */
function testSystem() {
    const tests = [
        { name: 'LocalStorage', result: testLocalStorage() },
        { name: 'Data Integrity', result: testDataIntegrity() },
        { name: 'Settings', result: testSettings() }
    ];
    
    const passedTests = tests.filter(test => test.result).length;
    const totalTests = tests.length;
    
    showSettingsMessage(`System test completed: ${passedTests}/${totalTests} tests passed.`, 
        passedTests === totalTests ? 'success' : 'warning');
}

/**
 * Test localStorage functionality
 */
function testLocalStorage() {
    try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        return true;
    } catch (e) {
        return false;
    }
}

/**
 * Test data integrity
 */
function testDataIntegrity() {
    try {
        const customers = JSON.parse(localStorage.getItem('crm_customers') || '[]');
        const products = JSON.parse(localStorage.getItem('crm_products') || '{}');
        return Array.isArray(customers) && typeof products === 'object';
    } catch (e) {
        return false;
    }
}

/**
 * Test settings
 */
function testSettings() {
    try {
        const settings = JSON.parse(localStorage.getItem('crm_settings') || '{}');
        return typeof settings === 'object';
    } catch (e) {
        return false;
    }
}

/**
 * Show settings message
 */
function showSettingsMessage(message, type = 'success') {
    // Remove existing messages
    const existingMessage = document.querySelector('.settings-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `settings-message ${type}`;
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

// Add functions to global scope
window.saveCompanyInfo = saveCompanyInfo;
window.saveLocalization = saveLocalization;
window.saveFieldSettings = saveFieldSettings;
window.saveNotificationSettings = saveNotificationSettings;
window.saveSecuritySettings = saveSecuritySettings;
window.savePerformanceSettings = savePerformanceSettings;
window.saveExportSettings = saveExportSettings;
window.saveImportSettings = saveImportSettings;
window.addCategory = addCategory;
window.editCategory = editCategory;
window.deleteCategory = deleteCategory;
window.saveCategories = saveCategories;
window.createBackup = createBackup;
window.restoreBackup = restoreBackup;
window.cleanupOldData = cleanupOldData;
window.resetSystem = resetSystem;
window.exportSystemLogs = exportSystemLogs;
window.testSystem = testSystem;

