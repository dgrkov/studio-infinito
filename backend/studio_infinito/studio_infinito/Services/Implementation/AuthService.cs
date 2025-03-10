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
        private readonly AuthService _authService;
        private readonly IConfiguration _configuration;
        public AuthService(DbContext context, AuthService authService, IConfiguration configuration)
        {
            _context = context;
            _authService = authService;
            _configuration = configuration;
        }

        public async Task<List<Dictionary<string, object>>> Login(UserLoginDTO user)
        {
            try
            {
                // smeni po potreba
                var result = await _context.ExecuteSqlQuery("SELECT password_hash FROM users WHERE phone = @EmailOrPhone" +
                    "OR email = @EmailOrPhone",
                    new MySqlParameter[] { new MySqlParameter("@EmailOrPhone", MySqlDbType.String) { Value = user.EmailOrPhone }, 
                                            new MySqlParameter("@password", MySqlDbType.String) { Value = user.Password } });

                if (result == null)
                {
                    return new List<Dictionary<string, object>> { new Dictionary<string, object> { ["error"] = $"Корисничката сметка не е пронајдена" } };
                } else if(!HashPassword(user.Password).Equals(result))
                {
                    return new List<Dictionary<string, object>> { new Dictionary<string, object> { ["error"] = $"Внесен е погрешена лозинка" } };
                }

                return new List<Dictionary<string, object>> { new Dictionary<string, object> { ["ok"] = $"Корисничката сметка е пронајдена: {GenerateJwtToken(user)}" } };
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public Task<List<Dictionary<string, string>>> Register(UserRegisterDto user)
        {
            throw new NotImplementedException();
        }

        private string GenerateJwtToken(UserLoginDTO loginRequest)
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
                { "user_details", loginRequest?.ToString()}
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
    }
}
