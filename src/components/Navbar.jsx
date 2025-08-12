import { useState } from 'react'
import './Navbar.css'

const Navbar = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="brand-logo">
            <div className="logo-icon">
              <div className="icon-core"></div>
              <div className="icon-ring"></div>
            </div>
            <span className="brand-text">TalentoTech</span>
          </div>
        </div>

        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <div className="navbar-nav">
            <a href="#" className="nav-link active">
              <span className="nav-icon">🏠</span>
              Inicio
            </a>
            <a href="#" className="nav-link">
              <span className="nav-icon">👥</span>
              Estudiantes
            </a>
            <a href="#" className="nav-link">
              <span className="nav-icon">📚</span>
              Cursos
            </a>
            <a href="#" className="nav-link">
              <span className="nav-icon">📊</span>
              Asistencia
            </a>
            <a href="#" className="nav-link">
              <span className="nav-icon">📈</span>
              Reportes
            </a>
          </div>

          <div className="navbar-user">
            <div className="user-info">
              <div className="user-avatar">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="user-details">
                <span className="user-name">{user?.name}</span>
                <span className="user-role">{user?.role}</span>
              </div>
            </div>
            <button className="logout-button" onClick={onLogout}>
              <span className="logout-icon">🚪</span>
              Salir
            </button>
          </div>
        </div>

        <div className="navbar-toggle" onClick={toggleMenu}>
          <span className={`toggle-line ${isMenuOpen ? 'active' : ''}`}></span>
          <span className={`toggle-line ${isMenuOpen ? 'active' : ''}`}></span>
          <span className={`toggle-line ${isMenuOpen ? 'active' : ''}`}></span>
        </div>
      </div>
    </nav>
  )
}

export default Navbar