// Reports Page JavaScript
// This file handles all the analytics, charts, and reporting functionality

// Initialize reports when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeReports();
    loadReportData();
    updateSystemInfo();
});

/**
 * Initialize the reports page
 */
function initializeReports() {
    // Set up event listeners for export buttons
    setupExportEventListeners();
    
    // Initialize charts
    initializeCharts();
}

/**
 * Set up export event listeners
 */
function setupExportEventListeners() {
    // Customer performance export
    if (document.getElementById('exportCustomerReport')) {
        document.getElementById('exportCustomerReport').addEventListener('click', exportCustomerReport);
    }
    
    // Financial report export
    if (document.getElementById('exportFinancialReport')) {
        document.getElementById('exportFinancialReport').addEventListener('click', exportFinancialReport);
    }
}

/**
 * Load and display report data
 */
function loadReportData() {
    // Load data from localStorage
    const storedCustomers = localStorage.getItem('crm_customers');
    const storedProducts = localStorage.getItem('crm_products');
    
    if (storedCustomers && storedProducts) {
        const customers = JSON.parse(storedCustomers);
        const products = JSON.parse(storedProducts);
        
        // Update quick stats
        updateQuickStats(customers, products);
        
        // Update detailed reports
        updateCustomerPerformanceReport(customers, products);
        updateFinancialReport(products);
        
        // Generate charts
        generateCharts(customers, products);
    } else {
        showNoDataMessage();
    }
}

/**
 * Update quick statistics
 */
function updateQuickStats(customers, products) {
    const totalRevenue = products.sold * products.price;
    const profitMargin = products.capital > 0 ? ((totalRevenue - products.capital) / products.capital * 100) : 0;
    const avgCustomerValue = customers.length > 0 ? totalRevenue / customers.length : 0;
    const growthRate = calculateGrowthRate(customers);
    
    document.getElementById('totalRevenue').textContent = formatCurrency(totalRevenue);
    document.getElementById('profitMargin').textContent = profitMargin.toFixed(1) + '%';
    document.getElementById('avgCustomerValue').textContent = formatCurrency(avgCustomerValue);
    document.getElementById('growthRate').textContent = growthRate.toFixed(1) + '%';
}

/**
 * Calculate customer growth rate
 */
function calculateGrowthRate(customers) {
    if (customers.length < 2) return 0;
    
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    
    const recentCustomers = customers.filter(customer => 
        new Date(customer.dateAdded) > oneMonthAgo
    ).length;
    
    const previousCustomers = customers.length - recentCustomers;
    
    if (previousCustomers === 0) return recentCustomers > 0 ? 100 : 0;
    
    return ((recentCustomers - previousCustomers) / previousCustomers) * 100;
}

/**
 * Update customer performance report
 */
function updateCustomerPerformanceReport(customers, products) {
    const tableBody = document.getElementById('customerPerformanceBody');
    if (!tableBody) return;
    
    // Group customers by category
    const categoryStats = {};
    customers.forEach(customer => {
        const category = customer.category || 'Regular';
        if (!categoryStats[category]) {
            categoryStats[category] = {
                count: 0,
                revenue: 0,
                avgValue: 0
            };
        }
        categoryStats[category].count++;
    });
    
    // Calculate revenue per category (assuming equal distribution)
    const revenuePerCustomer = products.sold * products.price / customers.length;
    Object.keys(categoryStats).forEach(category => {
        categoryStats[category].revenue = categoryStats[category].count * revenuePerCustomer;
        categoryStats[category].avgValue = revenuePerCustomer;
    });
    
    // Generate table rows
    let tableHTML = '';
    Object.keys(categoryStats).forEach(category => {
        const stats = categoryStats[category];
        tableHTML += `
            <tr>
                <td>${category}</td>
                <td>${stats.count}</td>
                <td>${formatCurrency(stats.revenue)}</td>
                <td>${formatCurrency(stats.avgValue)}</td>
            </tr>
        `;
    });
    
    tableBody.innerHTML = tableHTML;
}

/**
 * Update financial report
 */
function updateFinancialReport(products) {
    const totalRevenue = products.sold * products.price;
    const totalProfit = totalRevenue - products.capital;
    const roi = products.capital > 0 ? (totalProfit / products.capital * 100) : 0;
    
    document.getElementById('reportTotalCapital').textContent = formatCurrency(products.capital);
    document.getElementById('reportTotalRevenue').textContent = formatCurrency(totalRevenue);
    document.getElementById('reportTotalProfit').textContent = formatCurrency(totalProfit);
    document.getElementById('reportROI').textContent = roi.toFixed(1) + '%';
}

/**
 * Initialize charts
 */
function initializeCharts() {
    // Set up chart placeholders
    const charts = ['categoryChart', 'growthChart', 'salesChart', 'productChart'];
    charts.forEach(chartId => {
        const chartElement = document.getElementById(chartId);
        if (chartElement) {
            chartElement.classList.add('loading');
        }
    });
}

/**
 * Generate charts with data
 */
function generateCharts(customers, products) {
    // Simulate chart generation (in a real app, you'd use Chart.js or similar)
    setTimeout(() => {
        generateCategoryChart(customers);
        generateGrowthChart(customers);
        generateSalesChart(products);
        generateProductChart(products);
    }, 1000);
}

/**
 * Generate category distribution chart
 */
function generateCategoryChart(customers) {
    const chartElement = document.getElementById('categoryChart');
    if (!chartElement) return;
    
    // Group customers by category
    const categoryCounts = {};
    customers.forEach(customer => {
        const category = customer.category || 'Regular';
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    
    // Create simple text-based chart
    let chartHTML = '<div class="chart-content">';
    Object.keys(categoryCounts).forEach(category => {
        const count = categoryCounts[category];
        const percentage = (count / customers.length * 100).toFixed(1);
        const barWidth = Math.max(20, percentage * 2);
        
        chartHTML += `
            <div class="chart-bar">
                <div class="bar-label">${category}</div>
                <div class="bar-container">
                    <div class="bar" style="width: ${barWidth}px; background: ${getCategoryColor(category)};"></div>
                </div>
                <div class="bar-value">${count} (${percentage}%)</div>
            </div>
        `;
    });
    chartHTML += '</div>';
    
    chartElement.innerHTML = chartHTML;
    chartElement.classList.remove('loading');
    chartElement.classList.add('success');
}

/**
 * Generate growth chart
 */
function generateGrowthChart(customers) {
    const chartElement = document.getElementById('growthChart');
    if (!chartElement) return;
    
    // Create simple growth visualization
    const growthData = calculateMonthlyGrowth(customers);
    
    let chartHTML = '<div class="chart-content">';
    chartHTML += '<div class="growth-timeline">';
    
    Object.keys(growthData).forEach(month => {
        const count = growthData[month];
        chartHTML += `
            <div class="timeline-item">
                <div class="timeline-month">${month}</div>
                <div class="timeline-count">${count}</div>
            </div>
        `;
    });
    
    chartHTML += '</div></div>';
    
    chartElement.innerHTML = chartHTML;
    chartElement.classList.remove('loading');
    chartElement.classList.add('success');
}

/**
 * Generate sales chart
 */
function generateSalesChart(products) {
    const chartElement = document.getElementById('salesChart');
    if (!chartElement) return;
    
    // Create simple sales visualization
    const monthlySales = generateMonthlySalesData(products);
    
    let chartHTML = '<div class="chart-content">';
    chartHTML += '<div class="sales-chart">';
    
    Object.keys(monthlySales).forEach(month => {
        const sales = monthlySales[month];
        const barHeight = Math.max(20, sales / 100);
        
        chartHTML += `
            <div class="sales-bar">
                <div class="sales-value">${formatCurrency(sales)}</div>
                <div class="sales-bar-visual" style="height: ${barHeight}px;"></div>
                <div class="sales-month">${month}</div>
            </div>
        `;
    });
    
    chartHTML += '</div></div>';
    
    chartElement.innerHTML = chartHTML;
    chartElement.classList.remove('loading');
    chartElement.classList.add('success');
}

/**
 * Generate product performance chart
 */
function generateProductChart(products) {
    const chartElement = document.getElementById('productChart');
    if (!chartElement) return;
    
    // Create simple product visualization
    const remaining = products.total - products.sold;
    const soldPercentage = (products.sold / products.total * 100).toFixed(1);
    const remainingPercentage = (remaining / products.total * 100).toFixed(1);
    
    let chartHTML = `
        <div class="chart-content">
            <div class="product-summary-chart">
                <div class="product-stat">
                    <div class="stat-circle sold" style="--percentage: ${soldPercentage}%">
                        <span class="stat-number">${products.sold}</span>
                        <span class="stat-label">Sold</span>
                    </div>
                </div>
                <div class="product-stat">
                    <div class="stat-circle remaining" style="--percentage: ${remainingPercentage}%">
                        <span class="stat-number">${remaining}</span>
                        <span class="stat-label">Remaining</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    chartElement.innerHTML = chartHTML;
    chartElement.classList.remove('loading');
    chartElement.classList.add('success');
}

/**
 * Calculate monthly growth data
 */
function calculateMonthlyGrowth(customers) {
    const monthlyData = {};
    const now = new Date();
    
    // Generate last 6 months
    for (let i = 5; i >= 0; i--) {
        const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = month.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        monthlyData[monthKey] = 0;
    }
    
    // Count customers added in each month
    customers.forEach(customer => {
        const customerDate = new Date(customer.dateAdded);
        const monthKey = customerDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        if (monthlyData[monthKey] !== undefined) {
            monthlyData[monthKey]++;
        }
    });
    
    return monthlyData;
}

/**
 * Generate monthly sales data
 */
function generateMonthlySalesData(products) {
    const monthlySales = {};
    const now = new Date();
    
    // Generate last 6 months with random sales data
    for (let i = 5; i >= 0; i--) {
        const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = month.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        
        // Generate realistic sales data
        const baseSales = products.sold / 6;
        const variation = (Math.random() - 0.5) * 0.4; // ±20% variation
        monthlySales[monthKey] = Math.max(0, baseSales * (1 + variation) * products.price);
    }
    
    return monthlySales;
}

/**
 * Get category color
 */
function getCategoryColor(category) {
    const colors = {
        'Regular': '#667eea',
        'VIP': '#f39c12',
        'Premium': '#27ae60',
        'Wholesale': '#9b59b6',
        'Corporate': '#e74c3c'
    };
    return colors[category] || '#95a5a6';
}

/**
 * Update system information
 */
function updateSystemInfo() {
    const now = new Date();
    
    // Calculate data size
    const customersData = localStorage.getItem('crm_customers') || '';
    const productsData = localStorage.getItem('crm_products') || '';
    const totalSize = (customersData.length + productsData.length) / 1024; // KB
    
    // Update display
    document.getElementById('lastUpdated').textContent = now.toLocaleString();
    document.getElementById('totalRecords').textContent = (customersData ? JSON.parse(customersData).length : 0) + (productsData ? 1 : 0);
    document.getElementById('dataSize').textContent = totalSize.toFixed(1) + ' KB';
    document.getElementById('systemVersion').textContent = '1.0.0';
    document.getElementById('lastBackup').textContent = 'Never';
    document.getElementById('storageUsed').textContent = '0.1%';
}

/**
 * Show no data message
 */
function showNoDataMessage() {
    const charts = ['categoryChart', 'growthChart', 'salesChart', 'productChart'];
    charts.forEach(chartId => {
        const chartElement = document.getElementById(chartId);
        if (chartElement) {
            chartElement.innerHTML = '<div class="no-data">No data available. Please add customers and products in the main CRM.</div>';
            chartElement.classList.remove('loading');
        }
    });
}

/**
 * Export customer report
 */
function exportCustomerReport() {
    const reportData = {
        reportType: 'Customer Performance Report',
        generatedAt: new Date().toISOString(),
        data: document.getElementById('customerPerformanceTable').outerHTML
    };
    
    downloadReport(reportData, 'customer_performance_report');
}

/**
 * Export financial report
 */
function exportFinancialReport() {
    const reportData = {
        reportType: 'Financial Summary Report',
        generatedAt: new Date().toISOString(),
        totalCapital: document.getElementById('reportTotalCapital').textContent,
        totalRevenue: document.getElementById('reportTotalRevenue').textContent,
        totalProfit: document.getElementById('reportTotalProfit').textContent,
        roi: document.getElementById('reportROI').textContent
    };
    
    downloadReport(reportData, 'financial_summary_report');
}

/**
 * Download report
 */
function downloadReport(data, filename) {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.pdf`;
    link.click();
}

/**
 * Generate custom report
 */
function generateCustomReport() {
    const reportType = document.getElementById('reportType').value;
    const dateRange = document.getElementById('dateRange').value;
    
    alert(`Generating ${reportType} report for ${dateRange}...\nThis feature is under development.`);
}

/**
 * Export functions
 */
function exportAllData() {
    const allData = {
        customers: JSON.parse(localStorage.getItem('crm_customers') || '[]'),
        products: JSON.parse(localStorage.getItem('crm_products') || '{}'),
        exportDate: new Date().toISOString()
    };
    
    downloadReport(allData, 'crm_all_data');
}

function exportCustomersOnly() {
    const customers = JSON.parse(localStorage.getItem('crm_customers') || '[]');
    downloadReport(customers, 'crm_customers_only');
}

function exportSalesData() {
    const products = JSON.parse(localStorage.getItem('crm_products') || '{}');
    downloadReport(products, 'crm_sales_data');
}

function exportFinancialData() {
    const products = JSON.parse(localStorage.getItem('crm_products') || '{}');
    const financialData = {
        totalCapital: products.capital || 0,
        totalRevenue: (products.sold || 0) * (products.price || 0),
        totalProfit: ((products.sold || 0) * (products.price || 0)) - (products.capital || 0),
        exportDate: new Date().toISOString()
    };
    
    downloadReport(financialData, 'crm_financial_data');
}

/**
 * Format currency
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Add functions to global scope
window.generateCustomReport = generateCustomReport;
window.exportAllData = exportAllData;
window.exportCustomersOnly = exportCustomersOnly;
window.exportSalesData = exportSalesData;
window.exportFinancialData = exportFinancialData;

