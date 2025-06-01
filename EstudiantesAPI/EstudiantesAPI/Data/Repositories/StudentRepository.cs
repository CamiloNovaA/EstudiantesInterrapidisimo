using Dapper;
using EstudiantesAPI.Data.Interfaces;
using EstudiantesAPI.Models;

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
        using var connection = _context.CreateConnection();
        var sql = @"INSERT INTO Students (Name, Email, PhoneNumber, RegistrationDate) 
                    VALUES (@Name, @Email, @PhoneNumber, @RegistrationDate);
                    SELECT CAST(SCOPE_IDENTITY() as int)";
        return await connection.QuerySingleAsync<int>(sql, student);
    }

    public async Task<bool> UpdateAsync(Student student)
    {
        using var connection = _context.CreateConnection();
        var sql = @"UPDATE Students 
                    SET Name = @Name, Email = @Email, PhoneNumber = @PhoneNumber 
                    WHERE Id = @Id";
        var affected = await connection.ExecuteAsync(sql, student);
        return affected > 0;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        using var connection = _context.CreateConnection();
        var affected = await connection.ExecuteAsync(
            "DELETE FROM Students WHERE Id = @Id", new { Id = id });
        return affected > 0;
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
} 