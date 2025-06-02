using Microsoft.AspNetCore.Mvc;
using EstudiantesAPI.Models;
using EstudiantesAPI.Services;
using EstudiantesAPI.Data.Interfaces;

namespace EstudiantesAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IStudentRepository _studentRepository;

    public AuthController(IAuthService authService, IStudentRepository studentRepository)
    {
        _authService = authService;
        _studentRepository = studentRepository;
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
    {
        var response = await _authService.Login(request);
        if (response == null)
            return Unauthorized();
        return Ok(response);
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register([FromBody] Student student)
    {
        student.Password = _authService.HashPassword(student.Password);
        student.RegistrationDate = DateTime.UtcNow;

        var id = await _studentRepository.CreateAsync(student);
        student.Id = id;

        var token = _authService.GenerateJwtToken(student);
        var response = new AuthResponse
        {
            Token = token,
            Email = student.Email,
            Expiration = DateTime.UtcNow.AddHours(1)
        };

        return CreatedAtAction(nameof(Login), response);
    }
} 