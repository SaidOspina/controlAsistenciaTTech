import { useState, useEffect } from 'react'
import './Students.css'

const Students = () => {
  const [students, setStudents] = useState([])
  const [filteredStudents, setFilteredStudents] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingStudent, setEditingStudent] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [courseFilter, setCourseFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [studentsPerPage] = useState(10)
  //const [showDetails, setShowDetails] = useState(null)

  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    tipoDocumento: 'CC',
    documento: '',
    telefono: '',
    correo: '',
    fechaNacimiento: '',
    direccion: '',
    ciudad: '',
    estado: 'Activo',
    cursos: [],
    genero: '',
    emergenciaContacto: '',
    emergenciaTelefono: ''
  })

  const [availableCourses, setAvailableCourses] = useState([])

  // Cargar cursos disponibles
  useEffect(() => {
    // Datos de ejemplo de cursos que coinciden con courses.jsx
    const mockCourses = [
      'Desarrollo Web',
      'Data Science con Python',
      'Ciberseguridad Avanzada',
      'Desarrollo Web Backend',
      'Machine Learning',
      'DevOps',
      'UI/UX Design',
      'Cloud Computing',
      'JavaScript Moderno'
    ]
    setAvailableCourses(mockCourses)
  }, [])

  // Cargar estudiantes al montar el componente
  useEffect(() => {
    // Usar datos simulados en lugar de localStorage
    const exampleStudents = [
      {
        id: 1,
        nombres: 'Juan Carlos',
        apellidos: 'Rodríguez Pérez',
        tipoDocumento: 'CC',
        documento: '1234567890',
        telefono: '+57 300 123 4567',
        correo: 'juan.rodriguez@email.com',
        fechaNacimiento: '1995-03-15',
        direccion: 'Calle 123 #45-67',
        ciudad: 'Bogotá',
        estado: 'Activo',
        cursos: ['Desarrollo Web Frontend', 'UI/UX Design'],
        genero: 'Masculino',
        emergenciaContacto: 'María Rodríguez',
        emergenciaTelefono: '+57 301 234 5678',
        fechaRegistro: '2024-01-15T08:30:00Z',
        ultimaActividad: '2025-01-10T14:22:00Z',
        promedioPuntaje: 4.5
      },
      {
        id: 2,
        nombres: 'María Alejandra',
        apellidos: 'González López',
        tipoDocumento: 'CC',
        documento: '0987654321',
        telefono: '+57 301 987 6543',
        correo: 'maria.gonzalez@email.com',
        fechaNacimiento: '1998-07-22',
        direccion: 'Carrera 30 #20-45',
        ciudad: 'Medellín',
        estado: 'Activo',
        cursos: ['Data Science', 'Machine Learning', 'Python Avanzado'],
        genero: 'Femenino',
        emergenciaContacto: 'Carlos González',
        emergenciaTelefono: '+57 302 345 6789',
        fechaRegistro: '2024-02-01T09:15:00Z',
        ultimaActividad: '2025-01-12T16:45:00Z',
        promedioPuntaje: 4.8
      },
      {
        id: 3,
        nombres: 'Luis Fernando',
        apellidos: 'Martínez Silva',
        tipoDocumento: 'TI',
        documento: '1122334455',
        telefono: '+57 302 555 7890',
        correo: 'luis.martinez@email.com',
        fechaNacimiento: '2001-11-08',
        direccion: 'Avenida 15 #78-90',
        ciudad: 'Cali',
        estado: 'Inactivo',
        cursos: ['Desarrollo Web Backend'],
        genero: 'Masculino',
        emergenciaContacto: 'Ana Silva',
        emergenciaTelefono: '+57 303 456 7890',
        fechaRegistro: '2024-01-20T10:00:00Z',
        ultimaActividad: '2024-12-15T11:30:00Z',
        promedioPuntaje: 4.2
      },
      {
        id: 4,
        nombres: 'Ana Sofía',
        apellidos: 'Rivera Castillo',
        tipoDocumento: 'CC',
        documento: '5566778899',
        telefono: '+57 304 111 2233',
        correo: 'ana.rivera@email.com',
        fechaNacimiento: '1996-05-14',
        direccion: 'Calle 67 #89-12',
        ciudad: 'Barranquilla',
        estado: 'Activo',
        cursos: ['UI/UX Design', 'JavaScript Moderno'],
        genero: 'Femenino',
        emergenciaContacto: 'José Rivera',
        emergenciaTelefono: '+57 305 222 3344',
        fechaRegistro: '2024-03-10T08:45:00Z',
        ultimaActividad: '2025-01-11T13:20:00Z',
        promedioPuntaje: 4.6
      },
      {
        id: 5,
        nombres: 'Diego Alejandro',
        apellidos: 'Hernández Mora',
        tipoDocumento: 'CC',
        documento: '9988776655',
        telefono: '+57 305 444 5566',
        correo: 'diego.hernandez@email.com',
        fechaNacimiento: '1994-12-03',
        direccion: 'Carrera 45 #23-56',
        ciudad: 'Bucaramanga',
        estado: 'Activo',
        cursos: ['DevOps', 'Cloud Computing', 'Ciberseguridad'],
        genero: 'Masculino',
        emergenciaContacto: 'Laura Mora',
        emergenciaTelefono: '+57 306 555 6677',
        fechaRegistro: '2024-02-20T11:30:00Z',
        ultimaActividad: '2025-01-13T15:10:00Z',
        promedioPuntaje: 4.7
      }
    ]
    setStudents(exampleStudents)
    setFilteredStudents(exampleStudents)
  }, [])

  // Filtrar estudiantes
  useEffect(() => {
    let filtered = students

    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.documento.includes(searchTerm) ||
        student.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.ciudad.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(student => student.estado === statusFilter)
    }

    if (courseFilter !== 'all') {
      filtered = filtered.filter(student => student.cursos.includes(courseFilter))
    }

    setFilteredStudents(filtered)
    setCurrentPage(1)
  }, [searchTerm, statusFilter, courseFilter, students])

  // Paginación
  const indexOfLastStudent = currentPage * studentsPerPage
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent)
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleCourseChange = (course) => {
    const updatedCourses = formData.cursos.includes(course)
      ? formData.cursos.filter(c => c !== course)
      : [...formData.cursos, course]
    
    setFormData({
      ...formData,
      cursos: updatedCourses
    })
  }

  const validateForm = () => {
    const { nombres, apellidos, documento, telefono, correo } = formData
    
    if (!nombres.trim() || !apellidos.trim() || !documento.trim() || !telefono.trim() || !correo.trim()) {
      alert('Por favor, completa todos los campos obligatorios')
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(correo)) {
      alert('Por favor, ingresa un correo electrónico válido')
      return false
    }

    const phoneRegex = /^[+]?[0-9\s-()]+$/
    if (!phoneRegex.test(telefono)) {
      alert('Por favor, ingresa un número de teléfono válido')
      return false
    }

    const documentExists = students.some(student => 
      student.documento === documento && student.id !== editingStudent?.id
    )
    if (documentExists) {
      alert('Ya existe un estudiante con este número de documento')
      return false
    }

    return true
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    let updatedStudents

    if (editingStudent) {
      updatedStudents = students.map(student =>
        student.id === editingStudent.id
          ? { 
              ...formData, 
              id: editingStudent.id, 
              fechaRegistro: editingStudent.fechaRegistro,
              ultimaActividad: new Date().toISOString(),
              promedioPuntaje: editingStudent.promedioPuntaje || 0
            }
          : student
      )
    } else {
      const newStudent = {
        ...formData,
        id: Date.now(),
        fechaRegistro: new Date().toISOString(),
        ultimaActividad: new Date().toISOString(),
        promedioPuntaje: 0
      }
      updatedStudents = [...students, newStudent]
    }

    setStudents(updatedStudents)
    resetForm()
  }

  const handleEdit = (student) => {
    setEditingStudent(student)
    setFormData({
      nombres: student.nombres,
      apellidos: student.apellidos,
      tipoDocumento: student.tipoDocumento,
      documento: student.documento,
      telefono: student.telefono,
      correo: student.correo,
      fechaNacimiento: student.fechaNacimiento || '',
      direccion: student.direccion || '',
      ciudad: student.ciudad || '',
      estado: student.estado,
      cursos: [...student.cursos],
      genero: student.genero || '',
      emergenciaContacto: student.emergenciaContacto || '',
      emergenciaTelefono: student.emergenciaTelefono || ''
    })
    setShowModal(true)
  }

  const handleStatusChange = (studentId, newStatus) => {
    const updatedStudents = students.map(student =>
      student.id === studentId
        ? { ...student, estado: newStatus, ultimaActividad: new Date().toISOString() }
        : student
    )
    setStudents(updatedStudents)
  }

  const handleDelete = (studentId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este estudiante?')) {
      const updatedStudents = students.filter(student => student.id !== studentId)
      setStudents(updatedStudents)
    }
  }

  const resetForm = () => {
    setFormData({
      nombres: '',
      apellidos: '',
      tipoDocumento: 'CC',
      documento: '',
      telefono: '',
      correo: '',
      fechaNacimiento: '',
      direccion: '',
      ciudad: '',
      estado: 'Activo',
      cursos: [],
      genero: '',
      emergenciaContacto: '',
      emergenciaTelefono: ''
    })
    setEditingStudent(null)
    setShowModal(false)
  }

  const getInitials = (nombres, apellidos) => {
    return `${nombres.charAt(0)}${apellidos.charAt(0)}`.toUpperCase()
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const exportToCSV = () => {
    const csvData = filteredStudents.map(student => ({
      Nombres: student.nombres,
      Apellidos: student.apellidos,
      Documento: student.documento,
      Telefono: student.telefono,
      Correo: student.correo,
      Ciudad: student.ciudad,
      Estado: student.estado,
      Cursos: student.cursos.join('; '),
      'Fecha Registro': formatDate(student.fechaRegistro)
    }))

    const headers = Object.keys(csvData[0]).join(',')
    const rows = csvData.map(row => Object.values(row).join(',')).join('\n')
    const csvContent = `${headers}\n${rows}`

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `estudiantes_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="students-container">
      {/* Header */}
      <div className="students-header">
        <h1 className="page-title">
          <span className="title-icon">👥</span>
          Gestión de Estudiantes
        </h1>
        <p className="page-subtitle">
          Administra la información de todos los estudiantes registrados en el sistema
        </p>
      </div>

      {/* Controles */}
      <div className="students-controls">
        <div className="search-filters">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Buscar estudiantes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">Todos los estados</option>
            <option value="Activo">Solo Activos</option>
            <option value="Inactivo">Solo Inactivos</option>
          </select>

          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">Todos los cursos</option>
            {availableCourses.map((course) => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={exportToCSV}
            className="btn-add-student"
            style={{ background: 'linear-gradient(45deg, #28a745, #20c997)' }}
          >
            <span className="btn-icon">📥</span>
            Exportar CSV
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="btn-add-student"
          >
            <span className="btn-icon">➕</span>
            Nuevo Estudiante
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="students-stats">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <div className="stat-value">{students.length}</div>
            <div className="stat-label">Total Estudiantes</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <div className="stat-value">{students.filter(s => s.estado === 'Activo').length}</div>
            <div className="stat-label">Estudiantes Activos</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏸️</div>
          <div className="stat-info">
            <div className="stat-value">{students.filter(s => s.estado === 'Inactivo').length}</div>
            <div className="stat-label">Estudiantes Inactivos</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔍</div>
          <div className="stat-info">
            <div className="stat-value">{filteredStudents.length}</div>
            <div className="stat-label">Resultados Filtrados</div>
          </div>
        </div>
      </div>

      {/* Tabla de estudiantes */}
      <div className="students-table-container">
        <div className="table-wrapper">
          <table className="students-table">
            <thead>
              <tr>
                <th>Estudiante</th>
                <th>Documento</th>
                <th>Contacto</th>
                <th>Estado</th>
                <th>Cursos</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentStudents.map((student) => (
                <tr key={student.id} className="student-row">
                  <td>
                    <div className="student-info">
                      <div className="student-avatar">
                        {getInitials(student.nombres, student.apellidos)}
                      </div>
                      <div className="student-details">
                        <div className="student-name">
                          {student.nombres} {student.apellidos}
                        </div>
                        <div className="student-email">{student.correo}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="document-info">
                      <div className="document-type">{student.tipoDocumento}</div>
                      <div className="document-number">{student.documento}</div>
                    </div>
                  </td>
                  <td>
                    <div className="contact-info">
                      <div className="phone">{student.telefono}</div>
                      <div className="email">{student.ciudad}</div>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${student.estado === 'Activo' ? 'status-active' : 'status-inactive'}`}>
                      {student.estado}
                    </span>
                  </td>
                  <td>
                    <div className="courses-cell">
                      {student.cursos.length > 0 ? (
                        <div className="courses-list">
                          <div className="course-count">
                            {student.cursos.length} curso{student.cursos.length !== 1 ? 's' : ''}
                          </div>
                          <div className="courses-tooltip">
                            {student.cursos.map((curso, index) => (
                              <div key={index} className="course-item">{curso}</div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <span className="no-courses">Sin cursos</span>
                      )}
                    </div>
                  </td>
                  <td className="actions-cell">
                    <div className="action-buttons">
                      <button
                        onClick={() => handleEdit(student)}
                        className="btn-action btn-edit"
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleStatusChange(
                          student.id, 
                          student.estado === 'Activo' ? 'Inactivo' : 'Activo'
                        )}
                        className={`btn-action ${student.estado === 'Activo' ? 'btn-deactivate' : 'btn-activate'}`}
                        title={student.estado === 'Activo' ? 'Desactivar' : 'Activar'}
                      >
                        {student.estado === 'Activo' ? '⏸️' : '▶️'}
                      </button>
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="btn-action btn-delete"
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              ← Anterior
            </button>
            <div className="pagination-info">
              Página {currentPage} de {totalPages} ({filteredStudents.length} estudiantes)
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              Siguiente →
            </button>
          </div>
        )}
      </div>

      {filteredStudents.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255, 255, 255, 0.7)' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📋</div>
          <h3 style={{ color: '#ffffff', marginBottom: '0.5rem' }}>No se encontraron estudiantes</h3>
          <p>No hay estudiantes que coincidan con los filtros aplicados.</p>
        </div>
      )}

      {/* Modal para crear/editar estudiante */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">
                <span>{editingStudent ? '✏️' : '➕'}</span>
                {editingStudent ? 'Editar Estudiante' : 'Nuevo Estudiante'}
              </h2>
              <button onClick={resetForm} className="modal-close">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="student-form">
              <div className="form-grid">
                {/* Información Personal */}
                <div style={{ gridColumn: '1 / -1', marginBottom: '1rem' }}>
                  <h3 style={{ color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <span>👤</span> Información Personal
                  </h3>
                </div>

                <div className="form-group">
                  <label>Nombres *</label>
                  <input
                    type="text"
                    name="nombres"
                    value={formData.nombres}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="Ingresa los nombres"
                  />
                </div>

                <div className="form-group">
                  <label>Apellidos *</label>
                  <input
                    type="text"
                    name="apellidos"
                    value={formData.apellidos}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="Ingresa los apellidos"
                  />
                </div>

                <div className="form-group">
                  <label>Tipo de Documento</label>
                  <select
                    name="tipoDocumento"
                    value={formData.tipoDocumento}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="CC">Cédula de Ciudadanía</option>
                    <option value="TI">Tarjeta de Identidad</option>
                    <option value="CE">Cédula de Extranjería</option>
                    <option value="PP">Pasaporte</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Número de Documento *</label>
                  <input
                    type="text"
                    name="documento"
                    value={formData.documento}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="Número de documento"
                  />
                </div>

                <div className="form-group">
                  <label>Teléfono *</label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="+57 300 123 4567"
                  />
                </div>

                <div className="form-group">
                  <label>Correo Electrónico *</label>
                  <input
                    type="email"
                    name="correo"
                    value={formData.correo}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="correo@ejemplo.com"
                  />
                </div>

                <div className="form-group">
                  <label>Ciudad</label>
                  <input
                    type="text"
                    name="ciudad"
                    value={formData.ciudad}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Ciudad de residencia"
                  />
                </div>

                <div className="form-group">
                  <label>Estado</label>
                  <select
                    name="estado"
                    value={formData.estado}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>

                {/* Cursos */}
                <div className="courses-section">
                  <label style={{ color: '#ffffff', marginBottom: '1rem', display: 'block' }}>
                    📚 Cursos Asignados
                  </label>
                  <div className="courses-grid">
                    {availableCourses.map((course) => (
                      <label key={course} className="course-checkbox">
                        <input
                          type="checkbox"
                          checked={formData.cursos.includes(course)}
                          onChange={() => handleCourseChange(course)}
                        />
                        <div className="checkmark"></div>
                        <span>{course}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-cancel"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-submit"
                >
                  {editingStudent ? '💾 Actualizar' : '➕ Crear'} Estudiante
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Students