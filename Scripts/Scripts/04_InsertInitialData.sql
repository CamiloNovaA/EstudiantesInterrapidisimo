USE RegistroEstudiante;
GO

-- Insertar profesores iniciales
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

-- Insertar materias iniciales
IF NOT EXISTS (SELECT * FROM Subjects)
BEGIN
    -- Materias del profesor 1 (Juan Pérez)
    INSERT INTO Subjects (Name, Credits, TeacherId) VALUES
    ('Matemáticas I', 3, 1),
    ('Cálculo Diferencial', 3, 1);

    -- Materias del profesor 2 (María García)
    INSERT INTO Subjects (Name, Credits, TeacherId) VALUES
    ('Física I', 3, 2),
    ('Mecánica', 3, 2);

    -- Materias del profesor 3 (Carlos Rodríguez)
    INSERT INTO Subjects (Name, Credits, TeacherId) VALUES
    ('Programación I', 3, 3),
    ('Estructuras de Datos', 3, 3);

    -- Materias del profesor 4 (Ana Martínez)
    INSERT INTO Subjects (Name, Credits, TeacherId) VALUES
    ('Base de Datos', 3, 4),
    ('Sistemas Operativos', 3, 4);

    -- Materias del profesor 5 (Luis López)
    INSERT INTO Subjects (Name, Credits, TeacherId) VALUES
    ('Redes', 3, 5),
    ('Seguridad Informática', 3, 5);
END
GO

-- Indices para mejorar el rendimiento
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Students_Email' AND object_id = OBJECT_ID('Students'))
BEGIN
    CREATE UNIQUE INDEX IX_Students_Email ON Students(Email);
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_StudentSubjects_SubjectId' AND object_id = OBJECT_ID('StudentSubjects'))
BEGIN
    CREATE INDEX IX_StudentSubjects_SubjectId ON StudentSubjects(SubjectId);
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Subjects_TeacherId' AND object_id = OBJECT_ID('Subjects'))
BEGIN
    CREATE INDEX IX_Subjects_TeacherId ON Subjects(TeacherId);
END
GO 