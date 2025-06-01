using EstudiantesAPI.Models;

namespace EstudiantesAPI.Services;

public interface IAuthService
{
    Task<AuthResponse?> Login(LoginRequest request);
    string GenerateJwtToken(Student student);
    string HashPassword(string password);
    bool VerifyPassword(string password, string hashedPassword);
} 