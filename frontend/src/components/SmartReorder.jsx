import { useState, useEffect } from 'react';
import API from '../Utitility/api';
import { toast } from 'react-toastify';

export default function SmartReorder({ medicineId, medicineName }) {
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // ============================================================
    // Fetch prediction when medicineId changes
    // ============================================================
    useEffect(() => {
        if (!medicineId) return;

        const fetchPrediction = async () => {
            setLoading(true);
            setError(null);
            
            try {
                const response = await API.get(`/ai/predict/${medicineId}`);
                
                if (response.data.success) {
                    setPrediction(response.data.data);
                } else {
                    setError('Failed to get AI prediction');
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Error fetching prediction');
                toast.error('AI prediction failed');
            } finally {
                setLoading(false);
            }
        };

        fetchPrediction();
    }, [medicineId]);

    // ============================================================
    // Loading State
    // ============================================================
    if (loading) {
        return (
            <div className="card border-0 shadow-sm mb-3">
                <div className="card-body text-center py-4">
                    <div className="spinner-border text-primary me-2" />
                    <span>🧠 AI is analyzing inventory data...</span>
                </div>
            </div>
        );
    }

    // ============================================================
    // Error State
    // ============================================================
    if (error) {
        return (
            <div className="card border-0 shadow-sm mb-3">
                <div className="card-body text-center py-3 text-danger">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                    <button 
                        className="btn btn-sm btn-outline-primary ms-3"
                        onClick={() => window.location.reload()}
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // ============================================================
    // No Data State
    // ============================================================
    if (!prediction) {
        return (
            <div className="card border-0 shadow-sm mb-3">
                <div className="card-body text-center py-4 text-muted">
                    <i className="bi bi-robot fs-2 d-block mb-2"></i>
                    <p>📊 Not enough sales data for AI prediction.</p>
                    <small>Add at least 3 sales records to train the model.</small>
                </div>
            </div>
        );
    }

    // ============================================================
    // Main Display
    // ============================================================
    return (
        <div className="card border-0 shadow-sm mb-3">
            <div className="card-header bg-primary bg-opacity-10 border-0 d-flex justify-content-between align-items-center">
                <h6 className="mb-0 fw-bold">
                    <i className="bi bi-robot me-2 text-primary"></i>
                    AI Smart Reorder — {prediction.medicineName || medicineName}
                </h6>
                <span className={`badge ${prediction.confidence > 70 ? 'bg-success' : 'bg-warning'}`}>
                    {prediction.confidence}% Confidence
                </span>
            </div>
            <div className="card-body">
                {/* Stats Grid */}
                <div className="row g-2 mb-3">
                    <div className="col-6 col-md-3">
                        <div className="p-2 bg-light rounded">
                            <small className="text-muted d-block">📦 Current Stock</small>
                            <strong className="fs-5">{prediction.currentStock}</strong>
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <div className="p-2 bg-light rounded">
                            <small className="text-muted d-block">📈 Daily Sales</small>
                            <strong className="fs-5">{prediction.avgDailySales}/day</strong>
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <div className="p-2 bg-light rounded">
                            <small className="text-muted d-block">⏳ Days Left</small>
                            <strong className={`fs-5 ${prediction.daysToStockout < 7 ? 'text-danger' : ''}`}>
                                {prediction.daysToStockout} days
                            </strong>
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <div className="p-2 bg-light rounded">
                            <small className="text-muted d-block">🎯 Reorder Point</small>
                            <strong className="fs-5">{prediction.reorderPoint}</strong>
                        </div>
                    </div>
                </div>

                {/* Alert Section */}
                {prediction.reorderNeeded ? (
                    <div className="alert alert-danger d-flex align-items-start mb-0">
                        <i className="bi bi-exclamation-triangle-fill fs-4 me-2"></i>
                        <div>
                            <strong>⚠️ URGENT: Reorder Required!</strong>
                            <p className="mb-1">{prediction.suggestion}</p>
                            <div className="mt-2">
                                <button className="btn btn-danger btn-sm me-2">
                                    <i className="bi bi-file-text me-1"></i> Purchase Order
                                </button>
                                <button className="btn btn-outline-danger btn-sm">
                                    <i className="bi bi-envelope me-1"></i> Email Supplier
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="alert alert-success d-flex align-items-start mb-0">
                        <i className="bi bi-check-circle-fill fs-4 me-2"></i>
                        <div>
                            <strong>✅ Stock is Healthy</strong>
                            <p className="mb-0">{prediction.suggestion}</p>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="mt-2 pt-2 border-top">
                    <small className="text-muted">
                        🤖 Recommended order: <strong>{prediction.recommendedOrder} units</strong> (1 month supply)
                    </small>
                </div>
            </div>
        </div>
    );
}