import { useState, useEffect } from 'react'
import './Students.css'

const Students = () => {
  const [students, setStudents] = useState([])
  const [filteredStudents, setFilteredStudents] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingStudent, setEditingStudent] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [studentsPerPage] = useState(10)

  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    tipoDocumento: 'CC',
    documento: '',
    telefono: '',
    correo: '',
    estado: 'Activo',
    cursos: []
  })

  const availableCourses = [
    'Desarrollo Web Frontend',
    'Desarrollo Web Backend',
    'Desarrollo Mobile',
    'Data Science',
    'Machine Learning',
    'DevOps',
    'UI/UX Design',
    'Ciberseguridad',
    'Cloud Computing',
    'Inteligencia Artificial'
  ]

  // Cargar estudiantes del localStorage al montar el componente
  useEffect(() => {
    const savedStudents = localStorage.getItem('students')
    if (savedStudents) {
      const studentsData = JSON.parse(savedStudents)
      setStudents(studentsData)
      setFilteredStudents(studentsData)
    } else {
      // Datos de ejemplo si no hay estudiantes guardados
      const exampleStudents = [
        {
          id: 1,
          nombres: 'Juan Carlos',
          apellidos: 'Rodríguez Pérez',
          tipoDocumento: 'CC',
          documento: '1234567890',
          telefono: '+57 300 123 4567',
          correo: 'juan.rodriguez@email.com',
          estado: 'Activo',
          cursos: ['Desarrollo Web Frontend', 'UI/UX Design'],
          fechaRegistro: new Date().toISOString()
        },
        {
          id: 2,
          nombres: 'María Alejandra',
          apellidos: 'González López',
          tipoDocumento: 'CC',
          documento: '0987654321',
          telefono: '+57 301 987 6543',
          correo: 'maria.gonzalez@email.com',
          estado: 'Activo',
          cursos: ['Data Science', 'Machine Learning'],
          fechaRegistro: new Date().toISOString()
        },
        {
          id: 3,
          nombres: 'Luis Fernando',
          apellidos: 'Martínez Silva',
          tipoDocumento: 'TI',
          documento: '1122334455',
          telefono: '+57 302 555 7890',
          correo: 'luis.martinez@email.com',
          estado: 'Inactivo',
          cursos: ['Desarrollo Web Backend'],
          fechaRegistro: new Date().toISOString()
        }
      ]
      setStudents(exampleStudents)
      setFilteredStudents(exampleStudents)
      localStorage.setItem('students', JSON.stringify(exampleStudents))
    }
  }, [])

  // Filtrar estudiantes según búsqueda y estado
  useEffect(() => {
    let filtered = students

    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.documento.includes(searchTerm) ||
        student.correo.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(student => student.estado === statusFilter)
    }

    setFilteredStudents(filtered)
    setCurrentPage(1)
  }, [searchTerm, statusFilter, students])

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

    // Verificar si el documento ya existe (excepto al editar el mismo estudiante)
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
      // Actualizar estudiante existente
      updatedStudents = students.map(student =>
        student.id === editingStudent.id
          ? { ...formData, id: editingStudent.id, fechaRegistro: editingStudent.fechaRegistro }
          : student
      )
    } else {
      // Crear nuevo estudiante
      const newStudent = {
        ...formData,
        id: Date.now(),
        fechaRegistro: new Date().toISOString()
      }
      updatedStudents = [...students, newStudent]
    }

    setStudents(updatedStudents)
    localStorage.setItem('students', JSON.stringify(updatedStudents))
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
      estado: student.estado,
      cursos: [...student.cursos]
    })
    setShowModal(true)
  }

  const handleStatusChange = (studentId, newStatus) => {
    const updatedStudents = students.map(student =>
      student.id === studentId
        ? { ...student, estado: newStatus }
        : student
    )
    setStudents(updatedStudents)
    localStorage.setItem('students', JSON.stringify(updatedStudents))
  }

  const handleDelete = (studentId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este estudiante?')) {
      const updatedStudents = students.filter(student => student.id !== studentId)
      setStudents(updatedStudents)
      localStorage.setItem('students', JSON.stringify(updatedStudents))
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
      estado: 'Activo',
      cursos: []
    })
    setEditingStudent(null)
    setShowModal(false)
  }

  const getStatusBadgeClass = (status) => {
    return status === 'Activo' ? 'status-active' : 'status-inactive'
  }

  return (
    <div className="students-container">
      <div className="students-header">
        <h1 className="page-title">
          <span className="title-icon">👥</span>
          Gestión de Estudiantes
        </h1>
        <p className="page-subtitle">
          Administra la información de todos los estudiantes registrados en el sistema
        </p>
      </div>

      {/* Controles y filtros */}
      <div className="students-controls">
        <div className="search-filters">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Buscar por nombre, documento o correo..."
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
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="btn-add-student"
        >
          <span className="btn-icon">➕</span>
          Nuevo Estudiante
        </button>
      </div>

      {/* Estadísticas rápidas */}
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
                  <td className="student-info">
                    <div className="student-avatar">
                      {student.nombres.charAt(0)}{student.apellidos.charAt(0)}
                    </div>
                    <div className="student-details">
                      <div className="student-name">
                        {student.nombres} {student.apellidos}
                      </div>
                      <div className="student-email">{student.correo}</div>
                    </div>
                  </td>
                  <td className="document-info">
                    <div className="document-type">{student.tipoDocumento}</div>
                    <div className="document-number">{student.documento}</div>
                  </td>
                  <td className="contact-info">
                    <div className="phone">{student.telefono}</div>
                    <div className="email">{student.correo}</div>
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusBadgeClass(student.estado)}`}>
                      {student.estado}
                    </span>
                  </td>
                  <td className="courses-cell">
                    <div className="courses-list">
                      {student.cursos.length > 0 ? (
                        <>
                          <span className="course-count">{student.cursos.length} curso(s)</span>
                          <div className="courses-tooltip">
                            {student.cursos.map((curso, index) => (
                              <div key={index} className="course-item">{curso}</div>
                            ))}
                          </div>
                        </>
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
                        title="Editar estudiante"
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
                        title="Eliminar estudiante"
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
              Página {currentPage} de {totalPages} 
              ({filteredStudents.length} estudiantes)
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

      {/* Modal para crear/editar estudiante */}
      {showModal && (
        <div className="modal-overlay" onClick={() => resetForm()}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingStudent ? '✏️ Editar Estudiante' : '➕ Nuevo Estudiante'}
              </h2>
              <button onClick={resetForm} className="modal-close">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="student-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="nombres">Nombres *</label>
                  <input
                    type="text"
                    id="nombres"
                    name="nombres"
                    value={formData.nombres}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="Ingresa los nombres"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="apellidos">Apellidos *</label>
                  <input
                    type="text"
                    id="apellidos"
                    name="apellidos"
                    value={formData.apellidos}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="Ingresa los apellidos"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="tipoDocumento">Tipo de Documento</label>
                  <select
                    id="tipoDocumento"
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
                  <label htmlFor="documento">Número de Documento *</label>
                  <input
                    type="text"
                    id="documento"
                    name="documento"
                    value={formData.documento}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="Número de documento"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="telefono">Teléfono *</label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="+57 300 123 4567"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="correo">Correo Electrónico *</label>
                  <input
                    type="email"
                    id="correo"
                    name="correo"
                    value={formData.correo}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="correo@ejemplo.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="estado">Estado</label>
                  <select
                    id="estado"
                    name="estado"
                    value={formData.estado}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
              </div>

              <div className="form-group courses-section">
                <label>Cursos Asignados</label>
                <div className="courses-grid">
                  {availableCourses.map((course) => (
                    <label key={course} className="course-checkbox">
                      <input
                        type="checkbox"
                        checked={formData.cursos.includes(course)}
                        onChange={() => handleCourseChange(course)}
                      />
                      <span className="checkmark"></span>
                      {course}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-actions">
                <button type="button" onClick={resetForm} className="btn-cancel">
                  Cancelar
                </button>
                <button type="submit" className="btn-submit">
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