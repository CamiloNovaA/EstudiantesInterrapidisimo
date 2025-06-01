namespace EstudiantesAPI.Models;

public class Subject
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Credits { get; set; } = 3; // Each subject has 3 credits
    public int TeacherId { get; set; }
} 