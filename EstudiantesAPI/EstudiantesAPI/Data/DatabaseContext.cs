using Microsoft.Data.SqlClient;
using System.Data;

namespace EstudiantesAPI.Data;

public class DatabaseContext
{
    private readonly string _connectionString;

    public DatabaseContext(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("Connection") ?? 
            throw new ArgumentNullException("La cadena de conexión no esta configurada");
    }

    public IDbConnection CreateConnection()
        => new SqlConnection(_connectionString);
} 