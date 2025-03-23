using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.Data.SqlClient;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;

namespace studio_infinito.Data
{
    public class DbContext : IDisposable
    {
        private readonly MySqlConnection _connection;

        public DbContext(IConfiguration configuration)
        {
            string connectionString = configuration.GetConnectionString("DefaultConnection");
            _connection = new MySqlConnection(connectionString);
            _connection.Open();
        }

        public async Task<List<Dictionary<string, object>>> ExecuteSqlQuery(string query, MySqlParameter[] parameters = null)
        {
            try
            {
                using (MySqlCommand execute_query = new MySqlCommand(query, _connection))
                {
                    if (parameters != null)
                    {
                        execute_query.Parameters.AddRange(parameters);
                    }

                    using (MySqlDataReader reader = (MySqlDataReader)await execute_query.ExecuteReaderAsync())
                    {
                        if (execute_query.LastInsertedId > 0)
                        {
                            var result = new Dictionary<string, object> { { "id", execute_query.LastInsertedId } };
                            return new List<Dictionary<string, object>> { result };
                        }

                        var results = new List<Dictionary<string, object>>();
                        int row_number = 0;

                        while (await reader.ReadAsync())
                        {
                            row_number++;
                            var row = new Dictionary<string, object>
                            {
                                ["key"] = row_number
                            };

                            for (int i = 0; i < reader.FieldCount; i++)
                            {
                                row[reader.GetName(i)] = reader.GetValue(i);
                            }

                            results.Add(row);
                        }

                        return results;
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }


        public async Task<List<Dictionary<string, object>>> ExecuteStoredProcedure(string procedureName, Dictionary<string, object>? parameters = null)
        {
            try
            {
                using (MySqlCommand cmd = new MySqlCommand(procedureName, _connection))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;

                    if (parameters != null)
                    {
                        foreach (var param in parameters)
                        {
                            cmd.Parameters.AddWithValue(param.Key, param.Value);
                        }
                    }

                    using (MySqlDataReader reader = (MySqlDataReader)await cmd.ExecuteReaderAsync())
                    {
                        var results = new List<Dictionary<string, object>>();

                        while (reader.Read())
                        {
                            var row = new Dictionary<string, object>();

                            for (int i = 0; i < reader.FieldCount; i++)
                            {
                                row[reader.GetName(i)] = reader.GetValue(i);
                            }

                            results.Add(row);
                        }

                        return results;
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<MySqlTransaction> BeginTransactionAsync()
        {
            return await Task.FromResult(_connection.BeginTransaction());
        }


        public void Dispose()
        {
            _connection?.Close();
        }
    }
}