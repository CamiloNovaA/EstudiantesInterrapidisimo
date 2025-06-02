USE RegistroEstudiante;
GO

-- Crear tabla de Materias
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Subjects]') AND type in (N'U'))
BEGIN
    CREATE TABLE Subjects (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Name NVARCHAR(100) NOT NULL,
        Credits INT NOT NULL DEFAULT 3,
        TeacherId INT NOT NULL,
        FOREIGN KEY (TeacherId) REFERENCES Teachers(Id)
    );
END
GO

-- Crear tabla de Estudiantes
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Students]') AND type in (N'U'))
BEGIN
    CREATE TABLE Students (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Name NVARCHAR(100) NOT NULL,
        Email NVARCHAR(100) NOT NULL UNIQUE,
        Password NVARCHAR(256) NOT NULL,
        RegistrationDate DATETIME NOT NULL
    );
END
GO

-- Crear tabla de relación Estudiantes-Materias
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[StudentSubjects]') AND type in (N'U'))
BEGIN
    CREATE TABLE StudentSubjects (
        StudentId INT NOT NULL,
        SubjectId INT NOT NULL,
        EnrollmentDate DATETIME NOT NULL,
        PRIMARY KEY (StudentId, SubjectId),
        FOREIGN KEY (StudentId) REFERENCES Students(Id) ON DELETE CASCADE,
        FOREIGN KEY (SubjectId) REFERENCES Subjects(Id) ON DELETE CASCADE
    );
END
GO 