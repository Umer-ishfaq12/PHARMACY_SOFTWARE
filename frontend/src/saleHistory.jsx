


// import { useState, useEffect } from 'react';
// import { toast } from 'react-toastify';
// import API from './Utitility/api';
// import Navbar from './navbar';

// export default function Sales() {
//   const [sales, setSales] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState('');
//   const [expanded, setExpanded] = useState(null);
//   const [filter, setFilter] = useState('all');
//   const [returning, setReturning] = useState(null);
//   const [returnReason, setReturnReason] = useState('');
//   const [report, setReport] = useState(null);
//   const [reportType, setReportType] = useState('daily');
//   const [reportMonth, setReportMonth] = useState(new Date().getMonth() + 1);
//   const [reportYear, setReportYear] = useState(new Date().getFullYear());
//   const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
//   const [activeView, setActiveView] = useState('sales'); // sales | report

//   const fetchSales = async () => {
//     try {
//       const { data } = await API.get('/sales');
//       setSales(data);
//     } catch {
//       toast.error('Failed to load sales');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchSales(); }, []);

//   const fetchReport = async () => {
//     try {
//       let url = reportType === 'daily'
//         ? `/sales/report/daily?date=${reportDate}`
//         : `/sales/report/monthly?year=${reportYear}&month=${reportMonth}`;
//       const { data } = await API.get(url);
//       setReport(data);
//     } catch {
//       toast.error('Failed to load report');
//     }
//   };

//   const handleReturn = async (saleId) => {
//     try {
//       await API.post(`/sales/${saleId}/return`, { returnReason });
//       toast.success('Sale returned, stock restored');
//       setReturning(null);
//       setReturnReason('');
//       fetchSales();
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Return failed');
//     }
//   };

//   const todayStart = new Date();
//   todayStart.setHours(0, 0, 0, 0);

//   const filtered = sales.filter(s => {
//     const matchSearch =
//       s.customerName?.toLowerCase().includes(search.toLowerCase()) ||
//       s.invoiceNumber?.toLowerCase().includes(search.toLowerCase()) ||
//       s.items?.some(i => i.medicineName?.toLowerCase().includes(search.toLowerCase()));
//     const matchFilter =
//       filter === 'all' ? true :
//       filter === 'today' ? new Date(s.createdAt) >= todayStart :
//       filter === 'returned' ? s.status === 'returned' :
//       s.status === 'completed';
//     return matchSearch && matchFilter;
//   });

//   const totalRevenue = filtered.filter(s => s.status === 'completed').reduce((s, x) => s + x.totalAmount, 0);
//   const totalProfit = filtered.filter(s => s.status === 'completed').reduce((s, x) => s + x.totalProfit, 0);

//   const paymentIcon = (m) => m === 'cash' ? 'bi-cash' : m === 'credit' ? 'bi-credit-card' : 'bi-phone';

//   const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

//   return (
//     <>
//       <Navbar />
//       <div className="container-fluid py-4 px-4">
//         <div className="d-flex justify-content-between align-items-center mb-4">
//           <h4 className="fw-bold mb-0">
//             <i className="bi bi-receipt me-2 text-primary"></i>Sales
//           </h4>
//           <div className="btn-group">
//             <button className={`btn ${activeView === 'sales' ? 'btn-primary' : 'btn-outline-primary'}`}
//               onClick={() => setActiveView('sales')}>
//               <i className="bi bi-list-ul me-1"></i>Sales History
//             </button>
//             <button className={`btn ${activeView === 'report' ? 'btn-primary' : 'btn-outline-primary'}`}
//               onClick={() => setActiveView('report')}>
//               <i className="bi bi-bar-chart me-1"></i>Reports
//             </button>
//           </div>
//         </div>

//         {activeView === 'sales' && (
//           <>
//             {/* Summary Cards */}
//             <div className="row g-3 mb-4">
//               <div className="col-sm-3">
//                 <div className="card border-0 shadow-sm h-100">
//                   <div className="card-body d-flex align-items-center gap-3">
//                     <div className="rounded-3 bg-primary bg-opacity-10 p-3">
//                       <i className="bi bi-receipt fs-3 text-primary"></i>
//                     </div>
//                     <div>
//                       <div className="text-muted small">Sales</div>
//                       <div className="fs-3 fw-bold">{filtered.filter(s => s.status === 'completed').length}</div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="col-sm-3">
//                 <div className="card border-0 shadow-sm h-100">
//                   <div className="card-body d-flex align-items-center gap-3">
//                     <div className="rounded-3 bg-success bg-opacity-10 p-3">
//                       <i className="bi bi-cash-stack fs-3 text-success"></i>
//                     </div>
//                     <div>
//                       <div className="text-muted small">Revenue</div>
//                       <div className="fs-4 fw-bold">PKR {totalRevenue.toLocaleString()}</div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="col-sm-3">
//                 <div className="card border-0 shadow-sm h-100">
//                   <div className="card-body d-flex align-items-center gap-3">
//                     <div className="rounded-3 bg-warning bg-opacity-10 p-3">
//                       <i className="bi bi-graph-up fs-3 text-warning"></i>
//                     </div>
//                     <div>
//                       <div className="text-muted small">Profit</div>
//                       <div className="fs-4 fw-bold text-success">PKR {totalProfit.toLocaleString()}</div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="col-sm-3">
//                 <div className="card border-0 shadow-sm h-100">
//                   <div className="card-body d-flex align-items-center gap-3">
//                     <div className="rounded-3 bg-danger bg-opacity-10 p-3">
//                       <i className="bi bi-arrow-return-left fs-3 text-danger"></i>
//                     </div>
//                     <div>
//                       <div className="text-muted small">Returns</div>
//                       <div className="fs-3 fw-bold">{sales.filter(s => s.status === 'returned').length}</div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Filters */}
//             <div className="d-flex gap-2 mb-3 flex-wrap align-items-center">
//               <input type="text" className="form-control" placeholder="Search invoice, customer, medicine..."
//                 value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 320 }} />
//               <div className="btn-group">
//                 {['all', 'today', 'completed', 'returned'].map(f => (
//                   <button key={f}
//                     className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline-primary'}`}
//                     onClick={() => setFilter(f)}>
//                     {f.charAt(0).toUpperCase() + f.slice(1)}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Table */}
//             <div className="card border-0 shadow-sm">
//               <div className="card-body p-0">
//                 {loading ? (
//                   <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
//                 ) : filtered.length === 0 ? (
//                   <div className="text-center py-5 text-muted">
//                     <i className="bi bi-inbox fs-1 d-block mb-2"></i>No sales found
//                   </div>
//                 ) : (
//                   <div className="table-responsive">
//                     <table className="table table-hover align-middle mb-0">
//                       <thead className="table-light">
//                         <tr>
//                           <th style={{ width: 32 }}></th>
//                           <th>Invoice</th>
//                           <th>Customer</th>
//                           <th>Payment</th>
//                           <th>Discount</th>
//                           <th>Total</th>
//                           <th>Profit</th>
//                           <th>Status</th>
//                           <th>Date</th>
//                           <th>Action</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {filtered.map(sale => (
//                           <>
//                             <tr key={sale._id} style={{ cursor: 'pointer' }}
//                               onClick={() => setExpanded(expanded === sale._id ? null : sale._id)}>
//                               <td>
//                                 <i className={`bi bi-chevron-${expanded === sale._id ? 'down' : 'right'} text-muted`}></i>
//                               </td>
//                               <td><span className="badge bg-primary">{sale.invoiceNumber}</span></td>
//                               <td className="fw-semibold">
//                                 {sale.customerName}
//                                 {sale.customerPhone && <div className="text-muted small">{sale.customerPhone}</div>}
//                               </td>
//                               <td>
//                                 <i className={`bi ${paymentIcon(sale.paymentMethod)} me-1`}></i>
//                                 {sale.paymentMethod}
//                               </td>
//                               <td>
//                                 {sale.discountAmount > 0
//                                   ? <span className="text-danger small">-PKR {sale.discountAmount}</span>
//                                   : <span className="text-muted small">None</span>}
//                               </td>
//                               <td className="fw-bold">PKR {sale.totalAmount?.toLocaleString()}</td>
//                               <td className="fw-bold text-success">PKR {sale.totalProfit?.toLocaleString()}</td>
//                               <td>
//                                 <span className={`badge ${sale.status === 'completed' ? 'bg-success' : 'bg-danger'}`}>
//                                   {sale.status}
//                                 </span>
//                               </td>
//                               <td className="text-muted small">{new Date(sale.createdAt).toLocaleString()}</td>
//                               <td onClick={e => e.stopPropagation()}>
//                                 {sale.status === 'completed' && (
//                                   <button className="btn btn-sm btn-outline-danger"
//                                     onClick={() => setReturning(sale._id)}>
//                                     <i className="bi bi-arrow-return-left"></i>
//                                   </button>
//                                 )}
//                               </td>
//                             </tr>

//                             {expanded === sale._id && (
//                               <tr key={`${sale._id}-exp`} className="table-light">
//                                 <td colSpan={10} className="p-0">
//                                   <div className="p-3">
//                                     <p className="fw-semibold mb-2 text-primary small">
//                                       <i className="bi bi-list-ul me-2"></i>Sale Breakdown
//                                     </p>
//                                     <table className="table table-sm table-bordered mb-0 bg-white">
//                                       <thead>
//                                         <tr>
//                                           <th>Medicine</th>
//                                           <th>Qty</th>
//                                           <th>Price/Unit</th>
//                                           <th>Total</th>
//                                           <th>Profit</th>
//                                         </tr>
//                                       </thead>
//                                       <tbody>
//                                         {sale.items.map((item, i) => (
//                                           <tr key={i}>
//                                             <td>{item.medicineName}</td>
//                                             <td>{item.quantity}</td>
//                                             <td>PKR {item.pricePerUnit}</td>
//                                             <td>PKR {item.total?.toLocaleString()}</td>
//                                             <td className="text-success fw-semibold">PKR {item.profit?.toLocaleString()}</td>
//                                           </tr>
//                                         ))}
//                                         {sale.discountAmount > 0 && (
//                                           <tr>
//                                             <td colSpan={4} className="text-end text-danger">
//                                               Discount ({sale.discountType === 'percentage' ? `${sale.discountValue}%` : `PKR ${sale.discountValue}`})
//                                             </td>
//                                             <td className="text-danger">- PKR {sale.discountAmount}</td>
//                                           </tr>
//                                         )}
//                                         <tr className="table-success">
//                                           <td colSpan={3} className="text-end fw-bold">Grand Total</td>
//                                           <td className="fw-bold">PKR {sale.totalAmount?.toLocaleString()}</td>
//                                           <td className="fw-bold text-success">PKR {sale.totalProfit?.toLocaleString()}</td>
//                                         </tr>
//                                       </tbody>
//                                     </table>
//                                     {sale.status === 'returned' && sale.returnReason && (
//                                       <div className="alert alert-danger mt-2 py-1 mb-0 small">
//                                         <strong>Return Reason:</strong> {sale.returnReason}
//                                       </div>
//                                     )}
//                                   </div>
//                                 </td>
//                               </tr>
//                             )}
//                           </>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </>
//         )}

//         {/* Reports Tab */}
//         {activeView === 'report' && (
//           <div className="card border-0 shadow-sm">
//             <div className="card-body">
//               <h6 className="fw-bold mb-3"><i className="bi bi-bar-chart me-2 text-primary"></i>Profit Reports</h6>
//               <div className="row g-2 align-items-end mb-4">
//                 <div className="col-auto">
//                   <div className="btn-group">
//                     <button className={`btn ${reportType === 'daily' ? 'btn-primary' : 'btn-outline-primary'}`}
//                       onClick={() => setReportType('daily')}>Daily</button>
//                     <button className={`btn ${reportType === 'monthly' ? 'btn-primary' : 'btn-outline-primary'}`}
//                       onClick={() => setReportType('monthly')}>Monthly</button>
//                   </div>
//                 </div>
//                 {reportType === 'daily' ? (
//                   <div className="col-auto">
//                     <input type="date" className="form-control" value={reportDate}
//                       onChange={e => setReportDate(e.target.value)} />
//                   </div>
//                 ) : (
//                   <>
//                     <div className="col-auto">
//                       <select className="form-select" value={reportMonth} onChange={e => setReportMonth(e.target.value)}>
//                         {months.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
//                       </select>
//                     </div>
//                     <div className="col-auto">
//                       <input type="number" className="form-control" value={reportYear} style={{ width: 100 }}
//                         onChange={e => setReportYear(e.target.value)} />
//                     </div>
//                   </>
//                 )}
//                 <div className="col-auto">
//                   <button className="btn btn-success" onClick={fetchReport}>
//                     <i className="bi bi-search me-1"></i>Generate
//                   </button>
//                 </div>
//               </div>

//               {report && (
//                 <div>
//                   <div className="row g-3 mb-4">
//                     <div className="col-sm-4">
//                       <div className="card bg-primary text-white border-0">
//                         <div className="card-body text-center">
//                           <div className="small opacity-75">Total Sales</div>
//                           <div className="fs-3 fw-bold">{report.count}</div>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="col-sm-4">
//                       <div className="card bg-success text-white border-0">
//                         <div className="card-body text-center">
//                           <div className="small opacity-75">Revenue</div>
//                           <div className="fs-3 fw-bold">PKR {report.revenue?.toLocaleString()}</div>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="col-sm-4">
//                       <div className="card bg-warning text-dark border-0">
//                         <div className="card-body text-center">
//                           <div className="small opacity-75">Net Profit</div>
//                           <div className="fs-3 fw-bold">PKR {report.profit?.toLocaleString()}</div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {reportType === 'monthly' && report.dailyBreakdown && (
//                     <div className="table-responsive">
//                       <table className="table table-bordered table-hover align-middle">
//                         <thead className="table-light">
//                           <tr>
//                             <th>Day</th>
//                             <th>Sales Count</th>
//                             <th>Revenue</th>
//                             <th>Profit</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {Object.entries(report.dailyBreakdown).map(([day, d]) => (
//                             <tr key={day}>
//                               <td>{day} {months[report.month - 1]} {report.year}</td>
//                               <td>{d.count}</td>
//                               <td>PKR {d.revenue?.toLocaleString()}</td>
//                               <td className="text-success fw-semibold">PKR {d.profit?.toLocaleString()}</td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   )}

//                   {reportType === 'daily' && report.sales?.length > 0 && (
//                     <div className="table-responsive">
//                       <table className="table table-bordered table-hover align-middle">
//                         <thead className="table-light">
//                           <tr><th>Invoice</th><th>Customer</th><th>Total</th><th>Profit</th><th>Payment</th></tr>
//                         </thead>
//                         <tbody>
//                           {report.sales.map(s => (
//                             <tr key={s._id}>
//                               <td><span className="badge bg-primary">{s.invoiceNumber}</span></td>
//                               <td>{s.customerName}</td>
//                               <td>PKR {s.totalAmount?.toLocaleString()}</td>
//                               <td className="text-success fw-semibold">PKR {s.totalProfit?.toLocaleString()}</td>
//                               <td>{s.paymentMethod}</td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Return Modal */}
//       {returning && (
//         <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
//           <div className="modal-dialog modal-dialog-centered">
//             <div className="modal-content border-0 shadow">
//               <div className="modal-header">
//                 <h5 className="modal-title fw-bold text-danger">
//                   <i className="bi bi-arrow-return-left me-2"></i>Return Sale
//                 </h5>
//                 <button className="btn-close" onClick={() => setReturning(null)} />
//               </div>
//               <div className="modal-body">
//                 <p className="text-muted">Stock will be restored after return. This cannot be undone.</p>
//                 <label className="form-label fw-semibold">Return Reason</label>
//                 <textarea className="form-control" rows={3} placeholder="e.g. Wrong medicine, customer changed mind..."
//                   value={returnReason} onChange={e => setReturnReason(e.target.value)} />
//               </div>
//               <div className="modal-footer">
//                 <button className="btn btn-light" onClick={() => setReturning(null)}>Cancel</button>
//                 <button className="btn btn-danger" onClick={() => handleReturn(returning)}>
//                   <i className="bi bi-arrow-return-left me-2"></i>Confirm Return
//                 </button>
//               </div>
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

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState('all');
  const [returning, setReturning] = useState(null);
  const [returnReason, setReturnReason] = useState('');
  const [report, setReport] = useState(null);
  const [reportType, setReportType] = useState('daily');
  const [reportMonth, setReportMonth] = useState(new Date().getMonth() + 1);
  const [reportYear, setReportYear] = useState(new Date().getFullYear());
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeView, setActiveView] = useState('sales'); // sales | report

  const fetchSales = async () => {
    try {
      const { data } = await API.get('/sales');
      setSales(data);
    } catch {
      toast.error('Failed to load sales');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSales(); }, []);

  const fetchReport = async () => {
    try {
      let url = reportType === 'daily'
        ? `/sales/report/daily?date=${reportDate}`
        : `/sales/report/monthly?year=${reportYear}&month=${reportMonth}`;
      const { data } = await API.get(url);
      setReport(data);
    } catch {
      toast.error('Failed to load report');
    }
  };

  const handleReturn = async (saleId) => {
    try {
      await API.post(`/sales/${saleId}/return`, { returnReason });
      toast.success('Sale returned, stock restored');
      setReturning(null);
      setReturnReason('');
      fetchSales();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Return failed');
    }
  };

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const filtered = sales.filter(s => {
    const matchSearch =
      s.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      s.invoiceNumber?.toLowerCase().includes(search.toLowerCase()) ||
      s.items?.some(i => i.medicineName?.toLowerCase().includes(search.toLowerCase()));
    const matchFilter =
      filter === 'all' ? true :
      filter === 'today' ? new Date(s.createdAt) >= todayStart :
      filter === 'returned' ? s.status === 'returned' :
      s.status === 'completed';
    return matchSearch && matchFilter;
  });

  const totalRevenue = filtered.filter(s => s.status === 'completed').reduce((s, x) => s + x.totalAmount, 0);
  const totalProfit = filtered.filter(s => s.status === 'completed').reduce((s, x) => s + x.totalProfit, 0);

  const paymentIcon = (m) => m === 'cash' ? 'bi-cash' : m === 'credit' ? 'bi-credit-card' : 'bi-phone';

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  return (
    <>
      <Navbar />
      <div className="container-fluid py-4 px-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold mb-0">
            <i className="bi bi-receipt me-2 text-primary"></i>Sales
          </h4>
          <div className="btn-group">
            <button className={`btn ${activeView === 'sales' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setActiveView('sales')}>
              <i className="bi bi-list-ul me-1"></i>Sales History
            </button>
            <button className={`btn ${activeView === 'report' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setActiveView('report')}>
              <i className="bi bi-bar-chart me-1"></i>Reports
            </button>
          </div>
        </div>

        {activeView === 'sales' && (
          <>
            {/* Summary Cards */}
            <div className="row g-3 mb-4">
              <div className="col-sm-3">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body d-flex align-items-center gap-3">
                    <div className="rounded-3 bg-primary bg-opacity-10 p-3">
                      <i className="bi bi-receipt fs-3 text-primary"></i>
                    </div>
                    <div>
                      <div className="text-muted small">Sales</div>
                      <div className="fs-3 fw-bold">{filtered.filter(s => s.status === 'completed').length}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-3">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body d-flex align-items-center gap-3">
                    <div className="rounded-3 bg-success bg-opacity-10 p-3">
                      <i className="bi bi-cash-stack fs-3 text-success"></i>
                    </div>
                    <div>
                      <div className="text-muted small">Revenue</div>
                      <div className="fs-4 fw-bold">PKR {totalRevenue.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-3">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body d-flex align-items-center gap-3">
                    <div className="rounded-3 bg-warning bg-opacity-10 p-3">
                      <i className="bi bi-graph-up fs-3 text-warning"></i>
                    </div>
                    <div>
                      <div className="text-muted small">Profit</div>
                      <div className="fs-4 fw-bold text-success">PKR {totalProfit.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-3">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body d-flex align-items-center gap-3">
                    <div className="rounded-3 bg-danger bg-opacity-10 p-3">
                      <i className="bi bi-arrow-return-left fs-3 text-danger"></i>
                    </div>
                    <div>
                      <div className="text-muted small">Returns</div>
                      <div className="fs-3 fw-bold">{sales.filter(s => s.status === 'returned').length}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="d-flex gap-2 mb-3 flex-wrap align-items-center">
              <input type="text" className="form-control" placeholder="Search invoice, customer, medicine..."
                value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 320 }} />
              <div className="btn-group">
                {['all', 'today', 'completed', 'returned'].map(f => (
                  <button key={f}
                    className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setFilter(f)}>
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="card border-0 shadow-sm">
              <div className="card-body p-0">
                {loading ? (
                  <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
                ) : filtered.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <i className="bi bi-inbox fs-1 d-block mb-2"></i>No sales found
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th style={{ width: 32 }}></th>
                          <th>Invoice</th>
                          <th>Customer</th>
                          <th>Payment</th>
                          <th>Discount</th>
                          <th>Total</th>
                          <th>Profit</th>
                          <th>Status</th>
                          <th>Date</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map(sale => (
                          <>
                            <tr key={sale._id} style={{ cursor: 'pointer' }}
                              onClick={() => setExpanded(expanded === sale._id ? null : sale._id)}>
                              <td>
                                <i className={`bi bi-chevron-${expanded === sale._id ? 'down' : 'right'} text-muted`}></i>
                              </td>
                              <td><span className="badge bg-primary">{sale.invoiceNumber}</span></td>
                              <td className="fw-semibold">
                                {sale.customerName}
                                {sale.customerPhone && <div className="text-muted small">{sale.customerPhone}</div>}
                              </td>
                              <td>
                                <i className={`bi ${paymentIcon(sale.paymentMethod)} me-1`}></i>
                                {sale.paymentMethod}
                              </td>
                              <td>
                                {sale.discountAmount > 0
                                  ? <span className="text-danger small">-PKR {sale.discountAmount}</span>
                                  : <span className="text-muted small">None</span>}
                              </td>
                              <td className="fw-bold">PKR {sale.totalAmount?.toLocaleString()}</td>
                              <td className="fw-bold text-success">PKR {sale.totalProfit?.toLocaleString()}</td>
                              <td>
                                <span className={`badge ${sale.status === 'completed' ? 'bg-success' : 'bg-danger'}`}>
                                  {sale.status}
                                </span>
                              </td>
                              <td className="text-muted small">{new Date(sale.createdAt).toLocaleString()}</td>
                              <td onClick={e => e.stopPropagation()}>
                                {sale.status === 'completed' && (
                                  <button className="btn btn-sm btn-outline-danger"
                                    onClick={() => setReturning(sale._id)}>
                                    <i className="bi bi-arrow-return-left"></i>
                                  </button>
                                )}
                              </td>
                            </tr>

                            {expanded === sale._id && (
                              <tr key={`${sale._id}-exp`} className="table-light">
                                <td colSpan={10} className="p-0">
                                  <div className="p-3">
                                    <p className="fw-semibold mb-2 text-primary small">
                                      <i className="bi bi-list-ul me-2"></i>Sale Breakdown
                                    </p>
                                    <table className="table table-sm table-bordered mb-0 bg-white">
                                      <thead>
                                        <tr>
                                          <th>Medicine</th>
                                          <th>Qty</th>
                                          <th>Price/Unit</th>
                                          <th>Total</th>
                                          <th>Profit</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {sale.items.map((item, i) => (
                                          <tr key={i}>
                                            <td>{item.medicineName}</td>
                                            <td>{item.quantity}</td>
                                            <td>PKR {item.pricePerUnit}</td>
                                            <td>PKR {item.total?.toLocaleString()}</td>
                                            <td className="text-success fw-semibold">PKR {item.profit?.toLocaleString()}</td>
                                          </tr>
                                        ))}
                                        {sale.discountAmount > 0 && (
                                          <tr>
                                            <td colSpan={4} className="text-end text-danger">
                                              Discount ({sale.discountType === 'percentage' ? `${sale.discountValue}%` : `PKR ${sale.discountValue}`})
                                            </td>
                                            <td className="text-danger">- PKR {sale.discountAmount}</td>
                                          </tr>
                                        )}
                                        <tr className="table-success">
                                          <td colSpan={3} className="text-end fw-bold">Grand Total</td>
                                          <td className="fw-bold">PKR {sale.totalAmount?.toLocaleString()}</td>
                                          <td className="fw-bold text-success">PKR {sale.totalProfit?.toLocaleString()}</td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    {sale.status === 'returned' && sale.returnReason && (
                                      <div className="alert alert-danger mt-2 py-1 mb-0 small">
                                        <strong>Return Reason:</strong> {sale.returnReason}
                                      </div>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )}
                          </>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Reports Tab */}
        {activeView === 'report' && (
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="fw-bold mb-3"><i className="bi bi-bar-chart me-2 text-primary"></i>Profit Reports</h6>
              <div className="row g-2 align-items-end mb-4">
                <div className="col-auto">
                  <div className="btn-group">
                    <button className={`btn ${reportType === 'daily' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setReportType('daily')}>Daily</button>
                    <button className={`btn ${reportType === 'monthly' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setReportType('monthly')}>Monthly</button>
                  </div>
                </div>
                {reportType === 'daily' ? (
                  <div className="col-auto">
                    <input type="date" className="form-control" value={reportDate}
                      onChange={e => setReportDate(e.target.value)} />
                  </div>
                ) : (
                  <>
                    <div className="col-auto">
                      <select className="form-select" value={reportMonth} onChange={e => setReportMonth(e.target.value)}>
                        {months.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                      </select>
                    </div>
                    <div className="col-auto">
                      <input type="number" className="form-control" value={reportYear} style={{ width: 100 }}
                        onChange={e => setReportYear(e.target.value)} />
                    </div>
                  </>
                )}
                <div className="col-auto">
                  <button className="btn btn-success" onClick={fetchReport}>
                    <i className="bi bi-search me-1"></i>Generate
                  </button>
                </div>
              </div>

              {report && (
                <div>
                  <div className="row g-3 mb-4">
                    <div className="col-sm-4">
                      <div className="card bg-primary text-white border-0">
                        <div className="card-body text-center">
                          <div className="small opacity-75">Total Sales</div>
                          <div className="fs-3 fw-bold">{report.count}</div>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-4">
                      <div className="card bg-success text-white border-0">
                        <div className="card-body text-center">
                          <div className="small opacity-75">Revenue</div>
                          <div className="fs-3 fw-bold">PKR {report.revenue?.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-4">
                      <div className="card bg-warning text-dark border-0">
                        <div className="card-body text-center">
                          <div className="small opacity-75">Net Profit</div>
                          <div className="fs-3 fw-bold">PKR {report.profit?.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {reportType === 'monthly' && report.dailyBreakdown && (
                    <div className="table-responsive">
                      <table className="table table-bordered table-hover align-middle">
                        <thead className="table-light">
                          <tr>
                            <th>Day</th>
                            <th>Sales Count</th>
                            <th>Revenue</th>
                            <th>Profit</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(report.dailyBreakdown).map(([day, d]) => (
                            <tr key={day}>
                              <td>{day} {months[report.month - 1]} {report.year}</td>
                              <td>{d.count}</td>
                              <td>PKR {d.revenue?.toLocaleString()}</td>
                              <td className="text-success fw-semibold">PKR {d.profit?.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {reportType === 'daily' && report.sales?.length > 0 && (
                    <div className="table-responsive">
                      <table className="table table-bordered table-hover align-middle">
                        <thead className="table-light">
                          <tr><th>Invoice</th><th>Customer</th><th>Total</th><th>Profit</th><th>Payment</th></tr>
                        </thead>
                        <tbody>
                          {report.sales.map(s => (
                            <tr key={s._id}>
                              <td><span className="badge bg-primary">{s.invoiceNumber}</span></td>
                              <td>{s.customerName}</td>
                              <td>PKR {s.totalAmount?.toLocaleString()}</td>
                              <td className="text-success fw-semibold">PKR {s.totalProfit?.toLocaleString()}</td>
                              <td>{s.paymentMethod}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Return Modal */}
      {returning && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold text-danger">
                  <i className="bi bi-arrow-return-left me-2"></i>Return Sale
                </h5>
                <button className="btn-close" onClick={() => setReturning(null)} />
              </div>
              <div className="modal-body">
                <p className="text-muted">Stock will be restored after return. This cannot be undone.</p>
                <label className="form-label fw-semibold">Return Reason</label>
                <textarea className="form-control" rows={3} placeholder="e.g. Wrong medicine, customer changed mind..."
                  value={returnReason} onChange={e => setReturnReason(e.target.value)} />
              </div>
              <div className="modal-footer">
                <button className="btn btn-light" onClick={() => setReturning(null)}>Cancel</button>
                <button className="btn btn-danger" onClick={() => handleReturn(returning)}>
                  <i className="bi bi-arrow-return-left me-2"></i>Confirm Return
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}