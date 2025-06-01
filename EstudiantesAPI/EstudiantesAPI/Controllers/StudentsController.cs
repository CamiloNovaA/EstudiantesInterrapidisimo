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

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Student>>> GetAll()
    {
        var students = await _studentRepository.GetAllAsync();
        return Ok(students);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Student>> GetById(int id)
    {
        var student = await _studentRepository.GetByIdAsync(id);
        if (student == null)
            return NotFound();
        return Ok(student);
    }

    [HttpPost]
    public async Task<ActionResult<int>> Create(Student student)
    {
        student.RegistrationDate = DateTime.UtcNow;
        var id = await _studentRepository.CreateAsync(student);
        return CreatedAtAction(nameof(GetById), new { id }, id);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Student student)
    {
        if (id != student.Id)
            return BadRequest();

        var success = await _studentRepository.UpdateAsync(student);
        if (!success)
            return NotFound();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var success = await _studentRepository.DeleteAsync(id);
        if (!success)
            return NotFound();

        return NoContent();
    }

    [HttpGet("{studentId}/classmates/{subjectId}")]
    public async Task<ActionResult<IEnumerable<Student>>> GetClassmates(int studentId, int subjectId)
    {
        var classmates = await _studentRepository.GetClassmatesBySubjectAsync(subjectId, studentId);
        return Ok(classmates);
    }
} 