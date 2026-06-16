# 🏥 Fi-Citas — Sistema de Agendación de Citas de Fisioterapia

Sistema fullstack de agendación de citas implementado con **MVC**, **Singleton** y **Factory Method**.

---

## 🚀 Inicio rápido

### Backend (Node.js + Express)
```bash
cd backend
npm install
npm run dev        # → http://localhost:3001
```

### Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev        # → http://localhost:5173
```

---

## 🗂️ Estructura de carpetas

```
appointment-system/
├── backend/
│   ├── package.json
│   └── src/
│       ├── server.js                          ← Entrada + Express
│       ├── config/
│       ├── patterns/
│       │   ├── Database.singleton.js          ← SINGLETON: BD en memoria
│       │   └── EntityFactory.factory.js       ← FACTORY METHOD: crea entidades
│       ├── models/
│       │   ├── PatientModel.js                ← MODEL: lógica de negocio paciente
│       │   ├── AppointmentModel.js            ← MODEL: lógica de negocio cita
│       │   └── DoctorModel.js                 ← MODEL: acceso a doctores
│       ├── controllers/
│       │   ├── PatientController.js           ← CONTROLLER: HTTP pacientes
│       │   ├── AppointmentController.js       ← CONTROLLER: HTTP citas
│       │   └── DoctorController.js            ← CONTROLLER: HTTP doctores
│       └── routes/
│           ├── patientRoutes.js               ← GET/POST/PUT/DELETE /api/patients
│           ├── appointmentRoutes.js           ← GET/POST/PUT/DELETE /api/appointments
│           └── doctorRoutes.js                ← GET /api/doctors
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── main.jsx                           ← Entrada React
        ├── App.jsx                            ← Router principal
        ├── index.css                          ← Design tokens + estilos globales
        ├── patterns/
        │   └── NotificationStore.singleton.js ← SINGLETON: canal de notificaciones
        ├── context/
        │   └── AppContext.jsx                 ← Estado global + llamadas a la API
        ├── services/
        │   └── api.service.js                 ← Capa de comunicación con el backend
        ├── components/
        │   ├── layout/
        │   │   └── Sidebar.jsx                ← Navegación lateral
        │   ├── forms/
        │   │   ├── PatientForm.jsx            ← Formulario registro paciente
        │   │   └── AppointmentForm.jsx        ← Formulario agendar cita
        │   └── shared/
        │       ├── Modal.jsx                  ← Componente modal reutilizable
        │       └── ToastContainer.jsx         ← Notificaciones toast
        └── pages/
            ├── Dashboard.jsx                  ← Vista principal con estadísticas
            ├── Patients.jsx                   ← Gestión de pacientes
            └── Appointments.jsx               ← Gestión de citas
```

---

## 🏗️ Patrones de diseño

### 🔒 Singleton — `Database.singleton.js`
Garantiza que solo exista **una instancia** de la base de datos en memoria durante todo el ciclo de vida del servidor. Cualquier módulo que importe `database` recibe siempre el mismo objeto.

```js
class Database {
  constructor() {
    if (Database._instance) return Database._instance; // retorna instancia existente
    this._patients = [];
    Database._instance = this;
  }
}
export default new Database(); // única exportación
```

### 🏭 Factory Method — `EntityFactory.factory.js`
Define una interfaz común (`EntityFactory.create(type, data)`) para crear entidades. La lógica de qué clase instanciar queda encapsulada en el factory, no dispersa en los controladores.

```js
class EntityFactory {
  static create(type, data) {
    switch (type) {
      case "patient":     return new Patient(data);
      case "appointment": return new Appointment(data);
    }
  }
}
```

### 🔒 Singleton (Frontend) — `NotificationStore.singleton.js`
Una única instancia del store de notificaciones accesible desde cualquier componente React sin necesidad de prop drilling ni contexto adicional.

---

## 📡 API Endpoints

| Método | Ruta                        | Descripción               |
|--------|-----------------------------|---------------------------|
| GET    | /api/patients               | Listar pacientes          |
| POST   | /api/patients               | Crear paciente            |
| GET    | /api/patients/:id           | Obtener paciente          |
| PUT    | /api/patients/:id           | Actualizar paciente       |
| DELETE | /api/patients/:id           | Eliminar paciente         |
| GET    | /api/appointments           | Listar citas              |
| POST   | /api/appointments           | Crear cita                |
| PUT    | /api/appointments/:id       | Actualizar cita           |
| DELETE | /api/appointments/:id       | Cancelar cita             |
| GET    | /api/doctors                | Listar doctores           |
| GET    | /api/health                 | Health check              |

---

## 📋 Campos del formulario de paciente

| Campo          | Tipo     | Requerido |
|----------------|----------|-----------|
| nombre         | text     | ✅        |
| apellido       | text     | ✅        |
| edad           | number   | ✅        |
| peso (kg)      | number   | ✅        |
| estatura (cm)  | number   | ✅        |
| historialMedico| textarea | ❌        |
| sexo           | select   | ✅        |
| ocupacion      | text     | ✅        |

> El **IMC** se calcula automáticamente en tiempo real en el formulario.
