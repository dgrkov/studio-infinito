namespace DTOs
{
    public class UserLoginDTO
    {
        public string EmailOrPhone { get; set; }
        public string Password { get; set; }
        public bool rememberMe { get; set; }
    }
}