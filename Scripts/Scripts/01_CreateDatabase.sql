-- Crear la base de datos
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'RegistroEstudiante')
BEGIN
    CREATE DATABASE RegistroEstudiante;
END
GO

USE RegistroEstudiante;
GO

-- Crear tabla de Profesores
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Teachers]') AND type in (N'U'))
BEGIN
    CREATE TABLE Teachers (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Name NVARCHAR(100) NOT NULL,
        Email NVARCHAR(100) NOT NULL UNIQUE
    );
END
GO 