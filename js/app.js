// Main Application JavaScript

// Utility functions
window.toggleSection = function(section) {
    console.log('toggleSection called with:', section);
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

window.showWelcome = function() {
    hideAllContent();
    document.getElementById('welcomeScreen').classList.remove('hidden');
}

window.hideAllContent = function() {
    const contentSections = [
        'welcomeScreen',
        'measuresContent',
        'scriptsContent',
        'smsTemplatesContent',
        'todoContent',
        'measureImagesContent',
        'updatesContent',
        'callFlowContent'
    ];
    
    contentSections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
            element.classList.add('hidden');
        }
    });
    // Restablecer scroll al inicio
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
}

window.showInsurer = async function(insurer) {
    console.log('showInsurer called with:', insurer);
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
                                    ${measure.keyWords && measure.keyWords.trim() !== '' ? `
                                    <div class="measure-detail-item">
                                        <h4 class="measure-detail-title">
                                            <i class="fas fa-key measure-detail-icon"></i>
                                            Key Words
                                        </h4>
                                        <p class="measure-detail-content">${measure.keyWords}</p>
                                    </div>
                                    ` : ''}
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

window.toggleMeasure = function(index) {
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

window.showScripts = async function() {
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



window.showTodo = function() {
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



window.showMeasureImages = function() {
    hideAllContent();
    const content = document.getElementById('measureImagesContent');
    content.classList.remove('hidden');
    
    content.innerHTML = `
        <div class="mb-6">
            <h2 class="text-3xl font-montserrat font-bold text-gray-800 mb-2">How does the measure looks?</h2>
            <p class="text-gray-600">Measure screenshots from Common/Img folder. Use Force Refresh to reload images.</p>
        </div>
        
        <div class="mb-4 flex gap-4">
            <button onclick="forceRefreshImages()" class="btn btn-primary">
                <i class="fas fa-sync-alt"></i> Force Refresh
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

// Function to normalize text (remove accents, lowercase)
function normalizeText(text) {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '');
}

// Mejorar la función de búsqueda para que sea más flexible
function filterMeasureImages(searchTerm) {
    const measureGroups = document.querySelectorAll('.measure-group');
    const searchNorm = normalizeText(searchTerm);
    let anyVisible = false;

    measureGroups.forEach(group => {
        const title = group.querySelector('.measure-group-title').textContent;
        const titleNorm = normalizeText(title);
        // Buscar también en los nombres de las imágenes
        const imageLabels = Array.from(group.querySelectorAll('.measure-image-label'));
        const imageLabelsNorm = imageLabels.map(lbl => normalizeText(lbl.textContent));
        // Coincidencia si el título o alguna imagen coincide
        const match =
            titleNorm.includes(searchNorm) ||
            imageLabelsNorm.some(lbl => lbl.includes(searchNorm));
        if (match || searchNorm === '') {
            group.style.display = 'block';
            anyVisible = true;
        } else {
            group.style.display = 'none';
        }
    });

    // Show/hide no results message
    const noResultsMsg = document.getElementById('noResultsMessage');
    if (!anyVisible && searchTerm !== '') {
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
window.showUpdates = async function() {
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
window.showSMSTemplates = async function() {
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
window.showSMSTemplatesClinic = async function(clinic) {
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
                    <h3 class="text-xl font-semibold text-blue-800 mb-2">${t.title}</h3>
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
        const searchTerm = e.target.value;
        
        if (searchTerm === '') {
            return;
        }
        
        // Use the improved search from components.js
        debouncedSearch(searchTerm);
    });
}

// Call Flow Check List functionality
window.showCallFlowCheckList = async function() {
    hideAllContent();
    const content = document.getElementById('callFlowContent');
    content.classList.remove('hidden');
    
    // Show loading state
    content.innerHTML = `
        <div class="mb-6">
            <h2 class="text-3xl font-montserrat font-bold text-gray-800 mb-2">Call Flow Check List</h2>
            <p class="text-gray-600">Complete checklist for call center procedures and protocols</p>
        </div>
        
        <div class="loading-placeholder">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Loading call flow checklist...</p>
        </div>
    `;
    
    try {
        // Load data from JSON file
        const response = await fetch('Common/Docs/Call Flow/call-flow-checklist.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        if (!data.call_flow) {
            throw new Error('Invalid JSON structure: call_flow not found');
        }
        
        const callFlow = data.call_flow;
        
        // Create the HTML content
        content.innerHTML = `
            <div class="mb-6">
                <h2 class="text-3xl font-montserrat font-bold text-gray-800 mb-2">Call Flow Check List</h2>
                <p class="text-gray-600">Complete checklist for call center procedures and protocols</p>
            </div>
            
            <div class="call-flow-grid">
                ${Object.entries(callFlow).map(([sectionKey, steps]) => {
                    const sectionTitle = sectionKey
                        .split('_')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ');
                    
                    return `
                        <div class="call-flow-section">
                            <h3>
                                <i class="fas fa-list-check"></i>
                                ${sectionTitle}
                            </h3>
                            <ol class="call-flow-list">
                                ${steps.map((step, index) => `
                                    <li>
                                        <span class="call-flow-number">
                                            ${index + 1}
                                        </span>
                                        <span class="call-flow-text">${step}</span>
                                    </li>
                                `).join('')}
                            </ol>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
        
    } catch (error) {
        console.error('Error loading call flow checklist:', error);
        content.innerHTML = `
            <div class="mb-6">
                <h2 class="text-3xl font-montserrat font-bold text-gray-800 mb-2">Call Flow Check List</h2>
                <p class="text-gray-600">Complete checklist for call center procedures and protocols</p>
            </div>
            
            <div class="error-placeholder">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Error loading call flow checklist</p>
                <p class="text-sm text-gray-500 mt-2">${error.message}</p>
            </div>
        `;
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Ensure all functions are available globally
    if (typeof window.showCallFlowCheckList === 'undefined') {
        console.warn('showCallFlowCheckList not found, redefining...');
        window.showCallFlowCheckList = async function() {
            hideAllContent();
            const content = document.getElementById('callFlowContent');
            content.classList.remove('hidden');
            
            // Show loading state
            content.innerHTML = `
                <div class="mb-6">
                    <h2 class="text-3xl font-montserrat font-bold text-gray-800 mb-2">Call Flow Check List</h2>
                    <p class="text-gray-600">Complete checklist for call center procedures and protocols</p>
                </div>
                
                <div class="loading-placeholder">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>Loading call flow checklist...</p>
                </div>
            `;
            
            try {
                // Load data from JSON file
                const response = await fetch('Common/Docs/Call Flow/call-flow-checklist.json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                
                if (!data.call_flow) {
                    throw new Error('Invalid JSON structure: call_flow not found');
                }
                
                const callFlow = data.call_flow;
                
                // Create the HTML content
                content.innerHTML = `
                    <div class="mb-6">
                        <h2 class="text-3xl font-montserrat font-bold text-gray-800 mb-2">Call Flow Check List</h2>
                        <p class="text-gray-600">Complete checklist for call center procedures and protocols</p>
                    </div>
                    
                    <div class="call-flow-grid">
                        ${Object.entries(callFlow).map(([sectionKey, steps]) => {
                            const sectionTitle = sectionKey
                                .split('_')
                                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                .join(' ');
                            
                            return `
                                <div class="call-flow-section">
                                    <h3>
                                        <i class="fas fa-list-check"></i>
                                        ${sectionTitle}
                                    </h3>
                                    <ol class="call-flow-list">
                                        ${steps.map((step, index) => `
                                            <li>
                                                <span class="call-flow-number">
                                                    ${index + 1}
                                                </span>
                                                <span class="call-flow-text">${step}</span>
                                            </li>
                                        `).join('')}
                                    </ol>
                                </div>
                            `;
                        }).join('')}
                    </div>
                `;
                
            } catch (error) {
                console.error('Error loading call flow checklist:', error);
                content.innerHTML = `
                    <div class="mb-6">
                        <h2 class="text-3xl font-montserrat font-bold text-gray-800 mb-2">Call Flow Check List</h2>
                        <p class="text-gray-600">Complete checklist for call center procedures and protocols</p>
                    </div>
                    
                    <div class="error-placeholder">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>Error loading call flow checklist</p>
                        <p class="text-sm text-gray-500 mt-2">${error.message}</p>
                    </div>
                `;
            }
        };
    }
    
    console.log('DOM loaded, initializing application...');
    showWelcome();
    initializeSearch();
    console.log('Application initialized successfully');
});