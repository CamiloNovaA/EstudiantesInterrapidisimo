using EstudiantesAPI.Models;

namespace EstudiantesAPI.Data.Interfaces;

public interface IStudentRepository
{
    Task<IEnumerable<Student>> GetAllAsync();
    Task<Student?> GetByIdAsync(int id);
    Task<int> CreateAsync(Student student);
    Task<bool> UpdateAsync(Student student);
    Task<bool> DeleteAsync(int id);
    Task<IEnumerable<Student>> GetClassmatesBySubjectAsync(int subjectId, int studentId);
    Task<int> GetEnrolledSubjectsCountAsync(int studentId);
    Task<bool> HasClassWithTeacherAsync(int studentId, int teacherId);
    Task<bool> EnrollInSubjectAsync(int studentId, int subjectId);
    Task<bool> UnenrollFromSubjectAsync(int studentId, int subjectId);
} 