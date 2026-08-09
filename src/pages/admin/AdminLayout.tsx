import { Navigate, NavLink, Outlet } from 'react-router-dom'
import { isAdminLoggedIn, logoutAdmin } from '../../lib/portfolioStore'
import '../../App.css'
import './admin.css'

export default function AdminLayout() {
  if (!isAdminLoggedIn()) {
    return <Navigate to="/admin/login" replace />
  }

  return (
    <div className="admin-shell admin-app">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <img src="/logo-karsa.jpeg" alt="" />
          <div>
            <strong>KARSA DIGITAL</strong>
            <span>Backend Panel</span>
          </div>
        </div>

        <p className="admin-nav-label">Menu</p>
        <nav className="admin-nav">
          <NavLink to="/admin/portfolio" className={({ isActive }) => (isActive ? 'active' : '')}>
            <i className="admin-nav-icon" aria-hidden="true" />
            Portfolio
          </NavLink>
        </nav>

        <div className="admin-sidebar-foot">
          <a href="/" className="admin-btn admin-btn-soft">
            Lihat Website
          </a>
          <button
            type="button"
            className="admin-btn admin-btn-danger"
            onClick={() => {
              logoutAdmin()
              window.location.href = '/admin/login'
            }}
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}
