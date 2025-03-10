using DTOs;

namespace studio_infinito.Services
{
    public interface IAuthService
    {
        Task<List<Dictionary<string, object>>> Login(UserLoginDTO user);
        Task<List<Dictionary<string, string>>> Register(UserRegisterDto user);
        //Task<bool> Logout();
    }
}
