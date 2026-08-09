import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { isAdminLoggedIn, loginAdmin } from '../../lib/portfolioStore'
import '../../App.css'
import './admin.css'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (isAdminLoggedIn()) {
    return <Navigate to="/admin/portfolio" replace />
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (loginAdmin(password)) {
      navigate('/admin/portfolio', { replace: true })
      return
    }
    setError('Password salah. Coba lagi.')
  }

  return (
    <div className="admin-shell">
      <form className="glass admin-login-card" onSubmit={handleSubmit}>
        <img src="/logo-karsa.jpeg" alt="KARSA DIGITAL" className="admin-login-logo" />
        <h1>Backend KARSA</h1>
        <p>Masuk untuk mengelola portfolio & demo project.</p>

        {error ? <div className="admin-alert">{error}</div> : null}

        <label className="admin-field">
          <span>Password Admin</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Masukkan password"
            autoFocus
            required
          />
        </label>

        <button type="submit" className="btn btn-primary admin-full-btn">
          Masuk Dashboard
        </button>
        <a href="/" className="admin-back-link">
          Kembali ke website
        </a>
      </form>
    </div>
  )
}
