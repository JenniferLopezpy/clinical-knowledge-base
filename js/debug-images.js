// Debug script for image detection
// This script helps test and verify image detection

// Function to test image detection
async function testImageDetection() {
    console.log('=== TESTING IMAGE DETECTION ===');
    
    // Test 1: Get all images using the main function
    console.log('Test 1: Getting all images...');
    const allImages = await getExistingImages();
    console.log('All images found:', allImages);
    console.log('Total count:', allImages.length);
    
    // Test 2: Auto-detect additional images
    console.log('\nTest 2: Auto-detecting additional images...');
    const autoDetected = await autoDetectAllImages();
    console.log('Auto-detected images:', autoDetected);
    
    // Test 3: Get complete list again
    console.log('\nTest 3: Getting complete list after auto-detection...');
    const finalList = await getExistingImages();
    console.log('Final image list:', finalList);
    console.log('Final count:', finalList.length);
    
    // Test 4: Check specific images
    console.log('\nTest 4: Checking specific images...');
    const specificImages = [
        'Breast Cancer Screeening REFERRAL_01.png',
        'Breast Cancer Screening RESULT_01.png',
        'Chlamydia Screening_01.png',
        'Depression Screening_01.png'
    ];
    
    for (const image of specificImages) {
        const exists = await checkImageExists(`Common/Img/${image}`);
        console.log(`${image}: ${exists ? 'EXISTS' : 'NOT FOUND'}`);
    }
    
    return {
        allImages,
        autoDetected,
        finalList,
        totalCount: finalList.length
    };
}

// Function to manually test a specific image
async function testSpecificImage(filename) {
    console.log(`Testing specific image: ${filename}`);
    
    const imagePath = `Common/Img/${filename}`;
    const exists = await checkImageExists(imagePath);
    
    console.log(`Image ${filename}: ${exists ? 'EXISTS' : 'NOT FOUND'}`);
    
    if (exists) {
        // Try to add it to the patterns
        addCommonImagePattern(filename);
        console.log(`Added ${filename} to common patterns`);
        
        // Refresh the display
        if (typeof loadMeasureImages === 'function') {
            await loadMeasureImages();
        }
    }
    
    return exists;
}

// Function to list all common patterns
function listCommonPatterns() {
    console.log('Current common patterns:', COMMON_IMAGE_PATTERNS);
    return COMMON_IMAGE_PATTERNS;
}

// Function to clear browser cache and reload
function clearCacheAndReload() {
    console.log('Clearing cache and reloading...');
    
    // Clear any cached images
    if ('caches' in window) {
        caches.keys().then(names => {
            names.forEach(name => {
                caches.delete(name);
            });
        });
    }
    
    // Force reload the page
    window.location.reload(true);
}

// Function to show debug info in the UI
function showDebugInfo() {
    const debugInfo = `
        <div class="debug-info" style="background: #f0f0f0; padding: 15px; border-radius: 5px; margin: 10px 0;">
            <h4>Debug Information</h4>
            <p><strong>Common Patterns:</strong> ${COMMON_IMAGE_PATTERNS.length}</p>
            <p><strong>Current Images:</strong> <span id="currentImageCount">Loading...</span></p>
            <div class="debug-buttons">
                <button onclick="testImageDetection()" class="btn btn-sm btn-secondary">Test Detection</button>
                <button onclick="listCommonPatterns()" class="btn btn-sm btn-secondary">List Patterns</button>
                <button onclick="clearCacheAndReload()" class="btn btn-sm btn-warning">Clear Cache</button>
            </div>
        </div>
    `;
    
    // Add to the page
    const container = document.getElementById('measureImagesContainer');
    if (container) {
        container.insertAdjacentHTML('afterbegin', debugInfo);
        
        // Update image count
        getExistingImages().then(images => {
            document.getElementById('currentImageCount').textContent = images.length;
        });
    }
}

// Export functions for console use
window.testImageDetection = testImageDetection;
window.testSpecificImage = testSpecificImage;
window.listCommonPatterns = listCommonPatterns;
window.clearCacheAndReload = clearCacheAndReload;
window.showDebugInfo = showDebugInfo; 