"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.componentes = void 0;
// Componentes organizados por categoría
exports.componentes = [
    // Componentes de UI - Student
    {
        categoria: "Componentes de UI",
        descripcion: "Componente para mostrar ranking de estudiantes con puntuaciones",
        nombre: "Ranking Component",
        ruta: "./lib/components/student/ranking/ranking.component",
        tipo: "Componente Estudiante",
        toastReferenciado: "ui-components-toast"
    },
    {
        categoria: "Componentes de UI",
        descripcion: "Componente para mostrar horarios y cronogramas de eventos",
        nombre: "Schedule Component",
        ruta: "./lib/components/student/schedule/schedule.component",
        tipo: "Componente Estudiante",
        toastReferenciado: "ui-components-toast"
    },
    // Componentes de UI - Teacher
    {
        categoria: "Componentes de UI",
        descripcion: "Componente para visualizar el estado y progreso de alumnos",
        nombre: "Estado Alumno Component",
        ruta: "./lib/components/teacher/estado-alumno/estado-alumno.component",
        tipo: "Componente Profesor",
        toastReferenciado: "ui-components-toast"
    },
    {
        categoria: "Componentes de UI",
        descripcion: "Componente para listar recursos educativos disponibles",
        nombre: "Listado Recursos Component",
        ruta: "./lib/components/teacher/listado-recursos/listado-recursos.component",
        tipo: "Componente Profesor",
        toastReferenciado: "ui-components-toast"
    },
    {
        categoria: "Componentes de UI",
        descripcion: "Componente para subir material educativo al sistema",
        nombre: "Subida Material Component",
        ruta: "./lib/components/teacher/subida-material/subida-material.component",
        tipo: "Componente Profesor",
        toastReferenciado: "ui-components-toast"
    },
    // Componentes de UI - Admin
    {
        categoria: "Componentes de UI",
        descripcion: "Componente para mostrar estadísticas generales del sistema",
        nombre: "Estadísticas Component",
        ruta: "./lib/components/admin/estadisticas/estadisticas.component",
        tipo: "Componente Admin",
        toastReferenciado: "ui-components-toast"
    },
    {
        categoria: "Componentes de UI",
        descripcion: "Componente para renderizar gráficos simples de datos",
        nombre: "Gráfico Simple Component",
        ruta: "./lib/components/admin/grafico-simple/grafico-simple.component",
        tipo: "Componente Admin",
        toastReferenciado: "ui-components-toast"
    },
    {
        categoria: "Componentes de UI",
        descripcion: "Componente para mostrar datos en formato tabla",
        nombre: "Tabla Datos Component",
        ruta: "./lib/components/admin/tabla-datos/tabla-datos.component",
        tipo: "Componente Admin",
        toastReferenciado: "ui-components-toast"
    },
    // Componentes de UI - Auth
    {
        categoria: "Componentes de UI",
        descripcion: "Componente de login para autenticación de usuarios",
        nombre: "Login Component",
        ruta: "./lib/components/auth/login/login.component",
        tipo: "Componente Autenticación",
        toastReferenciado: "ui-components-toast"
    },
    // Servicios
    {
        categoria: "Servicios",
        descripcion: "Servicio para manejo de autenticación y autorización",
        nombre: "Auth Service",
        ruta: "./lib/services/auth.service",
        tipo: "Servicio Autenticación",
        toastReferenciado: "services-toast"
    },
    {
        categoria: "Servicios",
        descripcion: "Servicio para gestión de eventos del sistema",
        nombre: "Event Service",
        ruta: "./lib/services/event.service",
        tipo: "Servicio Eventos",
        toastReferenciado: "services-toast"
    },
    {
        categoria: "Servicios",
        descripcion: "Servicio para operaciones relacionadas con profesores",
        nombre: "Teacher Service",
        ruta: "./lib/services/teacher.service",
        tipo: "Servicio Profesor",
        toastReferenciado: "services-toast"
    },
    {
        categoria: "Servicios",
        descripcion: "Servicio para gestión de usuarios del sistema",
        nombre: "User Service",
        ruta: "./lib/services/user.service",
        tipo: "Servicio Usuario",
        toastReferenciado: "services-toast"
    },
    // Modelos
    {
        categoria: "Modelos",
        descripcion: "Modelo de datos para materiales educativos",
        nombre: "Material Model",
        ruta: "./lib/models/material.model",
        tipo: "Interfaz Material",
        toastReferenciado: "models-toast"
    },
    {
        categoria: "Modelos",
        descripcion: "Modelo de datos para estudiantes",
        nombre: "Student Model",
        ruta: "./lib/models/student.model",
        tipo: "Interfaz Estudiante",
        toastReferenciado: "models-toast"
    },
    {
        categoria: "Modelos",
        descripcion: "Modelo de datos para eventos del sistema",
        nombre: "Evento Model",
        ruta: "./lib/models/evento.model",
        tipo: "Interfaz Evento",
        toastReferenciado: "models-toast"
    },
    {
        categoria: "Modelos",
        descripcion: "Modelo de datos para usuarios del sistema",
        nombre: "Usuario Model",
        ruta: "./lib/models/usuario.model",
        tipo: "Interfaz Usuario",
        toastReferenciado: "models-toast"
    },
    // Guards
    {
        categoria: "Guards",
        descripcion: "Guard para proteger rutas que requieren autenticación",
        nombre: "Auth Guard",
        ruta: "./lib/guards/auth.guard",
        tipo: "Guard Autenticación",
        toastReferenciado: "guards-toast"
    },
    {
        categoria: "Guards",
        descripcion: "Guard para control de acceso basado en roles de usuario",
        nombre: "Role Guard",
        ruta: "./lib/guards/role.guard",
        tipo: "Guard Roles",
        toastReferenciado: "guards-toast"
    }
];
