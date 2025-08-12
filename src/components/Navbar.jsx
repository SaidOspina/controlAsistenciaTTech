import { useState } from 'react'
import './Navbar.css'

const Navbar = ({ user, onLogout, onNavigate, currentPage = 'home' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleNavigation = (page) => {
    if (onNavigate) {
      onNavigate(page)
    }
    setIsMenuOpen(false) // Cerrar menú móvil después de navegar
  }

  const navigationItems = [
    { id: 'home', label: 'Inicio', icon: '🏠' },
    { id: 'students', label: 'Estudiantes', icon: '👥' },
    { id: 'courses', label: 'Cursos', icon: '📚' },
    { id: 'attendance', label: 'Asistencia', icon: '📊' },
    { id: 'reports', label: 'Reportes', icon: '📈' }
  ]

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="brand-logo" onClick={() => handleNavigation('home')}>
            <div className="logo-icon">
              <div className="icon-core"></div>
              <div className="icon-ring"></div>
            </div>
            <span className="brand-text">TalentoTech</span>
          </div>
        </div>

        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <div className="navbar-nav">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </button>
            ))}
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