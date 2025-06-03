using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using EstudiantesAPI.Data.Interfaces;
using EstudiantesAPI.Models;
using Microsoft.IdentityModel.Tokens;

namespace EstudiantesAPI.Services;

public class AuthService : IAuthService
{
    private readonly IConfiguration _configuration;
    private readonly IStudentRepository _studentRepository;

    public AuthService(IConfiguration configuration, IStudentRepository studentRepository)
    {
        _configuration = configuration;
        _studentRepository = studentRepository;
    }

    public async Task<AuthResponse?> Login(LoginRequest request)
    {
        var students = await _studentRepository.GetAllAsync();
        var student = students.FirstOrDefault(s => s.Email == request.Email);

        if (student == null || !VerifyPassword(request.Password, student.Password))
            return null;

        var token = GenerateJwtToken(student);
        return new AuthResponse
        {
            Token = token,
            Email = student.Email,
            Expiration = DateTime.UtcNow.AddHours(1),
            IdUser = student.Id,
        };
    }

    public string GenerateJwtToken(Student student)
    {
        var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not found"));
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, student.Id.ToString()),
                new Claim(ClaimTypes.Email, student.Email)
            }),
            Expires = DateTime.UtcNow.AddHours(1),
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature)
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    public string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(hashedBytes);
    }

    public bool VerifyPassword(string password, string hashedPassword)
    {
        return HashPassword(password) == hashedPassword;
    }
} 