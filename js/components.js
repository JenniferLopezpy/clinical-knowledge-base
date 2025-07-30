// Components and Enhanced Features

// Mobile sidebar toggle functionality
function initializeMobileSidebar() {
    // Add mobile toggle button if not exists
    if (!document.querySelector('.sidebar-toggle')) {
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'sidebar-toggle';
        toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
        toggleBtn.onclick = toggleMobileSidebar;
        document.body.appendChild(toggleBtn);
    }
}

function toggleMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open');
}

// Close sidebar when clicking outside on mobile
document.addEventListener('click', function(e) {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.querySelector('.sidebar-toggle');
    
    if (window.innerWidth <= 768) {
        if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    }
});

// Enhanced measure card functionality
function enhanceMeasureCards() {
    // Add copy functionality to measure details
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('copy-btn')) {
            const textToCopy = e.target.getAttribute('data-text');
            navigator.clipboard.writeText(textToCopy).then(() => {
                showNotification('Copied to clipboard!', 'success');
            });
        }
    });
}

// Notification system
window.showNotification = function(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} fixed top-4 right-4 z-50 max-w-sm`;
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-${getNotificationIcon(type)} mr-2"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        warning: 'exclamation-triangle',
        danger: 'times-circle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// Enhanced search with debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Función para normalizar texto (quitar acentos, minúsculas y símbolos)
function normalizeText(text) {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .replace(/[^a-z0-9]/gi, ''); // Elimina todo lo que no sea letra o número
}

// Enhanced search functionality
window.debouncedSearch = debounce(async function(searchTerm) {
    if (searchTerm.length < 1) return;
    const searchNorm = normalizeText(searchTerm);
    
    // Search through all measures from JSON files
    let foundMeasures = [];
    
    // Get all available insurers
    const insurers = ['healthfirst', 'fidelis', 'uhc', 'molina'];
    
    for (const insurer of insurers) {
        try {
            const measures = await loadInsurerData(insurer);
            measures.forEach(measure => {
                // Check all fields of the measure
                const allFields = Object.values(measure).join(' ');
                if (normalizeText(allFields).includes(searchNorm)) {
                    foundMeasures.push({ ...measure, insurer });
                }
            });
        } catch (error) {
            console.error(`Error searching measures for ${insurer}:`, error);
        }
    }
    
    displaySearchResults(foundMeasures, searchTerm);
}, 300);

window.displaySearchResults = function(measures, searchTerm) {
    if (measures.length === 0) {
        showNotification('No measures found matching your search.', 'warning');
        return;
    }
    
    hideAllContent();
    const content = document.getElementById('measuresContent');
    content.classList.remove('hidden');
    
    content.innerHTML = `
        <div class="mb-6">
            <h2 class="text-3xl font-montserrat font-bold text-gray-800 mb-2">Search Results</h2>
            <p class="text-gray-600">Found ${measures.length} measure(s) matching "${searchTerm}"</p>
        </div>
        <div class="space-y-6">
            ${measures.map((measure, index) => {
                const config = insurerConfig[measure.insurer];
                const highlightedName = highlightText(measure.name, searchTerm);
                const highlightedDescription = highlightText(measure.description, searchTerm);
                
                return `
                    <div class="measure-card">
                        <div class="measure-header ${config.bgClass}">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center">
                                    <i class="fas fa-clipboard-check text-gray-600 mr-4 text-xl"></i>
                                    <div>
                                        <h3 class="text-lg font-montserrat font-semibold text-gray-800">${highlightedName}</h3>
                                        <p class="text-sm text-gray-600 mt-1">${config.name}</p>
                                    </div>
                                </div>
                                <button onclick="toggleSearchMeasure(${index})" class="text-gray-600 hover:text-gray-800">
                                    <i id="search-measure-arrow-${index}" class="fas fa-chevron-down transition-transform"></i>
                                </button>
                            </div>
                        </div>
                        <div id="search-measure-content-${index}" class="measure-content">
                            <p class="text-gray-700 mb-4">${highlightedDescription}</p>
                            <div class="flex items-center justify-between">
                                <div class="flex items-center text-sm text-gray-600">
                                    <i class="fas fa-map-marker-alt mr-2"></i>
                                    <span>${measure.location}</span>
                                </div>
                                <button onclick="showFullMeasure('${measure.insurer}', '${measure.name}')" class="btn btn-primary btn-sm">
                                    View Full Details
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

window.highlightText = function(text, searchTerm) {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
}

window.toggleSearchMeasure = function(index) {
    const content = document.getElementById(`search-measure-content-${index}`);
    const arrow = document.getElementById(`search-measure-arrow-${index}`);
    
    if (content.classList.contains('show')) {
        content.classList.remove('show');
        arrow.style.transform = 'rotate(0deg)';
    } else {
        content.classList.add('show');
        arrow.style.transform = 'rotate(180deg)';
    }
}

window.showFullMeasure = async function(insurer, measureName) {
    // First show the insurer content
    showInsurer(insurer);
    
    // Wait for content to load and then find and expand the specific measure
    setTimeout(async () => {
        try {
            const measures = await loadInsurerData(insurer);
            const measureIndex = measures.findIndex(m => m.name === measureName);
            if (measureIndex !== -1) {
                // Find the measure card and expand it
                const measureCards = document.querySelectorAll('.measure-card');
                if (measureCards[measureIndex]) {
                    const content = measureCards[measureIndex].querySelector('.measure-content');
                    const arrow = measureCards[measureIndex].querySelector('.measure-arrow');
                    
                    if (content && !content.classList.contains('show')) {
                        content.classList.add('show');
                        if (arrow) {
                            arrow.style.transform = 'rotate(180deg)';
                        }
                    }
                    
                    // Scroll to the measure
                    measureCards[measureIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        } catch (error) {
            console.error('Error finding measure:', error);
        }
    }, 500); // Increased timeout to ensure content is loaded
}

// Export functionality
function exportData() {
    const data = {
        measures: measuresData,
        scripts: scriptsData,
        callTracker: callTrackerData,
        exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clinical-kb-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Data exported successfully!', 'success');
}

// Import functionality
function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const data = JSON.parse(e.target.result);
                    if (data.measures) measuresData = data.measures;
                    if (data.scripts) window.scriptsData = data.scripts;
                    if (data.callTracker) callTrackerData = data.callTracker;
                    
                    showNotification('Data imported successfully!', 'success');
                    showWelcome(); // Refresh the view
                } catch (error) {
                    showNotification('Error importing data. Please check the file format.', 'danger');
                }
            };
            reader.readAsText(file);
        }
    };
    input.click();
}

// Keyboard shortcuts
function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            document.getElementById('searchInput').focus();
        }
        
        // Escape to close mobile sidebar
        if (e.key === 'Escape') {
            const sidebar = document.getElementById('sidebar');
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('open');
            }
        }
        
        // Ctrl/Cmd + E for export
        if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
            e.preventDefault();
            exportData();
        }
        
        // Ctrl/Cmd + I for import
        if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
            e.preventDefault();
            importData();
        }
    });
}

// Auto-save functionality
function initializeAutoSave() {
    // Save data to localStorage every 30 seconds
    setInterval(() => {
        const data = {
            scripts: window.scriptsData || [],
            callTracker: callTrackerData,
            lastSaved: new Date().toISOString()
        };
        localStorage.setItem('clinicalKBData', JSON.stringify(data));
    }, 30000);
    
    // Load data from localStorage on startup
    const savedData = localStorage.getItem('clinicalKBData');
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            if (data.scripts) window.scriptsData = data.scripts;
            if (data.callTracker) callTrackerData = data.callTracker;
        } catch (error) {
            console.warn('Could not load saved data:', error);
        }
    }
}

// Initialize all enhanced features
document.addEventListener('DOMContentLoaded', function() {
    initializeMobileSidebar();
    enhanceMeasureCards();
    initializeKeyboardShortcuts();
    initializeAutoSave();
    
    // Update search to use debounced version
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.trim();
            if (searchTerm === '') {
                showWelcome();
                return;
            }
            debouncedSearch(searchTerm);
        });
    }
}); 