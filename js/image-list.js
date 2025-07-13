// Image list for Common/Img folder
// This list should contain ALL possible images that might exist in the folder
const POSSIBLE_IMAGES = [
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

// Function to get only existing images
async function getExistingImages() {
    const existingImages = [];
    
    for (const filename of POSSIBLE_IMAGES) {
        const imagePath = `Common/Img/${filename}`;
        const exists = await checkImageExists(imagePath);
        if (exists) {
            existingImages.push(filename);
        }
    }
    
    return existingImages;
}

// Function to add a new image to the possible list
function addPossibleImage(filename) {
    if (!POSSIBLE_IMAGES.includes(filename)) {
        POSSIBLE_IMAGES.push(filename);
        console.log(`Added new possible image: ${filename}`);
    }
}

// Function to get all possible images (for manual management)
function getPossibleImages() {
    return POSSIBLE_IMAGES;
} 
