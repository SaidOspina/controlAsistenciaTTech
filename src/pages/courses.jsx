import { useState, useEffect } from 'react'
import './Courses.css'

const Courses = () => {
  const [courses, setCourses] = useState([])
  const [filteredCourses, setFilteredCourses] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingCourse, setEditingCourse] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [coursesPerPage] = useState(8)

  const [formData, setFormData] = useState({
    nombre: '',
    codigo: '',
    descripcion: '',
    instructor: '',
    duracionHoras: '',
    modalidad: 'Presencial',
    nivel: 'Principiante',
    estado: 'Activo',
    fechaInicio: '',
    fechaFin: '',
    cupos: '',
    precio: ''
  })

  const instructorsList = [
    'Carlos Mendoza',
    'Ana Sofía Rivera',
    'Miguel Ángel Torres',
    'Laura Martínez',
    'Diego Hernández',
    'Sofía González'
  ]

  // Cargar cursos del localStorage al montar el componente
  useEffect(() => {
    const savedCourses = localStorage.getItem('courses')
    if (savedCourses) {
      const coursesData = JSON.parse(savedCourses)
      setCourses(coursesData)
      setFilteredCourses(coursesData)
    } else {
      // Datos de ejemplo si no hay cursos guardados
      const exampleCourses = [
        {
          id: 1,
          nombre: 'Desarrollo Web Frontend',
          codigo: 'DWF001',
          descripcion: 'Aprende HTML, CSS, JavaScript y React para crear aplicaciones web modernas',
          instructor: 'Carlos Mendoza',
          duracionHoras: 120,
          modalidad: 'Presencial',
          nivel: 'Principiante',
          estado: 'Activo',
          fechaInicio: '2025-01-15',
          fechaFin: '2025-04-15',
          cupos: 25,
          precio: 850000,
          estudiantesInscritos: 18,
          fechaRegistro: new Date().toISOString()
        },
        {
          id: 2,
          nombre: 'Data Science con Python',
          codigo: 'DSP002',
          descripcion: 'Domina el análisis de datos, machine learning y visualización con Python',
          instructor: 'Ana Sofía Rivera',
          duracionHoras: 160,
          modalidad: 'Virtual',
          nivel: 'Intermedio',
          estado: 'Activo',
          fechaInicio: '2025-02-01',
          fechaFin: '2025-06-01',
          cupos: 20,
          precio: 1200000,
          estudiantesInscritos: 15,
          fechaRegistro: new Date().toISOString()
        },
        {
          id: 3,
          nombre: 'Ciberseguridad Avanzada',
          codigo: 'CIB003',
          descripcion: 'Protección de sistemas, ethical hacking y gestión de riesgos de seguridad',
          instructor: 'Miguel Ángel Torres',
          duracionHoras: 140,
          modalidad: 'Híbrido',
          nivel: 'Avanzado',
          estado: 'Próximamente',
          fechaInicio: '2025-03-01',
          fechaFin: '2025-07-01',
          cupos: 15,
          precio: 1500000,
          estudiantesInscritos: 0,
          fechaRegistro: new Date().toISOString()
        },
        {
          id: 4,
          nombre: 'Desarrollo Mobile con React Native',
          codigo: 'DMR004',
          descripcion: 'Crea aplicaciones móviles nativas para iOS y Android',
          instructor: 'Laura Martínez',
          duracionHoras: 100,
          modalidad: 'Virtual',
          nivel: 'Intermedio',
          estado: 'Inactivo',
          fechaInicio: '2024-11-01',
          fechaFin: '2025-01-15',
          cupos: 30,
          precio: 950000,
          estudiantesInscritos: 22,
          fechaRegistro: new Date().toISOString()
        }
      ]
      setCourses(exampleCourses)
      setFilteredCourses(exampleCourses)
      localStorage.setItem('courses', JSON.stringify(exampleCourses))
    }
  }, [])

  // Filtrar cursos según búsqueda y estado
  useEffect(() => {
    let filtered = courses

    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(course => course.estado === statusFilter)
    }

    setFilteredCourses(filtered)
    setCurrentPage(1)
  }, [searchTerm, statusFilter, courses])

  // Paginación
  const indexOfLastCourse = currentPage * coursesPerPage
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse)
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const validateForm = () => {
    const { nombre, codigo, instructor, duracionHoras, cupos, precio } = formData
    
    if (!nombre.trim() || !codigo.trim() || !instructor || !duracionHoras || !cupos || !precio) {
      alert('Por favor, completa todos los campos obligatorios')
      return false
    }

    // Verificar si el código ya existe (excepto al editar el mismo curso)
    const codeExists = courses.some(course => 
      course.codigo === codigo && course.id !== editingCourse?.id
    )
    if (codeExists) {
      alert('Ya existe un curso con este código')
      return false
    }

    return true
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    let updatedCourses

    if (editingCourse) {
      // Actualizar curso existente
      updatedCourses = courses.map(course =>
        course.id === editingCourse.id
          ? { 
              ...formData, 
              id: editingCourse.id, 
              fechaRegistro: editingCourse.fechaRegistro,
              estudiantesInscritos: editingCourse.estudiantesInscritos,
              duracionHoras: parseInt(formData.duracionHoras),
              cupos: parseInt(formData.cupos),
              precio: parseInt(formData.precio)
            }
          : course
      )
    } else {
      // Crear nuevo curso
      const newCourse = {
        ...formData,
        id: Date.now(),
        fechaRegistro: new Date().toISOString(),
        estudiantesInscritos: 0,
        duracionHoras: parseInt(formData.duracionHoras),
        cupos: parseInt(formData.cupos),
        precio: parseInt(formData.precio)
      }
      updatedCourses = [...courses, newCourse]
    }

    setCourses(updatedCourses)
    localStorage.setItem('courses', JSON.stringify(updatedCourses))
    resetForm()
  }

  const handleEdit = (course) => {
    setEditingCourse(course)
    setFormData({
      nombre: course.nombre,
      codigo: course.codigo,
      descripcion: course.descripcion,
      instructor: course.instructor,
      duracionHoras: course.duracionHoras.toString(),
      modalidad: course.modalidad,
      nivel: course.nivel,
      estado: course.estado,
      fechaInicio: course.fechaInicio,
      fechaFin: course.fechaFin,
      cupos: course.cupos.toString(),
      precio: course.precio.toString()
    })
    setShowModal(true)
  }

  const handleStatusChange = (courseId, newStatus) => {
    const updatedCourses = courses.map(course =>
      course.id === courseId
        ? { ...course, estado: newStatus }
        : course
    )
    setCourses(updatedCourses)
    localStorage.setItem('courses', JSON.stringify(updatedCourses))
  }

  const handleDelete = (courseId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este curso?')) {
      const updatedCourses = courses.filter(course => course.id !== courseId)
      setCourses(updatedCourses)
      localStorage.setItem('courses', JSON.stringify(updatedCourses))
    }
  }

  const resetForm = () => {
    setFormData({
      nombre: '',
      codigo: '',
      descripcion: '',
      instructor: '',
      duracionHoras: '',
      modalidad: 'Presencial',
      nivel: 'Principiante',
      estado: 'Activo',
      fechaInicio: '',
      fechaFin: '',
      cupos: '',
      precio: ''
    })
    setEditingCourse(null)
    setShowModal(false)
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Activo': return 'status-active'
      case 'Inactivo': return 'status-inactive'
      case 'Próximamente': return 'status-upcoming'
      case 'Finalizado': return 'status-finished'
      default: return 'status-active'
    }
  }

  const getLevelBadgeClass = (level) => {
    switch (level) {
      case 'Principiante': return 'level-beginner'
      case 'Intermedio': return 'level-intermediate'
      case 'Avanzado': return 'level-advanced'
      default: return 'level-beginner'
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price)
  }

  const calculateOccupancy = (inscribed, capacity) => {
    return Math.round((inscribed / capacity) * 100)
  }

  return (
    <div className="courses-container">
      <div className="courses-header">
        <h1 className="page-title">
          <span className="title-icon">📚</span>
          Gestión de Cursos
        </h1>
        <p className="page-subtitle">
          Administra el catálogo completo de cursos y programas educativos
        </p>
      </div>

      {/* Controles y filtros */}
      <div className="courses-controls">
        <div className="search-filters">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Buscar por nombre, código o instructor..."
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
            <option value="Próximamente">Próximamente</option>
            <option value="Finalizado">Finalizados</option>
          </select>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="btn-add-course"
        >
          <span className="btn-icon">➕</span>
          Nuevo Curso
        </button>
      </div>

      {/* Estadísticas rápidas */}
      <div className="courses-stats">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-info">
            <div className="stat-value">{courses.length}</div>
            <div className="stat-label">Total Cursos</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <div className="stat-value">{courses.filter(c => c.estado === 'Activo').length}</div>
            <div className="stat-label">Cursos Activos</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <div className="stat-value">{courses.reduce((sum, c) => sum + c.estudiantesInscritos, 0)}</div>
            <div className="stat-label">Estudiantes Inscritos</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔍</div>
          <div className="stat-info">
            <div className="stat-value">{filteredCourses.length}</div>
            <div className="stat-label">Resultados Filtrados</div>
          </div>
        </div>
      </div>

      {/* Grid de cursos */}
      <div className="courses-grid">
        {currentCourses.map((course) => (
          <div key={course.id} className="course-card">
            <div className="course-header">
              <div className="course-code">{course.codigo}</div>
              <div className="course-badges">
                <span className={`status-badge ${getStatusBadgeClass(course.estado)}`}>
                  {course.estado}
                </span>
                <span className={`level-badge ${getLevelBadgeClass(course.nivel)}`}>
                  {course.nivel}
                </span>
              </div>
            </div>

            <div className="course-content">
              <h3 className="course-title">{course.nombre}</h3>
              <p className="course-description">{course.descripcion}</p>
              
              <div className="course-details">
                <div className="detail-item">
                  <span className="detail-icon">👨‍🏫</span>
                  <span className="detail-text">{course.instructor}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">⏱️</span>
                  <span className="detail-text">{course.duracionHoras}h</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">💻</span>
                  <span className="detail-text">{course.modalidad}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">💰</span>
                  <span className="detail-text">{formatPrice(course.precio)}</span>
                </div>
              </div>

              <div className="enrollment-info">
                <div className="enrollment-text">
                  <span className="enrolled">{course.estudiantesInscritos}</span>
                  <span className="separator">/</span>
                  <span className="capacity">{course.cupos}</span>
                  <span className="label">estudiantes</span>
                </div>
                <div className="enrollment-bar">
                  <div 
                    className="enrollment-fill"
                    style={{ 
                      width: `${calculateOccupancy(course.estudiantesInscritos, course.cupos)}%`
                    }}
                  ></div>
                </div>
                <div className="occupancy-percentage">
                  {calculateOccupancy(course.estudiantesInscritos, course.cupos)}% ocupado
                </div>
              </div>

              <div className="course-dates">
                <div className="date-range">
                  <span className="date-label">📅 Inicio:</span>
                  <span className="date-value">{new Date(course.fechaInicio).toLocaleDateString('es-CO')}</span>
                </div>
                <div className="date-range">
                  <span className="date-label">🏁 Fin:</span>
                  <span className="date-value">{new Date(course.fechaFin).toLocaleDateString('es-CO')}</span>
                </div>
              </div>
            </div>

            <div className="course-actions">
              <button
                onClick={() => handleEdit(course)}
                className="btn-action btn-edit"
                title="Editar curso"
              >
                ✏️
              </button>
              <button
                onClick={() => handleStatusChange(
                  course.id, 
                  course.estado === 'Activo' ? 'Inactivo' : 'Activo'
                )}
                className={`btn-action ${course.estado === 'Activo' ? 'btn-deactivate' : 'btn-activate'}`}
                title={course.estado === 'Activo' ? 'Desactivar' : 'Activar'}
              >
                {course.estado === 'Activo' ? '⏸️' : '▶️'}
              </button>
              <button
                onClick={() => handleDelete(course.id)}
                className="btn-action btn-delete"
                title="Eliminar curso"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
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
            ({filteredCourses.length} cursos)
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

      {/* Modal para crear/editar curso */}
      {showModal && (
        <div className="modal-overlay" onClick={() => resetForm()}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingCourse ? '✏️ Editar Curso' : '➕ Nuevo Curso'}
              </h2>
              <button onClick={resetForm} className="modal-close">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="course-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="nombre">Nombre del Curso *</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="Ej: Desarrollo Web Frontend"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="codigo">Código del Curso *</label>
                  <input
                    type="text"
                    id="codigo"
                    name="codigo"
                    value={formData.codigo}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="Ej: DWF001"
                  />
                </div>

                <div className="form-group form-group-full">
                  <label htmlFor="descripcion">Descripción</label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    className="form-textarea"
                    rows="3"
                    placeholder="Describe el contenido y objetivos del curso"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="instructor">Instructor *</label>
                  <select
                    id="instructor"
                    name="instructor"
                    value={formData.instructor}
                    onChange={handleInputChange}
                    required
                    className="form-select"
                  >
                    <option value="">Seleccionar instructor</option>
                    {instructorsList.map((instructor) => (
                      <option key={instructor} value={instructor}>
                        {instructor}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="duracionHoras">Duración (Horas) *</label>
                  <input
                    type="number"
                    id="duracionHoras"
                    name="duracionHoras"
                    value={formData.duracionHoras}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="form-input"
                    placeholder="120"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="modalidad">Modalidad</label>
                  <select
                    id="modalidad"
                    name="modalidad"
                    value={formData.modalidad}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="Presencial">Presencial</option>
                    <option value="Virtual">Virtual</option>
                    <option value="Híbrido">Híbrido</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="nivel">Nivel</label>
                  <select
                    id="nivel"
                    name="nivel"
                    value={formData.nivel}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="Principiante">Principiante</option>
                    <option value="Intermedio">Intermedio</option>
                    <option value="Avanzado">Avanzado</option>
                  </select>
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
                    <option value="Próximamente">Próximamente</option>
                    <option value="Finalizado">Finalizado</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="fechaInicio">Fecha de Inicio</label>
                  <input
                    type="date"
                    id="fechaInicio"
                    name="fechaInicio"
                    value={formData.fechaInicio}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="fechaFin">Fecha de Fin</label>
                  <input
                    type="date"
                    id="fechaFin"
                    name="fechaFin"
                    value={formData.fechaFin}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cupos">Cupos Disponibles *</label>
                  <input
                    type="number"
                    id="cupos"
                    name="cupos"
                    value={formData.cupos}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="form-input"
                    placeholder="25"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="precio">Precio (COP) *</label>
                  <input
                    type="number"
                    id="precio"
                    name="precio"
                    value={formData.precio}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="form-input"
                    placeholder="850000"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" onClick={resetForm} className="btn-cancel">
                  Cancelar
                </button>
                <button type="submit" className="btn-submit">
                  {editingCourse ? '💾 Actualizar' : '➕ Crear'} Curso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Courses