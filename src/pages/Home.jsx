import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './Home.css'

// eslint-disable-next-line no-empty-pattern
const Home = ({ }) => {
  const stats = [
    {
      icon: '👥',
      title: 'Estudiantes Activos',
      value: '1,247',
      change: '+12%',
      positive: true
    },
    {
      icon: '📚',
      title: 'Cursos Disponibles',
      value: '48',
      change: '+3',
      positive: true
    },
    {
      icon: '📊',
      title: 'Asistencia Promedio',
      value: '89.5%',
      change: '+2.3%',
      positive: true
    },
    {
      icon: '🎯',
      title: 'Tasa de Éxito',
      value: '94.2%',
      change: '+1.8%',
      positive: true
    }
  ]

  return (
    <div className="home-container">
      
      <main className="home-main">
        <div className="home-background">
          <div className="bg-grid"></div>
          <div className="bg-particles">
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
          </div>
        </div>

        <div className="home-content">
          {/* Hero Section */}
          <section className="hero-section">
            <div className="hero-content">
              <div className="hero-text">
                <h1 className="hero-title">
                  Sistema de Control de Asistencia
                  <span className="title-gradient">TalentoTech</span>
                </h1>
                <p className="hero-subtitle">
                  Gestiona de manera inteligente la asistencia de tus estudiantes con tecnología de vanguardia. 
                  Monitoreo en tiempo real, reportes avanzados y análisis predictivo.
                </p>
              </div>
              
              <div className="hero-image">
                <div className="tech-illustration">
                  <div className="central-hub">
                    <div className="hub-core"></div>
                    <div className="hub-ring ring-1"></div>
                    <div className="hub-ring ring-2"></div>
                    <div className="hub-ring ring-3"></div>
                  </div>
                  <div className="data-nodes">
                    <div className="node node-1"></div>
                    <div className="node node-2"></div>
                    <div className="node node-3"></div>
                    <div className="node node-4"></div>
                  </div>
                  <div className="connection-lines">
                    <div className="line line-1"></div>
                    <div className="line line-2"></div>
                    <div className="line line-3"></div>
                    <div className="line line-4"></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="stats-section">
            <div className="stats-grid">
              {stats.map((stat, index) => (
                <div key={index} className="stat-card">
                  <div className="stat-icon">{stat.icon}</div>
                  <div className="stat-info">
                    <h3 className="stat-value">{stat.value}</h3>
                    <p className="stat-title">{stat.title}</p>
                    <div className={`stat-change ${stat.positive ? 'positive' : 'negative'}`}>
                      <span className="change-icon">{stat.positive ? '📈' : '📉'}</span>
                      {stat.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
          {/* Features Section */}
          <section className="features-section">
            <h2 className="section-title">Características Principales</h2>
            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-icon">⚡</div>
                <h3>Tiempo Real</h3>
                <p>Monitoreo instantáneo de asistencia con actualizaciones en vivo</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🔒</div>
                <h3>Seguro</h3>
                <p>Protección avanzada de datos con encriptación de extremo a extremo</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">📱</div>
                <h3>Responsivo</h3>
                <p>Acceso desde cualquier dispositivo, en cualquier momento y lugar</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🤖</div>
                <h3>Inteligente</h3>
                <p>Algoritmos de IA para análisis predictivo y recomendaciones</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default Home