import { useState, useEffect } from 'react'
import './Reports.css'

const Reports = () => {
  const [students, setStudents] = useState([])
  const [courses, setCourses] = useState([])
  const [attendanceRecords, setAttendanceRecords] = useState([])
  const [selectedReport, setSelectedReport] = useState('attendance-summary')
  const [filters, setFilters] = useState({
    course: '',
    startDate: '',
    endDate: '',
    student: ''
  })

  // Cargar datos
  useEffect(() => {
    const savedStudents = localStorage.getItem('students')
    if (savedStudents) setStudents(JSON.parse(savedStudents))

    const savedCourses = localStorage.getItem('courses')
    if (savedCourses) setCourses(JSON.parse(savedCourses))

    const savedAttendance = localStorage.getItem('attendance')
    if (savedAttendance) setAttendanceRecords(JSON.parse(savedAttendance))
  }, [])

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Filtrar registros de asistencia según filtros
  const getFilteredAttendance = () => {
    return attendanceRecords.filter(record => {
      const matchesCourse = !filters.course || record.curso === filters.course
      const matchesDate = (!filters.startDate || record.fecha >= filters.startDate) &&
                         (!filters.endDate || record.fecha <= filters.endDate)
      return matchesCourse && matchesDate
    })
  }

  // Reporte de resumen de asistencia por curso
  const getAttendanceSummaryReport = () => {
    const filteredRecords = getFilteredAttendance()
    const courseSummary = {}

    filteredRecords.forEach(record => {
      if (!courseSummary[record.curso]) {
        courseSummary[record.curso] = {
          curso: record.curso,
          instructor: record.instructor,
          totalClases: 0,
          totalPresentes: 0,
          totalAusentes: 0,
          totalTardanzas: 0,
          promedioAsistencia: 0
        }
      }
      
      courseSummary[record.curso].totalClases++
      courseSummary[record.curso].totalPresentes += record.presentes
      courseSummary[record.curso].totalAusentes += record.ausentes
      courseSummary[record.curso].totalTardanzas += record.tardanzas
    })

    return Object.values(courseSummary).map(course => ({
      ...course,
      promedioAsistencia: course.totalClases > 0 
        ? Math.round((course.totalPresentes / (course.totalPresentes + course.totalAusentes + course.totalTardanzas)) * 100)
        : 0
    }))
  }

  // Reporte de asistencia por estudiante
  const getStudentAttendanceReport = () => {
    const filteredRecords = getFilteredAttendance()
    const studentStats = {}

    // Inicializar estadísticas de estudiantes
    students.forEach(student => {
      if (!filters.course || student.cursos.includes(filters.course)) {
        studentStats[student.id] = {
          id: student.id,
          nombre: `${student.nombres} ${student.apellidos}`,
          documento: student.documento,
          cursos: student.cursos,
          totalClases: 0,
          presentes: 0,
          ausentes: 0,
          tardanzas: 0,
          porcentajeAsistencia: 0
        }
      }
    })

    // Procesar registros de asistencia
    filteredRecords.forEach(record => {
      if (!filters.course || record.curso === filters.course) {
        record.registros.forEach(registro => {
          if (studentStats[registro.estudianteId]) {
            studentStats[registro.estudianteId].totalClases++
            if (registro.estado === 'Presente') studentStats[registro.estudianteId].presentes++
            else if (registro.estado === 'Ausente') studentStats[registro.estudianteId].ausentes++
            else if (registro.estado === 'Tardanza') studentStats[registro.estudianteId].tardanzas++
          }
        })
      }
    })

    return Object.values(studentStats)
      .filter(student => student.totalClases > 0)
      .map(student => ({
        ...student,
        porcentajeAsistencia: student.totalClases > 0 
          ? Math.round((student.presentes / student.totalClases) * 100)
          : 0
      }))
      .sort((a, b) => b.porcentajeAsistencia - a.porcentajeAsistencia)
  }

  // Reporte detallado por fechas
  const getDateDetailReport = () => {
    return getFilteredAttendance().sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
  }

  // Reporte de estudiantes con baja asistencia
  const getLowAttendanceReport = () => {
    return getStudentAttendanceReport()
      .filter(student => student.porcentajeAsistencia < 75)
      .sort((a, b) => a.porcentajeAsistencia - b.porcentajeAsistencia)
  }

  const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) {
      alert('No hay datos para exportar')
      return
    }

    const headers = Object.keys(data[0])
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header]
          return typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value
        }).join(',')
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const renderReport = () => {
    switch (selectedReport) {
      case 'attendance-summary':
        return <AttendanceSummaryReport data={getAttendanceSummaryReport()} />
      case 'student-attendance':
        return <StudentAttendanceReport data={getStudentAttendanceReport()} />
      case 'date-detail':
        return <DateDetailReport data={getDateDetailReport()} />
      case 'low-attendance':
        return <LowAttendanceReport data={getLowAttendanceReport()} />
      default:
        return <AttendanceSummaryReport data={getAttendanceSummaryReport()} />
    }
  }

  const getReportData = () => {
    switch (selectedReport) {
      case 'attendance-summary':
        return getAttendanceSummaryReport()
      case 'student-attendance':
        return getStudentAttendanceReport()
      case 'date-detail':
        return getDateDetailReport()
      case 'low-attendance':
        return getLowAttendanceReport()
      default:
        return []
    }
  }

  const getReportTitle = () => {
    switch (selectedReport) {
      case 'attendance-summary':
        return 'Resumen de Asistencia por Curso'
      case 'student-attendance':
        return 'Reporte de Asistencia por Estudiante'
      case 'date-detail':
        return 'Reporte Detallado por Fechas'
      case 'low-attendance':
        return 'Estudiantes con Baja Asistencia'
      default:
        return 'Reporte'
    }
  }

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h1 className="page-title">
          <span className="title-icon">📈</span>
          Centro de Reportes
        </h1>
        <p className="page-subtitle">
          Genera reportes detallados de asistencia y rendimiento académico
        </p>
      </div>

      {/* Controles de reportes */}
      <div className="reports-controls">
        <div className="report-selector">
          <label htmlFor="report-type">Tipo de Reporte:</label>
          <select
            id="report-type"
            value={selectedReport}
            onChange={(e) => setSelectedReport(e.target.value)}
            className="report-select"
          >
            <option value="attendance-summary">Resumen por Curso</option>
            <option value="student-attendance">Asistencia por Estudiante</option>
            <option value="date-detail">Detalle por Fechas</option>
            <option value="low-attendance">Baja Asistencia</option>
          </select>
        </div>

        <div className="report-filters">
          <div className="filter-group">
            <label htmlFor="course-filter">Curso:</label>
            <select
              id="course-filter"
              value={filters.course}
              onChange={(e) => handleFilterChange('course', e.target.value)}
              className="filter-select"
            >
              <option value="">Todos los cursos</option>
              {courses.map((course) => (
                <option key={course.id} value={course.nombre}>
                  {course.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="start-date">Fecha Inicio:</label>
            <input
              type="date"
              id="start-date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="filter-date"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="end-date">Fecha Fin:</label>
            <input
              type="date"
              id="end-date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="filter-date"
            />
          </div>
        </div>

        <div className="report-actions">
          <button
            onClick={() => exportToCSV(getReportData(), `${selectedReport}-${new Date().toISOString().split('T')[0]}`)}
            className="btn-export"
          >
            <span className="btn-icon">📥</span>
            Exportar CSV
          </button>
          <button
            onClick={() => window.print()}
            className="btn-print"
          >
            <span className="btn-icon">🖨️</span>
            Imprimir
          </button>
        </div>
      </div>

      {/* Reporte */}
      <div className="report-content">
        <div className="report-title">
          <h2>{getReportTitle()}</h2>
          <span className="report-date">
            Generado el {new Date().toLocaleDateString('es-CO')}
          </span>
        </div>
        {renderReport()}
      </div>
    </div>
  )
}

// Componente para reporte de resumen de asistencia
const AttendanceSummaryReport = ({ data }) => (
  <div className="report-table-container">
    <table className="report-table">
      <thead>
        <tr>
          <th>Curso</th>
          <th>Instructor</th>
          <th>Total Clases</th>
          <th>Presentes</th>
          <th>Ausentes</th>
          <th>Tardanzas</th>
          <th>% Asistencia</th>
        </tr>
      </thead>
      <tbody>
        {data.map((course, index) => (
          <tr key={index}>
            <td className="course-name">{course.curso}</td>
            <td>{course.instructor}</td>
            <td className="text-center">{course.totalClases}</td>
            <td className="text-center present">{course.totalPresentes}</td>
            <td className="text-center absent">{course.totalAusentes}</td>
            <td className="text-center late">{course.totalTardanzas}</td>
            <td className="text-center">
              <span className={`percentage ${getPercentageClass(course.promedioAsistencia)}`}>
                {course.promedioAsistencia}%
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    {data.length === 0 && (
      <div className="no-data">
        <p>📊 No se encontraron datos para mostrar</p>
      </div>
    )}
  </div>
)

// Componente para reporte de asistencia por estudiante
const StudentAttendanceReport = ({ data }) => (
  <div className="report-table-container">
    <table className="report-table">
      <thead>
        <tr>
          <th>Estudiante</th>
          <th>Documento</th>
          <th>Total Clases</th>
          <th>Presentes</th>
          <th>Ausentes</th>
          <th>Tardanzas</th>
          <th>% Asistencia</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>
        {data.map((student) => (
          <tr key={student.id}>
            <td className="student-name">{student.nombre}</td>
            <td>{student.documento}</td>
            <td className="text-center">{student.totalClases}</td>
            <td className="text-center present">{student.presentes}</td>
            <td className="text-center absent">{student.ausentes}</td>
            <td className="text-center late">{student.tardanzas}</td>
            <td className="text-center">
              <span className={`percentage ${getPercentageClass(student.porcentajeAsistencia)}`}>
                {student.porcentajeAsistencia}%
              </span>
            </td>
            <td className="text-center">
              <span className={`status-badge ${getAttendanceStatusClass(student.porcentajeAsistencia)}`}>
                {getAttendanceStatus(student.porcentajeAsistencia)}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    {data.length === 0 && (
      <div className="no-data">
        <p>📊 No se encontraron datos para mostrar</p>
      </div>
    )}
  </div>
)

// Componente para reporte detallado por fechas
const DateDetailReport = ({ data }) => (
  <div className="report-cards">
    {data.map((record) => (
      <div key={record.id} className="report-card">
        <div className="card-header">
          <div className="date">{new Date(record.fecha).toLocaleDateString('es-CO')}</div>
          <div className="course">{record.curso}</div>
        </div>
        <div className="card-content">
          <div className="instructor">👨‍🏫 {record.instructor}</div>
          <div className="attendance-stats">
            <div className="stat present">
              <span className="icon">✅</span>
              <span className="value">{record.presentes}</span>
              <span className="label">Presentes</span>
            </div>
            <div className="stat absent">
              <span className="icon">❌</span>
              <span className="value">{record.ausentes}</span>
              <span className="label">Ausentes</span>
            </div>
            <div className="stat late">
              <span className="icon">⏰</span>
              <span className="value">{record.tardanzas}</span>
              <span className="label">Tardanzas</span>
            </div>
          </div>
          <div className="total">Total: {record.totalEstudiantes} estudiantes</div>
        </div>
      </div>
    ))}
    {data.length === 0 && (
      <div className="no-data">
        <p>📊 No se encontraron registros para mostrar</p>
      </div>
    )}
  </div>
)

// Componente para reporte de baja asistencia
const LowAttendanceReport = ({ data }) => (
  <div className="report-table-container">
    <div className="alert-warning">
      ⚠️ Estudiantes que requieren atención (Asistencia menor al 75%)
    </div>
    <table className="report-table">
      <thead>
        <tr>
          <th>Estudiante</th>
          <th>Documento</th>
          <th>Total Clases</th>
          <th>Presentes</th>
          <th>Ausentes</th>
          <th>% Asistencia</th>
          <th>Nivel de Riesgo</th>
        </tr>
      </thead>
      <tbody>
        {data.map((student) => (
          <tr key={student.id}>
            <td className="student-name">{student.nombre}</td>
            <td>{student.documento}</td>
            <td className="text-center">{student.totalClases}</td>
            <td className="text-center present">{student.presentes}</td>
            <td className="text-center absent">{student.ausentes}</td>
            <td className="text-center">
              <span className={`percentage ${getPercentageClass(student.porcentajeAsistencia)}`}>
                {student.porcentajeAsistencia}%
              </span>
            </td>
            <td className="text-center">
              <span className={`risk-badge ${getRiskLevelClass(student.porcentajeAsistencia)}`}>
                {getRiskLevel(student.porcentajeAsistencia)}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    {data.length === 0 && (
      <div className="no-data">
        <p>🎉 ¡Excelente! No hay estudiantes con baja asistencia</p>
      </div>
    )}
  </div>
)

// Funciones auxiliares
const getPercentageClass = (percentage) => {
  if (percentage >= 90) return 'excellent'
  if (percentage >= 75) return 'good'
  if (percentage >= 60) return 'warning'
  return 'danger'
}

const getAttendanceStatus = (percentage) => {
  if (percentage >= 90) return 'Excelente'
  if (percentage >= 75) return 'Bueno'
  if (percentage >= 60) return 'Regular'
  return 'Crítico'
}

const getAttendanceStatusClass = (percentage) => {
  if (percentage >= 90) return 'status-excellent'
  if (percentage >= 75) return 'status-good'
  if (percentage >= 60) return 'status-warning'
  return 'status-critical'
}

const getRiskLevel = (percentage) => {
  if (percentage >= 60) return 'Moderado'
  if (percentage >= 40) return 'Alto'
  return 'Crítico'
}

const getRiskLevelClass = (percentage) => {
  if (percentage >= 60) return 'risk-moderate'
  if (percentage >= 40) return 'risk-high'
  return 'risk-critical'
}

export default Reports