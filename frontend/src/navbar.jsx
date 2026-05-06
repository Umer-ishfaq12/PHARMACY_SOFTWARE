import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './Authcontext/authContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'nav-link active fw-semibold' : 'nav-link';

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/dashboard">
          <i className="bi bi-capsule me-2"></i>PharmaCare
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className={isActive('/dashboard')} to="/dashboard">
                <i className="bi bi-speedometer2 me-1"></i>Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link className={isActive('/medicines')} to="/medicines">
                <i className="bi bi-capsule me-1"></i>Medicines
              </Link>
            </li>
            <li className="nav-item">
              <Link className={isActive('/sell')} to="/sell">
                <i className="bi bi-cart-plus me-1"></i>Sell
              </Link>
            </li>
            <li className="nav-item">
              <Link className={isActive('/sales')} to="/sales">
                <i className="bi bi-receipt me-1"></i>Sales History
              </Link>
            </li>
          </ul>
          <ul className="navbar-nav">
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                <i className="bi bi-person-circle me-1"></i>{user?.name}
                <span className="badge bg-light text-primary ms-2">{user?.role}</span>
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><button className="dropdown-item text-danger" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-2"></i>Logout
                </button></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}