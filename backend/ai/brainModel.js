// const tf = require('@tensorflow/tfjs-node');
const tf = require('@tensorflow/tfjs');
const Medicine = require('../Model/Medicine');
const Sale = require('../Model/Sale');

// ============================================================
// 1. TRAIN NEURAL NETWORK
// ============================================================
async function trainModel() {
    try {
        const medicines = await Medicine.find({}).limit(30);
        
        if (medicines.length < 3) {
            console.log('⚠️ Not enough data. Using default model.');
            return getDefaultModel();
        }

        const inputs = [];
        const outputs = [];

        for (const med of medicines) {
            const sales = await Sale.find({ 
                'items.medicine': med._id 
            }).sort({ createdAt: -1 }).limit(30);

            let avgDailySales = 5;
            if (sales.length > 0) {
                let totalQuantity = 0;
                for (const sale of sales) {
                    for (const item of sale.items) {
                        if (item.medicine.toString() === med._id.toString()) {
                            totalQuantity += item.quantity;
                        }
                    }
                }
                avgDailySales = totalQuantity / 30;
                if (avgDailySales < 1) avgDailySales = 1;
            }

            const stock = med.quantity || 0;
            const leadTime = 3;
            const daysToStockout = avgDailySales > 0 ? stock / avgDailySales : 999;
            const reorderNeeded = daysToStockout < (leadTime + 2) ? 1 : 0;

            // Normalize inputs (0-1)
            const normalizedStock = Math.min(stock / 1000, 1);
            const normalizedAvgSales = Math.min(avgDailySales / 100, 1);
            const normalizedLeadTime = leadTime / 10;

            inputs.push([normalizedStock, normalizedAvgSales, normalizedLeadTime]);
            outputs.push([reorderNeeded]);
        }

        // ====== Build Neural Network ======
        const model = tf.sequential();
        
        model.add(tf.layers.dense({
            units: 8,
            activation: 'relu',
            inputShape: [3]
        }));
        
        model.add(tf.layers.dense({
            units: 4,
            activation: 'relu'
        }));
        
        model.add(tf.layers.dense({
            units: 1,
            activation: 'sigmoid'
        }));

        model.compile({
            optimizer: 'adam',
            loss: 'binaryCrossentropy',
            metrics: ['accuracy']
        });

        const xs = tf.tensor2d(inputs);
        const ys = tf.tensor2d(outputs);

        console.log('🧠 Training TensorFlow.js Neural Network...');
        
        await model.fit(xs, ys, {
            epochs: 100,
            batchSize: 8,
            callbacks: {
                onEpochEnd: (epoch, logs) => {
                    if (epoch % 20 === 0) {
                        console.log(`Epoch ${epoch}: loss = ${logs.loss.toFixed(4)}, accuracy = ${logs.acc.toFixed(4)}`);
                    }
                }
            }
        });

        console.log('✅ Model trained successfully!');
        
        // Cleanup
        xs.dispose();
        ys.dispose();
        
        return model;

    } catch (error) {
        console.error('❌ Training failed:', error.message);
        return getDefaultModel();
    }
}

// ============================================================
// 2. DEFAULT MODEL
// ============================================================
function getDefaultModel() {
    console.log('📊 Using default model');
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 4, activation: 'relu', inputShape: [3] }));
    model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));
    model.compile({ optimizer: 'adam', loss: 'binaryCrossentropy' });
    return model;
}

// ============================================================
// 3. PREDICT - Single Medicine
// ============================================================
async function predictReorder(medicineId) {
    try {
        const medicine = await Medicine.findById(medicineId);
        if (!medicine) throw new Error('Medicine not found');

        const model = await trainModel();

        const sales = await Sale.find({ 
            'items.medicine': medicineId 
        }).sort({ createdAt: -1 }).limit(30);

        let avgDailySales = 5;
        if (sales.length > 0) {
            let totalQuantity = 0;
            for (const sale of sales) {
                for (const item of sale.items) {
                    if (item.medicine.toString() === medicineId.toString()) {
                        totalQuantity += item.quantity;
                    }
                }
            }
            avgDailySales = totalQuantity / 30;
            if (avgDailySales < 1) avgDailySales = 1;
        }

        const stock = medicine.quantity || 0;
        const leadTime = 3;

        const normalizedStock = Math.min(stock / 1000, 1);
        const normalizedAvgSales = Math.min(avgDailySales / 100, 1);
        const normalizedLeadTime = leadTime / 10;

        // ====== AI PREDICTION ======
        const inputTensor = tf.tensor2d([[normalizedStock, normalizedAvgSales, normalizedLeadTime]]);
        const prediction = model.predict(inputTensor);
        const result = await prediction.data();
        
        inputTensor.dispose();
        prediction.dispose();

        const daysToStockout = avgDailySales > 0 ? Math.floor(stock / avgDailySales) : 999;
        const recommendedOrder = Math.ceil(avgDailySales * 30);
        const reorderPoint = Math.ceil((avgDailySales * leadTime) + (avgDailySales * 2));

        const reorderNeeded = result[0] > 0.5;
        const confidence = Math.round(result[0] * 100);

        return {
            medicineId: medicine._id,
            medicineName: medicine.name,
            currentStock: stock,
            avgDailySales: Math.round(avgDailySales),
            daysToStockout: daysToStockout,
            reorderNeeded: reorderNeeded,
            confidence: confidence,
            recommendedOrder: recommendedOrder,
            reorderPoint: reorderPoint,
            suggestion: reorderNeeded 
                ? `⚠️ ORDER NOW! Stock will finish in ${daysToStockout} days. Order ${recommendedOrder} units.` 
                : `✅ Stock is sufficient for ${daysToStockout} days.`,
            salesDataPoints: sales.length,
            aiModel: 'TensorFlow.js Neural Network'
        };

    } catch (error) {
        console.error('❌ Prediction error:', error.message);
        return null;
    }
}

// ============================================================
// 4. BULK PREDICTION
// ============================================================
async function predictAllReorder() {
    try {
        const medicines = await Medicine.find({});
        const results = [];

        for (const med of medicines) {
            const prediction = await predictReorder(med._id);
            if (prediction) {
                results.push(prediction);
            }
        }

        results.sort((a, b) => {
            if (a.reorderNeeded && !b.reorderNeeded) return -1;
            if (!a.reorderNeeded && b.reorderNeeded) return 1;
            return a.daysToStockout - b.daysToStockout;
        });

        return results;

    } catch (error) {
        console.error('❌ Bulk prediction error:', error.message);
        return [];
    }
}

module.exports = {
    trainModel,
    predictReorder,
    predictAllReorder
};