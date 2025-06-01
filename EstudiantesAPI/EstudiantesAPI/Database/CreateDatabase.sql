-- Create database
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'EstudiantesDB')
BEGIN
    CREATE DATABASE EstudiantesDB;
END
GO

USE EstudiantesDB;
GO

-- Create Teachers table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Teachers]') AND type in (N'U'))
BEGIN
    CREATE TABLE Teachers (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Name NVARCHAR(100) NOT NULL,
        Email NVARCHAR(100) NOT NULL
    );
END
GO

-- Create Subjects table
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

-- Create Students table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Students]') AND type in (N'U'))
BEGIN
    CREATE TABLE Students (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Name NVARCHAR(100) NOT NULL,
        Email NVARCHAR(100) NOT NULL UNIQUE,
        Password NVARCHAR(256) NOT NULL,
        PhoneNumber NVARCHAR(20) NOT NULL,
        RegistrationDate DATETIME NOT NULL
    );
END
GO

-- Create StudentSubjects table
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

-- Insert initial data for teachers
IF NOT EXISTS (SELECT * FROM Teachers)
BEGIN
    INSERT INTO Teachers (Name, Email) VALUES
    ('Juan Pérez', 'juan.perez@universidad.edu'),
    ('María García', 'maria.garcia@universidad.edu'),
    ('Carlos Rodríguez', 'carlos.rodriguez@universidad.edu'),
    ('Ana Martínez', 'ana.martinez@universidad.edu'),
    ('Luis López', 'luis.lopez@universidad.edu');
END
GO

-- Insert initial data for subjects
IF NOT EXISTS (SELECT * FROM Subjects)
BEGIN
    -- Teacher 1 subjects
    INSERT INTO Subjects (Name, Credits, TeacherId) VALUES
    ('Matemáticas I', 3, 1),
    ('Cálculo Diferencial', 3, 1);

    -- Teacher 2 subjects
    INSERT INTO Subjects (Name, Credits, TeacherId) VALUES
    ('Física I', 3, 2),
    ('Mecánica', 3, 2);

    -- Teacher 3 subjects
    INSERT INTO Subjects (Name, Credits, TeacherId) VALUES
    ('Programación I', 3, 3),
    ('Estructuras de Datos', 3, 3);

    -- Teacher 4 subjects
    INSERT INTO Subjects (Name, Credits, TeacherId) VALUES
    ('Base de Datos', 3, 4),
    ('Sistemas Operativos', 3, 4);

    -- Teacher 5 subjects
    INSERT INTO Subjects (Name, Credits, TeacherId) VALUES
    ('Redes', 3, 5),
    ('Seguridad Informática', 3, 5);
END
GO 