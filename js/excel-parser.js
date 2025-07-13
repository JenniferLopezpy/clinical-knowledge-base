// Excel Data Parser Utility
// This file helps convert Excel data to the application format

// Function to parse Excel-like data structure
function parseExcelData(excelData) {
    // This is a template function - you would need to implement
    // actual Excel parsing based on your Excel file structure
    
    const parsedData = {
        healthfirst: [],
        fidelis: [],
        uhc: [],
        molina: []
    };
    
    // Example structure - modify based on your Excel columns
    excelData.forEach(row => {
        const measure = {
            name: row.MeasureName || row['Measure Name'] || '',
            description: row.Description || row.MedicalDescription || '',
            explanation: row.PatientExplanation || row.Explanation || '',
            location: row.eCWLocation || row.Location || '',
            period: row.CompliancePeriod || row.Period || 'January 1 - December 31',
            coding: row.Coding || row.ICD10CPT || '',
            schedule: row.Schedule || row.AppointmentType || ''
        };
        
        // Determine insurer based on Excel data
        const insurer = row.Insurer || row.Insurance || '';
        const insurerKey = getInsurerKey(insurer);
        
        if (insurerKey && measure.name) {
            parsedData[insurerKey].push(measure);
        }
    });
    
    return parsedData;
}

function getInsurerKey(insurerName) {
    const insurerMap = {
        'healthfirst': 'healthfirst',
        'Healthfirst': 'healthfirst',
        'HEALTHFIRST': 'healthfirst',
        'fidelis': 'fidelis',
        'FidelisCare': 'fidelis',
        'FIDELIS': 'fidelis',
        'uhc': 'uhc',
        'UnitedHealthcare': 'uhc',
        'UHC': 'uhc',
        'molina': 'molina',
        'Molina': 'molina',
        'MOLINA': 'molina'
    };
    
    return insurerMap[insurerName] || null;
}

// Function to convert Excel data to JSON
function excelToJSON(excelData) {
    // This would typically use a library like SheetJS/xlsx
    // For now, this is a template function
    
    const jsonData = {
        measures: parseExcelData(excelData),
        exportDate: new Date().toISOString(),
        version: '1.0'
    };
    
    return jsonData;
}

// Function to update application data from Excel
function updateFromExcel(excelData) {
    try {
        const parsedData = parseExcelData(excelData);
        
        // Update the global measuresData
        Object.keys(parsedData).forEach(insurer => {
            if (parsedData[insurer].length > 0) {
                measuresData[insurer] = parsedData[insurer];
            }
        });
        
        // Save to localStorage
        localStorage.setItem('clinicalKBMeasures', JSON.stringify(measuresData));
        
        showNotification('Excel data imported successfully!', 'success');
        
        // Refresh the current view
        if (document.getElementById('measuresContent').classList.contains('hidden')) {
            showWelcome();
        } else {
            // Refresh current insurer view
            const currentInsurer = getCurrentInsurer();
            if (currentInsurer) {
                showInsurer(currentInsurer);
            }
        }
        
    } catch (error) {
        console.error('Error importing Excel data:', error);
        showNotification('Error importing Excel data. Please check the format.', 'danger');
    }
}

// Helper function to get current insurer being viewed
function getCurrentInsurer() {
    // This would need to be implemented based on your navigation state
    // For now, return null
    return null;
}

// Manual data entry function for testing
function addManualMeasure(insurer, measureData) {
    if (!measuresData[insurer]) {
        measuresData[insurer] = [];
    }
    
    measuresData[insurer].push({
        name: measureData.name || '',
        description: measureData.description || '',
        explanation: measureData.explanation || '',
        location: measureData.location || '',
        period: measureData.period || 'January 1 - December 31',
        coding: measureData.coding || '',
        schedule: measureData.schedule || ''
    });
    
    // Save to localStorage
    localStorage.setItem('clinicalKBMeasures', JSON.stringify(measuresData));
    
    showNotification(`Measure added to ${insurerConfig[insurer].name}`, 'success');
}

// Load measures from localStorage on startup
function loadMeasuresFromStorage() {
    const savedMeasures = localStorage.getItem('clinicalKBMeasures');
    if (savedMeasures) {
        try {
            const parsed = JSON.parse(savedMeasures);
            Object.keys(parsed).forEach(insurer => {
                measuresData[insurer] = parsed[insurer];
            });
        } catch (error) {
            console.warn('Could not load saved measures:', error);
        }
    }
}

// Export current measures data
function exportMeasuresData() {
    const data = {
        measures: measuresData,
        exportDate: new Date().toISOString(),
        version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qcm-measures-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Measures data exported successfully!', 'success');
}

// Initialize measures data loading
document.addEventListener('DOMContentLoaded', function() {
    loadMeasuresFromStorage();
});

// Example usage for manual data entry (for testing)
/*
addManualMeasure('healthfirst', {
    name: 'Example Measure',
    description: 'This is an example measure description',
    explanation: 'This is how to explain it to patients',
    location: 'eCW > Quality Measures > Example',
    period: 'January 1 - December 31',
    coding: 'ICD-10: Z00.00, CPT: 99213',
    schedule: 'Schedule follow-up appointment'
});
*/ 