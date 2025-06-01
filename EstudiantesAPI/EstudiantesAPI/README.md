# Estudiantes API

Esta es una API para el registro de estudiantes que permite la gestión de materias y profesores.

## Requisitos

- SQL Server
- .NET 8.0 SDK
- Visual Studio 2022 o Visual Studio Code

## Configuración

1. Clonar el repositorio
2. Crear la base de datos ejecutando el script en `Database/CreateDatabase.sql`
3. Actualizar la cadena de conexión en `appsettings.json` si es necesario

## Características

- CRUD completo de estudiantes
- Registro de materias (3 materias máximo por estudiante)
- 10 materias disponibles
- 5 profesores que dictan 2 materias cada uno
- Validación para evitar clases con el mismo profesor
- Consulta de compañeros de clase por materia

## Endpoints

### Estudiantes

- GET /api/students - Obtener todos los estudiantes
- GET /api/students/{id} - Obtener un estudiante por ID
- POST /api/students - Crear un nuevo estudiante
- PUT /api/students/{id} - Actualizar un estudiante
- DELETE /api/students/{id} - Eliminar un estudiante
- GET /api/students/{studentId}/classmates/{subjectId} - Obtener compañeros de clase por materia

## Ejecución

1. Navegar al directorio del proyecto
2. Ejecutar `dotnet restore`
3. Ejecutar `dotnet run`
4. Abrir el navegador en `https://localhost:7001/swagger` para ver la documentación de la API

## Reglas de Negocio

- Cada estudiante puede inscribirse en máximo 3 materias
- Cada materia vale 3 créditos
- Un estudiante no puede tener más de una materia con el mismo profesor
- Los estudiantes pueden ver quiénes son sus compañeros en cada materia 