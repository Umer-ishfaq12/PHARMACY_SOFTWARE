import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ============================================================
// 1. Single medicine prediction
// ============================================================
export const getMedicinePrediction = async (medicineId) => {
    try {
        const response = await axios.get(`${API_URL}/ai/predict/${medicineId}`);
        return response.data;
    } catch (error) {
        console.error('Prediction error:', error);
        return { success: false, message: error.message };
    }
};

// ============================================================
// 2. All medicines predictions
// ============================================================
export const getAllPredictions = async () => {
    try {
        const response = await axios.get(`${API_URL}/ai/predict-all`);
        return response.data;
    } catch (error) {
        console.error('Get all predictions error:', error);
        return { success: false, message: error.message };
    }
};

// ============================================================
// 3. Only urgent reorders
// ============================================================
export const getUrgentReorders = async () => {
    try {
        const response = await axios.get(`${API_URL}/ai/urgent`);
        return response.data;
    } catch (error) {
        console.error('Get urgent reorders error:', error);
        return { success: false, message: error.message };
    }
};