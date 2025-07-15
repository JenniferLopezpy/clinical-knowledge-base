// Main Application JavaScript

// Utility functions
function toggleSection(section) {
    const content = document.getElementById(`${section}-content`);
    const arrow = document.getElementById(`${section}-arrow`);
    
    if (content.classList.contains('show')) {
        content.classList.remove('show');
        arrow.classList.remove('rotated');
    } else {
        content.classList.add('show');
        arrow.classList.add('rotated');
    }
}

function showWelcome() {
    hideAllContent();
    document.getElementById('welcomeScreen').classList.remove('hidden');
}

function hideAllContent() {
    const contentSections = [
        'welcomeScreen',
        'measuresContent',
        'scriptsContent',
        'smsTemplatesContent', // <-- Agregado
        'todoContent',
        'callTrackerContent',
        'measureImagesContent',
        'updatesContent'
    ];
    
    contentSections.forEach(section => {
        document.getElementById(section).classList.add('hidden');
    });
}

async function showInsurer(insurer) {
    hideAllContent();
    const content = document.getElementById('measuresContent');
    content.classList.remove('hidden');
    
    const config = insurerConfig[insurer];
    
    // Show loading state
    content.innerHTML = `
        <div class="mb-6">
            <h2 class="text-3xl font-montserrat font-bold text-gray-800 mb-2">${config.name} QCM Measures</h2>
            <p class="text-gray-600">Quality measures and compliance tracking for ${config.name} patients</p>
        </div>
        
        <div class="loading-placeholder">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Loading measures from JSON data...</p>
        </div>
    `;
    
    try {
        // Load data from JSON file
        const measures = await loadInsurerData(insurer);
        
        if (measures.length === 0) {
            content.innerHTML = `
                <div class="mb-6">
                    <h2 class="text-3xl font-montserrat font-bold text-gray-800 mb-2">${config.name} QCM Measures</h2>
                    <p class="text-gray-600">Quality measures and compliance tracking for ${config.name} patients</p>
                </div>
                
                <div class="no-data-placeholder">
                    <i class="fas fa-file-alt"></i>
                    <p>No measures found for ${config.name}</p>
                    <p class="text-sm text-gray-500 mt-2">Check if the JSON file exists in Common/Docs folder</p>
                </div>
            `;
            return;
        }
        
        content.innerHTML = `
            <div class="mb-6">
                <h2 class="text-3xl font-montserrat font-bold text-gray-800 mb-2">${config.name} QCM Measures</h2>
                <p class="text-gray-600">Quality measures and compliance tracking for ${config.name} patients (${measures.length} measures loaded)</p>
            </div>
            
            <div class="space-y-6">
                ${measures.map((measure, index) => `
                    <div class="measure-card">
                        <button onclick="toggleMeasure(${index})" class="w-full measure-header ${config.bgClass}">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center">
                                    <i class="fas fa-clipboard-check text-gray-600 mr-4 text-xl"></i>
                                    <div>
                                        <h3 class="text-lg font-montserrat font-semibold text-gray-800">${measure.name}</h3>
                                        <p class="text-sm text-gray-600 mt-1">Click to expand details</p>
                                    </div>
                                </div>
                                <i id="measure-arrow-${index}" class="fas fa-chevron-down text-gray-600 transition-transform"></i>
                            </div>
                        </button>
                        <div id="measure-content-${index}" class="measure-content">
                            <div class="measure-details">
                                <div class="space-y-4">
                                    <div class="measure-detail-item">
                                        <h4 class="measure-detail-title">
                                            <i class="fas fa-stethoscope measure-detail-icon"></i>
                                            Medical Description
                                        </h4>
                                        <p class="measure-detail-content">${measure.description}</p>
                                    </div>
                                    <div class="measure-detail-item">
                                        <h4 class="measure-detail-title">
                                            <i class="fas fa-search measure-detail-icon"></i>
                                            Where is it in eCW?
                                        </h4>
                                        <p class="measure-detail-content">${measure.location}</p>
                                    </div>
                                </div>
                                <div class="space-y-4">
                                    <div class="measure-detail-item">
                                        <h4 class="measure-detail-title">
                                            <i class="fas fa-calendar measure-detail-icon"></i>
                                            Compliant Period
                                        </h4>
                                        <p class="measure-detail-content">${measure.compliantPeriod}</p>
                                    </div>
                                    <div class="measure-detail-item">
                                        <h4 class="measure-detail-title">
                                            <i class="fas fa-code measure-detail-icon"></i>
                                            Coding
                                        </h4>
                                        <p class="measure-detail-content">${measure.coding}</p>
                                    </div>
                                    <div class="measure-detail-item">
                                        <h4 class="measure-detail-title">
                                            <i class="fas fa-calendar-plus measure-detail-icon"></i>
                                            Schedule As / Add to Appt
                                        </h4>
                                        <p class="measure-detail-content">${measure.scheduleAs}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
    } catch (error) {
        console.error('Error loading insurer data:', error);
        content.innerHTML = `
            <div class="mb-6">
                <h2 class="text-3xl font-montserrat font-bold text-gray-800 mb-2">${config.name} QCM Measures</h2>
                <p class="text-gray-600">Quality measures and compliance tracking for ${config.name} patients</p>
            </div>
            
            <div class="error-placeholder">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Error loading measures for ${config.name}</p>
                <p class="text-sm text-gray-500 mt-2">${error.message}</p>
            </div>
        `;
    }
}

function showAddMeasureForm(insurer) {
    const config = insurerConfig[insurer];
    
    // Crear modal
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-montserrat font-bold text-gray-800">Agregar Nueva Medida - ${config.name}</h3>
                <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            
            <form id="addMeasureForm" class="space-y-4">
                <div class="form-group">
                    <label class="form-label">Nombre de la Medida *</label>
                    <input type="text" id="measureName" class="form-input" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Descripción Médica *</label>
                    <textarea id="measureDescription" class="form-textarea" rows="3" required></textarea>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Cómo Explicar al Paciente *</label>
                    <textarea id="measureExplanation" class="form-textarea" rows="3" required></textarea>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Ubicación en eCW *</label>
                    <input type="text" id="measureLocation" class="form-input" placeholder="eCW > Quality Measures > Categoría" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Códigos (ICD-10, CPT)</label>
                    <input type="text" id="measureCoding" class="form-input" placeholder="ICD-10: E11.9, CPT: 83036">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Qué Programar</label>
                    <input type="text" id="measureSchedule" class="form-input" placeholder="Programar cita de seguimiento">
                </div>
                
                <div class="flex justify-end space-x-3 pt-4">
                    <button type="button" onclick="this.closest('.fixed').remove()" class="btn btn-secondary">
                        Cancelar
                    </button>
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-plus btn-icon"></i>Agregar Medida
                    </button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Manejar el formulario
    document.getElementById('addMeasureForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nuevaMedida = {
            name: document.getElementById('measureName').value,
            description: document.getElementById('measureDescription').value,
            explanation: document.getElementById('measureExplanation').value,
            location: document.getElementById('measureLocation').value,
            period: "January 1 - December 31",
            coding: document.getElementById('measureCoding').value,
            schedule: document.getElementById('measureSchedule').value
        };
        
        // Agregar la medida
        if (!measuresData[insurer]) {
            measuresData[insurer] = [];
        }
        measuresData[insurer].push(nuevaMedida);
        
        // Guardar en localStorage
        localStorage.setItem('clinicalKBMeasures', JSON.stringify(measuresData));
        
        // Cerrar modal y recargar vista
        modal.remove();
        showInsurer(insurer);
        
        // Mostrar notificación
        if (typeof showNotification === 'function') {
            showNotification(`Medida agregada a ${config.name}`, 'success');
        }
    });
}

function toggleMeasure(index) {
    const content = document.getElementById(`measure-content-${index}`);
    const arrow = document.getElementById(`measure-arrow-${index}`);
    
    if (content.classList.contains('show')) {
        content.classList.remove('show');
        arrow.style.transform = 'rotate(0deg)';
    } else {
        content.classList.add('show');
        arrow.style.transform = 'rotate(180deg)';
    }
}

function eliminarMedida(insurer, index) {
    if (confirm('¿Estás seguro de que quieres eliminar esta medida?')) {
        measuresData[insurer].splice(index, 1);
        localStorage.setItem('clinicalKBMeasures', JSON.stringify(measuresData));
        showInsurer(insurer);
        if (typeof showNotification === 'function') {
            showNotification(`Medida eliminada de ${insurerConfig[insurer].name}`, 'success');
        }
    }
}

async function showScripts() {
    hideAllContent();
    const content = document.getElementById('scriptsContent');
    content.classList.remove('hidden');
    
    // Show loading state
    content.innerHTML = `
        <div class="mb-6">
            <h2 class="text-3xl font-montserrat font-bold text-gray-800 mb-2">Scripts Management</h2>
            <p class="text-gray-600">Call scripts in English and Spanish</p>
        </div>
        
        <div class="loading-placeholder">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Loading scripts from JSON data...</p>
        </div>
    `;
    
    try {
        // Load scripts from JSON file
        const scripts = await getScriptsData();
        
        if (scripts.length === 0) {
            content.innerHTML = `
                <div class="mb-6">
                    <h2 class="text-3xl font-montserrat font-bold text-gray-800 mb-2">Scripts Management</h2>
                    <p class="text-gray-600">Call scripts in English and Spanish</p>
                </div>
                
                <div class="no-data-placeholder">
                    <i class="fas fa-file-alt"></i>
                    <p>No scripts found</p>
                    <p class="text-sm text-gray-500 mt-2">Check if the scripts.json file exists in Common/Docs/Scripts folder</p>
                </div>
            `;
            return;
        }
        
        content.innerHTML = `
            <div class="mb-6">
                <h2 class="text-3xl font-montserrat font-bold text-gray-800 mb-2">Scripts Management</h2>
                <p class="text-gray-600">Call scripts in English and Spanish (${scripts.length} scripts loaded)</p>
            </div>

            <div class="space-y-4" id="scriptsList">
                ${scripts.map(script => `
                    <div class="card">
                        <div class="card-body">
                            <div class="flex items-center justify-between mb-4">
                                <h3 class="text-lg font-montserrat font-semibold text-gray-800">${script.title}</h3>
                            </div>
                            <div class="grid md:grid-cols-2 gap-4">
                                <div>
                                    <h4 class="font-medium text-gray-700 mb-2 flex items-center">
                                        <i class="fas fa-flag-usa text-gray-500 mr-2"></i>English
                                    </h4>
                                    <p class="text-gray-600 bg-gray-50 p-3 rounded-xl">${script.english}</p>
                                </div>
                                <div>
                                    <h4 class="font-medium text-gray-700 mb-2 flex items-center">
                                        <i class="fas fa-flag text-gray-500 mr-2"></i>Spanish
                                    </h4>
                                    <p class="text-gray-600 bg-gray-50 p-3 rounded-xl">${script.spanish}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
    } catch (error) {
        console.error('Error loading scripts data:', error);
        content.innerHTML = `
            <div class="mb-6">
                <h2 class="text-3xl font-montserrat font-bold text-gray-800 mb-2">Scripts Management</h2>
                <p class="text-gray-600">Call scripts in English and Spanish</p>
            </div>
            
            <div class="error-placeholder">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Error loading scripts</p>
                <p class="text-sm text-gray-500 mt-2">${error.message}</p>
            </div>
        `;
    }
}



function showTodo() {
    hideAllContent();
    const content = document.getElementById('todoContent');
    content.classList.remove('hidden');
    
    content.innerHTML = `
        <div class="mb-6">
            <h2 class="text-3xl font-montserrat font-bold text-gray-800 mb-2">Add to "TO DO" - eCW Steps</h2>
            <p class="text-gray-600">Follow these 6 steps to add measures to the patient's To Do list in eCW</p>
        </div>
        
        <div class="space-y-4">
            ${ecwSteps.map(step => `
                <div class="step-card">
                    <div class="step-content">
                        <div class="step-number">
                            <span>${step.step}</span>
                        </div>
                        <div class="flex items-center">
                            <i class="${step.icon} step-icon"></i>
                            <span class="step-text">${step.action}</span>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function showCallTracker() {
    hideAllContent();
    const content = document.getElementById('callTrackerContent');
    content.classList.remove('hidden');
    
    const totalSchedule = callTrackerData.reduce((sum, row) => sum + row.schedule, 0);
    const totalTryAgain = callTrackerData.reduce((sum, row) => sum + row.tryAgain, 0);
    const totalDontCall = callTrackerData.reduce((sum, row) => sum + row.dontCall, 0);
    
    content.innerHTML = `
        <div class="mb-6">
            <h2 class="text-3xl font-montserrat font-bold text-gray-800 mb-2">Call Tracker</h2>
            <p class="text-gray-600">Track call outcomes by insurer</p>
        </div>
        
        <div class="table-container">
            <div class="overflow-x-auto">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Insurer</th>
                            <th class="text-center">
                                <i class="fas fa-calendar-check text-green-500 mr-2"></i>Schedule
                            </th>
                            <th class="text-center">
                                <i class="fas fa-redo text-yellow-500 mr-2"></i>Try Again
                            </th>
                            <th class="text-center">
                                <i class="fas fa-times text-red-500 mr-2"></i>Don't Call
                            </th>
                            <th class="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="callTrackerBody">
                        ${callTrackerData.map((row, index) => `
                            <tr>
                                <td>
                                    <input type="text" value="${row.insurer}" onchange="updateCallTracker(${index}, 'insurer', this.value)" 
                                           class="bg-transparent border-none focus:outline-none font-medium text-gray-800">
                                </td>
                                <td class="text-center">
                                    <input type="number" value="${row.schedule}" onchange="updateCallTracker(${index}, 'schedule', this.value)" 
                                           class="w-16 text-center bg-transparent border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                </td>
                                <td class="text-center">
                                    <input type="number" value="${row.tryAgain}" onchange="updateCallTracker(${index}, 'tryAgain', this.value)" 
                                           class="w-16 text-center bg-transparent border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                </td>
                                <td class="text-center">
                                    <input type="number" value="${row.dontCall}" onchange="updateCallTracker(${index}, 'dontCall', this.value)" 
                                           class="w-16 text-center bg-transparent border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                </td>
                                <td class="text-center">
                                    <button onclick="deleteCallTrackerRow(${index})" class="text-red-500 hover:text-red-700 transition-colors">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td class="font-montserrat font-semibold text-gray-800">TOTAL</td>
                            <td class="text-center text-green-600 font-montserrat font-semibold">${totalSchedule}</td>
                            <td class="text-center text-yellow-600 font-montserrat font-semibold">${totalTryAgain}</td>
                            <td class="text-center text-red-600 font-montserrat font-semibold">${totalDontCall}</td>
                            <td class="text-center">
                                <button onclick="addCallTrackerRow()" class="text-blue-600 hover:text-blue-700 transition-colors">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    `;
}

function updateCallTracker(index, field, value) {
    callTrackerData[index][field] = parseInt(value) || 0;
    showCallTracker(); // Refresh to update totals
}

function addCallTrackerRow() {
    callTrackerData.push({ insurer: 'New Insurer', schedule: 0, tryAgain: 0, dontCall: 0 });
    showCallTracker();
}

function deleteCallTrackerRow(index) {
    if (confirm('Are you sure you want to delete this row?')) {
        callTrackerData.splice(index, 1);
        showCallTracker();
    }
}

function showMeasureImages() {
    hideAllContent();
    const content = document.getElementById('measureImagesContent');
    content.classList.remove('hidden');
    
    content.innerHTML = `
        <div class="mb-6">
            <h2 class="text-3xl font-montserrat font-bold text-gray-800 mb-2">How does the measure looks?</h2>
            <p class="text-gray-600">Measure screenshots from Common/Img folder. Use the scan button to detect new images.</p>
        </div>
        
        <div class="mb-4 flex gap-4">
            <button onclick="autoDetectAllImages()" class="btn btn-secondary">
                <i class="fas fa-search"></i> Auto-Detect All Images
            </button>
            <button onclick="scanForNewImages()" class="btn btn-secondary">
                <i class="fas fa-search"></i> Scan for New Images
            </button>
            <button onclick="forceRefreshImages()" class="btn btn-primary">
                <i class="fas fa-sync-alt"></i> Force Refresh
            </button>
            <button onclick="showDebugInfo()" class="btn btn-warning">
                <i class="fas fa-bug"></i> Debug Info
            </button>
            <button onclick="showJSONManagement()" class="btn btn-info">
                <i class="fas fa-cog"></i> JSON Management
            </button>
        </div>
        
        <div class="mb-6">
            <div class="search-container">
                <div class="search-wrapper">
                    <input type="text" id="measureImageSearch" placeholder="Search measure titles..." class="search-input">
                    <i class="fas fa-search search-icon"></i>
                </div>
            </div>
        </div>
        
        <div id="measureImagesContainer" class="measure-images-container">
            <div class="loading-placeholder">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Checking for measure images...</p>
            </div>
        </div>
    `;
    
    // Add event listener for measure image search
    document.getElementById('measureImageSearch').addEventListener('input', function(e) {
        filterMeasureImages(e.target.value);
    });
    
    // Load and display images from Common/Img folder
    loadMeasureImages();
}

// Function to load measure images from Common/Img folder
async function loadMeasureImages() {
    const container = document.getElementById('measureImagesContainer');
    
    // Show loading state
    container.innerHTML = `
        <div class="loading-placeholder">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Checking for measure images...</p>
        </div>
    `;
    
    try {
        console.log('Starting image detection...');
        
        // Get all images from the folder using the environment-aware function
        const imageFiles = await getImagesForEnvironment();
        
        console.log('Detected images:', imageFiles);
        console.log('Total images found:', imageFiles.length);
        
        // Try to get images with metadata first
        let imagesWithMetadata = [];
        try {
            imagesWithMetadata = await getImagesWithMetadata();
            console.log('Images with metadata:', imagesWithMetadata);
        } catch (error) {
            console.log('Could not load metadata, using basic detection');
        }
        
        // Group images by title (before the underscore)
        const groupedImages = {};
        
        if (imagesWithMetadata.length > 0) {
            // Use metadata from JSON
            imagesWithMetadata.forEach(img => {
                const title = img.title;
                const imageNumber = img.number;
                
                if (!groupedImages[title]) {
                    groupedImages[title] = [];
                }
                
                groupedImages[title].push({
                    filename: img.filename,
                    number: imageNumber,
                    path: `Common/Img/${img.filename}`,
                    category: img.category
                });
                
                console.log(`Grouped ${img.filename} under title: ${title}`);
            });
        } else {
            // Fallback to basic detection
            imageFiles.forEach(filename => {
                console.log(`Processing image: ${filename}`);
                const parts = filename.replace('.png', '').split('_');
                if (parts.length >= 2) {
                    const title = parts[0];
                    const imageNumber = parts[1];
                    
                    if (!groupedImages[title]) {
                        groupedImages[title] = [];
                    }
                    
                    groupedImages[title].push({
                        filename: filename,
                        number: imageNumber,
                        path: `Common/Img/${filename}`
                    });
                    
                    console.log(`Grouped ${filename} under title: ${title}`);
                } else {
                    console.warn(`Image ${filename} doesn't follow the expected naming pattern (Title_Number.png)`);
                }
            });
        }
        
        // Sort images within each group by number
        Object.keys(groupedImages).forEach(title => {
            groupedImages[title].sort((a, b) => {
                const numA = parseInt(a.number);
                const numB = parseInt(b.number);
                return numA - numB;
            });
        });
        
        console.log('Grouped images:', groupedImages);
        
        // Generate HTML for grouped images
        if (Object.keys(groupedImages).length === 0) {
            container.innerHTML = `
                <div class="no-images-placeholder">
                    <i class="fas fa-image"></i>
                    <p>No measure images found in Common/Img folder</p>
                    <p class="text-sm text-gray-500 mt-2">Add images to Common/Img folder with format: "Title_Number.png"</p>
                    <div class="mt-4 space-y-2">
                        <button onclick="forceRefreshImages()" class="btn btn-primary">
                            <i class="fas fa-sync-alt"></i> Force Refresh
                        </button>
                        <button onclick="getCompleteImageList()" class="btn btn-secondary ml-2">
                            <i class="fas fa-list"></i> Debug: Show All Images
                        </button>
                    </div>
                </div>
            `;
            return;
        }
        
        const html = Object.keys(groupedImages).map(title => {
            const images = groupedImages[title];
            
            return `
                <div class="measure-group">
                    <h3 class="measure-group-title">${title}</h3>
                    <div class="measure-images-grid">
                        ${images.map(img => `
                            <div class="measure-image-item">
                                <img src="${img.path}" alt="${title} - Image ${img.number}" 
                                     class="measure-image" onclick="openImageModal('${img.path}', '${title} - Image ${img.number}')">
                                <div class="measure-image-label">Image ${img.number}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }).join('');
        
        container.innerHTML = html;
        
        // Log found images for debugging
        console.log('Successfully loaded images:', imageFiles);
        console.log('Grouped images:', groupedImages);
        console.log('Total groups:', Object.keys(groupedImages).length);
        
        // Add a debug button to the page
        const debugButton = document.createElement('button');
        debugButton.className = 'btn btn-secondary mt-4';
        debugButton.innerHTML = '<i class="fas fa-bug"></i> Debug: Show Image List';
        debugButton.onclick = () => {
            console.log('=== DEBUG INFO ===');
            console.log('All detected images:', imageFiles);
            console.log('Grouped images:', groupedImages);
            alert(`Found ${imageFiles.length} images in ${Object.keys(groupedImages).length} groups. Check console for details.`);
        };
        container.appendChild(debugButton);
        
    } catch (error) {
        console.error('Error loading images:', error);
        container.innerHTML = `
            <div class="no-images-placeholder">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Error loading measure images</p>
                <p class="text-sm text-gray-500 mt-2">${error.message}</p>
                <div class="mt-4 space-y-2">
                    <button onclick="forceRefreshImages()" class="btn btn-primary">
                        <i class="fas fa-sync-alt"></i> Force Refresh
                    </button>
                    <button onclick="getCompleteImageList()" class="btn btn-secondary ml-2">
                        <i class="fas fa-list"></i> Debug: Show All Images
                    </button>
                </div>
            </div>
        `;
    }
}

// Function to add a new possible image and refresh the display
function addNewPossibleImage(filename) {
    addCommonImagePattern(filename);
    loadMeasureImages(); // Refresh the display
    console.log(`Possible image "${filename}" added and display refreshed!`);
}

// Function to manually refresh images (for console use)
async function refreshMeasureImages() {
    try {
        // Clear the search input
        const searchInput = document.getElementById('measureImageSearch');
        if (searchInput) {
            searchInput.value = '';
        }
        
        await loadMeasureImages();
        console.log('Measure images refreshed successfully!');
    } catch (error) {
        console.error('Error refreshing images:', error);
    }
}

// Function to filter measure images by title
function filterMeasureImages(searchTerm) {
    const measureGroups = document.querySelectorAll('.measure-group');
    const searchLower = searchTerm.toLowerCase();
    
    measureGroups.forEach(group => {
        const title = group.querySelector('.measure-group-title').textContent.toLowerCase();
        
        if (title.includes(searchLower)) {
            group.style.display = 'block';
        } else {
            group.style.display = 'none';
        }
    });
    
    // Show/hide no results message
    const visibleGroups = document.querySelectorAll('.measure-group[style="display: block;"]');
    const noResultsMsg = document.getElementById('noResultsMessage');
    
    if (visibleGroups.length === 0 && searchTerm !== '') {
        if (!noResultsMsg) {
            const container = document.getElementById('measureImagesContainer');
            const msg = document.createElement('div');
            msg.id = 'noResultsMessage';
            msg.className = 'no-results-message';
            msg.innerHTML = `
                <i class="fas fa-search"></i>
                <p>No measure titles found matching "${searchTerm}"</p>
            `;
            container.appendChild(msg);
        }
    } else if (noResultsMsg) {
        noResultsMsg.remove();
    }
}

function openImageModal(imagePath, title) {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'image-modal-overlay';
    modal.innerHTML = `
        <div class="image-modal">
            <div class="image-modal-header">
                <h3 class="image-modal-title">${title}</h3>
                <button onclick="this.closest('.image-modal-overlay').remove()" class="image-modal-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="image-modal-content">
                <img src="${imagePath}" alt="${title}" class="image-modal-img">
            </div>
        </div>
    `;
    
    // Add click outside to close
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Add escape key to close
    document.addEventListener('keydown', function closeOnEscape(e) {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', closeOnEscape);
        }
    });
    
    document.body.appendChild(modal);
}

// Function to show updates/reminders
async function showUpdates() {
    hideAllContent();
    const content = document.getElementById('updatesContent');
    content.classList.remove('hidden');
    
    // Show loading state
    content.innerHTML = `
        <div class="mb-6">
            <h2 class="text-3xl font-montserrat font-bold text-gray-800 mb-2">Updates & Reminders</h2>
            <p class="text-gray-600">Important updates and reminders for the team</p>
        </div>
        
        <div class="loading-placeholder">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Loading updates from JSON data...</p>
        </div>
    `;
    
    try {
        // Load updates from JSON file
        const updates = await getUpdatesData();
        
        if (updates.length === 0) {
            content.innerHTML = `
                <div class="mb-6">
                    <h2 class="text-3xl font-montserrat font-bold text-gray-800 mb-2">Updates & Reminders</h2>
                    <p class="text-gray-600">Important updates and reminders for the team</p>
                </div>
                
                <div class="no-data-placeholder">
                    <i class="fas fa-bell"></i>
                    <p>No updates found</p>
                    <p class="text-sm text-gray-500 mt-2">Check if the Updates.json file exists in Common/Docs/Updates folder</p>
                </div>
            `;
            return;
        }
        
        // Sort updates by date (most recent first)
        const sortedUpdates = updates.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        content.innerHTML = `
            <div class="mb-6">
                <h2 class="text-3xl font-montserrat font-bold text-gray-800 mb-2">Updates & Reminders</h2>
                <p class="text-gray-600">Important updates and reminders for the team (${updates.length} updates loaded)</p>
            </div>

            <div class="space-y-4" id="updatesList">
                ${sortedUpdates.map(update => {
                    const priorityClass = update.priority === 'high' ? 'border-red-500 bg-red-50' : 
                                        update.priority === 'medium' ? 'border-yellow-500 bg-yellow-50' : 
                                        'border-blue-500 bg-blue-50';
                    
                    const priorityIcon = update.priority === 'high' ? 'fas fa-exclamation-triangle text-red-600' : 
                                       update.priority === 'medium' ? 'fas fa-exclamation-circle text-yellow-600' : 
                                       'fas fa-info-circle text-blue-600';
                    
                    const formattedDate = new Date(update.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                    
                    return `
                        <div class="card border-l-4 ${priorityClass}">
                            <div class="card-body">
                                <div class="flex items-start justify-between mb-3">
                                    <div class="flex items-center">
                                        <i class="${priorityIcon} mr-3 text-xl"></i>
                                        <div>
                                            <h3 class="text-lg font-montserrat font-semibold text-gray-800">${update.title}</h3>
                                            <p class="text-sm text-gray-600">${formattedDate}</p>
                                        </div>
                                    </div>
                                    <span class="px-2 py-1 text-xs font-medium rounded-full ${
                                        update.priority === 'high' ? 'bg-red-100 text-red-800' : 
                                        update.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                                        'bg-blue-100 text-blue-800'
                                    }">${update.priority.toUpperCase()}</span>
                                </div>
                                
                                <div class="mb-3">
                                    <p class="text-gray-700">${update.description}</p>
                                </div>
                                
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center text-sm text-gray-600">
                                        <i class="fas fa-tag mr-2"></i>
                                        <span class="capitalize">${update.category}</span>
                                    </div>
                                    <div class="flex items-center text-sm font-medium text-gray-800">
                                        <i class="fas fa-bell mr-2"></i>
                                        <span>${update.reminder}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
        
    } catch (error) {
        console.error('Error loading updates data:', error);
        content.innerHTML = `
            <div class="mb-6">
                <h2 class="text-3xl font-montserrat font-bold text-gray-800 mb-2">Updates & Reminders</h2>
                <p class="text-gray-600">Important updates and reminders for the team</p>
            </div>
            
            <div class="error-placeholder">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Error loading updates</p>
                <p class="text-sm text-gray-500 mt-2">${error.message}</p>
            </div>
        `;
    }
}

// Función para mostrar los SMS Templates
async function showSMSTemplates() {
    hideAllContent();
    const content = document.getElementById('smsTemplatesContent');
    content.classList.remove('hidden');
    content.innerHTML = `
        <div class="mb-6">
            <h2 class="text-3xl font-montserrat font-bold text-gray-800 mb-2">SMS Templates</h2>
            <p class="text-gray-600">Mensajes de texto automáticos para Quality Care Measures (QCM)</p>
        </div>
        <div class="loading-placeholder">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Cargando SMS templates...</p>
        </div>
    `;
    try {
        const response = await fetch('Common/Docs/SMS template/sms_template_qcm.json');
        if (!response.ok) throw new Error('No se pudo cargar el archivo de SMS templates');
        const templates = await response.json();
        if (!Array.isArray(templates) || templates.length === 0) {
            content.innerHTML += `<div class='no-data-placeholder'><i class='fas fa-sms'></i><p>No hay SMS templates disponibles.</p></div>`;
            return;
        }
        // Renderizar los templates
        const html = templates.map(t => `
            <div class="card mb-4">
                <div class="card-body">
                    <h3 class="text-xl font-semibold text-blue-800 mb-2">${t.name}</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h4 class="font-bold text-gray-700 mb-1">Español</h4>
                            <ul class="list-disc ml-6">
                                <li><span class="font-semibold">Riverhead:</span> ${t.es.Riverhead}</li>
                                <li><span class="font-semibold">Hempstead:</span> ${t.es.Hempstead}</li>
                            </ul>
                        </div>
                        <div>
                            <h4 class="font-bold text-gray-700 mb-1">English</h4>
                            <ul class="list-disc ml-6">
                                <li><span class="font-semibold">Riverhead:</span> ${t.en.Riverhead}</li>
                                <li><span class="font-semibold">Hempstead:</span> ${t.en.Hempstead}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
        content.innerHTML = `
            <div class="mb-6">
                <h2 class="text-3xl font-montserrat font-bold text-gray-800 mb-2">SMS Templates</h2>
                <p class="text-gray-600">Mensajes de texto automáticos para Quality Care Measures (QCM)</p>
            </div>
            <div class="space-y-4">${html}</div>
        `;
    } catch (error) {
        content.innerHTML = `<div class='no-data-placeholder'><i class='fas fa-exclamation-triangle'></i><p>Error cargando SMS templates: ${error.message}</p></div>`;
    }
}

// Función para mostrar los SMS Templates de una clínica específica
async function showSMSTemplatesClinic(clinic) {
    hideAllContent();
    const content = document.getElementById('smsTemplatesContent');
    content.classList.remove('hidden');
    content.innerHTML = `
        <div class="mb-6">
            <h2 class="text-3xl font-montserrat font-bold text-gray-800 mb-2">SMS Templates - ${clinic}</h2>
            <p class="text-gray-600">Mensajes de texto automáticos para Quality Care Measures (QCM) - <span class="font-semibold">${clinic}</span></p>
        </div>
        <div class="loading-placeholder">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Cargando SMS templates...</p>
        </div>
    `;
    try {
        const file = `Common/Docs/SMS template/${clinic}.json`;
        const response = await fetch(file);
        if (!response.ok) throw new Error('No se pudo cargar el archivo de SMS templates para ' + clinic);
        const templates = await response.json();
        if (!Array.isArray(templates) || templates.length === 0) {
            content.innerHTML += `<div class='no-data-placeholder'><i class='fas fa-sms'></i><p>No hay SMS templates disponibles para ${clinic}.</p></div>`;
            return;
        }
        // Renderizar los templates
        const html = templates.map(t => `
            <div class="card mb-4">
                <div class="card-body">
                    <h3 class="text-xl font-semibold text-blue-800 mb-2">${t.name}</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h4 class="font-bold text-gray-700 mb-1">Español</h4>
                            <div class="bg-gray-100 rounded p-2 text-gray-800 text-sm">${t.es}</div>
                        </div>
                        <div>
                            <h4 class="font-bold text-gray-700 mb-1">English</h4>
                            <div class="bg-gray-100 rounded p-2 text-gray-800 text-sm">${t.en}</div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
        content.innerHTML = `
            <div class="mb-6">
                <h2 class="text-3xl font-montserrat font-bold text-gray-800 mb-2">SMS Templates - ${clinic}</h2>
                <p class="text-gray-600">Mensajes de texto automáticos para Quality Care Measures (QCM) - <span class="font-semibold">${clinic}</span></p>
            </div>
            <div class="space-y-4">${html}</div>
        `;
    } catch (error) {
        content.innerHTML = `<div class='no-data-placeholder'><i class='fas fa-exclamation-triangle'></i><p>Error cargando SMS templates: ${error.message}</p></div>`;
    }
}

// Search functionality
function initializeSearch() {
    document.getElementById('searchInput').addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        
        if (searchTerm === '') {
            return;
        }
        
        // Search through all measures
        let foundMeasures = [];
        Object.keys(measuresData).forEach(insurer => {
            measuresData[insurer].forEach(measure => {
                if (measure.name.toLowerCase().includes(searchTerm) || 
                    measure.description.toLowerCase().includes(searchTerm)) {
                    foundMeasures.push({ ...measure, insurer });
                }
            });
        });
        
        if (foundMeasures.length > 0) {
            hideAllContent();
            const content = document.getElementById('measuresContent');
            content.classList.remove('hidden');
            
            content.innerHTML = `
                <div class="mb-6">
                    <h2 class="text-3xl font-montserrat font-bold text-gray-800 mb-2">Search Results</h2>
                    <p class="text-gray-600">Found ${foundMeasures.length} measure(s) matching "${searchTerm}"</p>
                </div>
                <div class="space-y-6">
                    ${foundMeasures.map((measure, index) => {
                        const config = insurerConfig[measure.insurer];
                        
                        return `
                            <div class="measure-card">
                                <div class="measure-header ${config.bgClass}">
                                    <div class="flex items-center justify-between">
                                        <div class="flex items-center">
                                            <i class="fas fa-clipboard-check text-gray-600 mr-4 text-xl"></i>
                                            <div>
                                                <h3 class="text-lg font-montserrat font-semibold text-gray-800">${measure.name}</h3>
                                                <p class="text-sm text-gray-600 mt-1">${config.name}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="measure-content show">
                                    <p class="text-gray-700 mb-4">${measure.description}</p>
                                    <div class="flex items-center text-sm text-gray-600">
                                        <i class="fas fa-map-marker-alt mr-2"></i>
                                        <span>${measure.location}</span>
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
        }
    });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    showWelcome();
    initializeSearch();
});