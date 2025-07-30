// Sample data for QCM measures
window.measuresData = {
    healthfirst: [
        {
            name: "Diabetes HbA1c Control",
            description: "Percentage of patients 18-75 years of age with diabetes who had HbA1c > 9.0% during the measurement period",
            explanation: "This measure tracks how well we're managing your diabetes. We want your HbA1c to be below 9% for better health outcomes.",
            location: "eCW > Quality Measures > Diabetes Management",
            period: "January 1 - December 31",
            coding: "ICD-10: E11.9, CPT: 83036",
            schedule: "Schedule follow-up in 3 months"
        },
        {
            name: "Colorectal Cancer Screening",
            description: "Percentage of patients 50-75 years of age who had appropriate screening for colorectal cancer",
            explanation: "Regular screening helps catch colon cancer early when it's most treatable. We recommend screening every 10 years.",
            location: "eCW > Quality Measures > Cancer Screening",
            period: "January 1 - December 31",
            coding: "ICD-10: Z12.11, CPT: 45378",
            schedule: "Schedule colonoscopy appointment"
        },
        {
            name: "Hypertension Control",
            description: "Percentage of patients 18-85 years of age with hypertension whose blood pressure was adequately controlled",
            explanation: "Keeping your blood pressure under control reduces your risk of heart disease and stroke.",
            location: "eCW > Quality Measures > Hypertension",
            period: "January 1 - December 31",
            coding: "ICD-10: I10, CPT: 99213",
            schedule: "Schedule BP check in 1 month"
        }
    ],
    fidelis: [
        {
            name: "Hypertension Control",
            description: "Percentage of patients 18-85 years of age with hypertension whose blood pressure was adequately controlled",
            explanation: "Keeping your blood pressure under control reduces your risk of heart disease and stroke.",
            location: "eCW > Quality Measures > Hypertension",
            period: "January 1 - December 31",
            coding: "ICD-10: I10, CPT: 99213",
            schedule: "Schedule BP check in 1 month"
        },
        {
            name: "Breast Cancer Screening",
            description: "Percentage of women 50-74 years of age who had a mammogram to screen for breast cancer",
            explanation: "Mammograms help detect breast cancer early. We recommend screening every 2 years for women 50-74.",
            location: "eCW > Quality Measures > Cancer Screening",
            period: "January 1 - December 31",
            coding: "ICD-10: Z12.31, CPT: 77067",
            schedule: "Schedule mammogram appointment"
        },
        {
            name: "Depression Screening",
            description: "Percentage of patients 12 years and older screened for depression using a standardized tool",
            explanation: "Depression screening helps us identify and treat mental health concerns early.",
            location: "eCW > Quality Measures > Mental Health",
            period: "January 1 - December 31",
            coding: "ICD-10: Z13.89, CPT: 96127",
            schedule: "Schedule mental health evaluation"
        }
    ],
    uhc: [
        {
            name: "Depression Screening",
            description: "Percentage of patients 12 years and older screened for depression using a standardized tool",
            explanation: "Depression screening helps us identify and treat mental health concerns early.",
            location: "eCW > Quality Measures > Mental Health",
            period: "January 1 - December 31",
            coding: "ICD-10: Z13.89, CPT: 96127",
            schedule: "Schedule mental health evaluation"
        },
        {
            name: "Childhood Immunization",
            description: "Percentage of children 2 years of age who had four diphtheria, tetanus and acellular pertussis (DTaP)",
            explanation: "Vaccines protect your child from serious diseases. We need to ensure they're up to date.",
            location: "eCW > Quality Measures > Immunizations",
            period: "January 1 - December 31",
            coding: "ICD-10: Z23, CPT: 90700",
            schedule: "Schedule immunization appointment"
        },
        {
            name: "Asthma Control",
            description: "Percentage of patients 5-64 years of age with asthma who had an asthma control assessment",
            explanation: "Regular asthma control assessments help us adjust your treatment plan for better breathing.",
            location: "eCW > Quality Measures > Asthma Management",
            period: "January 1 - December 31",
            coding: "ICD-10: J45.909, CPT: 94060",
            schedule: "Schedule asthma control assessment"
        }
    ],
    molina: [
        {
            name: "Asthma Control",
            description: "Percentage of patients 5-64 years of age with asthma who had an asthma control assessment",
            explanation: "Regular asthma control assessments help us adjust your treatment plan for better breathing.",
            location: "eCW > Quality Measures > Asthma Management",
            period: "January 1 - December 31",
            coding: "ICD-10: J45.909, CPT: 94060",
            schedule: "Schedule asthma control assessment"
        },
        {
            name: "Tobacco Cessation",
            description: "Percentage of patients 18 years and older who are current tobacco users and received cessation intervention",
            explanation: "Quitting smoking improves your health significantly. We can help you with cessation programs.",
            location: "eCW > Quality Measures > Tobacco Cessation",
            period: "January 1 - December 31",
            coding: "ICD-10: F17.200, CPT: 99406",
            schedule: "Schedule smoking cessation counseling"
        },
        {
            name: "Diabetes HbA1c Control",
            description: "Percentage of patients 18-75 years of age with diabetes who had HbA1c > 9.0% during the measurement period",
            explanation: "This measure tracks how well we're managing your diabetes. We want your HbA1c to be below 9% for better health outcomes.",
            location: "eCW > Quality Measures > Diabetes Management",
            period: "January 1 - December 31",
            coding: "ICD-10: E11.9, CPT: 83036",
            schedule: "Schedule follow-up in 3 months"
        }
    ]
};

// Scripts data is now loaded from Common/Docs/Scripts/scripts.json
let scriptsData = []; // Initialize as empty array, will be loaded from JSON



// Insurer configuration
window.insurerConfig = {
    healthfirst: {
        name: 'Healthfirst',
        color: 'var(--healthfirst)',
        bgClass: 'healthfirst'
    },
    fidelis: {
        name: 'FidelisCare',
        color: 'var(--fidelis)',
        bgClass: 'fidelis'
    },
    uhc: {
        name: 'UnitedHealthcare',
        color: 'var(--uhc)',
        bgClass: 'uhc'
    },
    molina: {
        name: 'Molina',
        color: 'var(--molina)',
        bgClass: 'molina'
    }
};

// eCW Steps data
const ecwSteps = [
    { step: 1, action: "Go to Progress Note", icon: "fas fa-file-medical" },
    { step: 2, action: "Click \"To Do List\"", icon: "fas fa-tasks" },
    { step: 3, action: "Add measure name", icon: "fas fa-plus" },
    { step: 4, action: "Set due date as same day", icon: "fas fa-calendar-day" },
    { step: 5, action: "Set Priority = High", icon: "fas fa-exclamation-triangle" },
    { step: 6, action: "Add comment to Reason", icon: "fas fa-comment" }
];

// ===== FUNCIÓN FÁCIL PARA AGREGAR MEDIDAS =====
// Usa esta función desde la consola del navegador (F12)

function agregarMedida(insurer, nombre, descripcion, explicacion, ubicacion, codigos, programar) {
    const nuevaMedida = {
        name: nombre,
        description: descripcion,
        explanation: explicacion,
        location: ubicacion,
        period: "January 1 - December 31",
        coding: codigos,
        schedule: programar
    };
    
    if (!measuresData[insurer]) {
        measuresData[insurer] = [];
    }
    
    measuresData[insurer].push(nuevaMedida);
    
    // Guardar en localStorage
    localStorage.setItem('clinicalKBMeasures', JSON.stringify(measuresData));
    
    console.log(`✅ Medida agregada a ${insurerConfig[insurer].name}: ${nombre}`);
    
    // Recargar la vista si está abierta
    if (typeof showInsurer === 'function') {
        showInsurer(insurer);
    }
    
    return nuevaMedida;
}

// Ejemplo de uso:
// agregarMedida('healthfirst', 'Colesterol LDL', 'Control de colesterol LDL en pacientes diabéticos', 'El colesterol alto puede causar problemas cardíacos', 'eCW > Quality Measures > Diabetes', 'ICD-10: E78.5, CPT: 80061', 'Programar laboratorio de lípidos');

// Función para ver todas las medidas de un seguro
function verMedidas(insurer) {
    console.log(`📊 Medidas de ${insurerConfig[insurer].name}:`);
    measuresData[insurer].forEach((medida, index) => {
        console.log(`${index + 1}. ${medida.name}`);
    });
}

// Función para eliminar una medida
function eliminarMedida(insurer, index) {
    if (measuresData[insurer] && measuresData[insurer][index]) {
        const medidaEliminada = measuresData[insurer].splice(index, 1)[0];
        localStorage.setItem('clinicalKBMeasures', JSON.stringify(measuresData));
        console.log(`❌ Medida eliminada: ${medidaEliminada.name}`);
        
        if (typeof showInsurer === 'function') {
            showInsurer(insurer);
        }
    } else {
        console.log('❌ Medida no encontrada');
    }
} 