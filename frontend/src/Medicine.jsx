

// import { useState, useEffect } from 'react';
// import { toast } from 'react-toastify';
// import API from './Utitility/api';
// import Navbar from './navbar';

// const emptyForm = {
//   name: '', batchNumber: '', price: '', tpPrice: '',
//   expiryDate: '', buyDate: '', quantity: '', lowStockThreshold: 10,
//   unitsPerPack: 1, priceType: 'sell',
//   supplierName: '', supplierPhone: '', supplierCompany: ''
// };

// export default function Medicines() {
//   const [medicines, setMedicines] = useState([]);
//   const [form, setForm] = useState(emptyForm);
//   const [editId, setEditId] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [search, setSearch] = useState('');
//   const [showModal, setShowModal] = useState(false);
//   const [activeTab, setActiveTab] = useState('basic');

//   const fetchMedicines = async () => {
//     try {
//       const { data } = await API.get('/medicines');
//       setMedicines(data);
//     } catch {
//       toast.error('Failed to load medicines');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchMedicines(); }, []);

//   const openAdd = () => {
//     setForm(emptyForm);
//     setEditId(null);
//     setActiveTab('basic');
//     setShowModal(true);
//   };

//   const openEdit = (med) => {
//     setForm({
//       name: med.name,
//       batchNumber: med.batchNumber,
//       price: med.price,
//       tpPrice: med.tpPrice,
//       expiryDate: med.expiryDate?.split('T')[0],
//       buyDate: med.buyDate?.split('T')[0],
//       quantity: med.quantity,
//       lowStockThreshold: med.lowStockThreshold,
//       unitsPerPack: med.unitsPerPack || 1,
//       priceType: med.priceType || 'sell',
//       supplierName: med.supplierName || '',
//       supplierPhone: med.supplierPhone || '',
//       supplierCompany: med.supplierCompany || ''
//     });
//     setEditId(med._id);
//     setActiveTab('basic');
//     setShowModal(true);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);
//     try {
//       const payload = {
//         ...form,
//         price: parseFloat(form.price),
//         tpPrice: parseFloat(form.tpPrice),
//         quantity: parseInt(form.quantity),
//         unitsPerPack: parseInt(form.unitsPerPack) || 1,
//         lowStockThreshold: parseInt(form.lowStockThreshold)
//       };
//       if (editId) {
//         await API.put(`/medicines/${editId}`, payload);
//         toast.success('Medicine updated');
//       } else {
//         await API.post('/medicines', payload);
//         toast.success('Medicine added');
//       }
//       setShowModal(false);
//       fetchMedicines();
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Something went wrong');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleDelete = async (id, name) => {
//     if (!window.confirm(`Delete "${name}"?`)) return;
//     try {
//       await API.delete(`/medicines/${id}`);
//       toast.success('Medicine deleted');
//       fetchMedicines();
//     } catch {
//       toast.error('Delete failed');
//     }
//   };

//   const isExpired = (date) => new Date(date) < new Date();
//   const isExpiringSoon = (date) => {
//     const diff = (new Date(date) - new Date()) / (1000 * 60 * 60 * 24);
//     return diff >= 0 && diff <= 180; // 6 months
//   };
//   const daysUntilExpiry = (date) => Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));
//   const isLowStock = (med) => med.quantity <= med.lowStockThreshold;
//   const packsRemaining = (med) => {
//     const upp = med.unitsPerPack || 1;
//     return Math.floor(med.quantity / upp);
//   };
//   const profitPerUnit = (med) => parseFloat((med.price - med.tpPrice).toFixed(2));
//   const profitMargin = (med) => {
//     if (!med.tpPrice || med.tpPrice === 0) return '0.0';
//     return (((med.price - med.tpPrice) / med.tpPrice) * 100).toFixed(1);
//   };

//   // Live preview in form
//   const liveProfit = form.price && form.tpPrice
//     ? parseFloat((parseFloat(form.price) - parseFloat(form.tpPrice)).toFixed(2))
//     : null;
//   const liveMargin = form.tpPrice > 0 && liveProfit !== null
//     ? ((liveProfit / parseFloat(form.tpPrice)) * 100).toFixed(1)
//     : null;

//   const filtered = medicines.filter(m =>
//     m.name.toLowerCase().includes(search.toLowerCase()) ||
//     m.batchNumber.toLowerCase().includes(search.toLowerCase()) ||
//     (m.supplierName || '').toLowerCase().includes(search.toLowerCase())
//   );

//   const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

//   const expiryBadge = (date) => {
//     if (isExpired(date)) return <span className="badge bg-danger">Expired</span>;
//     const days = daysUntilExpiry(date);
//     if (days <= 30) return <span className="badge bg-danger">Expires in {days}d</span>;
//     if (days <= 90) return <span className="badge bg-warning text-dark">Expires in {days}d</span>;
//     if (days <= 180) return <span className="badge bg-info text-dark">Expires in {days}d</span>;
//     return <span className="badge bg-success">OK</span>;
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="container-fluid py-4 px-4">
//         <div className="d-flex justify-content-between align-items-center mb-4">
//           <h4 className="fw-bold mb-0">
//             <i className="bi bi-capsule me-2 text-primary"></i>Medicines
//           </h4>
//           <button className="btn btn-primary" onClick={openAdd}>
//             <i className="bi bi-plus-lg me-2"></i>Add Medicine
//           </button>
//         </div>

//         <div className="mb-3">
//           <input
//             type="text"
//             className="form-control"
//             placeholder="Search by name, batch or supplier..."
//             value={search}
//             onChange={e => setSearch(e.target.value)}
//             style={{ maxWidth: 380 }}
//           />
//         </div>

//         <div className="card border-0 shadow-sm">
//           <div className="card-body p-0">
//             {loading ? (
//               <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
//             ) : filtered.length === 0 ? (
//               <div className="text-center py-5 text-muted">
//                 <i className="bi bi-inbox fs-1 d-block mb-2"></i>No medicines found
//               </div>
//             ) : (
//               <div className="table-responsive">
//                 <table className="table table-hover align-middle mb-0">
//                   <thead className="table-light">
//                     <tr>
//                       <th>Name</th>
//                       <th>Batch</th>
//                       <th>Sell Price</th>
//                       <th>TP Price</th>
//                       <th>Profit/Unit</th>
//                       <th>Margin</th>
//                       <th>Units</th>
//                       <th>Packs</th>
//                       <th>Supplier</th>
//                       <th>Expiry</th>
//                       <th>Status</th>
//                       <th>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filtered.map(med => (
//                       <tr key={med._id}>
//                         <td className="fw-semibold">{med.name}</td>
//                         <td><span className="badge bg-secondary">{med.batchNumber}</span></td>
//                         <td>PKR {parseFloat(med.price).toFixed(2)}</td>
//                         <td>PKR {parseFloat(med.tpPrice).toFixed(2)}</td>
//                         <td className="text-success fw-semibold">PKR {profitPerUnit(med)}</td>
//                         <td>
//                           <span className={`badge ${parseFloat(profitMargin(med)) >= 20 ? 'bg-success' : parseFloat(profitMargin(med)) >= 10 ? 'bg-warning text-dark' : 'bg-danger'}`}>
//                             {profitMargin(med)}%
//                           </span>
//                         </td>
//                         <td>
//                           <span className={`fw-bold ${isLowStock(med) ? 'text-danger' : 'text-success'}`}>
//                             {med.quantity}
//                             {isLowStock(med) && <i className="bi bi-exclamation-triangle-fill ms-1"></i>}
//                           </span>
//                         </td>
//                         <td>
//                           <span className="text-muted small">
//                             {packsRemaining(med)} pack{packsRemaining(med) !== 1 ? 's' : ''}
//                             <span className="ms-1 text-muted" style={{ fontSize: 11 }}>({med.unitsPerPack || 1}/pack)</span>
//                           </span>
//                         </td>
//                         <td className="text-muted small">{med.supplierName || '—'}</td>
//                         <td>{new Date(med.expiryDate).toLocaleDateString()}</td>
//                         <td>{expiryBadge(med.expiryDate)}</td>
//                         <td>
//                           <button className="btn btn-sm btn-outline-primary me-1" onClick={() => openEdit(med)}>
//                             <i className="bi bi-pencil"></i>
//                           </button>
//                           <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(med._id, med.name)}>
//                             <i className="bi bi-trash"></i>
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Modal */}
//       {showModal && (
//         <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
//           <div className="modal-dialog modal-lg modal-dialog-centered">
//             <div className="modal-content border-0 shadow">
//               <div className="modal-header">
//                 <h5 className="modal-title fw-bold">
//                   <i className={`bi ${editId ? 'bi-pencil' : 'bi-plus-circle'} me-2 text-primary`}></i>
//                   {editId ? 'Edit Medicine' : 'Add Medicine'}
//                 </h5>
//                 <button className="btn-close" onClick={() => setShowModal(false)} />
//               </div>
//               <form onSubmit={handleSubmit}>
//                 <div className="modal-body">
//                   <ul className="nav nav-tabs mb-3">
//                     <li className="nav-item">
//                       <button type="button" className={`nav-link ${activeTab === 'basic' ? 'active' : ''}`} onClick={() => setActiveTab('basic')}>
//                         <i className="bi bi-capsule me-1"></i>Medicine Info
//                       </button>
//                     </li>
//                     <li className="nav-item">
//                       <button type="button" className={`nav-link ${activeTab === 'supplier' ? 'active' : ''}`} onClick={() => setActiveTab('supplier')}>
//                         <i className="bi bi-truck me-1"></i>Supplier Info
//                       </button>
//                     </li>
//                   </ul>

//                   {activeTab === 'basic' && (
//                     <div className="row g-3">
//                       <div className="col-md-6">
//                         <label className="form-label fw-semibold">Medicine Name *</label>
//                         <input className="form-control" placeholder="e.g. Panadol 500mg" required value={form.name} onChange={set('name')} />
//                       </div>
//                       <div className="col-md-6">
//                         <label className="form-label fw-semibold">Batch Number *</label>
//                         <input className="form-control" placeholder="e.g. BT-2024-001" required value={form.batchNumber} onChange={set('batchNumber')} />
//                       </div>

//                       {/* Price type toggle */}
//                       <div className="col-12">
//                         <label className="form-label fw-semibold d-block">Price Entry Type</label>
//                         <div className="btn-group btn-group-sm">
//                           <button type="button"
//                             className={`btn ${form.priceType === 'sell' ? 'btn-primary' : 'btn-outline-secondary'}`}
//                             onClick={() => setForm({ ...form, priceType: 'sell' })}>
//                             Sell Price first
//                           </button>
//                           <button type="button"
//                             className={`btn ${form.priceType === 'tp' ? 'btn-primary' : 'btn-outline-secondary'}`}
//                             onClick={() => setForm({ ...form, priceType: 'tp' })}>
//                             TP Price first
//                           </button>
//                         </div>
//                         <div className="text-muted small mt-1">Select which price you're entering first</div>
//                       </div>

//                       <div className="col-md-6">
//                         <label className="form-label fw-semibold">
//                           Sell Price (PKR) *
//                           <span className="text-muted small ms-1">— decimals allowed</span>
//                         </label>
//                         <input
//                           type="number" step="0.01" min="0"
//                           className="form-control" placeholder="e.g. 125.50" required
//                           value={form.price} onChange={set('price')}
//                         />
//                       </div>
//                       <div className="col-md-6">
//                         <label className="form-label fw-semibold">
//                           TP Price (PKR) *
//                           <span className="text-muted small ms-1">— decimals allowed</span>
//                         </label>
//                         <input
//                           type="number" step="0.01" min="0"
//                           className="form-control" placeholder="e.g. 98.75" required
//                           value={form.tpPrice} onChange={set('tpPrice')}
//                         />
//                       </div>

//                       {/* Live profit preview */}
//                       {liveProfit !== null && (
//                         <div className="col-12">
//                           <div className={`alert py-2 mb-0 ${liveProfit >= 0 ? 'alert-success' : 'alert-danger'}`}>
//                             <div className="row text-center g-0">
//                               <div className="col">
//                                 <div className="small text-muted">Profit / Unit</div>
//                                 <div className="fw-bold">PKR {liveProfit}</div>
//                               </div>
//                               <div className="col border-start">
//                                 <div className="small text-muted">Margin %</div>
//                                 <div className="fw-bold">{liveMargin}%</div>
//                               </div>
//                               {form.unitsPerPack > 1 && (
//                                 <div className="col border-start">
//                                   <div className="small text-muted">Profit / Pack</div>
//                                   <div className="fw-bold">PKR {(liveProfit * form.unitsPerPack).toFixed(2)}</div>
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       )}

//                       <div className="col-md-4">
//                         <label className="form-label fw-semibold">Total Units *</label>
//                         <input type="number" className="form-control" placeholder="e.g. 200" min="0" required
//                           value={form.quantity} onChange={set('quantity')} />
//                       </div>
//                       <div className="col-md-4">
//                         <label className="form-label fw-semibold">Units Per Pack</label>
//                         <input type="number" className="form-control" placeholder="e.g. 10" min="1"
//                           value={form.unitsPerPack} onChange={set('unitsPerPack')} />
//                         {form.quantity && form.unitsPerPack > 1 && (
//                           <div className="text-muted small mt-1">
//                             = {Math.floor(form.quantity / form.unitsPerPack)} packs
//                           </div>
//                         )}
//                       </div>
//                       <div className="col-md-4">
//                         <label className="form-label fw-semibold">Low Stock Alert At</label>
//                         <input type="number" className="form-control" min="0"
//                           value={form.lowStockThreshold} onChange={set('lowStockThreshold')} />
//                         <div className="text-muted small mt-1">units</div>
//                       </div>

//                       <div className="col-md-6">
//                         <label className="form-label fw-semibold">Buy Date *</label>
//                         <input type="date" className="form-control" required value={form.buyDate} onChange={set('buyDate')} />
//                       </div>
//                       <div className="col-md-6">
//                         <label className="form-label fw-semibold">Expiry Date *</label>
//                         <input type="date" className="form-control" required value={form.expiryDate} onChange={set('expiryDate')} />
//                         {form.expiryDate && (() => {
//                           const days = daysUntilExpiry(form.expiryDate);
//                           if (days <= 0) return <div className="text-danger small mt-1">⚠ Already expired</div>;
//                           if (days <= 180) return <div className="text-warning small mt-1">⚠ Expires in {days} days</div>;
//                           return <div className="text-success small mt-1">✓ {days} days remaining</div>;
//                         })()}
//                       </div>
//                     </div>
//                   )}

//                   {activeTab === 'supplier' && (
//                     <div className="row g-3">
//                       <div className="col-md-6">
//                         <label className="form-label fw-semibold">Supplier Name</label>
//                         <input className="form-control" placeholder="e.g. Ahmed Traders" value={form.supplierName} onChange={set('supplierName')} />
//                       </div>
//                       <div className="col-md-6">
//                         <label className="form-label fw-semibold">Supplier Phone</label>
//                         <input className="form-control" placeholder="e.g. 03001234567" value={form.supplierPhone} onChange={set('supplierPhone')} />
//                       </div>
//                       <div className="col-12">
//                         <label className="form-label fw-semibold">Supplier Company</label>
//                         <input className="form-control" placeholder="e.g. GSK Pakistan" value={form.supplierCompany} onChange={set('supplierCompany')} />
//                       </div>
//                     </div>
//                   )}
//                 </div>
//                 <div className="modal-footer">
//                   <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
//                   <button type="submit" className="btn btn-primary" disabled={submitting}>
//                     {submitting && <span className="spinner-border spinner-border-sm me-2" />}
//                     {editId ? 'Update Medicine' : 'Add Medicine'}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }





import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API from './Utitility/api';
import Navbar from './navbar';

const emptyForm = {
  name: '',
  batchNumber: '',
  price: '',
  tpPrice: '',
  expiryDate: '',
  buyDate: '',
  quantity: '',
  lowStockThreshold: 10,
  unitsPerPack: 10,
  priceType: 'sell',
  supplierName: '',
  supplierPhone: '',
  supplierCompany: '',
  packQuantity: 1,
  packSellPrice: '',
  packTpPrice: '',
};

export default function Medicines() {
  const [medicines, setMedicines] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  // ====== CALCULATED STATE ======
  const [calculated, setCalculated] = useState({
    totalUnits: 0,
    perUnitSell: 0,
    perUnitTp: 0,
    profitPerPack: 0,
    profitPerUnit: 0,
    margin: 0,
    packCount: 0
  });

  // ====== AUTO-CALCULATE ======
  useEffect(() => {
    const unitsPerPack = parseInt(form.unitsPerPack) || 1;
    const packQuantity = parseInt(form.packQuantity) || 0;
    const packSellPrice = parseFloat(form.packSellPrice) || 0;
    const packTpPrice = parseFloat(form.packTpPrice) || 0;

    const totalUnits = packQuantity * unitsPerPack;
    const perUnitSell = unitsPerPack > 0 ? packSellPrice / unitsPerPack : 0;
    const perUnitTp = unitsPerPack > 0 ? packTpPrice / unitsPerPack : 0;
    const profitPerPack = packSellPrice - packTpPrice;
    const profitPerUnit = perUnitSell - perUnitTp;
    const margin = perUnitTp > 0 ? (profitPerUnit / perUnitTp) * 100 : 0;

    setCalculated({
      totalUnits,
      perUnitSell,
      perUnitTp,
      profitPerPack,
      profitPerUnit,
      margin,
      packCount: packQuantity
    });
  }, [form.unitsPerPack, form.packQuantity, form.packSellPrice, form.packTpPrice]);

  // ====== FETCH MEDICINES ======
  const fetchMedicines = async () => {
    try {
      const { data } = await API.get('/medicines');
      setMedicines(data);
    } catch {
      toast.error('Failed to load medicines');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMedicines(); }, []);

  // ====== OPEN ADD ======
  const openAdd = () => {
    setForm({
      ...emptyForm,
      unitsPerPack: 10,
      packQuantity: 1,
    });
    setEditId(null);
    setActiveTab('basic');
    setShowModal(true);
  };

  // ====== OPEN EDIT ======
  const openEdit = (med) => {
    const unitsPerPack = med.unitsPerPack || 1;
    const packSellPrice = med.price * unitsPerPack;
    const packTpPrice = med.tpPrice * unitsPerPack;
    const packQuantity = Math.floor(med.quantity / unitsPerPack);

    setForm({
      name: med.name,
      batchNumber: med.batchNumber,
      price: med.price,
      tpPrice: med.tpPrice,
      expiryDate: med.expiryDate?.split('T')[0],
      buyDate: med.buyDate?.split('T')[0],
      quantity: med.quantity,
      lowStockThreshold: med.lowStockThreshold || 10,
      unitsPerPack: unitsPerPack,
      priceType: med.priceType || 'sell',
      supplierName: med.supplierName || '',
      supplierPhone: med.supplierPhone || '',
      supplierCompany: med.supplierCompany || '',
      packQuantity: packQuantity,
      packSellPrice: packSellPrice,
      packTpPrice: packTpPrice,
    });
    setEditId(med._id);
    setActiveTab('basic');
    setShowModal(true);
  };

  // ====== HANDLE SUBMIT ======
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const unitsPerPack = parseInt(form.unitsPerPack) || 1;
      const packQuantity = parseInt(form.packQuantity) || 0;
      const packSellPrice = parseFloat(form.packSellPrice) || 0;
      const packTpPrice = parseFloat(form.packTpPrice) || 0;

      const totalUnits = packQuantity * unitsPerPack;
      const perUnitSell = unitsPerPack > 0 ? packSellPrice / unitsPerPack : 0;
      const perUnitTp = unitsPerPack > 0 ? packTpPrice / unitsPerPack : 0;

      const payload = {
        name: form.name,
        batchNumber: form.batchNumber,
        price: perUnitSell,
        tpPrice: perUnitTp,
        quantity: totalUnits,
        unitsPerPack: unitsPerPack,
        expiryDate: form.expiryDate,
        buyDate: form.buyDate,
        lowStockThreshold: parseInt(form.lowStockThreshold) || 10,
        supplierName: form.supplierName || '',
        supplierPhone: form.supplierPhone || '',
        supplierCompany: form.supplierCompany || ''
      };

      if (editId) {
        await API.put(`/medicines/${editId}`, payload);
        toast.success('Medicine updated');
      } else {
        await API.post('/medicines', payload);
        toast.success('Medicine added');
      }
      setShowModal(false);
      fetchMedicines();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  // ====== DELETE ======
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await API.delete(`/medicines/${id}`);
      toast.success('Medicine deleted');
      fetchMedicines();
    } catch {
      toast.error('Delete failed');
    }
  };

  // ====== HELPERS ======
  const isExpired = (date) => new Date(date) < new Date();
  const daysUntilExpiry = (date) => Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));
  const isLowStock = (med) => med.quantity <= med.lowStockThreshold;
  const packsRemaining = (med) => {
    const upp = med.unitsPerPack || 1;
    return Math.floor(med.quantity / upp);
  };
  const profitPerUnit = (med) => parseFloat((med.price - med.tpPrice).toFixed(2));
  const profitMargin = (med) => {
    if (!med.tpPrice || med.tpPrice === 0) return '0.0';
    return (((med.price - med.tpPrice) / med.tpPrice) * 100).toFixed(1);
  };

  const filtered = medicines.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.batchNumber.toLowerCase().includes(search.toLowerCase()) ||
    (m.supplierName || '').toLowerCase().includes(search.toLowerCase())
  );

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const expiryBadge = (date) => {
    if (isExpired(date)) return <span className="badge bg-danger">Expired</span>;
    const days = daysUntilExpiry(date);
    if (days <= 30) return <span className="badge bg-danger">Expires in {days}d</span>;
    if (days <= 90) return <span className="badge bg-warning text-dark">Expires in {days}d</span>;
    if (days <= 180) return <span className="badge bg-info text-dark">Expires in {days}d</span>;
    return <span className="badge bg-success">OK</span>;
  };

  // ====== RENDER ======
  return (
    <>
      <Navbar />
      <div className="container-fluid py-4 px-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold mb-0">
            <i className="bi bi-capsule me-2 text-primary"></i>Medicines
          </h4>
          <button className="btn btn-primary" onClick={openAdd}>
            <i className="bi bi-plus-lg me-2"></i>Add Medicine
          </button>
        </div>

        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name, batch or supplier..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ maxWidth: 380 }}
          />
        </div>

        <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
            {loading ? (
              <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <i className="bi bi-inbox fs-1 d-block mb-2"></i>No medicines found
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Name</th>
                      <th>Batch</th>
                      <th>Sell Price</th>
                      <th>TP Price</th>
                      <th>Profit/Unit</th>
                      <th>Margin</th>
                      <th>Units</th>
                      <th>Packs</th>
                      <th>Supplier</th>
                      <th>Expiry</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(med => (
                      <tr key={med._id}>
                        <td className="fw-semibold">{med.name}</td>
                        <td><span className="badge bg-secondary">{med.batchNumber}</span></td>
                        <td>PKR {parseFloat(med.price).toFixed(2)}</td>
                        <td>PKR {parseFloat(med.tpPrice).toFixed(2)}</td>
                        <td className="text-success fw-semibold">PKR {profitPerUnit(med)}</td>
                        <td>
                          <span className={`badge ${parseFloat(profitMargin(med)) >= 20 ? 'bg-success' : parseFloat(profitMargin(med)) >= 10 ? 'bg-warning text-dark' : 'bg-danger'}`}>
                            {profitMargin(med)}%
                          </span>
                        </td>
                        <td>
                          <span className={`fw-bold ${isLowStock(med) ? 'text-danger' : 'text-success'}`}>
                            {med.quantity}
                            {isLowStock(med) && <i className="bi bi-exclamation-triangle-fill ms-1"></i>}
                          </span>
                        </td>
                        <td>
                          <span className="text-muted small">
                            {packsRemaining(med)} pack{packsRemaining(med) !== 1 ? 's' : ''}
                            <span className="ms-1 text-muted" style={{ fontSize: 11 }}>({med.unitsPerPack || 1}/pack)</span>
                          </span>
                        </td>
                        <td className="text-muted small">{med.supplierName || '—'}</td>
                        <td>{new Date(med.expiryDate).toLocaleDateString()}</td>
                        <td>{expiryBadge(med.expiryDate)}</td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary me-1" onClick={() => openEdit(med)}>
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(med._id, med.name)}>
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ====== MODAL ====== */}
      {showModal && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  <i className={`bi ${editId ? 'bi-pencil' : 'bi-plus-circle'} me-2 text-primary`}></i>
                  {editId ? 'Edit Medicine' : 'Add Medicine'}
                </h5>
                <button className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <ul className="nav nav-tabs mb-3">
                    <li className="nav-item">
                      <button type="button" className={`nav-link ${activeTab === 'basic' ? 'active' : ''}`} onClick={() => setActiveTab('basic')}>
                        <i className="bi bi-capsule me-1"></i>Medicine Info
                      </button>
                    </li>
                    <li className="nav-item">
                      <button type="button" className={`nav-link ${activeTab === 'supplier' ? 'active' : ''}`} onClick={() => setActiveTab('supplier')}>
                        <i className="bi bi-truck me-1"></i>Supplier Info
                      </button>
                    </li>
                  </ul>

                  {activeTab === 'basic' && (
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Medicine Name *</label>
                        <input className="form-control" placeholder="e.g. Panadol 500mg" required value={form.name} onChange={set('name')} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Batch Number *</label>
                        <input className="form-control" placeholder="e.g. BT-2024-001" required value={form.batchNumber} onChange={set('batchNumber')} />
                      </div>

                      {/* ====== PACK-BASED ENTRY ====== */}
                      <div className="col-12">
                        <div className="card bg-light p-3">
                          <h6 className="fw-bold mb-3">
                            <i className="bi bi-box me-2 text-primary"></i>
                            Pack-Based Entry
                          </h6>
                          <div className="row g-3">
                            <div className="col-md-3">
                              <label className="form-label fw-semibold">Units Per Pack *</label>
                              <input type="number" className="form-control" placeholder="e.g. 10" min="1" required value={form.unitsPerPack} onChange={set('unitsPerPack')} />
                            </div>
                            <div className="col-md-3">
                              <label className="form-label fw-semibold">Pack Quantity *</label>
                              <input type="number" className="form-control" placeholder="e.g. 20" min="0" required value={form.packQuantity} onChange={set('packQuantity')} />
                            </div>
                            <div className="col-md-3">
                              <label className="form-label fw-semibold">Pack Sell Price (PKR) *</label>
                              <input type="number" step="0.01" className="form-control" placeholder="e.g. 500.00" min="0" required value={form.packSellPrice} onChange={set('packSellPrice')} />
                            </div>
                            <div className="col-md-3">
                              <label className="form-label fw-semibold">Pack TP Price (PKR) *</label>
                              <input type="number" step="0.01" className="form-control" placeholder="e.g. 400.00" min="0" required value={form.packTpPrice} onChange={set('packTpPrice')} />
                            </div>
                          </div>

                          {/* LIVE CALCULATIONS */}
                          {form.packSellPrice && form.packTpPrice && form.packQuantity > 0 && (
                            <div className="mt-3 p-3 bg-white rounded border">
                              <div className="row text-center g-0">
                                <div className="col-3">
                                  <div className="small text-muted">Total Units</div>
                                  <div className="fw-bold fs-5">{calculated.totalUnits}</div>
                                  <div className="small text-muted">({calculated.packCount} packs)</div>
                                </div>
                                <div className="col-3 border-start">
                                  <div className="small text-muted">Per Unit Sell</div>
                                  <div className="fw-bold fs-5 text-primary">PKR {calculated.perUnitSell.toFixed(2)}</div>
                                </div>
                                <div className="col-3 border-start">
                                  <div className="small text-muted">Per Unit TP</div>
                                  <div className="fw-bold fs-5 text-secondary">PKR {calculated.perUnitTp.toFixed(2)}</div>
                                </div>
                                <div className="col-3 border-start">
                                  <div className="small text-muted">Margin</div>
                                  <div className={`fw-bold fs-5 ${calculated.margin >= 20 ? 'text-success' : calculated.margin >= 10 ? 'text-warning' : 'text-danger'}`}>
                                    {calculated.margin.toFixed(1)}%
                                  </div>
                                </div>
                              </div>
                              <div className="row text-center mt-2 pt-2 border-top">
                                <div className="col-6">
                                  <div className="small text-muted">Profit / Pack</div>
                                  <div className="fw-bold text-success">PKR {calculated.profitPerPack.toFixed(2)}</div>
                                </div>
                                <div className="col-6 border-start">
                                  <div className="small text-muted">Profit / Unit</div>
                                  <div className="fw-bold text-success">PKR {calculated.profitPerUnit.toFixed(2)}</div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-4">
                        <label className="form-label fw-semibold">Low Stock Alert At</label>
                        <input type="number" className="form-control" min="0" value={form.lowStockThreshold} onChange={set('lowStockThreshold')} />
                        <div className="text-muted small mt-1">units</div>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Buy Date *</label>
                        <input type="date" className="form-control" required value={form.buyDate} onChange={set('buyDate')} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Expiry Date *</label>
                        <input type="date" className="form-control" required value={form.expiryDate} onChange={set('expiryDate')} />
                        {form.expiryDate && (() => {
                          const days = daysUntilExpiry(form.expiryDate);
                          if (days <= 0) return <div className="text-danger small mt-1">⚠ Already expired</div>;
                          if (days <= 180) return <div className="text-warning small mt-1">⚠ Expires in {days} days</div>;
                          return <div className="text-success small mt-1">✓ {days} days remaining</div>;
                        })()}
                      </div>
                    </div>
                  )}

                  {activeTab === 'supplier' && (
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Supplier Name</label>
                        <input className="form-control" placeholder="e.g. Ahmed Traders" value={form.supplierName} onChange={set('supplierName')} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Supplier Phone</label>
                        <input className="form-control" placeholder="e.g. 03001234567" value={form.supplierPhone} onChange={set('supplierPhone')} />
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-semibold">Supplier Company</label>
                        <input className="form-control" placeholder="e.g. GSK Pakistan" value={form.supplierCompany} onChange={set('supplierCompany')} />
                      </div>
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting && <span className="spinner-border spinner-border-sm me-2" />}
                    {editId ? 'Update Medicine' : 'Add Medicine'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}