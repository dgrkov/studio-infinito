using DTOs;

namespace studio_infinito.Services
{
    public interface IAuthService
    {
        Task<List<Dictionary<string, object>>> Login(UserLoginDTO user);
        Task<bool> RegisterUserAsync(UserRegisterDto user);
        //Task<bool> Logout();
    }
}
