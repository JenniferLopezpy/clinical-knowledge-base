# Setup Instructions - Clinical Knowledge Base QCM

## 🚀 Quick Start

### Option 1: Direct File Opening
1. Simply double-click on `index.html` to open in your default browser
2. The application will work immediately with sample data

### Option 2: Local Server (Recommended)
1. Open a terminal/command prompt in the project directory
2. Run one of these commands:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   
   # Node.js (if you have it installed)
   npx serve .
   ```
3. Open your browser and go to `http://localhost:8000`

## 📁 Project Structure

```
SPH_KnowlesgeBase_QCM/
├── index.html                 # Main application file
├── css/                       # Stylesheets
│   ├── styles.css            # Global styles
│   ├── sidebar.css           # Sidebar navigation
│   └── components.css        # UI components
├── js/                       # JavaScript files
│   ├── data.js              # Application data
│   ├── app.js               # Core functionality
│   ├── components.js        # Enhanced features
│   └── excel-parser.js      # Excel data integration
├── QCM.xlsx                 # Your Excel data file
├── README.md                # Full documentation
├── package.json             # Project configuration
└── SETUP_INSTRUCTIONS.md    # This file
```

## 🔧 Configuration

### Integrating Your Excel Data

1. **Analyze Your Excel Structure**
   - Open `QCM.xlsx` and identify your column headers
   - Note the column names for: Measure Name, Description, Insurer, etc.

2. **Update the Parser**
   - Open `js/excel-parser.js`
   - Modify the `parseExcelData` function to match your Excel columns
   - Update the column name mappings in the function

3. **Example Column Mapping**
   ```javascript
   const measure = {
       name: row.MeasureName || row['Measure Name'] || '',
       description: row.Description || row.MedicalDescription || '',
       explanation: row.PatientExplanation || row.Explanation || '',
       location: row.eCWLocation || row.Location || '',
       period: row.CompliancePeriod || row.Period || 'January 1 - December 31',
       coding: row.Coding || row.ICD10CPT || '',
       schedule: row.Schedule || row.AppointmentType || ''
   };
   ```

4. **Test the Integration**
   - Use the manual data entry function for testing
   - Verify that data appears correctly in the application

### Customizing Insurers

1. **Add New Insurers**
   - Edit `js/data.js` to add new insurer configurations
   - Add corresponding CSS variables in `css/styles.css`
   - Update the insurer mapping in `js/excel-parser.js`

2. **Example Insurer Addition**
   ```javascript
   // In data.js
   const insurerConfig = {
       // ... existing insurers
       newinsurer: {
           name: 'New Insurer Name',
           color: 'var(--newinsurer)',
           bgClass: 'newinsurer'
       }
   };
   ```

   ```css
   /* In styles.css */
   :root {
       /* ... existing colors */
       --newinsurer: #YOUR_COLOR_HERE;
   }
   ```

## 🎯 Key Features

### Navigation
- **Sidebar**: Collapsible navigation on the left
- **Search**: Global search across all measures
- **Responsive**: Works on desktop and mobile devices

### QCM Measures
- **Multi-Insurer Support**: Healthfirst, FidelisCare, UHC, Molina
- **Detailed Information**: Medical descriptions, patient explanations, eCW locations
- **Color Coding**: Each insurer has a distinct color scheme

### Scripts Management
- **Bilingual**: English and Spanish script support
- **CRUD Operations**: Add, edit, delete scripts
- **Auto-save**: Data persists between sessions

### Call Tracking
- **Outcome Tracking**: Schedule, Try Again, Don't Call
- **Real-time Totals**: Automatic calculations
- **Insurer-specific**: Track by insurance provider

### eCW Integration
- **Step-by-step Guide**: 6-step process for To-Do lists
- **Visual Instructions**: Clear icons and descriptions

## ⌨️ Keyboard Shortcuts

- `Ctrl/Cmd + K`: Focus search
- `Ctrl/Cmd + E`: Export data
- `Ctrl/Cmd + I`: Import data
- `Escape`: Close mobile sidebar

## 🔍 Troubleshooting

### Common Issues

1. **Application Not Loading**
   - Check that all files are in the correct directory structure
   - Ensure JavaScript is enabled in your browser
   - Try opening in a different browser

2. **Styles Not Loading**
   - Verify that the `css/` folder contains all three CSS files
   - Check browser console for 404 errors
   - Ensure you're running from a web server (not just opening the HTML file)

3. **Search Not Working**
   - Check browser console for JavaScript errors
   - Verify that `js/data.js` contains measure data
   - Try refreshing the page

4. **Data Not Saving**
   - Check if localStorage is enabled in your browser
   - Try in a different browser
   - Check browser console for errors

### Browser Compatibility

- **Chrome**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support
- **Internet Explorer**: Not supported

## 📞 Support

If you encounter issues:

1. Check the browser console (F12) for error messages
2. Verify all files are present in the correct structure
3. Try running from a local web server instead of opening the HTML file directly
4. Test in a different browser

## 🔄 Updates and Maintenance

### Adding New Measures
1. Edit `js/data.js` to add new measures
2. Or use the Excel parser to import from your Excel file
3. Test the new measures in the application

### Updating Existing Data
1. Modify the data in `js/data.js`
2. Or use the import/export functionality
3. Data will automatically save to localStorage

### Customizing the Interface
1. Edit CSS files in the `css/` folder
2. Modify JavaScript files in the `js/` folder
3. Test changes thoroughly before deployment

---

**Note**: This application is designed for healthcare professionals and should be used in compliance with HIPAA and other relevant healthcare regulations. 