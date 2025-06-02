using Dapper;
using EstudiantesAPI.Data.Interfaces;
using EstudiantesAPI.Models;
using Microsoft.Data.SqlClient;
using System.Data;

namespace EstudiantesAPI.Data.Repositories;

public class StudentRepository : IStudentRepository
{
    private readonly DatabaseContext _context;

    public StudentRepository(DatabaseContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Student>> GetAllAsync()
    {
        using var connection = _context.CreateConnection();
        return await connection.QueryAsync<Student>("SELECT * FROM Students");
    }

    public async Task<Student?> GetByIdAsync(int id)
    {
        using var connection = _context.CreateConnection();
        return await connection.QueryFirstOrDefaultAsync<Student>(
            "SELECT * FROM Students WHERE Id = @Id", new { Id = id });
    }

    public async Task<int> CreateAsync(Student student)
    {
        using var connection = _context.CreateConnection() as SqlConnection;
        await connection!.OpenAsync();

        using var command = new SqlCommand(
            @"INSERT INTO Students (Name, Email, Password, RegistrationDate) 
              VALUES (@Name, @Email, @Password, @RegistrationDate);
              SELECT CAST(SCOPE_IDENTITY() as int)", connection);

        command.Parameters.AddWithValue("@Name", student.Name);
        command.Parameters.AddWithValue("@Email", student.Email);
        command.Parameters.AddWithValue("@Password", student.Password);
        command.Parameters.AddWithValue("@RegistrationDate", student.RegistrationDate);

        return (int)await command.ExecuteScalarAsync();
    }

    public async Task<bool> UpdateAsync(Student student)
    {
        using var connection = _context.CreateConnection() as SqlConnection;
        await connection!.OpenAsync();

        using var command = new SqlCommand(
            @"UPDATE Students 
              SET Name = @Name, 
                  Email = @Email, 
                  PhoneNumber = @PhoneNumber 
              WHERE Id = @Id", connection);

        command.Parameters.AddWithValue("@Id", student.Id);
        command.Parameters.AddWithValue("@Name", student.Name);
        command.Parameters.AddWithValue("@Email", student.Email);

        var rowsAffected = await command.ExecuteNonQueryAsync();
        return rowsAffected > 0;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        using var connection = _context.CreateConnection() as SqlConnection;
        await connection!.OpenAsync();

        // Primero eliminamos las relaciones en StudentSubjects
        using var deleteSubjectsCommand = new SqlCommand(
            "DELETE FROM StudentSubjects WHERE StudentId = @Id", connection);
        deleteSubjectsCommand.Parameters.AddWithValue("@Id", id);
        await deleteSubjectsCommand.ExecuteNonQueryAsync();

        // Luego eliminamos el estudiante
        using var deleteStudentCommand = new SqlCommand(
            "DELETE FROM Students WHERE Id = @Id", connection);
        deleteStudentCommand.Parameters.AddWithValue("@Id", id);

        var rowsAffected = await deleteStudentCommand.ExecuteNonQueryAsync();
        return rowsAffected > 0;
    }

    public async Task<IEnumerable<Student>> GetClassmatesBySubjectAsync(int subjectId, int studentId)
    {
        using var connection = _context.CreateConnection();
        var sql = @"SELECT s.* FROM Students s
                    INNER JOIN StudentSubjects ss ON s.Id = ss.StudentId
                    WHERE ss.SubjectId = @SubjectId AND s.Id != @StudentId";
        return await connection.QueryAsync<Student>(sql, new { SubjectId = subjectId, StudentId = studentId });
    }

    public async Task<int> GetEnrolledSubjectsCountAsync(int studentId)
    {
        using var connection = _context.CreateConnection();
        return await connection.QuerySingleAsync<int>(
            "SELECT COUNT(*) FROM StudentSubjects WHERE StudentId = @StudentId",
            new { StudentId = studentId });
    }

    public async Task<bool> HasClassWithTeacherAsync(int studentId, int teacherId)
    {
        using var connection = _context.CreateConnection();
        var sql = @"SELECT COUNT(*) FROM StudentSubjects ss
                    INNER JOIN Subjects s ON ss.SubjectId = s.Id
                    WHERE ss.StudentId = @StudentId AND s.TeacherId = @TeacherId";
        var count = await connection.QuerySingleAsync<int>(sql, 
            new { StudentId = studentId, TeacherId = teacherId });
        return count > 0;
    }

    public async Task<bool> EnrollInSubjectAsync(int studentId, int subjectId)
    {
        using var connection = _context.CreateConnection() as SqlConnection;
        await connection!.OpenAsync();

        // Verificar si ya está inscrito
        using var checkCommand = new SqlCommand(
            "SELECT COUNT(*) FROM StudentSubjects WHERE StudentId = @StudentId AND SubjectId = @SubjectId",
            connection);
        checkCommand.Parameters.AddWithValue("@StudentId", studentId);
        checkCommand.Parameters.AddWithValue("@SubjectId", subjectId);

        var count = (int)await checkCommand.ExecuteScalarAsync();
        if (count > 0)
            return false;

        // Inscribir al estudiante
        using var enrollCommand = new SqlCommand(
            @"INSERT INTO StudentSubjects (StudentId, SubjectId, EnrollmentDate) 
              VALUES (@StudentId, @SubjectId, @EnrollmentDate)",
            connection);

        enrollCommand.Parameters.AddWithValue("@StudentId", studentId);
        enrollCommand.Parameters.AddWithValue("@SubjectId", subjectId);
        enrollCommand.Parameters.AddWithValue("@EnrollmentDate", DateTime.UtcNow);

        var rowsAffected = await enrollCommand.ExecuteNonQueryAsync();
        return rowsAffected > 0;
    }

    public async Task<bool> UnenrollFromSubjectAsync(int studentId, int subjectId)
    {
        using var connection = _context.CreateConnection() as SqlConnection;
        await connection!.OpenAsync();

        using var command = new SqlCommand(
            "DELETE FROM StudentSubjects WHERE StudentId = @StudentId AND SubjectId = @SubjectId",
            connection);

        command.Parameters.AddWithValue("@StudentId", studentId);
        command.Parameters.AddWithValue("@SubjectId", subjectId);

        var rowsAffected = await command.ExecuteNonQueryAsync();
        return rowsAffected > 0;
    }
} 