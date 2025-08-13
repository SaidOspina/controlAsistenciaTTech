import { useState, useEffect } from 'react'
import './Login.css'

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Crear usuarios por defecto en localStorage si no existen
  useEffect(() => {
    const existingUsers = localStorage.getItem('instructors')
    if (!existingUsers) {
      const defaultInstructors = [
        {
          id: 1,
          name: 'Carlos Mendoza',
          email: 'carlos.mendoza@talentotech.edu',
          password: '123456',
          role: 'instructor',
          especialidad: 'Desarrollo Web',
          telefono: '+57 301 234 5678',
          fechaRegistro: new Date().toISOString()
        },
        {
          id: 2,
          name: 'Ana Sofía Rivera',
          email: 'ana.rivera@talentotech.edu',
          password: '123456',
          role: 'instructor',
          especialidad: 'Data Science',
          telefono: '+57 302 345 6789',
          fechaRegistro: new Date().toISOString()
        },
        {
          id: 3,
          name: 'Miguel Ángel Torres',
          email: 'miguel.torres@talentotech.edu',
          password: '123456',
          role: 'instructor',
          especialidad: 'Ciberseguridad',
          telefono: '+57 303 456 7890',
          fechaRegistro: new Date().toISOString()
        }
      ]
      
      localStorage.setItem('instructors', JSON.stringify(defaultInstructors))
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    // Simulación de autenticación
    setTimeout(() => {
      if (credentials.email && credentials.password) {
        const instructors = JSON.parse(localStorage.getItem('instructors') || '[]')
        const user = instructors.find(
          instructor => 
            instructor.email === credentials.email && 
            instructor.password === credentials.password
        )
        
        if (user) {
          // Login exitoso
          onLogin({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            especialidad: user.especialidad,
            telefono: user.telefono
          })
        } else {
          setError('Credenciales incorrectas. Verifica tu email y contraseña.')
        }
      } else {
        setError('Por favor, completa todos los campos.')
      }
      setIsLoading(false)
    }, 1500)
  }

  const handleInputChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    })
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError('')
  }

  const fillCredentials = (email, password) => {
    setCredentials({ email, password })
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

        {/* Usuarios de prueba */}
        <div className="demo-users">
          <p className="demo-title">👥 Usuarios de Prueba:</p>
          <div className="demo-user-list">
            <button 
              type="button" 
              className="demo-user"
              onClick={() => fillCredentials('carlos.mendoza@talentotech.edu', '123456')}
            >
              <span className="demo-icon">👨‍💻</span>
              <div className="demo-info">
                <div className="demo-name">Carlos Mendoza</div>
                <div className="demo-email">carlos.mendoza@talentotech.edu</div>
              </div>
            </button>
            
            <button 
              type="button" 
              className="demo-user"
              onClick={() => fillCredentials('ana.rivera@talentotech.edu', '123456')}
            >
              <span className="demo-icon">👩‍💻</span>
              <div className="demo-info">
                <div className="demo-name">Ana Sofía Rivera</div>
                <div className="demo-email">ana.rivera@talentotech.edu</div>
              </div>
            </button>
            
            <button 
              type="button" 
              className="demo-user"
              onClick={() => fillCredentials('miguel.torres@talentotech.edu', '123456')}
            >
              <span className="demo-icon">👨‍💼</span>
              <div className="demo-info">
                <div className="demo-name">Miguel Ángel Torres</div>
                <div className="demo-email">miguel.torres@talentotech.edu</div>
              </div>
            </button>
          </div>
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

          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

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
          <p className="demo-note">💡 Contraseña para todos los usuarios: <strong>123456</strong></p>
        </div>
      </div>
    </div>
  )
}

export default Login