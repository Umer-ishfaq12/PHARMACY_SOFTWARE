const express = require('express');
const router = express.Router();
const { predictReorder, predictAllReorder } = require('../ai/brainModel');

// ============================================================
// ROUTE 1: Single medicine prediction
// ============================================================
// URL: GET /api/ai/predict/:medicineId
router.get('/predict/:id', async (req, res) => {
    try {
        const prediction = await predictReorder(req.params.id);

        if (!prediction) {
            return res.status(404).json({
                success: false,
                message: 'Prediction failed or medicine not found'
            });
        }

        res.json({
            success: true,
            data: prediction
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// ============================================================
// ROUTE 2: All medicines predictions
// ============================================================
// URL: GET /api/ai/predict-all
router.get('/predict-all', async (req, res) => {
    try {
        const predictions = await predictAllReorder();

        res.json({
            success: true,
            count: predictions.length,
            data: predictions
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// ============================================================
// ROUTE 3: Only urgent reorders
// ============================================================
// URL: GET /api/ai/urgent
router.get('/urgent', async (req, res) => {
    try {
        const predictions = await predictAllReorder();
        const urgent = predictions.filter(p => p.reorderNeeded === true);

        res.json({
            success: true,
            count: urgent.length,
            data: urgent
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;