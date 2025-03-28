using DTOs;
using studio_infinito.DTOs;

namespace studio_infinito.Services
{
    public interface IUserDetailsService
    {
        Task<Dictionary<string, string>> UpdateUser(UserDetailsDTO user);
        Task<bool> UpdateUserPassword(UserDetailsDTO user, string newPassword);
        Task<Dictionary<string, string>> FindUserById(int userID);

        //Task<Dictionary<string, string>> UpdateUserById(int userID, UserDetailsDTO newUser);
    }
}
