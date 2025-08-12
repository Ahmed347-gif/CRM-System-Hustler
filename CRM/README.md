# CRM - Customer & Sales Management System

A complete, modern Customer Relationship Management (CRM) system built with HTML, CSS, and JavaScript. This system provides comprehensive customer management, product tracking, and sales analytics in a clean, responsive interface.

## 🌟 Features

### Customer Management
- **Add New Customers**: Complete customer records with name, phone, address, and optional email
- **Edit Customers**: Modify existing customer information through an intuitive modal interface
- **Delete Customers**: Remove customers with confirmation dialog
- **Customer Search**: Find customers by name or phone number with instant results
- **Data Validation**: Ensures data integrity and prevents duplicate phone numbers

### Product & Sales Management
- **Inventory Tracking**: Monitor total products available and sold
- **Automatic Calculations**: Real-time calculation of remaining products
- **Product Pricing**: Set and track product prices for revenue calculations
- **Capital Management**: Track total capital investment

### Financial Tracking
- **Revenue Calculation**: Automatic calculation of earnings from sales
- **Capital Display**: Show total capital investment
- **Available Funds**: Display current available funds from sales

### Statistics Dashboard
- **Real-time Metrics**: Live updates of key business metrics
- **Customer Count**: Total registered customers
- **Sales Summary**: Products sold and revenue generated
- **Financial Overview**: Capital and available funds

### Data Persistence
- **Local Storage**: All data persists between browser sessions
- **Data Export**: Export customer and product data to JSON
- **Data Import**: Import previously exported data
- **Data Backup**: Automatic local storage backup

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server required - runs entirely in the browser

### Installation
1. Download all three files to the same folder:
   - `index.html`
   - `style.css`
   - `main.js`

2. Open `index.html` in your web browser

3. The CRM system will load automatically with sample data

## 📱 How to Use

### Adding Customers
1. Fill in the customer form in the "Add New Customer" section
2. Required fields: Name, Phone Number, Address
3. Email is optional
4. Click "Add Customer" to save

### Managing Products
1. Enter total products available
2. Set products sold count
3. Input capital amount
4. Set product price
5. Click "Update Products & Capital"

### Searching Customers
1. **By Name**: Enter customer name and click "Search"
2. **By Phone**: Enter phone number and click "Search"
3. Results display instantly below the search section

### Editing Customers
1. Click the "Edit" button next to any customer in the table
2. Modify information in the popup modal
3. Click "Save Changes" to update

### Deleting Customers
1. Click the "Delete" button next to any customer
2. Confirm deletion in the popup dialog
3. Customer will be permanently removed

### Data Management
- **Export**: Use browser console to call `exportData()` function
- **Import**: Use browser console to call `importData()` function
- **Clear Data**: Use browser console to call `clearAllData()` function

## 🎨 Design Features

### Modern UI/UX
- Clean, professional interface
- Responsive design for all devices
- Smooth animations and transitions
- Intuitive color scheme and typography

### Responsive Layout
- Mobile-first design approach
- Adaptive grid layouts
- Touch-friendly interface elements
- Optimized for all screen sizes

### Visual Elements
- Gradient header with modern styling
- Card-based statistics dashboard
- Hover effects and interactive elements
- Professional form styling

## 🔧 Technical Details

### Technologies Used
- **HTML5**: Semantic markup and modern structure
- **CSS3**: Flexbox, Grid, animations, and responsive design
- **Vanilla JavaScript**: ES6+ features, no external dependencies
- **LocalStorage API**: Client-side data persistence

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Performance Features
- Efficient DOM manipulation
- Optimized event handling
- Minimal memory footprint
- Fast search algorithms

## 📊 Data Structure

### Customer Object
```javascript
{
    id: "unique_identifier",
    name: "Customer Name",
    phone: "Phone Number",
    address: "Customer Address",
    email: "Email or 'N/A'",
    dateAdded: "ISO Date String",
    lastModified: "ISO Date String" // Optional
}
```

### Products Object
```javascript
{
    total: 0,        // Total products available
    sold: 0,         // Products sold
    price: 0,        // Product price
    capital: 0       // Total capital
}
```

## 🛠️ Customization

### Styling
- Modify `style.css` to change colors, fonts, and layout
- CSS variables can be added for easy theme switching
- Responsive breakpoints can be adjusted

### Functionality
- Add new features in `main.js`
- Extend data validation rules
- Implement additional search filters
- Add data export formats

### Localization
- Currency formatting can be modified in `formatCurrency()` function
- Date formats can be customized
- Language-specific text can be added

## 🔒 Data Security

### Local Storage
- All data is stored locally in the browser
- No data is transmitted to external servers
- Data persists until manually cleared or browser data is cleared

### Privacy
- No tracking or analytics
- No external API calls
- Complete data ownership by the user

## 📈 Future Enhancements

### Potential Features
- Customer categories and tags
- Sales history tracking
- Invoice generation
- Customer notes and comments
- Advanced reporting and analytics
- Data backup to cloud storage
- Multi-user support
- Offline functionality

### Technical Improvements
- Service Worker for offline support
- IndexedDB for larger data storage
- Progressive Web App features
- Real-time collaboration
- API integration capabilities

## 🐛 Troubleshooting

### Common Issues
1. **Data not saving**: Check if localStorage is enabled in your browser
2. **Search not working**: Ensure search fields are not empty
3. **Modal not closing**: Click outside the modal or use the X button
4. **Responsive issues**: Check browser console for CSS errors

### Browser Console Commands
```javascript
// Export all data
exportData()

// Import data (requires file input)
// Use browser's file input dialog

// Clear all data
clearAllData()

// View current data
console.log('Customers:', customers)
console.log('Products:', products)
```

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues, feature requests, or pull requests.

## 📞 Support

For support or questions:
1. Check the troubleshooting section above
2. Review browser console for error messages
3. Ensure all files are in the same directory
4. Verify browser compatibility

---

**Built with ❤️ using modern web technologies**
