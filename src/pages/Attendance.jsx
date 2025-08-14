import { useState, useEffect } from 'react'
import './Attendance.css'

const Attendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([])
  const [filteredRecords, setFilteredRecords] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [courseFilter, setCourseFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [recordsPerPage] = useState(10)
  
  const [takeAttendanceMode, setTakeAttendanceMode] = useState(false)
  const [students, setStudents] = useState([])
  const [courses, setCourses] = useState([])
  const [attendanceData, setAttendanceData] = useState({})

  // Cargar datos iniciales
  useEffect(() => {
    // Cargar estudiantes
    const savedStudents = localStorage.getItem('students')
    if (savedStudents) {
      setStudents(JSON.parse(savedStudents))
    }

    // Cargar cursos
    const savedCourses = localStorage.getItem('courses')
    if (savedCourses) {
      setCourses(JSON.parse(savedCourses))
    }

    // Cargar registros de asistencia
    const savedAttendance = localStorage.getItem('attendance')
    if (savedAttendance) {
      const attendanceData = JSON.parse(savedAttendance)
      setAttendanceRecords(attendanceData)
      setFilteredRecords(attendanceData)
    } else {
      // Datos de ejemplo
      const exampleAttendance = [
        {
          id: 1,
          fecha: '2025-01-10',
          curso: 'Desarrollo Web Frontend',
          instructor: 'Carlos Mendoza',
          totalEstudiantes: 18,
          presentes: 16,
          ausentes: 2,
          tardanzas: 1,
          registros: [
            { estudianteId: 1, estudiante: 'Juan Carlos Rodríguez', estado: 'Presente', hora: '08:00' },
            { estudianteId: 2, estudiante: 'María Alejandra González', estado: 'Presente', hora: '08:05' },
            { estudianteId: 3, estudiante: 'Luis Fernando Martínez', estado: 'Ausente', hora: null }
          ],
          fechaRegistro: new Date().toISOString()
        }
      ]
      setAttendanceRecords(exampleAttendance)
      setFilteredRecords(exampleAttendance)
      localStorage.setItem('attendance', JSON.stringify(exampleAttendance))
    }
  }, [])

  // Filtrar registros
  useEffect(() => {
    let filtered = attendanceRecords

    if (searchTerm) {
      filtered = filtered.filter(record =>
        record.curso.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.fecha.includes(searchTerm)
      )
    }

    if (courseFilter !== 'all') {
      filtered = filtered.filter(record => record.curso === courseFilter)
    }

    setFilteredRecords(filtered)
    setCurrentPage(1)
  }, [searchTerm, courseFilter, attendanceRecords])

  // Paginación
  const indexOfLastRecord = currentPage * recordsPerPage
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage
  const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord)
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage)

  // Inicializar datos para tomar asistencia
  const initializeAttendanceData = (courseId) => {
    const course = courses.find(c => c.id === parseInt(courseId))
    if (!course) return

    const courseStudents = students.filter(student => 
      student.cursos.includes(course.nombre) && student.estado === 'Activo'
    )

    const initialData = {}
    courseStudents.forEach(student => {
      initialData[student.id] = {
        estado: 'Presente',
        hora: new Date().toTimeString().slice(0, 5),
        observaciones: ''
      }
    })
    
    setAttendanceData(initialData)
  }

  const handleTakeAttendance = () => {
    if (!selectedCourse) {
      alert('Por favor, selecciona un curso')
      return
    }
    
    initializeAttendanceData(selectedCourse)
    setTakeAttendanceMode(true)
    setShowModal(true)
  }

  const handleAttendanceChange = (studentId, field, value) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }))
  }

  const saveAttendance = () => {
    const course = courses.find(c => c.id === parseInt(selectedCourse))
    if (!course) return

    const courseStudents = students.filter(student => 
      student.cursos.includes(course.nombre) && student.estado === 'Activo'
    )

    const registros = courseStudents.map(student => ({
      estudianteId: student.id,
      estudiante: `${student.nombres} ${student.apellidos}`,
      estado: attendanceData[student.id]?.estado || 'Presente',
      hora: attendanceData[student.id]?.estado === 'Ausente' ? null : attendanceData[student.id]?.hora,
      observaciones: attendanceData[student.id]?.observaciones || ''
    }))

    const presentes = registros.filter(r => r.estado === 'Presente').length
    const ausentes = registros.filter(r => r.estado === 'Ausente').length
    const tardanzas = registros.filter(r => r.estado === 'Tardanza').length

    const newRecord = {
      id: Date.now(),
      fecha: selectedDate,
      curso: course.nombre,
      instructor: course.instructor,
      totalEstudiantes: courseStudents.length,
      presentes,
      ausentes,
      tardanzas,
      registros,
      fechaRegistro: new Date().toISOString()
    }

    const updatedRecords = [...attendanceRecords, newRecord]
    setAttendanceRecords(updatedRecords)
    localStorage.setItem('attendance', JSON.stringify(updatedRecords))
    
    resetForm()
    alert('Asistencia registrada exitosamente')
  }

  const resetForm = () => {
    setSelectedCourse('')
    setSelectedDate('')
    setAttendanceData({})
    setTakeAttendanceMode(false)
    setShowModal(false)
  }

  const calculateAttendancePercentage = (presentes, total) => {
    return total > 0 ? Math.round((presentes / total) * 100) : 0
  }

  const getAttendanceColor = (percentage) => {
    if (percentage >= 90) return '#00d4aa'
    if (percentage >= 75) return '#ffc107'
    if (percentage >= 60) return '#ff8c00'
    return '#ff6b6b'
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }



  return (
    <div className="attendance-container">
      <div className="attendance-header">
        <h1 className="page-title">
          <span className="title-icon">📊</span>
          Control de Asistencia
        </h1>
        <p className="page-subtitle">
          Registra y consulta la asistencia de estudiantes por curso
        </p>
      </div>

      {/* Controles principales */}
      <div className="attendance-controls">
        <div className="search-filters">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Buscar por curso, instructor o fecha..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">Todos los cursos</option>
            {courses.map((course) => (
              <option key={course.id} value={course.nombre}>
                {course.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="attendance-actions">
          <div className="date-course-selection">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="date-input"
              max={new Date().toISOString().split('T')[0]}
            />
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="course-select"
            >
              <option value="">Seleccionar curso</option>
              {courses.filter(course => course.estado === 'Activo').map((course) => (
                <option key={course.id} value={course.id}>
                  {course.nombre}
                </option>
              ))}
            </select>
          </div>
          
          <button
            onClick={handleTakeAttendance}
            className="btn-take-attendance"
            disabled={!selectedCourse || !selectedDate}
          >
            <span className="btn-icon">✍️</span>
            Tomar Asistencia
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="attendance-stats">
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-info">
            <div className="stat-value">{attendanceRecords.length}</div>
            <div className="stat-label">Registros Totales</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <div className="stat-value">
              {attendanceRecords.reduce((sum, record) => sum + record.presentes, 0)}
            </div>
            <div className="stat-label">Asistencias</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">❌</div>
          <div className="stat-info">
            <div className="stat-value">
              {attendanceRecords.reduce((sum, record) => sum + record.ausentes, 0)}
            </div>
            <div className="stat-label">Ausencias</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-info">
            <div className="stat-value">
              {attendanceRecords.length > 0 
                ? Math.round(
                    attendanceRecords.reduce((sum, record) => 
                      sum + calculateAttendancePercentage(record.presentes, record.totalEstudiantes), 0
                    ) / attendanceRecords.length
                  )
                : 0
              }%
            </div>
            <div className="stat-label">Promedio Asistencia</div>
          </div>
        </div>
      </div>

      {/* Lista de registros */}
      <div className="attendance-records">
        <div className="records-header">
          <h2>Historial de Asistencias</h2>
          <span className="records-count">
            {filteredRecords.length} registro{filteredRecords.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="records-grid">
          {currentRecords.map((record) => {
            const percentage = calculateAttendancePercentage(record.presentes, record.totalEstudiantes)
            return (
              <div key={record.id} className="record-card">
                <div className="record-header">
                  <div className="record-date">
                    <span className="date-icon">📅</span>
                    {formatDate(record.fecha)}
                  </div>
                  <div 
                    className="attendance-percentage"
                    style={{ color: getAttendanceColor(percentage) }}
                  >
                    {percentage}%
                  </div>
                </div>

                <div className="record-content">
                  <h3 className="course-name">{record.curso}</h3>
                  <p className="instructor-name">👨‍🏫 {record.instructor}</p>

                  <div className="attendance-summary">
                    <div className="summary-item present">
                      <span className="summary-icon">✅</span>
                      <span className="summary-count">{record.presentes}</span>
                      <span className="summary-label">Presentes</span>
                    </div>
                    <div className="summary-item absent">
                      <span className="summary-icon">❌</span>
                      <span className="summary-count">{record.ausentes}</span>
                      <span className="summary-label">Ausentes</span>
                    </div>
                    <div className="summary-item late">
                      <span className="summary-icon">⏰</span>
                      <span className="summary-count">{record.tardanzas}</span>
                      <span className="summary-label">Tardanzas</span>
                    </div>
                  </div>

                  <div className="attendance-bar">
                    <div 
                      className="attendance-fill"
                      style={{ 
                        width: `${percentage}%`,
                        background: getAttendanceColor(percentage)
                      }}
                    ></div>
                  </div>

                  <div className="total-students">
                    Total: {record.totalEstudiantes} estudiantes
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {filteredRecords.length === 0 && (
          <div className="no-records">
            <span className="no-records-icon">📋</span>
            <p>No se encontraron registros de asistencia</p>
            <p className="no-records-subtitle">
              Comienza tomando asistencia para ver los registros aquí
            </p>
          </div>
        )}
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
            ({filteredRecords.length} registros)
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

      {/* Modal para tomar asistencia */}
      {showModal && takeAttendanceMode && (
        <div className="modal-overlay" onClick={() => resetForm()}>
          <div className="modal-content large-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                ✍️ Registrar Asistencia
              </h2>
              <button onClick={resetForm} className="modal-close">✕</button>
            </div>

            <div className="attendance-form">
              <div className="form-info">
                <div className="info-item">
                  <span className="info-label">📚 Curso:</span>
                  <span className="info-value">
                    {courses.find(c => c.id === parseInt(selectedCourse))?.nombre}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">📅 Fecha:</span>
                  <span className="info-value">{formatDate(selectedDate)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">👨‍🏫 Instructor:</span>
                  <span className="info-value">
                    {courses.find(c => c.id === parseInt(selectedCourse))?.instructor}
                  </span>
                </div>
              </div>

              <div className="students-attendance">
                <div className="attendance-header-controls">
                  <h3>Lista de Estudiantes</h3>
                  <div className="bulk-actions">
                    <button
                      type="button"
                      onClick={() => {
                        const courseStudents = students.filter(student => 
                          student.cursos.includes(courses.find(c => c.id === parseInt(selectedCourse))?.nombre) 
                          && student.estado === 'Activo'
                        )
                        const newData = {}
                        courseStudents.forEach(student => {
                          newData[student.id] = {
                            ...attendanceData[student.id],
                            estado: 'Presente'
                          }
                        })
                        setAttendanceData(newData)
                      }}
                      className="bulk-btn present"
                    >
                      ✅ Todos Presentes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const courseStudents = students.filter(student => 
                          student.cursos.includes(courses.find(c => c.id === parseInt(selectedCourse))?.nombre) 
                          && student.estado === 'Activo'
                        )
                        const newData = {}
                        courseStudents.forEach(student => {
                          newData[student.id] = {
                            ...attendanceData[student.id],
                            estado: 'Ausente'
                          }
                        })
                        setAttendanceData(newData)
                      }}
                      className="bulk-btn absent"
                    >
                      ❌ Todos Ausentes
                    </button>
                  </div>
                </div>

                <div className="students-list">
                  {students
                    .filter(student => 
                      student.cursos.includes(courses.find(c => c.id === parseInt(selectedCourse))?.nombre) 
                      && student.estado === 'Activo'
                    )
                    .map((student) => (
                      <div key={student.id} className="student-attendance-row">
                        <div className="student-info">
                          <div className="student-avatar">
                            {student.nombres.charAt(0)}{student.apellidos.charAt(0)}
                          </div>
                          <div className="student-details">
                            <div className="student-name">
                              {student.nombres} {student.apellidos}
                            </div>
                            <div className="student-document">
                              {student.tipoDocumento}: {student.documento}
                            </div>
                          </div>
                        </div>

                        <div className="attendance-controls">
                          <div className="status-buttons">
                            <button
                              type="button"
                              className={`status-btn present ${
                                attendanceData[student.id]?.estado === 'Presente' ? 'active' : ''
                              }`}
                              onClick={() => handleAttendanceChange(student.id, 'estado', 'Presente')}
                            >
                              ✅ Presente
                            </button>
                            <button
                              type="button"
                              className={`status-btn late ${
                                attendanceData[student.id]?.estado === 'Tardanza' ? 'active' : ''
                              }`}
                              onClick={() => handleAttendanceChange(student.id, 'estado', 'Tardanza')}
                            >
                              ⏰ Tardanza
                            </button>
                            <button
                              type="button"
                              className={`status-btn absent ${
                                attendanceData[student.id]?.estado === 'Ausente' ? 'active' : ''
                              }`}
                              onClick={() => handleAttendanceChange(student.id, 'estado', 'Ausente')}
                            >
                              ❌ Ausente
                            </button>
                          </div>

                          {attendanceData[student.id]?.estado !== 'Ausente' && (
                            <input
                              type="time"
                              value={attendanceData[student.id]?.hora || ''}
                              onChange={(e) => handleAttendanceChange(student.id, 'hora', e.target.value)}
                              className="time-input"
                              title="Hora de llegada"
                            />
                          )}

                          <input
                            type="text"
                            placeholder="Observaciones..."
                            value={attendanceData[student.id]?.observaciones || ''}
                            onChange={(e) => handleAttendanceChange(student.id, 'observaciones', e.target.value)}
                            className="observations-input"
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="form-actions">
                <button type="button" onClick={resetForm} className="btn-cancel">
                  Cancelar
                </button>
                <button type="button" onClick={saveAttendance} className="btn-submit">
                  💾 Guardar Asistencia
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Attendance