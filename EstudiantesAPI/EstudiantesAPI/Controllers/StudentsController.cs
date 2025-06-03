using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using EstudiantesAPI.Data.Interfaces;
using EstudiantesAPI.Models;

namespace EstudiantesAPI.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class StudentsController : ControllerBase
{
    private readonly IStudentRepository _studentRepository;

    public StudentsController(IStudentRepository studentRepository)
    {
        _studentRepository = studentRepository;
    }

    /// <summary>
    /// Obtener todos los estudiantes
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Student>>> GetAll()
    {
        var students = await _studentRepository.GetAllAsync();
        return Ok(students);
    }

    [HttpGet("SubjectsAvailable/{id}")]
    public async Task<ActionResult<IEnumerable<Subject>>> GetAllSubjectsAvaliables(int id)
    {
        var subjects = await _studentRepository.GetAllSubjectsAvaliables(id);
        return Ok(subjects);
    }

    [HttpGet("MySubjects/{id}")]
    public async Task<ActionResult<IEnumerable<Subject>>> GetMySubjects(int id)
    {
        var subjects = await _studentRepository.GetMySubjects(id);
        return Ok(subjects);
    }

    /// <summary>
    /// Obtener estudiante por ID
    /// </summary>
    /// <param name="id">Id estudiante</param>
    [HttpGet("{id}")]
    public async Task<ActionResult<Student>> GetById(int id)
    {
        var student = await _studentRepository.GetByIdAsync(id);
        if (student == null)
            return NotFound();
        return Ok(student);
    }

    /// <summary>
    /// Actualiza un estudiante
    /// </summary>
    /// <param name="id"></param>
    /// <param name="student"></param>
    /// <returns></returns>
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Student student)
    {
        if (id != student.Id)
            return BadRequest("No puede editar un estudiante que no sea el suyo");

        var success = await _studentRepository.UpdateAsync(student);
        if (!success)
            return NotFound("Fallo la actualización de datos");

        return Ok("Se actualizo con exito");
    }

    /// <summary>
    /// Elimina un estudiante si se requiere
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var success = await _studentRepository.DeleteAsync(id);
        if (!success)
            return Ok("Se elimino al estudiante");

        return BadRequest("No se logro eliminar al estudiante");
    }

    /// <summary>
    /// Obtiene los compañeros de clase de un estudiante
    /// </summary>
    /// <param name="studentId">Id estudiante</param>
    /// <param name="subjectId">Id materia</param>
    /// <returns></returns>
    [HttpGet("{studentId}/classmates/{subjectId}")]
    public async Task<ActionResult<IEnumerable<Student>>> GetClassmates(int studentId, int subjectId)
    {
        var classmates = await _studentRepository.GetClassmatesBySubjectAsync(subjectId, studentId);
        return Ok(classmates);
    }

    /// <summary>
    /// Inscribirse en una materia y sus validaciones
    /// </summary>
    /// <param name="studentId">id estudiante</param>
    /// <param name="subjectId">id materia</param>
    /// <returns></returns>
    [HttpPost]
    [Route("EnrollInSubject")]
    public async Task<IActionResult> EnrollInSubject(RegistrarMateria registrarMateria)
    {
        // Verificar si el estudiante ya tiene 3 materias
        var currentSubjects = await _studentRepository.GetEnrolledSubjectsCountAsync(registrarMateria.IdStudent);
        if (currentSubjects >= 3)
            return Conflict(new GeneralResponse
            {
                mensaje = "El estudiante ya está inscrito en el máximo de materias permitidas (3)."
            });

        // Obtener el profesor de la materia y verificar si ya tiene una materia con él
        var hasClassWithTeacher = await _studentRepository.HasClassWithTeacherAsync(registrarMateria.IdStudent, registrarMateria.IdSubject);
        if (hasClassWithTeacher)
            return Conflict(new GeneralResponse
            {
                mensaje = "El estudiante ya tiene una materia con este profesor."
            });

        var success = await _studentRepository.EnrollInSubjectAsync(registrarMateria.IdStudent, registrarMateria.IdSubject);
        if (!success)
            return Conflict(new GeneralResponse
            {
                mensaje = "No se pudo inscribir al estudiante en la materia."
            });

        return Ok(new GeneralResponse
        {
            mensaje = "Se registro con éxito en la materia."
        });
    }

    /// <summary>
    /// Desinscribirse en una materia y sus validaciones
    /// </summary>
    /// <param name="studentId">id estudiante</param>
    /// <param name="subjectId">id materia</param>
    /// <returns></returns>
    [HttpDelete("{studentId}/subjects/{subjectId}")]
    public async Task<IActionResult> UnenrollFromSubject(int studentId, int subjectId)
    {
        var success = await _studentRepository.UnenrollFromSubjectAsync(studentId, subjectId);
        if (!success)
            return BadRequest(new GeneralResponse
            {
                mensaje = "No se pudo retirar de la materia o quizá ya no este registrado, por favor nuevamente."
            });

        return Ok(new GeneralResponse
        {
            mensaje = "Se ha elimina su asistencia a la materia con exito"
        });
    }
} 