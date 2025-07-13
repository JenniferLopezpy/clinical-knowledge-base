// Script to update the image-list.json file
// This script helps maintain the image list for GitHub Pages

// Function to update the image list JSON file
async function updateImageListJSON() {
    console.log('Updating image list JSON...');
    
    try {
        // Get all images from the folder
        const imageFiles = await getAllImagesFromFolder();
        
        // Create metadata for each image
        const imagesWithMetadata = imageFiles.map(filename => {
            const parts = filename.replace('.png', '').split('_');
            const title = parts[0];
            const number = parts[1] || '01';
            
            // Determine category based on title
            let category = title;
            if (title.includes('Breast Cancer')) {
                category = 'Breast Cancer Screening';
            } else if (title.includes('Colorectal Cancer')) {
                category = 'Colorectal Cancer Screening';
            } else if (title.includes('Chlamydia')) {
                category = 'Chlamydia Screening';
            } else if (title.includes('Depression')) {
                category = 'Depression Screening';
            } else if (title.includes('Blood Pressure')) {
                category = 'Blood Pressure';
            } else if (title.includes('Kidney')) {
                category = 'Kidney Health';
            } else if (title.includes('Functional Assessment')) {
                category = 'Functional Assessment';
            } else if (title.includes('Nutritional')) {
                category = 'Nutritional Counseling';
            } else if (title.includes('Social')) {
                category = 'Social Screening';
            } else if (title.includes('Eye Exam')) {
                category = 'Eye Exam';
            } else if (title.includes('Glycemic')) {
                category = 'Glycemic Assessment';
            }
            
            return {
                filename: filename,
                title: title,
                number: number,
                category: category
            };
        });
        
        // Create the JSON object
        const imageListData = {
            images: imagesWithMetadata,
            lastUpdated: new Date().toISOString().split('T')[0],
            totalImages: imageFiles.length
        };
        
        console.log('Updated image list data:', imageListData);
        
        // In a real environment, you would save this to the file
        // For now, we'll just log it and provide a way to copy it
        const jsonString = JSON.stringify(imageListData, null, 2);
        console.log('JSON to save to Common/Img/image-list.json:');
        console.log(jsonString);
        
        // Create a download link for the updated JSON
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'image-list.json';
        a.textContent = 'Download Updated Image List JSON';
        a.className = 'btn btn-primary mt-2';
        a.onclick = () => {
            setTimeout(() => URL.revokeObjectURL(url), 100);
        };
        
        // Add to the page
        const container = document.getElementById('measureImagesContainer');
        if (container) {
            const existingLink = container.querySelector('a[download="image-list.json"]');
            if (existingLink) {
                existingLink.remove();
            }
            container.appendChild(a);
        }
        
        return imageListData;
        
    } catch (error) {
        console.error('Error updating image list JSON:', error);
        return null;
    }
}

// Function to manually add a new image to the JSON list
async function addImageToJSON(filename, title, category) {
    console.log(`Adding image to JSON: ${filename}`);
    
    try {
        // Get current JSON data
        let currentData = { images: [], lastUpdated: '', totalImages: 0 };
        
        try {
            const response = await fetch('Common/Img/image-list.json');
            if (response.ok) {
                currentData = await response.json();
            }
        } catch (error) {
            console.log('Could not load existing JSON, creating new one');
        }
        
        // Add new image
        const newImage = {
            filename: filename,
            title: title || filename.replace('.png', '').split('_')[0],
            number: filename.replace('.png', '').split('_')[1] || '01',
            category: category || 'Other'
        };
        
        // Check if image already exists
        const existingIndex = currentData.images.findIndex(img => img.filename === filename);
        if (existingIndex >= 0) {
            currentData.images[existingIndex] = newImage;
            console.log(`Updated existing image: ${filename}`);
        } else {
            currentData.images.push(newImage);
            console.log(`Added new image: ${filename}`);
        }
        
        // Update metadata
        currentData.lastUpdated = new Date().toISOString().split('T')[0];
        currentData.totalImages = currentData.images.length;
        
        // Create download link
        const jsonString = JSON.stringify(currentData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'image-list.json';
        a.textContent = `Download Updated JSON (${currentData.totalImages} images)`;
        a.className = 'btn btn-success mt-2';
        a.onclick = () => {
            setTimeout(() => URL.revokeObjectURL(url), 100);
        };
        
        // Add to the page
        const container = document.getElementById('measureImagesContainer');
        if (container) {
            const existingLink = container.querySelector('a[download="image-list.json"]');
            if (existingLink) {
                existingLink.remove();
            }
            container.appendChild(a);
        }
        
        console.log('Updated JSON data:', currentData);
        return currentData;
        
    } catch (error) {
        console.error('Error adding image to JSON:', error);
        return null;
    }
}

// Function to show JSON management interface
function showJSONManagement() {
    const container = document.getElementById('measureImagesContainer');
    if (!container) return;
    
    const managementHTML = `
        <div class="json-management" style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 10px 0;">
            <h4>Image List JSON Management</h4>
            <p>Manage the image list for GitHub Pages deployment</p>
            <div class="management-buttons">
                <button onclick="updateImageListJSON()" class="btn btn-primary">
                    <i class="fas fa-sync"></i> Update JSON from Current Images
                </button>
                <button onclick="showAddImageForm()" class="btn btn-secondary">
                    <i class="fas fa-plus"></i> Add Single Image to JSON
                </button>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('afterbegin', managementHTML);
}

// Function to show form for adding single image
function showAddImageForm() {
    const container = document.getElementById('measureImagesContainer');
    if (!container) return;
    
    const formHTML = `
        <div class="add-image-form" style="background: #e9ecef; padding: 15px; border-radius: 5px; margin: 10px 0;">
            <h5>Add Image to JSON</h5>
            <div class="form-group">
                <label>Filename:</label>
                <input type="text" id="newImageFilename" placeholder="e.g., New Measure_01.png" class="form-control">
            </div>
            <div class="form-group">
                <label>Title:</label>
                <input type="text" id="newImageTitle" placeholder="e.g., New Measure" class="form-control">
            </div>
            <div class="form-group">
                <label>Category:</label>
                <input type="text" id="newImageCategory" placeholder="e.g., New Category" class="form-control">
            </div>
            <button onclick="addImageFromForm()" class="btn btn-success">
                <i class="fas fa-plus"></i> Add to JSON
            </button>
        </div>
    `;
    
    container.insertAdjacentHTML('afterbegin', formHTML);
}

// Function to add image from form
async function addImageFromForm() {
    const filename = document.getElementById('newImageFilename').value;
    const title = document.getElementById('newImageTitle').value;
    const category = document.getElementById('newImageCategory').value;
    
    if (!filename) {
        alert('Please enter a filename');
        return;
    }
    
    await addImageToJSON(filename, title, category);
    
    // Remove the form
    const form = document.querySelector('.add-image-form');
    if (form) {
        form.remove();
    }
}

// Export functions for console use
window.updateImageListJSON = updateImageListJSON;
window.addImageToJSON = addImageToJSON;
window.showJSONManagement = showJSONManagement;
window.showAddImageForm = showAddImageForm;
window.addImageFromForm = addImageFromForm; 