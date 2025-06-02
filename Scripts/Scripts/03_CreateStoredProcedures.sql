USE RegistroEstudiante;
GO

-- Procedimiento almacenado para verificar si un estudiante puede inscribirse en una materia
CREATE OR ALTER PROCEDURE sp_CanEnrollInSubject
    @StudentId INT,
    @SubjectId INT,
    @CanEnroll BIT OUTPUT,
    @Message NVARCHAR(200) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @CurrentSubjectsCount INT;
    DECLARE @TeacherId INT;
    
    -- Verificar si el estudiante ya está inscrito en la materia
    IF EXISTS (SELECT 1 FROM StudentSubjects WHERE StudentId = @StudentId AND SubjectId = @SubjectId)
    BEGIN
        SET @CanEnroll = 0;
        SET @Message = 'El estudiante ya está inscrito en esta materia.';
        RETURN;
    END
    
    -- Verificar el número de materias inscritas
    SELECT @CurrentSubjectsCount = COUNT(*)
    FROM StudentSubjects
    WHERE StudentId = @StudentId;
    
    IF @CurrentSubjectsCount >= 3
    BEGIN
        SET @CanEnroll = 0;
        SET @Message = 'El estudiante ya está inscrito en el máximo de materias permitidas (3).';
        RETURN;
    END
    
    -- Obtener el profesor de la materia
    SELECT @TeacherId = TeacherId
    FROM Subjects
    WHERE Id = @SubjectId;
    
    -- Verificar si ya tiene una materia con el mismo profesor
    IF EXISTS (
        SELECT 1
        FROM StudentSubjects ss
        INNER JOIN Subjects s ON ss.SubjectId = s.Id
        WHERE ss.StudentId = @StudentId
        AND s.TeacherId = @TeacherId
    )
    BEGIN
        SET @CanEnroll = 0;
        SET @Message = 'El estudiante ya tiene una materia con este profesor.';
        RETURN;
    END
    
    SET @CanEnroll = 1;
    SET @Message = 'El estudiante puede inscribirse en esta materia.';
END
GO

-- Procedimiento almacenado para inscribir un estudiante en una materia
CREATE OR ALTER PROCEDURE sp_EnrollStudentInSubject
    @StudentId INT,
    @SubjectId INT,
    @Success BIT OUTPUT,
    @Message NVARCHAR(200) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @CanEnroll BIT;
    
    -- Verificar si puede inscribirse
    EXEC sp_CanEnrollInSubject 
        @StudentId = @StudentId,
        @SubjectId = @SubjectId,
        @CanEnroll = @CanEnroll OUTPUT,
        @Message = @Message OUTPUT;
    
    IF @CanEnroll = 1
    BEGIN
        BEGIN TRY
            INSERT INTO StudentSubjects (StudentId, SubjectId, EnrollmentDate)
            VALUES (@StudentId, @SubjectId, GETUTCDATE());
            
            SET @Success = 1;
            SET @Message = 'Inscripción realizada con éxito.';
        END TRY
        BEGIN CATCH
            SET @Success = 0;
            SET @Message = 'Error al realizar la inscripción: ' + ERROR_MESSAGE();
        END CATCH
    END
    ELSE
    BEGIN
        SET @Success = 0;
    END
END
GO

-- Procedimiento almacenado para obtener los compañeros de clase
CREATE OR ALTER PROCEDURE sp_GetClassmates
    @StudentId INT,
    @SubjectId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT DISTINCT s.*
    FROM Students s
    INNER JOIN StudentSubjects ss ON s.Id = ss.StudentId
    WHERE ss.SubjectId = @SubjectId
    AND s.Id != @StudentId;
END
GO 