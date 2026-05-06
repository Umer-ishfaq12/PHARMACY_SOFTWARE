// import { useState, useEffect, useRef } from 'react';
// import { toast } from 'react-toastify';
// import API from './Utitility/api';
// import Navbar from './navbar';

// export default function Sell() {
//   const [medicines, setMedicines] = useState([]);
//   const [cart, setCart] = useState([]);
//   const [customerName, setCustomerName] = useState('');
//   const [customerPhone, setCustomerPhone] = useState('');
//   const [selectedMed, setSelectedMed] = useState('');
//   const [qty, setQty] = useState(1);
//   const [discountType, setDiscountType] = useState('percentage');
//   const [discountValue, setDiscountValue] = useState(0);
//   const [paymentMethod, setPaymentMethod] = useState('cash');
//   const [submitting, setSubmitting] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [receipt, setReceipt] = useState(null);
//   const printRef = useRef();

//   const fetchMedicines = async () => {
//     try {
//       const { data } = await API.get('/medicines');
//       setMedicines(data.filter(m => m.quantity > 0 && new Date(m.expiryDate) > new Date()));
//     } catch {
//       toast.error('Failed to load medicines');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchMedicines(); }, []);

//   const addToCart = () => {
//     if (!selectedMed) return toast.warn('Select a medicine first');
//     const med = medicines.find(m => m._id === selectedMed);
//     if (!med) return;
//     const numQty = Number(qty);
//     if (numQty < 1 || numQty > med.quantity) return toast.warn(`Max stock: ${med.quantity}`);

//     const existing = cart.find(c => c.medicineId === med._id);
//     if (existing) {
//       const newQty = existing.quantity + numQty;
//       if (newQty > med.quantity) return toast.warn(`Max stock: ${med.quantity}`);
//       setCart(cart.map(c => c.medicineId === med._id
//         ? { ...c, quantity: newQty, total: newQty * med.price }
//         : c
//       ));
//     } else {
//       setCart([...cart, {
//         medicineId: med._id,
//         name: med.name,
//         quantity: numQty,
//         pricePerUnit: med.price,
//         tpPrice: med.tpPrice,
//         total: numQty * med.price
//       }]);
//     }
//     setSelectedMed('');
//     setQty(1);
//   };

//   const removeFromCart = (id) => setCart(cart.filter(c => c.medicineId !== id));

//   const updateCartQty = (id, newQty) => {
//     const med = medicines.find(m => m._id === id);
//     const num = Number(newQty);
//     if (!med || num < 1 || num > med.quantity) return;
//     setCart(cart.map(c => c.medicineId === id
//       ? { ...c, quantity: num, total: num * c.pricePerUnit }
//       : c
//     ));
//   };

//   const subtotal = cart.reduce((s, c) => s + c.total, 0);

//   const discountAmount = (() => {
//     const v = Number(discountValue) || 0;
//     if (discountType === 'percentage') return parseFloat(((subtotal * v) / 100).toFixed(2));
//     return Math.min(v, subtotal);
//   })();

//   const totalAmount = parseFloat((subtotal - discountAmount).toFixed(2));

//   const handleSell = async () => {
//     if (cart.length === 0) return toast.warn('Cart is empty');
//     setSubmitting(true);
//     try {
//       const { data } = await API.post('/sales', {
//         items: cart.map(c => ({ medicineId: c.medicineId, quantity: c.quantity })),
//         customerName: customerName || 'Walk-in Customer',
//         customerPhone,
//         discountType,
//         discountValue: Number(discountValue) || 0,
//         paymentMethod
//       });
//       toast.success(`Sale saved! Invoice: ${data.invoiceNumber}`);
//       setReceipt({
//         ...data,
//         cartItems: [...cart],
//         subtotal,
//         discountAmount,
//         totalAmount,
//         discountType,
//         discountValue: Number(discountValue) || 0,
//         paymentMethod,
//         customerName: customerName || 'Walk-in Customer',
//         customerPhone,
//         time: new Date().toLocaleString()
//       });
//       setCart([]);
//       setCustomerName('');
//       setCustomerPhone('');
//       setDiscountValue(0);
//       setPaymentMethod('cash');
//       fetchMedicines();
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Sale failed');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handlePrint = () => {
//     const content = printRef.current.innerHTML;
//     const win = window.open('', '_blank');
//     win.document.write(`
//       <html>
//         <head>
//           <title>Invoice ${receipt?.invoiceNumber}</title>
//           <style>
//             body { font-family: Arial, sans-serif; padding: 20px; font-size: 13px; }
//             table { width: 100%; border-collapse: collapse; margin: 10px 0; }
//             th, td { border: 1px solid #ddd; padding: 6px 10px; text-align: left; }
//             th { background: #f5f5f5; }
//             .text-end { text-align: right; }
//             .header { text-align: center; margin-bottom: 16px; }
//             .header h2 { margin: 0; }
//             .divider { border-top: 1px dashed #999; margin: 10px 0; }
//             .total-row { font-weight: bold; font-size: 14px; }
//             @media print { button { display: none; } }
//           </style>
//         </head>
//         <body>${content}</body>
//       </html>
//     `);
//     win.document.close();
//     win.focus();
//     win.print();
//     win.close();
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="container-fluid py-4 px-4">
//         <h4 className="fw-bold mb-4">
//           <i className="bi bi-cart-plus me-2 text-primary"></i>Sell Medicine
//         </h4>

//         <div className="row g-4">
//           {/* Left */}
//           <div className="col-lg-7">
//             {/* Customer + Medicine */}
//             <div className="card border-0 shadow-sm mb-3">
//               <div className="card-body">
//                 <h6 className="fw-bold mb-3">Customer Details</h6>
//                 <div className="row g-2 mb-3">
//                   <div className="col-md-6">
//                     <label className="form-label fw-semibold">Customer Name</label>
//                     <input className="form-control" placeholder="Walk-in Customer"
//                       value={customerName} onChange={e => setCustomerName(e.target.value)} />
//                   </div>
//                   <div className="col-md-6">
//                     <label className="form-label fw-semibold">Phone (optional)</label>
//                     <input className="form-control" placeholder="03001234567"
//                       value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} />
//                   </div>
//                 </div>

//                 <h6 className="fw-bold mb-3">Add Medicine</h6>
//                 <div className="row g-2 align-items-end">
//                   <div className="col-md-7">
//                     <label className="form-label fw-semibold">Medicine</label>
//                     {loading ? <p className="text-muted small">Loading...</p> : (
//                       <select className="form-select" value={selectedMed} onChange={e => setSelectedMed(e.target.value)}>
//                         <option value="">-- Select Medicine --</option>
//                         {medicines.map(m => (
//                           <option key={m._id} value={m._id}>
//                             {m.name} | PKR {m.price} | Stock: {m.quantity}
//                           </option>
//                         ))}
//                       </select>
//                     )}
//                   </div>
//                   <div className="col-md-3">
//                     <label className="form-label fw-semibold">Quantity</label>
//                     <input type="number" className="form-control" min="1"
//                       value={qty} onChange={e => setQty(e.target.value)} />
//                   </div>
//                   <div className="col-md-2">
//                     <button className="btn btn-primary w-100" onClick={addToCart}>
//                       <i className="bi bi-plus-lg"></i>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Cart */}
//             <div className="card border-0 shadow-sm">
//               <div className="card-header bg-white border-0 pt-3 pb-0">
//                 <h6 className="fw-bold"><i className="bi bi-cart me-2 text-primary"></i>Cart ({cart.length})</h6>
//               </div>
//               <div className="card-body p-0">
//                 {cart.length === 0 ? (
//                   <div className="text-center py-4 text-muted">
//                     <i className="bi bi-cart-x fs-2 d-block mb-2"></i>Cart is empty
//                   </div>
//                 ) : (
//                   <div className="table-responsive">
//                     <table className="table table-hover align-middle mb-0">
//                       <thead className="table-light">
//                         <tr>
//                           <th>Medicine</th>
//                           <th>Price</th>
//                           <th>Qty</th>
//                           <th>Total</th>
//                           <th></th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {cart.map(item => (
//                           <tr key={item.medicineId}>
//                             <td className="fw-semibold">{item.name}</td>
//                             <td>PKR {item.pricePerUnit}</td>
//                             <td style={{ width: 110 }}>
//                               <input type="number" className="form-control form-control-sm" min="1"
//                                 value={item.quantity}
//                                 onChange={e => updateCartQty(item.medicineId, e.target.value)} />
//                             </td>
//                             <td className="fw-bold text-success">PKR {item.total.toLocaleString()}</td>
//                             <td>
//                               <button className="btn btn-sm btn-outline-danger" onClick={() => removeFromCart(item.medicineId)}>
//                                 <i className="bi bi-trash"></i>
//                               </button>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Right - Summary */}
//           <div className="col-lg-5">
//             <div className="card border-0 shadow-sm mb-3">
//               <div className="card-body">
//                 <h6 className="fw-bold mb-3">Payment Details</h6>

//                 {/* Payment Method */}
//                 <div className="mb-3">
//                   <label className="form-label fw-semibold">Payment Method</label>
//                   <div className="d-flex gap-2">
//                     {['cash', 'credit', 'online'].map(m => (
//                       <button key={m} type="button"
//                         className={`btn btn-sm flex-fill ${paymentMethod === m ? 'btn-primary' : 'btn-outline-secondary'}`}
//                         onClick={() => setPaymentMethod(m)}>
//                         <i className={`bi me-1 ${m === 'cash' ? 'bi-cash' : m === 'credit' ? 'bi-credit-card' : 'bi-phone'}`}></i>
//                         {m.charAt(0).toUpperCase() + m.slice(1)}
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Discount */}
//                 <div className="mb-3">
//                   <label className="form-label fw-semibold">Discount</label>
//                   <div className="input-group">
//                     <select className="form-select" style={{ maxWidth: 130 }}
//                       value={discountType} onChange={e => setDiscountType(e.target.value)}>
//                       <option value="percentage">% Percent</option>
//                       <option value="fixed">PKR Fixed</option>
//                     </select>
//                     <input type="number" className="form-control" min="0"
//                       placeholder={discountType === 'percentage' ? '0-100' : '0'}
//                       value={discountValue}
//                       onChange={e => setDiscountValue(e.target.value)} />
//                   </div>
//                 </div>

//                 <hr />

//                 {/* Totals */}
//                 <div className="d-flex justify-content-between mb-1">
//                   <span className="text-muted">Subtotal</span>
//                   <span>PKR {subtotal.toLocaleString()}</span>
//                 </div>
//                 {discountAmount > 0 && (
//                   <div className="d-flex justify-content-between mb-1 text-danger">
//                     <span>Discount ({discountType === 'percentage' ? `${discountValue}%` : `PKR ${discountValue}`})</span>
//                     <span>- PKR {discountAmount.toLocaleString()}</span>
//                   </div>
//                 )}
//                 <div className="d-flex justify-content-between mb-4 mt-2">
//                   <span className="fw-bold fs-5">Total</span>
//                   <span className="fw-bold fs-5 text-primary">PKR {totalAmount.toLocaleString()}</span>
//                 </div>

//                 <button className="btn btn-success w-100 py-2 fw-semibold"
//                   onClick={handleSell} disabled={submitting || cart.length === 0}>
//                   {submitting
//                     ? <><span className="spinner-border spinner-border-sm me-2" />Processing...</>
//                     : <><i className="bi bi-check-circle me-2"></i>Confirm Sale</>
//                   }
//                 </button>
//               </div>
//             </div>

//             {/* Receipt */}
//             {receipt && (
//               <div className="card border-0 shadow-sm">
//                 <div className="card-header bg-success bg-opacity-10 border-0 d-flex justify-content-between align-items-center">
//                   <h6 className="mb-0 text-success fw-bold">
//                     <i className="bi bi-receipt me-2"></i>{receipt.invoiceNumber}
//                   </h6>
//                   <button className="btn btn-sm btn-outline-success" onClick={handlePrint}>
//                     <i className="bi bi-printer me-1"></i>Print
//                   </button>
//                 </div>

//                 {/* Printable Content */}
//                 <div className="card-body" ref={printRef}>
//                   <div className="header" style={{ textAlign: 'center', marginBottom: 12 }}>
//                     <h2 style={{ margin: 0 }}>PharmaCare</h2>
//                     <p style={{ margin: '2px 0', fontSize: 12, color: '#666' }}>Pharmacy Management System</p>
//                     <div className="divider"></div>
//                     <p style={{ margin: '4px 0', fontSize: 12 }}>
//                       <strong>Invoice:</strong> {receipt.invoiceNumber} &nbsp;|&nbsp;
//                       <strong>Date:</strong> {receipt.time}
//                     </p>
//                     <p style={{ margin: '2px 0', fontSize: 12 }}>
//                       <strong>Customer:</strong> {receipt.customerName}
//                       {receipt.customerPhone && ` | ${receipt.customerPhone}`}
//                     </p>
//                     <p style={{ margin: '2px 0', fontSize: 12 }}>
//                       <strong>Payment:</strong> {receipt.paymentMethod.toUpperCase()}
//                     </p>
//                   </div>

//                   <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
//                     <thead>
//                       <tr style={{ background: '#f5f5f5' }}>
//                         <th style={{ border: '1px solid #ddd', padding: '5px 8px' }}>Medicine</th>
//                         <th style={{ border: '1px solid #ddd', padding: '5px 8px' }}>Qty</th>
//                         <th style={{ border: '1px solid #ddd', padding: '5px 8px' }}>Price</th>
//                         <th style={{ border: '1px solid #ddd', padding: '5px 8px' }}>Total</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {receipt.cartItems.map((item, i) => (
//                         <tr key={i}>
//                           <td style={{ border: '1px solid #ddd', padding: '5px 8px' }}>{item.name}</td>
//                           <td style={{ border: '1px solid #ddd', padding: '5px 8px' }}>{item.quantity}</td>
//                           <td style={{ border: '1px solid #ddd', padding: '5px 8px' }}>PKR {item.pricePerUnit}</td>
//                           <td style={{ border: '1px solid #ddd', padding: '5px 8px' }}>PKR {item.total}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                     <tfoot>
//                       <tr>
//                         <td colSpan={3} style={{ border: '1px solid #ddd', padding: '5px 8px', textAlign: 'right' }}>Subtotal</td>
//                         <td style={{ border: '1px solid #ddd', padding: '5px 8px' }}>PKR {receipt.subtotal}</td>
//                       </tr>
//                       {receipt.discountAmount > 0 && (
//                         <tr>
//                           <td colSpan={3} style={{ border: '1px solid #ddd', padding: '5px 8px', textAlign: 'right', color: 'red' }}>
//                             Discount ({receipt.discountType === 'percentage' ? `${receipt.discountValue}%` : `PKR ${receipt.discountValue}`})
//                           </td>
//                           <td style={{ border: '1px solid #ddd', padding: '5px 8px', color: 'red' }}>- PKR {receipt.discountAmount}</td>
//                         </tr>
//                       )}
//                       <tr style={{ fontWeight: 'bold' }}>
//                         <td colSpan={3} style={{ border: '1px solid #ddd', padding: '5px 8px', textAlign: 'right' }}>TOTAL</td>
//                         <td style={{ border: '1px solid #ddd', padding: '5px 8px' }}>PKR {receipt.totalAmount}</td>
//                       </tr>
//                     </tfoot>
//                   </table>
//                   <p style={{ textAlign: 'center', marginTop: 12, fontSize: 11, color: '#888' }}>
//                     Thank you for your purchase!
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }



import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'react-toastify';
import API from './Utitility/api';
import Navbar from './navbar';

export default function Sell() {
  const [medicines, setMedicines] = useState([]);
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [discountType, setDiscountType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [receipt, setReceipt] = useState(null);
  const [showShortcuts, setShowShortcuts] = useState(false);

  const searchRef = useRef();
  const qtyRef = useRef();
  const customerRef = useRef();
  const printRef = useRef();

  const fetchMedicines = async () => {
    try {
      const { data } = await API.get('/medicines');
      setMedicines(data.filter(m => m.quantity > 0 && new Date(m.expiryDate) > new Date()));
    } catch {
      toast.error('Failed to load medicines');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMedicines(); }, []);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleGlobal = (e) => {
      const tag = document.activeElement?.tagName;
      const isTyping = ['INPUT', 'TEXTAREA', 'SELECT'].includes(tag);

      // S = focus search (when not typing elsewhere)
      if (e.key === 's' && !isTyping) {
        e.preventDefault();
        searchRef.current?.focus();
      }
      // C = focus customer name
      if (e.key === 'c' && !isTyping) {
        e.preventDefault();
        customerRef.current?.focus();
      }
      // F = confirm sale
      if (e.key === 'f' && !isTyping) {
        e.preventDefault();
        handleSell();
      }
      // Escape = clear search
      if (e.key === 'Escape') {
        setSearchQuery('');
        setSearchResults([]);
      }
    };
    window.addEventListener('keydown', handleGlobal);
    return () => window.removeEventListener('keydown', handleGlobal);
  }, [cart, customerName, discountType, discountValue, paymentMethod]);

  // Search medicines
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSelectedIndex(0);
      return;
    }
    const q = searchQuery.toLowerCase();
    const results = medicines.filter(m =>
      m.name.toLowerCase().includes(q) ||
      m.batchNumber.toLowerCase().includes(q)
    ).slice(0, 8);
    setSearchResults(results);
    setSelectedIndex(0);
  }, [searchQuery, medicines]);

  const addToCartById = (med, quantity) => {
    const numQty = Number(quantity) || 1;
    if (numQty < 1 || numQty > med.quantity) {
      toast.warn(`Max stock: ${med.quantity}`);
      return;
    }
    const existing = cart.find(c => c.medicineId === med._id);
    if (existing) {
      const newQty = existing.quantity + numQty;
      if (newQty > med.quantity) { toast.warn(`Max stock: ${med.quantity}`); return; }
      setCart(cart.map(c => c.medicineId === med._id
        ? { ...c, quantity: newQty, total: newQty * med.price }
        : c
      ));
    } else {
      setCart(prev => [...prev, {
        medicineId: med._id,
        name: med.name,
        quantity: numQty,
        pricePerUnit: med.price,
        tpPrice: med.tpPrice,
        total: numQty * med.price
      }]);
    }
    setSearchQuery('');
    setSearchResults([]);
    setQty(1);
    toast.success(`${med.name} added`, { autoClose: 800 });
    // refocus search for next item
    setTimeout(() => searchRef.current?.focus(), 50);
  };

  // Handle keyboard in search box
  const handleSearchKeyDown = (e) => {
    if (searchResults.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, searchResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const med = searchResults[selectedIndex];
      if (med) {
        // Move focus to qty, then user presses Enter again to add
        qtyRef.current?.focus();
        qtyRef.current?.select();
        // Store selected med for qty confirm
        setSearchQuery(med.name);
        setSearchResults([med]); // keep only selected
        setSelectedIndex(0);
      }
    } else if (e.key === 'Tab') {
      if (searchResults[selectedIndex]) {
        e.preventDefault();
        qtyRef.current?.focus();
        qtyRef.current?.select();
        setSearchQuery(searchResults[selectedIndex].name);
        setSearchResults([searchResults[selectedIndex]]);
        setSelectedIndex(0);
      }
    }
  };

  // Handle keyboard in qty box
  const handleQtyKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const med = searchResults[0] || medicines.find(m => m.name === searchQuery);
      if (med) addToCartById(med, qty);
    }
    if (e.key === 'Escape') {
      setSearchQuery('');
      setSearchResults([]);
      searchRef.current?.focus();
    }
  };

  const removeFromCart = (id) => setCart(cart.filter(c => c.medicineId !== id));

  const updateCartQty = (id, newQty) => {
    const med = medicines.find(m => m._id === id);
    const num = Number(newQty);
    if (!med || num < 1 || num > med.quantity) return;
    setCart(cart.map(c => c.medicineId === id
      ? { ...c, quantity: num, total: num * c.pricePerUnit }
      : c
    ));
  };

  const subtotal = cart.reduce((s, c) => s + c.total, 0);
  const discountAmount = (() => {
    const v = Number(discountValue) || 0;
    if (discountType === 'percentage') return parseFloat(((subtotal * v) / 100).toFixed(2));
    return Math.min(v, subtotal);
  })();
  const totalAmount = parseFloat((subtotal - discountAmount).toFixed(2));

  const handleSell = useCallback(async () => {
    if (cart.length === 0) return toast.warn('Cart is empty');
    setSubmitting(true);
    try {
      const { data } = await API.post('/sales', {
        items: cart.map(c => ({ medicineId: c.medicineId, quantity: c.quantity })),
        customerName: customerName || 'Walk-in Customer',
        customerPhone,
        discountType,
        discountValue: Number(discountValue) || 0,
        paymentMethod
      });
      toast.success(`Invoice: ${data.invoiceNumber}`);
      setReceipt({
        ...data,
        cartItems: [...cart],
        subtotal,
        discountAmount,
        totalAmount,
        discountType,
        discountValue: Number(discountValue) || 0,
        paymentMethod,
        customerName: customerName || 'Walk-in Customer',
        customerPhone,
        time: new Date().toLocaleString()
      });
      setCart([]);
      setCustomerName('');
      setCustomerPhone('');
      setDiscountValue(0);
      setPaymentMethod('cash');
      fetchMedicines();
      setTimeout(() => searchRef.current?.focus(), 100);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Sale failed');
    } finally {
      setSubmitting(false);
    }
  }, [cart, customerName, customerPhone, discountType, discountValue, paymentMethod, subtotal, discountAmount, totalAmount]);

  const handlePrint = () => {
    const content = printRef.current.innerHTML;
    const win = window.open('', '_blank');
    win.document.write(`
      <html>
        <head>
          <title>Invoice ${receipt?.invoiceNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; font-size: 13px; }
            table { width: 100%; border-collapse: collapse; margin: 10px 0; }
            th, td { border: 1px solid #ddd; padding: 6px 10px; text-align: left; }
            th { background: #f5f5f5; }
            .text-right { text-align: right; }
            .header { text-align: center; margin-bottom: 16px; }
            .divider { border-top: 1px dashed #999; margin: 10px 0; }
            @media print { button { display: none !important; } }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  return (
    <>
      <Navbar />
      <div className="container-fluid py-3 px-4">

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold mb-0">
            <i className="bi bi-cart-plus me-2 text-primary"></i>Sell Medicine
          </h4>
          <button className="btn btn-sm btn-outline-secondary" onClick={() => setShowShortcuts(!showShortcuts)}>
            <i className="bi bi-keyboard me-1"></i>Shortcuts
          </button>
        </div>

        {/* Shortcuts Panel */}
        {showShortcuts && (
          <div className="alert alert-info py-2 mb-3">
            <div className="row g-2 small">
              <div className="col-auto"><kbd>S</kbd> Focus Search</div>
              <div className="col-auto"><kbd>C</kbd> Customer Name</div>
              <div className="col-auto"><kbd>↑↓</kbd> Navigate Results</div>
              <div className="col-auto"><kbd>Enter</kbd> Select / Add to Cart</div>
              <div className="col-auto"><kbd>Tab</kbd> Search → Qty</div>
              <div className="col-auto"><kbd>F</kbd> Confirm Sale</div>
              <div className="col-auto"><kbd>Esc</kbd> Clear Search</div>
            </div>
          </div>
        )}

        <div className="row g-3">
          {/* LEFT COLUMN */}
          <div className="col-lg-8">

            {/* Customer Row */}
            <div className="card border-0 shadow-sm mb-3">
              <div className="card-body py-2">
                <div className="row g-2 align-items-center">
                  <div className="col-auto text-muted small fw-semibold" style={{ minWidth: 80 }}>
                    <i className="bi bi-person me-1"></i>Customer
                  </div>
                  <div className="col-md-4">
                    <input
                      ref={customerRef}
                      className="form-control form-control-sm"
                      placeholder="Name (optional) [C]"
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && searchRef.current?.focus()}
                    />
                  </div>
                  <div className="col-md-3">
                    <input
                      className="form-control form-control-sm"
                      placeholder="Phone (optional)"
                      value={customerPhone}
                      onChange={e => setCustomerPhone(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && searchRef.current?.focus()}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SEARCH BAR — main focus point */}
            <div className="card border-0 shadow-sm mb-3">
              <div className="card-body pb-2">
                <div className="row g-2 align-items-end">
                  {/* Search input */}
                  <div className="col">
                    <label className="form-label fw-semibold small mb-1">
                      <i className="bi bi-search me-1 text-primary"></i>
                      Search Medicine <span className="badge bg-primary ms-1">S</span>
                    </label>
                    <div className="position-relative">
                      <input
                        ref={searchRef}
                        type="text"
                        className="form-control"
                        placeholder="Type medicine name or batch number..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearchKeyDown}
                        autoComplete="off"
                        autoFocus
                      />
                      {loading && (
                        <span className="position-absolute end-0 top-50 translate-middle-y me-3">
                          <span className="spinner-border spinner-border-sm text-muted" />
                        </span>
                      )}

                      {/* Dropdown Results */}
                      {searchResults.length > 0 && (
                        <div className="position-absolute w-100 bg-white border rounded shadow-lg mt-1"
                          style={{ zIndex: 1000, maxHeight: 280, overflowY: 'auto' }}>
                          {searchResults.map((med, idx) => (
                            <div
                              key={med._id}
                              className={`px-3 py-2 d-flex justify-content-between align-items-center ${idx === selectedIndex ? 'bg-primary text-white' : 'border-bottom'}`}
                              style={{ cursor: 'pointer' }}
                              onMouseEnter={() => setSelectedIndex(idx)}
                              onClick={() => {
                                setSearchQuery(med.name);
                                setSearchResults([med]);
                                setSelectedIndex(0);
                                qtyRef.current?.focus();
                                qtyRef.current?.select();
                              }}
                            >
                              <div>
                                <div className="fw-semibold">{med.name}</div>
                                <div className={`small ${idx === selectedIndex ? 'text-white-50' : 'text-muted'}`}>
                                  Batch: {med.batchNumber} &nbsp;|&nbsp; PKR {med.price}
                                </div>
                              </div>
                              <div className="text-end">
                                <span className={`badge ${med.quantity <= med.lowStockThreshold ? 'bg-warning text-dark' : idx === selectedIndex ? 'bg-white text-primary' : 'bg-success'}`}>
                                  Stock: {med.quantity}
                                </span>
                              </div>
                            </div>
                          ))}
                          <div className="px-3 py-1 text-muted small bg-light border-top">
                            <kbd>↑↓</kbd> navigate &nbsp; <kbd>Enter</kbd> select &nbsp; <kbd>Tab</kbd> go to qty
                          </div>
                        </div>
                      )}

                      {/* No results */}
                      {searchQuery && searchResults.length === 0 && !loading && (
                        <div className="position-absolute w-100 bg-white border rounded shadow-sm mt-1 px-3 py-2 text-muted small" style={{ zIndex: 1000 }}>
                          No medicine found for "{searchQuery}"
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Qty */}
                  <div className="col-auto" style={{ width: 110 }}>
                    <label className="form-label fw-semibold small mb-1">Qty</label>
                    <input
                      ref={qtyRef}
                      type="number"
                      className="form-control"
                      min="1"
                      value={qty}
                      onChange={e => setQty(e.target.value)}
                      onKeyDown={handleQtyKeyDown}
                    />
                  </div>

                  {/* Add button */}
                  <div className="col-auto">
                    <label className="form-label small mb-1 d-block invisible">Add</label>
                    <button className="btn btn-primary px-3"
                      onClick={() => {
                        const med = searchResults[0] || medicines.find(m => m.name === searchQuery);
                        if (med) addToCartById(med, qty);
                        else toast.warn('Select a medicine from the list');
                      }}>
                      <i className="bi bi-plus-lg me-1"></i>Add
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Cart Table */}
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 pt-3 pb-0 d-flex justify-content-between">
                <h6 className="fw-bold mb-0">
                  <i className="bi bi-cart me-2 text-primary"></i>
                  Cart ({cart.length} item{cart.length !== 1 ? 's' : ''})
                </h6>
                {cart.length > 0 && (
                  <button className="btn btn-sm btn-outline-danger" onClick={() => setCart([])}>
                    <i className="bi bi-trash me-1"></i>Clear All
                  </button>
                )}
              </div>
              <div className="card-body p-0">
                {cart.length === 0 ? (
                  <div className="text-center py-4 text-muted">
                    <i className="bi bi-cart-x fs-2 d-block mb-2"></i>
                    Press <kbd>S</kbd> and search for a medicine to begin
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>#</th>
                          <th>Medicine</th>
                          <th>Price</th>
                          <th>Qty</th>
                          <th>Total</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {cart.map((item, idx) => (
                          <tr key={item.medicineId}>
                            <td className="text-muted small">{idx + 1}</td>
                            <td className="fw-semibold">{item.name}</td>
                            <td className="text-muted">PKR {item.pricePerUnit}</td>
                            <td style={{ width: 100 }}>
                              <input
                                type="number"
                                className="form-control form-control-sm"
                                min="1"
                                value={item.quantity}
                                onChange={e => updateCartQty(item.medicineId, e.target.value)}
                              />
                            </td>
                            <td className="fw-bold text-success">PKR {item.total.toLocaleString()}</td>
                            <td>
                              <button className="btn btn-sm btn-outline-danger"
                                onClick={() => removeFromCart(item.medicineId)}>
                                <i className="bi bi-x-lg"></i>
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

          {/* RIGHT COLUMN */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm mb-3">
              <div className="card-body">
                <h6 className="fw-bold mb-3">Payment</h6>

                {/* Payment Method */}
                <div className="mb-3">
                  <label className="form-label fw-semibold small">Method</label>
                  <div className="d-flex gap-1">
                    {['cash', 'credit', 'online'].map(m => (
                      <button key={m} type="button"
                        className={`btn btn-sm flex-fill ${paymentMethod === m ? 'btn-primary' : 'btn-outline-secondary'}`}
                        onClick={() => setPaymentMethod(m)}>
                        <i className={`bi me-1 ${m === 'cash' ? 'bi-cash' : m === 'credit' ? 'bi-credit-card' : 'bi-phone'}`}></i>
                        {m.charAt(0).toUpperCase() + m.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Discount */}
                <div className="mb-3">
                  <label className="form-label fw-semibold small">Discount</label>
                  <div className="input-group input-group-sm">
                    <select className="form-select" style={{ maxWidth: 120 }}
                      value={discountType} onChange={e => setDiscountType(e.target.value)}>
                      <option value="percentage">% Percent</option>
                      <option value="fixed">PKR Fixed</option>
                    </select>
                    <input type="number" className="form-control" min="0"
                      placeholder={discountType === 'percentage' ? '0–100' : '0'}
                      value={discountValue}
                      onChange={e => setDiscountValue(e.target.value)} />
                  </div>
                </div>

                <hr className="my-2" />

                {/* Totals */}
                <div className="d-flex justify-content-between mb-1 small">
                  <span className="text-muted">Subtotal</span>
                  <span>PKR {subtotal.toLocaleString()}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="d-flex justify-content-between mb-1 small text-danger">
                    <span>Discount ({discountType === 'percentage' ? `${discountValue}%` : `PKR ${discountValue}`})</span>
                    <span>- PKR {discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="d-flex justify-content-between mt-2 mb-3">
                  <span className="fw-bold fs-5">Total</span>
                  <span className="fw-bold fs-5 text-primary">PKR {totalAmount.toLocaleString()}</span>
                </div>

                <button
                  className="btn btn-success w-100 py-2 fw-bold"
                  onClick={handleSell}
                  disabled={submitting || cart.length === 0}
                >
                  {submitting
                    ? <><span className="spinner-border spinner-border-sm me-2" />Processing...</>
                    : <><i className="bi bi-check-circle me-2"></i>Confirm Sale <kbd className="ms-2 bg-white text-success">F</kbd></>
                  }
                </button>
              </div>
            </div>

            {/* Receipt */}
            {receipt && (
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-success bg-opacity-10 border-0 d-flex justify-content-between align-items-center">
                  <h6 className="mb-0 text-success fw-bold">
                    <i className="bi bi-receipt me-2"></i>{receipt.invoiceNumber}
                  </h6>
                  <button className="btn btn-sm btn-success" onClick={handlePrint}>
                    <i className="bi bi-printer me-1"></i>Print
                  </button>
                </div>
                <div className="card-body" ref={printRef}>
                  <div className="header" style={{ textAlign: 'center', marginBottom: 12 }}>
                    <h2 style={{ margin: 0 }}>PharmaCare</h2>
                    <p style={{ margin: '2px 0', fontSize: 12, color: '#666' }}>Pharmacy Management System</p>
                    <div style={{ borderTop: '1px dashed #999', margin: '8px 0' }}></div>
                    <p style={{ margin: '4px 0', fontSize: 12 }}>
                      <strong>Invoice:</strong> {receipt.invoiceNumber} &nbsp;|&nbsp;
                      <strong>Date:</strong> {receipt.time}
                    </p>
                    <p style={{ margin: '2px 0', fontSize: 12 }}>
                      <strong>Customer:</strong> {receipt.customerName}
                      {receipt.customerPhone && ` | ${receipt.customerPhone}`}
                    </p>
                    <p style={{ margin: '2px 0', fontSize: 12 }}>
                      <strong>Payment:</strong> {receipt.paymentMethod?.toUpperCase()}
                    </p>
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                    <thead>
                      <tr style={{ background: '#f5f5f5' }}>
                        <th style={{ border: '1px solid #ddd', padding: '5px 8px' }}>Medicine</th>
                        <th style={{ border: '1px solid #ddd', padding: '5px 8px' }}>Qty</th>
                        <th style={{ border: '1px solid #ddd', padding: '5px 8px' }}>Price</th>
                        <th style={{ border: '1px solid #ddd', padding: '5px 8px' }}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {receipt.cartItems.map((item, i) => (
                        <tr key={i}>
                          <td style={{ border: '1px solid #ddd', padding: '5px 8px' }}>{item.name}</td>
                          <td style={{ border: '1px solid #ddd', padding: '5px 8px' }}>{item.quantity}</td>
                          <td style={{ border: '1px solid #ddd', padding: '5px 8px' }}>PKR {item.pricePerUnit}</td>
                          <td style={{ border: '1px solid #ddd', padding: '5px 8px' }}>PKR {item.total}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={3} style={{ border: '1px solid #ddd', padding: '5px 8px', textAlign: 'right' }}>Subtotal</td>
                        <td style={{ border: '1px solid #ddd', padding: '5px 8px' }}>PKR {receipt.subtotal}</td>
                      </tr>
                      {receipt.discountAmount > 0 && (
                        <tr>
                          <td colSpan={3} style={{ border: '1px solid #ddd', padding: '5px 8px', textAlign: 'right', color: 'red' }}>
                            Discount ({receipt.discountType === 'percentage' ? `${receipt.discountValue}%` : `PKR ${receipt.discountValue}`})
                          </td>
                          <td style={{ border: '1px solid #ddd', padding: '5px 8px', color: 'red' }}>- PKR {receipt.discountAmount}</td>
                        </tr>
                      )}
                      <tr style={{ fontWeight: 'bold' }}>
                        <td colSpan={3} style={{ border: '1px solid #ddd', padding: '5px 8px', textAlign: 'right' }}>TOTAL</td>
                        <td style={{ border: '1px solid #ddd', padding: '5px 8px' }}>PKR {receipt.totalAmount}</td>
                      </tr>
                    </tfoot>
                  </table>
                  <p style={{ textAlign: 'center', marginTop: 12, fontSize: 11, color: '#888' }}>
                    Thank you for your purchase!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}