using DTOs;
using MySql.Data.MySqlClient;
using studio_infinito.Data;
using studio_infinito.DTOs;
using System.Security.Cryptography;
using System.Text;

namespace studio_infinito.Services.Implementation
{
    public class UserDetailsService : IUserDetailsService
    {
        DbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IAuthService _authService;

        public UserDetailsService(DbContext context, IConfiguration configuration, IAuthService authService)
        {
            _context = context;
            _configuration = configuration;
            _authService = authService;
        }


        public async Task<Dictionary<string, string>> FindUserById(int userID)
        {
            try
            {
                var user = await _context.ExecuteSqlQuery("SELECT * FROM users WHERE user_id = @Id",
                    new MySqlParameter[] {
                        new MySqlParameter("@Id", MySqlDbType.Int32) { Value = userID }
                    });
                if(user == null)
                {
                    return new Dictionary<string, string> { { "status", "error" }, { "message", $"Корисникот не е пронајден" } };
                }
                 

                return new Dictionary<string, string> { { "status", "success" }, { "user", user.First().ToString() } };  // user[0].toString vo message;

            }
            catch(Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }


        public async Task<Dictionary<string, string>> UpdateUser(UserDetailsDTO user)
        {
            try
            {
                // PRVA OPCIJA TUTO KOMPLETO 
                //var existingUser = await _context.ExecuteSqlQuery(
                //    "SELECT * FROM users WHERE phone = @Phone OR email = @Email " +
                //    "AND id NOT IN (SELECT id FROM users WHERE (phone = @Phone AND email != @Email) OR (email = @Email AND phone != @Phone))", // subquery za da proveri dali ima isti tel ili email (radi na nikola inatot magareshki)
                //    new MySqlParameter[] {
                //new MySqlParameter("@Phone", MySqlDbType.VarChar) { Value = user.phone },
                //new MySqlParameter("@Email", MySqlDbType.VarChar) { Value = user.email }
                //    }
                //);

                //VOTRA OPCIJA AMA SO POVEKJE QUERIES I CUSTOM ERRORS. BIRAJ 
                var existingUser = await _context.ExecuteSqlQuery(
                    "SELECT * FROM users WHERE user_id = @Id", 
                    new MySqlParameter[] {
                        new MySqlParameter("@Id", MySqlDbType.Int32) { Value = user.id }
                    }
                );

                var existingEmail = await _context.ExecuteSqlQuery(
                    "SELECT * FROM users WHERE email = @Email AND user_id != @Id",
                    new MySqlParameter[] {
                new MySqlParameter("@Email", MySqlDbType.VarChar) { Value = user.email },
                new MySqlParameter("@Id", MySqlDbType.Int32) { Value = existingUser.First()["user_id"]}
                    }
                );

                if (existingEmail != null && existingEmail.Any())
                {
                    throw new Exception("Email already exists");
                }

                var existingPhone = await _context.ExecuteSqlQuery(
                    "SELECT * FROM users WHERE phone = @Phone AND user_id != @Id",
                    new MySqlParameter[] {
                new MySqlParameter("@Phone", MySqlDbType.VarChar) { Value = user.phone },
                new MySqlParameter("@Id", MySqlDbType.Int32) { Value = existingUser.First()["user_id"]}
                    }
                );

                if (existingUser != null && existingUser.Any())
                {
                    var updateUserQuery = "UPDATE users SET full_name = @Name, phone = @Phone, email = @Email WHERE user_id = @Id";
                    await _context.ExecuteSqlQuery(
                        updateUserQuery,
                        new MySqlParameter[] {
                    new MySqlParameter("@Name", MySqlDbType.VarChar) { Value = user.firstName + " " + user.lastName },
                    new MySqlParameter("@Phone", MySqlDbType.VarChar) { Value = user.phone },
                    new MySqlParameter("@Email", MySqlDbType.VarChar) { Value = user.email },
                    new MySqlParameter("@Id", MySqlDbType.Int32) { Value = existingUser.First()["user_id"]}
                        }
                    );
                }
                else
                {
                    throw new Exception("Корисникот не може да биде ажуриран");
                }

                return new Dictionary<string, string> { { "status", "success" }, { "message", $"Корисникот е успешно ажуриран" } };
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        //TREBA ODOBRUVANJE OD NIKOLA

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(hashedBytes);
        }

        // dictionaryt da vrakja 
        public async Task<bool> UpdateUserPassword(UserDetailsDTO user, string newPassword)
        {
            try
            {
                var existingUser = await _context.ExecuteSqlQuery("SELECT * FROM users WHERE user_id = @Id",
                    new MySqlParameter[] {
                        new MySqlParameter("@Id", MySqlDbType.Int32) { Value = user.id }});

                if (existingUser != null && existingUser.Any())
                {
                    string oldPasswordHashed = existingUser.First()["password_hash"].ToString();
                    string newPasswordHashed = HashPassword(newPassword);
                    if (oldPasswordHashed.Equals(newPasswordHashed)) throw new Exception("Ве молиме да внесете нова лозинка, различна од старата.");


                    var updateUserQuery = "UPDATE users SET password_hash = @Password WHERE id = @Id";
                    await _context.ExecuteSqlQuery(
                        updateUserQuery,
                        new MySqlParameter[] {
                    new MySqlParameter("@Password", MySqlDbType.VarChar) { Value = newPasswordHashed },
                    new MySqlParameter("@Id", MySqlDbType.Int32) { Value = existingUser.First()["id"]}
                        }
                    );
                }
                else throw new Exception("Корисникот не може да биде пронајден");

                return true;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        //public async Task<Dictionary<string, string>> UpdateUserById(int userID, UserDetailsDTO newUser)
        //{
        //    try
        //    {
        //        var userResult = await FindUserById(userID);
        //        if (userResult["status"] == "error")
        //        {
        //            return userResult;
        //        }

        //        var userData = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, object>>(userResult["user"]);
        //        int userId = Convert.ToInt32(userData["user_id"]);

        //        var existingUser = await _context.ExecuteSqlQuery(
        //            "SELECT * FROM users WHERE (phone = @Phone OR email = @Email) AND user_id != @Id",
        //            new MySqlParameter[] {
        //                new MySqlParameter("@Phone", MySqlDbType.VarChar) { Value = newUser.phone },
        //                new MySqlParameter("@Email", MySqlDbType.VarChar) { Value = newUser.email },
        //                new MySqlParameter("@Id", MySqlDbType.Int32) { Value = userId }
        //            }
        //        );

        //        if (existingUser != null && existingUser.Any())
        //        {
        //            return new Dictionary<string, string> { { "status", "error" }, { "message", "Телефонот или емаилот веќе постојат" } };
        //        }

        //        var updateUserQuery = "UPDATE users SET full_name = @Name WHERE user_id = @Id";
        //        await _context.ExecuteSqlQuery(
        //            updateUserQuery,
        //            new MySqlParameter[] {
        //                new MySqlParameter("@Name", MySqlDbType.VarChar) { Value = newUser.firstName + " " + newUser.lastName },
        //                new MySqlParameter("@Id", MySqlDbType.Int32) { Value = userId }
        //            }
        //        );

        //        return new Dictionary<string, string> { { "status", "success" }, { "message", "Корисникот е успешно ажуриран" } };
        //    }
        //    catch (Exception ex)
        //    {
        //        return new Dictionary<string, string> { { "status", "error" }, { "message", ex.Message } };
        //    }
        //}
    }
}
