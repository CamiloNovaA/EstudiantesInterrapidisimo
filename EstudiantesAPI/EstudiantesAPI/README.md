# Estudiantes API

Esta es una API para el registro de estudiantes que permite la gestión de materias y profesores.

## Endpoints

### Estudiantes

- GET /api/students - Obtener todos los estudiantes
- GET /api/students/{id} - Obtener un estudiante por ID
- POST /api/students - Crear un nuevo estudiante
- PUT /api/students/{id} - Actualizar un estudiante
- DELETE /api/students/{id} - Eliminar un estudiante
- GET /api/students/{studentId}/classmates/{subjectId} - Obtener compañeros de clase por materia

## Reglas de Negocio

1.Realizar un CRUD que le permita a un usuario realizar un registro en línea.
2.El estudiante se adhiere a un programa de créditos
3.Existen 10 materias
4.Cada materia equivale a 3 créditos.
5.El estudiante sólo podrá seleccionar 3 materias.
6.Hay 5 profesores que dictan 2 materias cada uno.
7.El estudiante no podrá tener clases con el mismo profesor.
8.Cada estudiante puede ver en línea los registros de otros estudiantes.
9.El estudiante podrá ver sólo el nombre de los alumnos con quienes compartirá cada
clase.