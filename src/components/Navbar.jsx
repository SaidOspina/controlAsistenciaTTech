import { useState } from 'react'
import './Navbar.css'

const Navbar = ({ user, onLogout, onNavigate, currentPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const isActive = (page) => {
    return currentPage === page
  }

  const handleNavigation = (page) => {
    onNavigate(page)
    setIsMenuOpen(false) // Cerrar menú móvil después de navegar
  }

  const handleLogout = () => {
    // Solo llamar a la función de logout del componente padre
    // sin usar localStorage/sessionStorage
    onLogout()
    setIsMenuOpen(false) // Cerrar menú móvil
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
            <button 
              onClick={() => handleNavigation('home')} 
              className="brand-text"
              style={{ 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer', 
                color: '#ffffff', 
                fontSize: '1.5rem', 
                fontWeight: 700, 
                textShadow: '0 0 10px rgba(0, 162, 255, 0.5)' 
              }}
            >
              TalentoTech
            </button>
          </div>
        </div>

        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <div className="navbar-nav">
            <button 
              onClick={() => handleNavigation('home')}
              className={`nav-link ${isActive('home') ? 'active' : ''}`}
            >
              <span className="nav-icon">🏠</span>
              Dashboard
            </button>
            <button 
              onClick={() => handleNavigation('students')}
              className={`nav-link ${isActive('students') ? 'active' : ''}`}
            >
              <span className="nav-icon">👥</span>
              Estudiantes
            </button>
            <button 
              onClick={() => handleNavigation('courses')}
              className={`nav-link ${isActive('courses') ? 'active' : ''}`}
            >
              <span className="nav-icon">📚</span>
              Cursos
            </button>
            <button 
              onClick={() => handleNavigation('attendance')}
              className={`nav-link ${isActive('attendance') ? 'active' : ''}`}
            >
              <span className="nav-icon">✅</span>
              Asistencia
            </button>
            <button 
              onClick={() => handleNavigation('reports')}
              className={`nav-link ${isActive('reports') ? 'active' : ''}`}
            >
              <span className="nav-icon">📊</span>
              Reportes
            </button>
          </div>

          <div className="navbar-user">
            <div className="user-info">
              <div className="user-avatar">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="user-details">
                <span className="user-name">{user?.name || 'Usuario'}</span>
                <span className="user-role">{user?.role || 'Administrador'}</span>
              </div>
            </div>
            <button className="logout-button" onClick={handleLogout}>
              <span className="logout-icon">🚪</span>
              Salir
            </button>
          </div>
        </div>

        <div className="navbar-toggle" onClick={toggleMenu}>
          <div className={`toggle-line ${isMenuOpen ? 'active' : ''}`}></div>
          <div className={`toggle-line ${isMenuOpen ? 'active' : ''}`}></div>
          <div className={`toggle-line ${isMenuOpen ? 'active' : ''}`}></div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar