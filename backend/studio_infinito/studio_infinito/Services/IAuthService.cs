using DTOs;

namespace studio_infinito.Services
{
    public interface IAuthService
    {
        Task<Dictionary<string, string>> Login(UserLoginDTO user);
        Task<bool> RegisterUserAsync(UserRegisterDto user);
        //Task<bool> Logout();
    }
}
