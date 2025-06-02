-- Crear BD
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'RegistroEstudiante')
BEGIN
    CREATE DATABASE RegistroEstudiante;
END
GO

USE RegistroEstudiante;
GO

-- Crear tabla Profesores
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Teachers]') AND type in (N'U'))
BEGIN
    CREATE TABLE Teachers (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Name NVARCHAR(100) NOT NULL,
        Email NVARCHAR(100) NOT NULL
    );
END
GO

-- Crear tabla Materias
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

-- Crear tabla estudiantes
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

-- Crear tabla estudiantes_Materias
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[StudentSubjects]') AND type in (N'U'))
BEGIN
    CREATE TABLE StudentSubjects (
        StudentId INT NOT NULL,
        SubjectId INT NOT NULL,
        EnrollmentDate DATETIME NOT NULL,
        PRIMARY KEY (StudentId, SubjectId),
        FOREIGN KEY (StudentId) REFERENCES Students(Id),
        FOREIGN KEY (SubjectId) REFERENCES Subjects(Id)
    );
END
GO

-- Insert inicial a la tabla profesores
IF NOT EXISTS (SELECT * FROM Teachers)
BEGIN
    INSERT INTO Teachers (Name, Email) VALUES
    ('Juan Pérez', 'juan.perez@universidadInter.edu'),
    ('María García', 'maria.garcia@universidadInter.edu'),
    ('Carlos Rodríguez', 'carlos.rodriguez@universidadInter.edu'),
    ('Ana Martínez', 'ana.martinez@universidadInter.edu'),
    ('Luis López', 'luis.lopez@universidadInter.edu');
END
GO

-- Insert inicial a la tabla Materias
IF NOT EXISTS (SELECT * FROM Subjects)
BEGIN
    INSERT INTO Subjects (Name, Credits, TeacherId) VALUES
    ('Matemáticas I', 3, 1),
    ('Cálculo Diferencial', 3, 1);

    INSERT INTO Subjects (Name, Credits, TeacherId) VALUES
    ('Física I', 3, 2),
    ('Mecánica', 3, 2);

    INSERT INTO Subjects (Name, Credits, TeacherId) VALUES
    ('Programación I', 3, 3),
    ('Estructuras de Datos', 3, 3);

    INSERT INTO Subjects (Name, Credits, TeacherId) VALUES
    ('Base de Datos', 3, 4),
    ('Sistemas Operativos', 3, 4);

    INSERT INTO Subjects (Name, Credits, TeacherId) VALUES
    ('Redes', 3, 5),
    ('Seguridad Informática', 3, 5);
END
GO 