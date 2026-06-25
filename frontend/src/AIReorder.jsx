// import { useState, useEffect } from 'react';
// import { toast } from 'react-toastify';
// import API from './Utitility/api';
// import Navbar from './navbar';
// import SmartReorder from './components/SmartReorder';

// export default function AIReorder() {
//     const [medicines, setMedicines] = useState([]);
//     const [selectedMedicine, setSelectedMedicine] = useState('');
//     const [urgentCount, setUrgentCount] = useState(0);
//     const [loading, setLoading] = useState(true);
//     const [allPredictions, setAllPredictions] = useState([]);

//     // ============================================================
//     // Fetch medicines and urgent count
//     // ============================================================
//     // useEffect(() => {
//     //     const fetchData = async () => {
//     //         try {
//     //             // Fetch all medicines
//     //             const medResponse = await API.get('/medicines');
//     //             setMedicines(medResponse.data.data || []);

//     //             // Fetch urgent reorders count
//     //             const urgentResponse = await API.get('/ai/urgent');
//     //             if (urgentResponse.data.success) {
//     //                 setUrgentCount(urgentResponse.data.count);
//     //                 setAllPredictions(urgentResponse.data.data || []);
//     //             }
//     //         } catch (error) {
//     //             console.error('Error fetching data:', error);
//     //             toast.error('Failed to load AI data');
//     //         } finally {
//     //             setLoading(false);
//     //         }
//     //     };

//     //     fetchData();
//     // }, []);

    

//     // ============================================================
//     // Loading State
//     // ============================================================
//     if (loading) {
//         return (
//             <>
//                 <Navbar />
//                 <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
//                     <div className="spinner-border text-primary" />
//                 </div>
//             </>
//         );
//     }

//     // ============================================================
//     // Main Render
//     // ============================================================
//     return (
//         <>
//             <Navbar />
//             <div className="container-fluid py-4 px-4">
//                 <h4 className="fw-bold mb-4">
//                     <i className="bi bi-robot me-2 text-primary"></i>
//                     AI Smart Reorder
//                 </h4>

//                 {/* Urgent Alert */}
//                 {urgentCount > 0 && (
//                     <div className="alert alert-danger d-flex align-items-center mb-3">
//                         <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
//                         <span>
//                             <strong>{urgentCount} medicine(s)</strong> need urgent reorder!
//                             <button 
//                                 className="btn btn-sm btn-danger ms-3"
//                                 onClick={() => document.getElementById('urgentList')?.scrollIntoView()}
//                             >
//                                 View Now
//                             </button>
//                         </span>
//                     </div>
//                 )}

//                 {/* Medicine Selector */}
//                 <div className="card border-0 shadow-sm mb-4">
//                     <div className="card-body">
//                         <div className="row g-3">
//                             <div className="col-md-8">
//                                 <label className="form-label fw-bold">
//                                     <i className="bi bi-search me-1"></i>
//                                     Select Medicine for AI Prediction
//                                 </label>
//                                 <select
//                                     className="form-select"
//                                     value={selectedMedicine}
//                                     onChange={(e) => setSelectedMedicine(e.target.value)}
//                                 >
//                                     <option value="">-- Select a medicine --</option>
//                                     {medicines.map(med => (
//                                         <option key={med._id} value={med._id}>
//                                             {med.name} (Stock: {med.quantity})
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>
//                             <div className="col-md-4 d-flex align-items-end">
//                                 <button
//                                     className="btn btn-outline-primary w-100"
//                                     onClick={() => setSelectedMedicine('')}
//                                 >
//                                     <i className="bi bi-arrow-counterclockwise me-1"></i>
//                                     Reset
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* AI Prediction Component */}
//                 {selectedMedicine && (
//                     <SmartReorder 
//                         medicineId={selectedMedicine}
//                         medicineName={medicines.find(m => m._id === selectedMedicine)?.name}
//                     />
//                 )}

//                 {/* Urgent Reorders List */}
//                 {allPredictions.length > 0 && (
//                     <div id="urgentList">
//                         <h5 className="fw-bold mb-3 mt-4">
//                             <i className="bi bi-exclamation-triangle text-danger me-2"></i>
//                             Urgent Reorders ({allPredictions.filter(p => p.reorderNeeded).length})
//                         </h5>
//                         <div className="row g-3">
//                             {allPredictions.filter(p => p.reorderNeeded).map(p => (
//                                 <div key={p.medicineId} className="col-md-6 col-xl-4">
//                                     <div className="card border-danger shadow-sm h-100">
//                                         <div className="card-header bg-danger bg-opacity-10 border-danger">
//                                             <h6 className="mb-0 fw-bold">{p.medicineName}</h6>
//                                         </div>
//                                         <div className="card-body">
//                                             <div className="row g-2">
//                                                 <div className="col-6">
//                                                     <small className="text-muted d-block">Stock</small>
//                                                     <strong>{p.currentStock}</strong>
//                                                 </div>
//                                                 <div className="col-6">
//                                                     <small className="text-muted d-block">Days Left</small>
//                                                     <strong className="text-danger">{p.daysToStockout}</strong>
//                                                 </div>
//                                                 <div className="col-12">
//                                                     <small className="text-muted d-block">Recommended Order</small>
//                                                     <strong>{p.recommendedOrder} units</strong>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <div className="card-footer bg-transparent">
//                                             <button 
//                                                 className="btn btn-danger btn-sm w-100"
//                                                 onClick={() => setSelectedMedicine(p.medicineId)}
//                                             >
//                                                 <i className="bi bi-eye me-1"></i>
//                                                 View AI Analysis
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 )}

//                 {/* All Medicines Quick View */}
//                 <h5 className="fw-bold mb-3 mt-4">
//                     <i className="bi bi-grid-3x3-gap me-2 text-primary"></i>
//                     All Medicines
//                 </h5>
//                 <div className="row g-3">
//                     {medicines.slice(0, 12).map(med => (
//                         <div key={med._id} className="col-sm-6 col-md-4 col-xl-3">
//                             <div className="card border-0 shadow-sm h-100">
//                                 <div className="card-body">
//                                     <h6 className="fw-bold mb-1">{med.name}</h6>
//                                     <div className="row g-1 small">
//                                         <div className="col-6">
//                                             <span className="text-muted">Stock:</span> {med.quantity}
//                                         </div>
//                                         <div className="col-6">
//                                             <span className="text-muted">Batch:</span> {med.batchNumber}
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <div className="card-footer bg-transparent p-2">
//                                     <button
//                                         className="btn btn-primary btn-sm w-100"
//                                         onClick={() => setSelectedMedicine(med._id)}
//                                     >
//                                         <i className="bi bi-robot me-1"></i>
//                                         AI Analyze
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </>
//     );
// }


import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API from './Utitility/api';
import Navbar from './navbar';
import SmartReorder from './components/SmartReorder';

export default function AIReorder() {
    const [medicines, setMedicines] = useState([]);
    const [selectedMedicine, setSelectedMedicine] = useState('');
    const [urgentCount, setUrgentCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [allPredictions, setAllPredictions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('🔄 Fetching medicines...');
                const medResponse = await API.get('/medicines');
                console.log('📦 Medicines Response:', medResponse.data);

                // ====== FIX: Handle both response formats ======
                let medicinesList = [];
                if (Array.isArray(medResponse.data)) {
                    medicinesList = medResponse.data;
                } else if (medResponse.data.success && Array.isArray(medResponse.data.data)) {
                    medicinesList = medResponse.data.data;
                } else {
                    medicinesList = [];
                }
                
                setMedicines(medicinesList);
                console.log('✅ Medicines loaded:', medicinesList.length);

                console.log('🔄 Fetching urgent reorders...');
                const urgentResponse = await API.get('/ai/urgent');
                console.log('🚨 Urgent Response:', urgentResponse.data);

                if (urgentResponse.data.success) {
                    setUrgentCount(urgentResponse.data.count || 0);
                    setAllPredictions(urgentResponse.data.data || []);
                } else {
                    setUrgentCount(0);
                    setAllPredictions([]);
                }

            } catch (error) {
                console.error('❌ Error fetching data:', error);
                toast.error('Failed to load AI data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
                    <div className="spinner-border text-primary" />
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="container-fluid py-4 px-4">
                <h4 className="fw-bold mb-4">
                    <i className="bi bi-robot me-2 text-primary"></i>
                    AI Smart Reorder
                </h4>

                {urgentCount > 0 && (
                    <div className="alert alert-danger d-flex align-items-center mb-3">
                        <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
                        <span>
                            <strong>{urgentCount} medicine(s)</strong> need urgent reorder!
                        </span>
                    </div>
                )}

                {/* Medicine Selector */}
                <div className="card border-0 shadow-sm mb-4">
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-md-8">
                                <label className="form-label fw-bold">
                                    <i className="bi bi-search me-1"></i>
                                    Select Medicine for AI Prediction
                                </label>
                                <select
                                    className="form-select"
                                    value={selectedMedicine}
                                    onChange={(e) => setSelectedMedicine(e.target.value)}
                                >
                                    <option value="">-- Select a medicine --</option>
                                    {medicines.map(med => (
                                        <option key={med._id} value={med._id}>
                                            {med.name} (Stock: {med.quantity})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI Prediction Component */}
                {selectedMedicine && (
                    <SmartReorder 
                        medicineId={selectedMedicine}
                        medicineName={medicines.find(m => m._id === selectedMedicine)?.name}
                    />
                )}

                {/* Urgent Reorders List */}
                {allPredictions.length > 0 && (
                    <div id="urgentList">
                        <h5 className="fw-bold mb-3 mt-4">
                            <i className="bi bi-exclamation-triangle text-danger me-2"></i>
                            Urgent Reorders ({allPredictions.filter(p => p.reorderNeeded).length})
                        </h5>
                        <div className="row g-3">
                            {allPredictions.filter(p => p.reorderNeeded).map(p => (
                                <div key={p.medicineId} className="col-md-6 col-xl-4">
                                    <div className="card border-danger shadow-sm h-100">
                                        <div className="card-header bg-danger bg-opacity-10 border-danger">
                                            <h6 className="mb-0 fw-bold">{p.medicineName}</h6>
                                        </div>
                                        <div className="card-body">
                                            <div className="row g-2">
                                                <div className="col-6">
                                                    <small className="text-muted d-block">Stock</small>
                                                    <strong>{p.currentStock}</strong>
                                                </div>
                                                <div className="col-6">
                                                    <small className="text-muted d-block">Days Left</small>
                                                    <strong className="text-danger">{p.daysToStockout}</strong>
                                                </div>
                                                <div className="col-12">
                                                    <small className="text-muted d-block">Recommended Order</small>
                                                    <strong>{p.recommendedOrder} units</strong>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-footer bg-transparent">
                                            <button 
                                                className="btn btn-danger btn-sm w-100"
                                                onClick={() => setSelectedMedicine(p.medicineId)}
                                            >
                                                <i className="bi bi-eye me-1"></i>
                                                View AI Analysis
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* All Medicines Quick View */}
                <h5 className="fw-bold mb-3 mt-4">
                    <i className="bi bi-grid-3x3-gap me-2 text-primary"></i>
                    All Medicines ({medicines.length})
                </h5>
                <div className="row g-3">
                    {medicines.map(med => (
                        <div key={med._id} className="col-sm-6 col-md-4 col-xl-3">
                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-body">
                                    <h6 className="fw-bold mb-1">{med.name}</h6>
                                    <div className="row g-1 small">
                                        <div className="col-6">
                                            <span className="text-muted">Stock:</span> {med.quantity}
                                        </div>
                                        <div className="col-6">
                                            <span className="text-muted">Batch:</span> {med.batchNumber}
                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer bg-transparent p-2">
                                    <button
                                        className="btn btn-primary btn-sm w-100"
                                        onClick={() => setSelectedMedicine(med._id)}
                                    >
                                        <i className="bi bi-robot me-1"></i>
                                        AI Analyze
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}