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
  const [showDetails, setShowDetails] = useState(null)

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
    'Inteligencia Artificial',
    'Python Avanzado',
    'JavaScript Moderno',
    'React Native',
    'Angular',
    'Vue.js'
  ]

  // Cargar estudiantes al montar el componente
  useEffect(() => {
    const savedStudents = JSON.parse(localStorage.getItem('students') || '[]')
    if (savedStudents.length === 0) {
      // Datos de ejemplo más completos
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
      localStorage.setItem('students', JSON.stringify(exampleStudents))
    } else {
      setStudents(savedStudents)
      setFilteredStudents(savedStudents)
    }
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

  const getStatusBadgeClass = (status) => {
    return status === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
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

  const getRandomGradient = (id) => {
    const gradients = [
      'from-blue-400 to-purple-600',
      'from-green-400 to-blue-600',
      'from-purple-400 to-pink-600',
      'from-yellow-400 to-orange-600',
      'from-red-400 to-pink-600',
      'from-indigo-400 to-purple-600'
    ]
    return gradients[id % gradients.length]
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            <span className="mr-3">👥</span>
            Gestión de Estudiantes
          </h1>
          <p className="text-lg text-gray-600">
            Administra la información de todos los estudiantes registrados en el sistema
          </p>
        </div>

        {/* Controles */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Buscar estudiantes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos los estados</option>
                <option value="Activo">Solo Activos</option>
                <option value="Inactivo">Solo Inactivos</option>
              </select>

              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos los cursos</option>
                {availableCourses.map((course) => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={exportToCSV}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <span>📥</span>
                Exportar CSV
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <span>➕</span>
                Nuevo Estudiante
              </button>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Estudiantes</p>
                <p className="text-2xl font-bold text-gray-900">{students.length}</p>
              </div>
              <div className="text-3xl">👥</div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Estudiantes Activos</p>
                <p className="text-2xl font-bold text-green-600">{students.filter(s => s.estado === 'Activo').length}</p>
              </div>
              <div className="text-3xl">✅</div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Estudiantes Inactivos</p>
                <p className="text-2xl font-bold text-red-600">{students.filter(s => s.estado === 'Inactivo').length}</p>
              </div>
              <div className="text-3xl">⏸️</div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Resultados Filtrados</p>
                <p className="text-2xl font-bold text-blue-600">{filteredStudents.length}</p>
              </div>
              <div className="text-3xl">🔍</div>
            </div>
          </div>
        </div>

        {/* Tabla de estudiantes */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estudiante
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Documento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cursos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Última Actividad
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`h-10 w-10 rounded-full bg-gradient-to-r ${getRandomGradient(student.id)} flex items-center justify-center text-white font-medium text-sm mr-4`}>
                          {getInitials(student.nombres, student.apellidos)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {student.nombres} {student.apellidos}
                          </div>
                          <div className="text-sm text-gray-500">{student.correo}</div>
                          {student.ciudad && (
                            <div className="text-xs text-gray-400">{student.ciudad}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.tipoDocumento}</div>
                      <div className="text-sm text-gray-500">{student.documento}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.telefono}</div>
                      <div className="text-sm text-gray-500">{student.correo}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(student.estado)}`}>
                        {student.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        {student.cursos.length > 0 ? (
                          <div>
                            <div className="text-sm font-medium text-gray-900 mb-1">
                              {student.cursos.length} curso{student.cursos.length !== 1 ? 's' : ''}
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {student.cursos.slice(0, 2).map((curso, index) => (
                                <span key={index} className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                                  {curso}
                                </span>
                              ))}
                              {student.cursos.length > 2 && (
                                <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                                  +{student.cursos.length - 2} más
                                </span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">Sin cursos</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.ultimaActividad ? formatDate(student.ultimaActividad) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => setShowDetails(student)}
                          className="text-blue-600 hover:text-blue-800 transition-colors p-1"
                          title="Ver detalles"
                        >
                          👁️
                        </button>
                        <button
                          onClick={() => handleEdit(student)}
                          className="text-yellow-600 hover:text-yellow-800 transition-colors p-1"
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleStatusChange(
                            student.id, 
                            student.estado === 'Activo' ? 'Inactivo' : 'Activo'
                          )}
                          className={`transition-colors p-1 ${
                            student.estado === 'Activo' 
                              ? 'text-orange-600 hover:text-orange-800' 
                              : 'text-green-600 hover:text-green-800'
                          }`}
                          title={student.estado === 'Activo' ? 'Desactivar' : 'Activar'}
                        >
                          {student.estado === 'Activo' ? '⏸️' : '▶️'}
                        </button>
                        <button
                          onClick={() => handleDelete(student.id)}
                          className="text-red-600 hover:text-red-800 transition-colors p-1"
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
            <div className="bg-white px-6 py-3 border-t border-gray-200 flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Anterior
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Mostrando <span className="font-medium">{indexOfFirstStudent + 1}</span> a{' '}
                    <span className="font-medium">{Math.min(indexOfLastStudent, filteredStudents.length)}</span> de{' '}
                    <span className="font-medium">{filteredStudents.length}</span> resultados
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      ←
                    </button>
                    
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNum = index + 1
                      if (pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === pageNum
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        )
                      } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                        return <span key={pageNum} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">...</span>
                      }
                      return null
                    })}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      →
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>

        {filteredStudents.length === 0 && (
          <div className="bg-white rounded-xl p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No se encontraron estudiantes</h3>
            <p className="text-gray-500">No hay estudiantes que coincidan con los filtros aplicados.</p>
          </div>
        )}

        {/* Modal para crear/editar estudiante */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingStudent ? '✏️ Editar Estudiante' : '➕ Nuevo Estudiante'}
                </h2>
                <button onClick={resetForm} className="text-gray-400 hover:text-gray-600 text-2xl">
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Información Personal */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <span>👤</span> Información Personal
                    </h3>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombres *
                    </label>
                    <input
                      type="text"
                      name="nombres"
                      value={formData.nombres}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ingresa los nombres"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apellidos *
                    </label>
                    <input
                      type="text"
                      name="apellidos"
                      value={formData.apellidos}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ingresa los apellidos"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Documento
                    </label>
                    <select
                      name="tipoDocumento"
                      value={formData.tipoDocumento}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="CC">Cédula de Ciudadanía</option>
                      <option value="TI">Tarjeta de Identidad</option>
                      <option value="CE">Cédula de Extranjería</option>
                      <option value="PP">Pasaporte</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número de Documento *
                    </label>
                    <input
                      type="text"
                      name="documento"
                      value={formData.documento}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Número de documento"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de Nacimiento
                    </label>
                    <input
                      type="date"
                      name="fechaNacimiento"
                      value={formData.fechaNacimiento}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Género
                    </label>
                    <select
                      name="genero"
                      value={formData.genero}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Seleccionar género</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Femenino">Femenino</option>
                      <option value="Otro">Otro</option>
                      <option value="Prefiero no decir">Prefiero no decir</option>
                    </select>
                  </div>

                  {/* Información de Contacto */}
                  <div className="md:col-span-2 mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <span>📞</span> Información de Contacto
                    </h3>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+57 300 123 4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      name="correo"
                      value={formData.correo}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="correo@ejemplo.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dirección
                    </label>
                    <input
                      type="text"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Dirección de residencia"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ciudad
                    </label>
                    <input
                      type="text"
                      name="ciudad"
                      value={formData.ciudad}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ciudad de residencia"
                    />
                  </div>

                  {/* Contacto de Emergencia */}
                  <div className="md:col-span-2 mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <span>🆘</span> Contacto de Emergencia
                    </h3>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del Contacto
                    </label>
                    <input
                      type="text"
                      name="emergenciaContacto"
                      value={formData.emergenciaContacto}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nombre completo del contacto"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono de Emergencia
                    </label>
                    <input
                      type="tel"
                      name="emergenciaTelefono"
                      value={formData.emergenciaTelefono}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+57 300 123 4567"
                    />
                  </div>

                  {/* Estado */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado
                    </label>
                    <select
                      name="estado"
                      value={formData.estado}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                    </select>
                  </div>

                  {/* Cursos */}
                  <div className="md:col-span-2 mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <span>📚</span> Cursos Asignados
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto p-1">
                      {availableCourses.map((course) => (
                        <label key={course} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.cursos.includes(course)}
                            onChange={() => handleCourseChange(course)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">{course}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-8 pt-6 border-t">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <span>{editingStudent ? '💾' : '➕'}</span>
                    {editingStudent ? 'Actualizar' : 'Crear'} Estudiante
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de detalles del estudiante */}
        {showDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <div className={`h-12 w-12 rounded-full bg-gradient-to-r ${getRandomGradient(showDetails.id)} flex items-center justify-center text-white font-medium`}>
                    {getInitials(showDetails.nombres, showDetails.apellidos)}
                  </div>
                  Detalles del Estudiante
                </h2>
                <button onClick={() => setShowDetails(null)} className="text-gray-400 hover:text-gray-600 text-2xl">
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Información básica */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span>👤</span> Información Personal
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Nombre Completo</label>
                      <p className="text-gray-900">{showDetails.nombres} {showDetails.apellidos}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Documento</label>
                      <p className="text-gray-900">{showDetails.tipoDocumento}: {showDetails.documento}</p>
                    </div>
                    {showDetails.fechaNacimiento && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Fecha de Nacimiento</label>
                        <p className="text-gray-900">{formatDate(showDetails.fechaNacimiento)}</p>
                      </div>
                    )}
                    {showDetails.genero && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Género</label>
                        <p className="text-gray-900">{showDetails.genero}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Información de contacto */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span>📞</span> Información de Contacto
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Teléfono</label>
                      <p className="text-gray-900">{showDetails.telefono}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Correo</label>
                      <p className="text-gray-900">{showDetails.correo}</p>
                    </div>
                    {showDetails.direccion && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Dirección</label>
                        <p className="text-gray-900">{showDetails.direccion}</p>
                      </div>
                    )}
                    {showDetails.ciudad && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Ciudad</label>
                        <p className="text-gray-900">{showDetails.ciudad}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contacto de emergencia */}
                {(showDetails.emergenciaContacto || showDetails.emergenciaTelefono) && (
                  <div className="bg-red-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <span>🆘</span> Contacto de Emergencia
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {showDetails.emergenciaContacto && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Contacto</label>
                          <p className="text-gray-900">{showDetails.emergenciaContacto}</p>
                        </div>
                      )}
                      {showDetails.emergenciaTelefono && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Teléfono</label>
                          <p className="text-gray-900">{showDetails.emergenciaTelefono}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Cursos */}
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span>📚</span> Cursos Asignados ({showDetails.cursos.length})
                  </h3>
                  {showDetails.cursos.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {showDetails.cursos.map((curso, index) => (
                        <span key={index} className="inline-flex px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">
                          {curso}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No tiene cursos asignados</p>
                  )}
                </div>

                {/* Información del sistema */}
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span>⚙️</span> Información del Sistema
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Estado</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(showDetails.estado)}`}>
                        {showDetails.estado}
                      </span>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Fecha de Registro</label>
                      <p className="text-gray-900">{formatDate(showDetails.fechaRegistro)}</p>
                    </div>
                    {showDetails.ultimaActividad && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Última Actividad</label>
                        <p className="text-gray-900">{formatDate(showDetails.ultimaActividad)}</p>
                      </div>
                    )}
                    {showDetails.promedioPuntaje !== undefined && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Promedio</label>
                        <p className="text-gray-900">{showDetails.promedioPuntaje.toFixed(1)} / 5.0</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t px-6 py-4 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowDetails(null)
                    handleEdit(showDetails)
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <span>✏️</span>
                  Editar Estudiante
                </button>
                <button
                  onClick={() => setShowDetails(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Students