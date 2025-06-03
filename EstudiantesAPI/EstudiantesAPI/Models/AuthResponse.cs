namespace EstudiantesAPI.Models;

public class AuthResponse
{
    public long IdUser { get; set; }
    public string Token { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateTime Expiration { get; set; }
} 