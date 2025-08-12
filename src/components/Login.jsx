import { useState } from 'react'
import './Login.css'

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulación de autenticación
    setTimeout(() => {
      if (credentials.email && credentials.password) {
        onLogin({
          name: 'Usuario TalentoTech',
          email: credentials.email,
          role: 'instructor'
        })
      }
      setIsLoading(false)
    }, 1500)
  }

  const handleInputChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="tech-grid"></div>
        <div className="floating-elements">
          <div className="floating-circle"></div>
          <div className="floating-square"></div>
          <div className="floating-triangle"></div>
        </div>
      </div>
      
      <div className="login-card">
        <div className="login-header">
          <div className="logo-container">
            <div className="tech-logo">
              <div className="logo-core"></div>
              <div className="logo-ring"></div>
            </div>
          </div>
          <h1 className="login-title">TalentoTech</h1>
          <p className="login-subtitle">Sistema de Control de Asistencia</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <div className="input-container">
              <input
                type="email"
                name="email"
                placeholder="Correo electrónico"
                value={credentials.email}
                onChange={handleInputChange}
                required
                className="tech-input"
              />
              <div className="input-line"></div>
            </div>
          </div>

          <div className="input-group">
            <div className="input-container">
              <input
                type="password"
                name="password"
                placeholder="Contraseña"
                value={credentials.password}
                onChange={handleInputChange}
                required
                className="tech-input"
              />
              <div className="input-line"></div>
            </div>
          </div>

          <button 
            type="submit" 
            className={`login-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="loading-spinner"></div>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>¿Olvidaste tu contraseña? <span className="tech-link">Recuperar</span></p>
        </div>
      </div>
    </div>
  )
}

export default Login