// Image list for Common/Img folder
// This list contains common image patterns for reference
const COMMON_IMAGE_PATTERNS = [
    'Breast Cancer Screeening REFERRAL_01.png',
    'Breast Cancer Screening RESULT_01.png',
    'Chlamydia Screening_01.png',
    'Colorectal Cancer Screening REFERRAL_01.png',
    'Colorectal Cancer Screening RESULT_01.png',
    'Controlling High Blood Pressure (BP Measures)_01.png',
    'Kidney Health Evaluation (KED measures)_01.png',
    'Functional Assessment (COA measure)_01.png',
    'Nutritional Counseling_01.png',
    'Social Screening_01.png',
    'Eye Exam for Patients with Diabeted (EED Measures)_01.png',
    'Glycemic Status Assessment (A1C Measures)_01.png',
    'Depression Screening_01.png'
];

// Function to check if an image exists
function checkImageExists(imagePath) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = imagePath;
    });
}

// Function to get all images from the Common/Img folder using a more robust approach
async function getAllImagesFromFolder() {
    const allImages = [];
    
    // First check the common patterns
    for (const filename of COMMON_IMAGE_PATTERNS) {
        const imagePath = `Common/Img/${filename}`;
        const exists = await checkImageExists(imagePath);
        if (exists) {
            allImages.push(filename);
        }
    }
    
    // Now try to detect additional images by checking common variations
    const additionalImages = await detectAdditionalImages();
    for (const filename of additionalImages) {
        if (!allImages.includes(filename)) {
            allImages.push(filename);
        }
    }
    
    return allImages;
}

// Function to detect additional images that might not be in the common patterns
async function detectAdditionalImages() {
    const additionalImages = [];
    
    // Common base titles for medical measures
    const baseTitles = [
        'Breast Cancer Screening',
        'Breast Cancer Screeening', // Note the typo in existing file
        'Colorectal Cancer Screening',
        'Chlamydia Screening',
        'Depression Screening',
        'Controlling High Blood Pressure',
        'Kidney Health Evaluation',
        'Functional Assessment',
        'Nutritional Counseling',
        'Social Screening',
        'Eye Exam for Patients with Diabeted',
        'Glycemic Status Assessment'
    ];
    
    // Common suffixes and variations
    const suffixes = [
        'REFERRAL',
        'RESULT',
        'SCREENING',
        'ASSESSMENT',
        'MEASURES',
        'BP Measures',
        'KED measures',
        'COA measure',
        'EED Measures',
        'A1C Measures'
    ];
    
    // Check combinations
    for (const title of baseTitles) {
        for (const suffix of suffixes) {
            for (let i = 1; i <= 10; i++) {
                const number = i.toString().padStart(2, '0');
                const filename = `${title} ${suffix}_${number}.png`;
                
                if (!COMMON_IMAGE_PATTERNS.includes(filename)) {
                    const imagePath = `Common/Img/${filename}`;
                    const exists = await checkImageExists(imagePath);
                    if (exists) {
                        additionalImages.push(filename);
                        console.log(`Detected additional image: ${filename}`);
                    }
                }
            }
        }
    }
    
    return additionalImages;
}

// Function to get only existing images (backward compatibility)
async function getExistingImages() {
    return await getAllImagesFromFolder();
}

// Function to add a new image pattern to the common patterns
function addCommonImagePattern(filename) {
    if (!COMMON_IMAGE_PATTERNS.includes(filename)) {
        COMMON_IMAGE_PATTERNS.push(filename);
        console.log(`Added new common image pattern: ${filename}`);
    }
}

// Function to get all common image patterns (for manual management)
function getCommonImagePatterns() {
    return COMMON_IMAGE_PATTERNS;
}

// Function to manually add a new image and refresh the display
async function addNewImage(filename) {
    addCommonImagePattern(filename);
    
    // Check if the image actually exists
    const imagePath = `Common/Img/${filename}`;
    const exists = await checkImageExists(imagePath);
    
    if (exists) {
        console.log(`Image "${filename}" added and exists in folder!`);
        // Refresh the display if the function exists
        if (typeof loadMeasureImages === 'function') {
            await loadMeasureImages();
        }
    } else {
        console.warn(`Image "${filename}" added to patterns but doesn't exist in folder yet.`);
    }
}

// Function to force refresh all images (useful for debugging)
async function forceRefreshImages() {
    console.log('Force refreshing all images...');
    const images = await getAllImagesFromFolder();
    console.log('Found images:', images);
    
    if (typeof loadMeasureImages === 'function') {
        await loadMeasureImages();
    }
    
    return images;
}

// Function to scan for new images automatically
async function scanForNewImages() {
    console.log('Scanning for new images in Common/Img folder...');
    
    // Try to detect new images by checking common variations
    const possibleNewImages = [];
    
    // Get current images
    const currentImages = await getAllImagesFromFolder();
    
    // Try variations of existing patterns
    const baseTitles = [
        'Breast Cancer Screening',
        'Colorectal Cancer Screening',
        'Chlamydia Screening',
        'Depression Screening',
        'Controlling High Blood Pressure',
        'Kidney Health Evaluation',
        'Functional Assessment',
        'Nutritional Counseling',
        'Social Screening',
        'Eye Exam for Patients with Diabeted',
        'Glycemic Status Assessment'
    ];
    
    const variations = ['REFERRAL', 'RESULT', 'SCREENING', 'ASSESSMENT'];
    const numbers = ['01', '02', '03', '04', '05'];
    
    for (const title of baseTitles) {
        for (const variation of variations) {
            for (const number of numbers) {
                const filename = `${title} ${variation}_${number}.png`;
                if (!currentImages.includes(filename) && !COMMON_IMAGE_PATTERNS.includes(filename)) {
                    const imagePath = `Common/Img/${filename}`;
                    const exists = await checkImageExists(imagePath);
                    if (exists) {
                        possibleNewImages.push(filename);
                        addCommonImagePattern(filename);
                    }
                }
            }
        }
    }
    
    if (possibleNewImages.length > 0) {
        console.log('Found new images:', possibleNewImages);
        if (typeof loadMeasureImages === 'function') {
            await loadMeasureImages();
        }
    } else {
        console.log('No new images found');
    }
    
    return possibleNewImages;
}

// Function to manually add a specific image filename
async function addSpecificImage(filename) {
    if (!filename.endsWith('.png')) {
        filename = filename + '.png';
    }
    
    const imagePath = `Common/Img/${filename}`;
    const exists = await checkImageExists(imagePath);
    
    if (exists) {
        addCommonImagePattern(filename);
        console.log(`Image "${filename}" successfully added!`);
        
        if (typeof loadMeasureImages === 'function') {
            await loadMeasureImages();
        }
        
        return true;
    } else {
        console.error(`Image "${filename}" not found in Common/Img folder`);
        return false;
    }
}

// Function to get a complete list of all images currently in the folder
async function getCompleteImageList() {
    console.log('Getting complete image list...');
    const allImages = await getAllImagesFromFolder();
    console.log('Complete image list:', allImages);
    return allImages;
}

// Function to automatically detect ALL PNG files in the Common/Img folder
async function autoDetectAllImages() {
    console.log('Auto-detecting all PNG files in Common/Img folder...');
    
    const detectedImages = [];
    
    // Get the current list of known images
    const knownImages = await getAllImagesFromFolder();
    
    // Try to detect additional images by checking common file patterns
    const commonPatterns = [
        // Common medical measure patterns
        'Breast Cancer Screening',
        'Breast Cancer Screeening', // Note the typo
        'Colorectal Cancer Screening',
        'Chlamydia Screening',
        'Depression Screening',
        'Controlling High Blood Pressure',
        'Kidney Health Evaluation',
        'Functional Assessment',
        'Nutritional Counseling',
        'Social Screening',
        'Eye Exam for Patients with Diabeted',
        'Glycemic Status Assessment',
        // Add more patterns as needed
    ];
    
    const suffixes = [
        'REFERRAL',
        'RESULT',
        'SCREENING',
        'ASSESSMENT',
        'MEASURES',
        'BP Measures',
        'KED measures',
        'COA measure',
        'EED Measures',
        'A1C Measures',
        '' // Empty suffix for simple names
    ];
    
    // Check all possible combinations
    for (const pattern of commonPatterns) {
        for (const suffix of suffixes) {
            for (let i = 1; i <= 20; i++) { // Check up to 20 images per pattern
                const number = i.toString().padStart(2, '0');
                const filename = suffix ? `${pattern} ${suffix}_${number}.png` : `${pattern}_${number}.png`;
                
                if (!knownImages.includes(filename) && !detectedImages.includes(filename)) {
                    const imagePath = `Common/Img/${filename}`;
                    const exists = await checkImageExists(imagePath);
                    if (exists) {
                        detectedImages.push(filename);
                        addCommonImagePattern(filename);
                        console.log(`Auto-detected new image: ${filename}`);
                    }
                }
            }
        }
    }
    
    // Also try some generic patterns
    const genericPatterns = [
        'Measure',
        'Screening',
        'Assessment',
        'Evaluation',
        'Test',
        'Check',
        'Exam'
    ];
    
    for (const pattern of genericPatterns) {
        for (let i = 1; i <= 10; i++) {
            const number = i.toString().padStart(2, '0');
            const filename = `${pattern}_${number}.png`;
            
            if (!knownImages.includes(filename) && !detectedImages.includes(filename)) {
                const imagePath = `Common/Img/${filename}`;
                const exists = await checkImageExists(imagePath);
                if (exists) {
                    detectedImages.push(filename);
                    addCommonImagePattern(filename);
                    console.log(`Auto-detected generic image: ${filename}`);
                }
            }
        }
    }
    
    if (detectedImages.length > 0) {
        console.log(`Auto-detected ${detectedImages.length} new images:`, detectedImages);
        
        // Refresh the display
        if (typeof loadMeasureImages === 'function') {
            await loadMeasureImages();
        }
    } else {
        console.log('No new images auto-detected');
    }
    
    return detectedImages;
}

// Function to manually add an image by filename (case-insensitive)
async function addImageByFilename(filename) {
    // Normalize filename
    if (!filename.endsWith('.png')) {
        filename = filename + '.png';
    }
    
    // Try different case variations
    const variations = [
        filename,
        filename.toLowerCase(),
        filename.toUpperCase(),
        filename.charAt(0).toUpperCase() + filename.slice(1).toLowerCase()
    ];
    
    for (const variation of variations) {
        const imagePath = `Common/Img/${variation}`;
        const exists = await checkImageExists(imagePath);
        
        if (exists) {
            addCommonImagePattern(variation);
            console.log(`Successfully added image: ${variation}`);
            
            if (typeof loadMeasureImages === 'function') {
                await loadMeasureImages();
            }
            
            return variation;
        }
    }
    
    console.error(`Image "${filename}" not found in Common/Img folder (tried variations: ${variations.join(', ')})`);
    return null;
}

// Function to create a static image list for GitHub Pages
function createStaticImageList() {
    // This function creates a static list of all images that should be available
    // This is useful for GitHub Pages where we can't dynamically scan the folder
    const staticImageList = [
        'Breast Cancer Screeening REFERRAL_01.png',
        'Breast Cancer Screening RESULT_01.png',
        'Chlamydia Screening_01.png',
        'Colorectal Cancer Screening REFERRAL_01.png',
        'Colorectal Cancer Screening RESULT_01.png',
        'Controlling High Blood Pressure (BP Measures)_01.png',
        'Kidney Health Evaluation (KED measures)_01.png',
        'Functional Assessment (COA measure)_01.png',
        'Nutritional Counseling_01.png',
        'Social Screening_01.png',
        'Eye Exam for Patients with Diabeted (EED Measures)_01.png',
        'Glycemic Status Assessment (A1C Measures)_01.png',
        'Depression Screening_01.png'
    ];
    
    return staticImageList;
}

// Function to get images using static list (for GitHub Pages)
async function getImagesFromStaticList() {
    try {
        // Try to load from JSON file first
        const response = await fetch('Common/Img/image-list.json');
        if (response.ok) {
            const data = await response.json();
            console.log('Loaded image list from JSON:', data);
            return data.images.map(img => img.filename);
        }
    } catch (error) {
        console.log('Could not load image-list.json, falling back to static list');
    }
    
    // Fallback to static list
    const staticList = createStaticImageList();
    const existingImages = [];
    
    for (const filename of staticList) {
        const imagePath = `Common/Img/${filename}`;
        const exists = await checkImageExists(imagePath);
        if (exists) {
            existingImages.push(filename);
        }
    }
    
    return existingImages;
}

// Function to get images with metadata from JSON
async function getImagesWithMetadata() {
    try {
        const response = await fetch('Common/Img/image-list.json');
        if (response.ok) {
            const data = await response.json();
            return data.images;
        }
    } catch (error) {
        console.log('Could not load image-list.json with metadata');
    }
    
    // Fallback: create metadata from static list
    const staticList = createStaticImageList();
    return staticList.map(filename => {
        const parts = filename.replace('.png', '').split('_');
        const title = parts[0];
        const number = parts[1] || '01';
        
        return {
            filename: filename,
            title: title,
            number: number,
            category: title
        };
    });
}

// Function to detect if we're running on GitHub Pages
function isGitHubPages() {
    return window.location.hostname === 'jenniferlopezpy.github.io' || 
           window.location.hostname.includes('github.io');
}

// Main function to get images (works for both local and GitHub Pages)
async function getImagesForEnvironment() {
    if (isGitHubPages()) {
        console.log('Detected GitHub Pages environment, using static image list');
        return await getImagesFromStaticList();
    } else {
        console.log('Detected local environment, using dynamic detection');
        return await getAllImagesFromFolder();
    }
}
