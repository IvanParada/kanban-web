# KanbanWeb

Una aplicación web moderna de gestión de tareas tipo Kanban, construida con **Angular 21**, **Tailwind CSS** y **DaisyUI**. Este proyecto sigue principios de **Clean Architecture** para garantizar escalabilidad y mantenibilidad.

json
```
https://kanban-web-orpin.vercel.app
```

## 🚀 Características Principales

*   **Gestión de Tareas**: Visualización y administración de tareas en un tablero Kanban.
*   **Autenticación**: Sistema completo de Login y Registro de usuarios.
*   **Arquitectura Modular**: Organización del código en módulos por características (Features), con capas Core y Shared definidas.
*   **UI Moderna**: Interfaz de usuario responsiva y elegante utilizando Tailwind CSS 4 y componentes de DaisyUI 5.

## 🛠️ Tecnologías Utilizadas

*   **Framework**: [Angular 21](https://angular.dev/)
*   **Estilos**: [Tailwind CSS 4](https://tailwindcss.com/)
*   **Componentes UI**: [DaisyUI 5](https://daisyui.com/)
*   **Reactive Programming**: RxJS
*   **Testing**: Vitest
*   **Lenguaje**: TypeScript 5.9

## 📂 Estructura del Proyecto

El proyecto sigue una estructura basada en Clean Architecture:

```
src/app/
├── core/       # Servicios singleton, interceptores, guards y modelos globales
├── shared/     # Componentes, directivas y pipes reutilizables
└── features/   # Módulos principales de negocio
    ├── auth/   # Autenticación (Login, Registro)
    └── task/   # Gestión del tablero y tareas
```

## ⚙️ Instalación y Ejecución

Sigue estos pasos para ejecutar el proyecto en tu entorno local:

1.  **Clonar el repositorio**:
    ```bash
    git clone https://github.com/IvanParada/kanban-web.git
    cd kanban-web
    ```

2.  **Instalar dependencias**:
    ```bash
    npm install
    ```

3.  **Iniciar el servidor de desarrollo**:
    ```bash
    npm start
    # o ejecutar directamente: ng serve -o
    ```

4.  **Abrir la aplicación**:
    Navega a `http://localhost:4200/` en tu navegador. La aplicación se recargará automáticamente si realizas cambios en el código.

## 📦 Scripts Disponibles

*   `npm start`: Inicia el servidor de desarrollo.
*   `npm run build`: Compila la aplicación para producción en el directorio `dist/`.
*   `npm test`: Ejecuta las pruebas unitarias.
*   `npm run watch`: Compila en modo desarrollo y observa cambios.

```bash
npm test
```
