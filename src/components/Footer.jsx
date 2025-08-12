import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-background">
        <div className="footer-grid"></div>
      </div>
      
      <div className="footer-content">
        <div className="footer-main">
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="footer-logo-icon">
                <div className="footer-icon-core"></div>
                <div className="footer-icon-ring"></div>
              </div>
              <span className="footer-brand-text">TalentoTech</span>
            </div>
            <p className="footer-description">
              Sistema avanzado de control de asistencia para instituciones educativas tecnológicas.
            </p>
            <div className="footer-social">
              <div className="social-link">📧</div>
              <div className="social-link">🌐</div>
              <div className="social-link">📱</div>
            </div>
          </div>

          <div className="footer-links">
            <div className="link-group">
              <h4 className="link-title">Plataforma</h4>
              <ul className="link-list">
                <li><a href="#" className="footer-link">Dashboard</a></li>
                <li><a href="#" className="footer-link">Estudiantes</a></li>
                <li><a href="#" className="footer-link">Cursos</a></li>
                <li><a href="#" className="footer-link">Reportes</a></li>
              </ul>
            </div>

            <div className="link-group">
              <h4 className="link-title">Recursos</h4>
              <ul className="link-list">
                <li><a href="#" className="footer-link">Documentación</a></li>
                <li><a href="#" className="footer-link">API</a></li>
                <li><a href="#" className="footer-link">Guías</a></li>
                <li><a href="#" className="footer-link">Soporte</a></li>
              </ul>
            </div>

            <div className="link-group">
              <h4 className="link-title">Contacto</h4>
              <ul className="link-list">
                <li><span className="contact-info">📧 info@talentotech.edu</span></li>
                <li><span className="contact-info">📞 +57 300 123 4567</span></li>
                <li><span className="contact-info">📍 Bogotá, Colombia</span></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-divider"></div>
          <div className="footer-copyright">
            <p>&copy; 2025 TalentoTech. Todos los derechos reservados.</p>
            <div className="footer-tech-info">
              <span className="tech-badge">Powered by React</span>
              <span className="version-badge">v2.0.1</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer