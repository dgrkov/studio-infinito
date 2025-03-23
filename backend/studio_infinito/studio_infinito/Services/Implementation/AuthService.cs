using DTOs;
using Microsoft.IdentityModel.Tokens;
using MySql.Data.MySqlClient;
using studio_infinito.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Text.Json;
using System.Text;
using System.Security.Cryptography;

namespace studio_infinito.Services.Implementation
{
    public class AuthService : IAuthService
    {
        DbContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(DbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<Dictionary<string, string>> Login(UserLoginDTO user)
        {
            try
            {
                List<Dictionary<string, object>> result = await _context.ExecuteSqlQuery("SELECT * FROM users WHERE phone = @EmailOrPhone" +
                    " OR email = @EmailOrPhone",
                    new MySqlParameter[] { new MySqlParameter("@EmailOrPhone", MySqlDbType.String) { Value = user.EmailOrPhone },
                                   new MySqlParameter("@password", MySqlDbType.String) { Value = user.Password } });

                if (result.Count > 0 && result[0].ContainsKey("error") || result.Count == 0)
                {
                    return new Dictionary<string, string> { { "status", "error" }, { "message", $"Корисничката сметка не е пронајдена" } };
                }
                else if (!VerifyPassword(user.Password, result[0]["password_hash"].ToString()))
                {
                    return new Dictionary<string, string> { { "status", "warning" } ,{ "message", $"Внесена е погрешена лозинка" } };
                }

                if (!string.IsNullOrEmpty(user.firebase_token))
                {
                    await _context.ExecuteSqlQuery(
                        "UPDATE users SET firebase_token = @FirebaseToken WHERE user_id = @UserId",
                        new MySqlParameter[]
                        {
                            new MySqlParameter("@FirebaseToken", MySqlDbType.String) { Value = user.firebase_token },
                            new MySqlParameter("@UserId", MySqlDbType.String) { Value = result[0]["user_id"] }
                        }
                    );
                }

                return new Dictionary<string, string> { { "status", "success" } , { "message", $"{GenerateJwtToken(user, result[0]["user_id"].ToString())}" } };
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        private string GenerateJwtToken(UserLoginDTO loginRequest, string user_id)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var expirationTime = loginRequest.rememberMe ? DateTime.Now.AddDays(30) : DateTime.Now.AddMinutes(120);

            var Sectoken = new JwtSecurityToken(_configuration["Jwt:Issuer"],
              _configuration["Jwt:Issuer"],
              null,
              expires: expirationTime,
              signingCredentials: credentials);

            var access_token = new JwtSecurityTokenHandler().WriteToken(Sectoken);

            Dictionary<string, string> response_token = new Dictionary<string, string>
            {
                { "access_token", access_token },
                { "token_type", "Bearer" },
                { "valid_to", Sectoken.ValidTo.ToString("O") },
                { "user_id", user_id }
            };

            return JsonSerializer.Serialize(response_token);
        }

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(hashedBytes);
        }

        private bool VerifyPassword(string enteredPassword, string storedPassword)
        {
            return HashPassword(enteredPassword) == storedPassword;
        }

        public async Task<bool> RegisterUserAsync(UserRegisterDto newUser)
        {
            try
            {
                var userExists = await _context.ExecuteSqlQuery(
                    "SELECT * FROM Users WHERE phone = @Phone OR email = @Email",
                    new MySqlParameter[] {
                        new MySqlParameter("@Phone", MySqlDbType.VarChar) { Value = newUser.phone },
                        new MySqlParameter("@Email", MySqlDbType.VarChar) { Value = newUser.email }
                    }
                );

                if (userExists?.Count > 0) return false;

                var hashedPassword = HashPassword(newUser.password);


                DateTime dateTimeNow = TimeZoneInfo.ConvertTime(DateTime.Now, TimeZoneInfo.FindSystemTimeZoneById("Central European Standard Time"));

                string query = "INSERT INTO Users (full_name, email, phone, password_hash, role, created_at) " +
                               "VALUES (@FullName, @Email, @Phone, @PasswordHash, 'customer', @DateNow)";

                await _context.ExecuteSqlQuery(query,
                    new MySqlParameter[] {
                        new MySqlParameter("@FullName", MySqlDbType.VarChar) { Value = $"{newUser.firstName} {newUser.lastName}" },
                        new MySqlParameter("@Email", MySqlDbType.VarChar) { Value = newUser.email },
                        new MySqlParameter("@Phone", MySqlDbType.VarChar) { Value = newUser.phone },
                        new MySqlParameter("@PasswordHash", MySqlDbType.VarChar) { Value = hashedPassword },
                        new MySqlParameter("@DateNow", MySqlDbType.DateTime) { Value = dateTimeNow }
                    }
                );

                return true;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error registering user: {ex.Message}", ex);
            }
        }
    }
}
