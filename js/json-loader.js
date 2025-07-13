// JSON Loader for Common/Docs folder
// This file handles loading measure data and scripts from JSON files

// Available insurers and their corresponding JSON files
const INSURER_JSON_FILES = {
    'healthfirst': 'QCM Measures/Healthfirst.json',
    'fidelis': 'QCM Measures/Fideliscare.json',
    'uhc': 'QCM Measures/UnitedHealthcare.json',
    'molina': 'QCM Measures/Molina.json'
};

// Cache for loaded JSON data
const jsonDataCache = {};

// Function to load JSON data for a specific insurer
async function loadInsurerData(insurer) {
    const fileName = INSURER_JSON_FILES[insurer];
    
    if (!fileName) {
        console.error(`No JSON file configured for insurer: ${insurer}`);
        return [];
    }
    
    // Check cache first
    if (jsonDataCache[insurer]) {
        return jsonDataCache[insurer];
    }
    
    try {
        const response = await fetch(`Common/Docs/${fileName}`);
        
        if (!response.ok) {
            console.warn(`JSON file not found for ${insurer}: ${fileName}`);
            return [];
        }
        
        const data = await response.json();
        
        // Transform the data to match our expected format
        const transformedData = data.map(measure => ({
            name: measure['MEASURE NAME'] || 'Unknown Measure',
            description: measure['DESCRIPTION'] || 'No description available',
            location: measure['WHERE IS IT?'] || 'Location not specified',
            compliantPeriod: measure['COMPLIANT PERIOD'] || 'Period not specified',
            coding: measure['CODING'] || 'No coding specified',
            scheduleAs: measure['SCHEDULE AS/ADD TO APPT'] || 'Schedule not specified',
            insurer: insurer
        }));
        
        // Cache the data
        jsonDataCache[insurer] = transformedData;
        
        console.log(`Loaded ${transformedData.length} measures for ${insurer}`);
        return transformedData;
        
    } catch (error) {
        console.error(`Error loading JSON data for ${insurer}:`, error);
        return [];
    }
}

// Function to get all available insurers
function getAvailableInsurers() {
    return Object.keys(INSURER_JSON_FILES);
}

// Function to check if an insurer has data
async function hasInsurerData(insurer) {
    const data = await loadInsurerData(insurer);
    return data.length > 0;
}

// Function to add a new insurer JSON file
function addInsurerJsonFile(insurerKey, fileName) {
    INSURER_JSON_FILES[insurerKey] = fileName;
    console.log(`Added JSON file for ${insurerKey}: ${fileName}`);
}

// Function to clear cache (useful for development)
function clearJsonCache() {
    Object.keys(jsonDataCache).forEach(key => delete jsonDataCache[key]);
    console.log('JSON cache cleared');
}

// ===== SCRIPTS LOADER =====

// Cache for loaded scripts data
const scriptsDataCache = null;

// Function to load scripts data from JSON file
async function loadScriptsData() {
    // Check cache first
    if (scriptsDataCache) {
        return scriptsDataCache;
    }
    
    try {
        const response = await fetch('Common/Docs/Scripts/scripts.json');
        
        if (!response.ok) {
            console.warn('Scripts JSON file not found');
            return [];
        }
        
        const data = await response.json();
        
        console.log(`Loaded ${data.length} scripts`);
        return data;
        
    } catch (error) {
        console.error('Error loading scripts JSON data:', error);
        return [];
    }
}

// Function to get scripts data
async function getScriptsData() {
    return await loadScriptsData();
}

// ===== UPDATES LOADER =====

// Cache for loaded updates data
const updatesDataCache = null;

// Function to load updates data from JSON file
async function loadUpdatesData() {
    // Check cache first
    if (updatesDataCache) {
        return updatesDataCache;
    }
    
    try {
        const response = await fetch('Common/Docs/Updates/Updates.json');
        
        if (!response.ok) {
            console.warn('Updates JSON file not found');
            return [];
        }
        
        const data = await response.json();
        
        console.log(`Loaded ${data.length} updates`);
        return data;
        
    } catch (error) {
        console.error('Error loading updates JSON data:', error);
        return [];
    }
}

// Function to get updates data
async function getUpdatesData() {
    return await loadUpdatesData();
} 