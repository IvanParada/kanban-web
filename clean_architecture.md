src/
│
├── app/
│   ├── core/                         # Servicios compartidos, interfaces y dependencias globales
│   │   ├── services/                 # Servicios globales que se usan en toda la app
│   │   │   ├── http.service.ts       # Servicio HTTP base para manejo de peticiones
│   │   │   ├── auth.service.ts       # Servicio de autenticación centralizado
│   │   │   ├── notification.service.ts # Servicio global de notificaciones (snackbars, etc.)
│   │   │   └── ...
│   │   ├── interceptors/             # Interceptores HTTP para manejo de headers y errores globales
│   │   ├── models/                   # Modelos globales e interfaces
│   │   └── core.module.ts            # Módulo del Core (importación de servicios, etc.)
│   │
│   ├── shared/                       # Componentes, directivas, pipes reutilizables
│   │   ├── components/               # Componentes comunes (botones, formularios, etc.)
│   │   ├── directives/               # Directivas reutilizables
│   │   ├── pipes/                    # Pipes personalizados
│   │   └── shared.module.ts          # Módulo compartido (importado en toda la app)
│   │
│   ├── features/                     # Módulos principales (cada feature tiene su propio módulo)
│   │   ├── auth/                     # Módulo de autenticación (Login, Registro)
│   │   │   ├── components/           # Componentes del módulo (login, registro)
│   │   │   │   ├── login.component.ts
│   │   │   │   ├── login.component.html
│   │   │   │   ├── register.component.ts
│   │   │   │   └── register.component.html
│   │   │   ├── services/             # Servicio de autenticación (login, logout, registro)
│   │   │   │   └── auth.service.ts
│   │   │   ├── auth.module.ts        # Módulo de autenticación
│   │   │   └── auth-routing.module.ts # Rutas específicas para login y registro
│   │   │
│   │   ├── dashboard/                # Módulo del dashboard (Tareas, actividades)
│   │   │   ├── components/           # Componentes del dashboard
│   │   │   │   ├── task-list.component.ts
│   │   │   │   ├── task-create.component.ts
│   │   │   │   └── task-edit.component.ts
│   │   │   ├── services/             # Servicio del dashboard (gestión de tareas)
│   │   │   │   └── dashboard.service.ts
│   │   │   ├── dashboard.module.ts   # Módulo del dashboard
│   │   │   └── dashboard-routing.module.ts # Rutas específicas del dashboard
│   │   │
│   │   ├──  tasks/                    # Módulo de tareas (CRUD) + Imagenes dentro de tareas
│   │   │   ├── components/           # Componentes de tareas (ver detalles, editar)
│   │   │   │   ├── task-create.component.ts    # Componente para crear tareas (con imágenes)
│   │   │   │   ├── task-create.component.html   # Vista HTML para crear tarea (con formulario para imagen)
│   │   │   │   ├── task-create.component.css    # Estilos del componente de tarea
│   │   │   │   ├── image-upload.component.ts    # Componente para carga de imágenes dentro de la tarea
│   │   │   │   └── image-upload.component.html   # Vista HTML de la carga de imágenes
│   │   │   ├── services/             # Servicio para el CRUD de tareas + manejo de imágenes
│   │   │   │   ├── task.service.ts       # Lógica para CRUD de tareas
│   │   │   │   └── image-task.service.ts # Lógica para manejar imágenes dentro de tareas
│   │   │   ├── tasks.module.ts       # Módulo de tareas
│   │   │   └── tasks-routing.module.ts # Rutas específicas de tareas
│   │
│   ├── app-routing.module.ts         # Rutas globales de la aplicación
│   ├── app.component.ts              # Componente principal
│   └── app.module.ts                 # Módulo raíz de la aplicación
│
├── assets/                           # Archivos estáticos (imágenes, estilos globales)
├── environments/                     # Configuración de ambientes (dev, prod)
└── styles/                           # Estilos globales de la app
