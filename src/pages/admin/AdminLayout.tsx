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
      <aside className="glass admin-sidebar">
        <div className="admin-brand">
          <img src="/logo-karsa.jpeg" alt="" />
          <div>
            <strong>KARSA DIGITAL</strong>
            <span>Backend Panel</span>
          </div>
        </div>

        <nav className="admin-nav">
          <NavLink to="/admin/portfolio" className={({ isActive }) => (isActive ? 'active' : '')}>
            Portfolio
          </NavLink>
        </nav>

        <div className="admin-sidebar-foot">
          <a href="/" className="btn btn-ghost admin-full-btn">
            Lihat Website
          </a>
          <button
            type="button"
            className="btn btn-ghost admin-full-btn"
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
