import { useState } from 'react'
import Login from './components/Login'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Students from './pages/Students'
import Courses from './pages/Courses'
import Attendance from './pages/Attendance'
import Reports from './pages/Reports'
import './App.css'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [currentPage, setCurrentPage] = useState('home')

  const handleLogin = (userData) => {
    setUser(userData)
    setIsLoggedIn(true)
    setCurrentPage('home')
  }

  const handleLogout = () => {
    setUser(null)
    setIsLoggedIn(false)
    setCurrentPage('home')
  }

  const handleNavigation = (page) => {
    setCurrentPage(page)
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home user={user} />
      case 'students':
        return <Students />
      case 'courses':
        return <Courses />
      case 'attendance':
        return <Attendance />
      case 'reports':
        return <Reports />
      default:
        return <Home user={user} />
    }
  }

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <div className="app">
      <Navbar 
        user={user} 
        onLogout={handleLogout} 
        onNavigate={handleNavigation}
        currentPage={currentPage}
      />
      <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {renderCurrentPage()}
      </main>
      {currentPage === 'home' && <Footer onNavigate={handleNavigation} />}
    </div>
  )
}

export default App