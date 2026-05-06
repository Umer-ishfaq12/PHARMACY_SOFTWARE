import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API from './Utitility/api';
import Navbar from './navbar';

export default function Dashboard() {
  const [medStats, setMedStats] = useState(null);
  const [saleStats, setSaleStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const [medRes, saleRes] = await Promise.all([
        API.get('/medicines/stats'),
        API.get('/sales/stats')
      ]);
      setMedStats(medRes.data);
      setSaleStats(saleRes.data);
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading) return (
    <>
      <Navbar />
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <div className="spinner-border text-primary" />
      </div>
    </>
  );

  return (
    <>
      <Navbar />
      <div className="container-fluid py-4 px-4">
        <h4 className="fw-bold mb-4"><i className="bi bi-speedometer2 me-2 text-primary"></i>Dashboard</h4>

        {/* Alert Banners */}
        {medStats?.lowStock?.length > 0 && (
          <div className="alert alert-warning d-flex align-items-center mb-3">
            <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
            <span><strong>{medStats.lowStock.length} medicine(s)</strong> are low on stock: {medStats.lowStock.map(m => m.name).join(', ')}</span>
          </div>
        )}
        {medStats?.expired?.length > 0 && (
          <div className="alert alert-danger d-flex align-items-center mb-3">
            <i className="bi bi-x-octagon-fill me-2 fs-5"></i>
            <span><strong>{medStats.expired.length} medicine(s)</strong> have expired: {medStats.expired.map(m => m.name).join(', ')}</span>
          </div>
        )}
        {medStats?.expiringSoon?.length > 0 && (
          <div className="alert alert-info d-flex align-items-center mb-3">
            <i className="bi bi-clock-fill me-2 fs-5"></i>
            <span><strong>{medStats.expiringSoon.length} medicine(s)</strong> expiring within 30 days: {medStats.expiringSoon.map(m => m.name).join(', ')}</span>
          </div>
        )}

        {/* Stat Cards */}
        <div className="row g-3 mb-4">
          <div className="col-sm-6 col-xl-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body d-flex align-items-center gap-3">
                <div className="rounded-3 bg-primary bg-opacity-10 p-3">
                  <i className="bi bi-capsule fs-3 text-primary"></i>
                </div>
                <div>
                  <div className="text-muted small">Total Medicines</div>
                  <div className="fs-3 fw-bold">{medStats?.total || 0}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body d-flex align-items-center gap-3">
                <div className="rounded-3 bg-success bg-opacity-10 p-3">
                  <i className="bi bi-currency-dollar fs-3 text-success"></i>
                </div>
                <div>
                  <div className="text-muted small">Today's Revenue</div>
                  <div className="fs-3 fw-bold">PKR {saleStats?.todayRevenue?.toLocaleString() || 0}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body d-flex align-items-center gap-3">
                <div className="rounded-3 bg-warning bg-opacity-10 p-3">
                  <i className="bi bi-cart-check fs-3 text-warning"></i>
                </div>
                <div>
                  <div className="text-muted small">Today's Sales</div>
                  <div className="fs-3 fw-bold">{saleStats?.todaySalesCount || 0}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body d-flex align-items-center gap-3">
                <div className="rounded-3 bg-info bg-opacity-10 p-3">
                  <i className="bi bi-graph-up-arrow fs-3 text-info"></i>
                </div>
                <div>
                  <div className="text-muted small">Total Revenue</div>
                  <div className="fs-3 fw-bold">PKR {saleStats?.totalRevenue?.toLocaleString() || 0}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Low Stock Table */}
        {medStats?.lowStock?.length > 0 && (
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-warning bg-opacity-10 border-0">
              <h6 className="mb-0 text-warning fw-bold"><i className="bi bi-exclamation-triangle me-2"></i>Low Stock Medicines</h6>
            </div>
            <div className="card-body p-0">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Medicine</th>
                    <th>Batch</th>
                    <th>Current Stock</th>
                    <th>Threshold</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {medStats.lowStock.map(m => (
                    <tr key={m._id}>
                      <td className="fw-semibold">{m.name}</td>
                      <td><span className="badge bg-secondary">{m.batchNumber}</span></td>
                      <td>{m.quantity}</td>
                      <td>{m.lowStockThreshold}</td>
                      <td><span className="badge bg-warning text-dark">Low Stock</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Expired Table */}
        {medStats?.expired?.length > 0 && (
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-danger bg-opacity-10 border-0">
              <h6 className="mb-0 text-danger fw-bold"><i className="bi bi-x-octagon me-2"></i>Expired Medicines</h6>
            </div>
            <div className="card-body p-0">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr><th>Medicine</th><th>Batch</th><th>Expiry Date</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {medStats.expired.map(m => (
                    <tr key={m._id}>
                      <td className="fw-semibold">{m.name}</td>
                      <td><span className="badge bg-secondary">{m.batchNumber}</span></td>
                      <td>{new Date(m.expiryDate).toLocaleDateString()}</td>
                      <td><span className="badge bg-danger">Expired</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}