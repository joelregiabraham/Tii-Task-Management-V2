namespace Project_API.Services
{
    public interface IUserService
    {
        Task<bool> UserExistsAsync(string userId);
        Task<string> GetUserNameAsync(string userId);
        Task<string> GetUserIdByUsernameAsync(string username);
    }
}