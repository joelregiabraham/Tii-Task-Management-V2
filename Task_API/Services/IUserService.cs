﻿namespace Task_API.Services
{
    public interface IUserService
    {
        Task<bool> UserExistsAsync(string userId);
        Task<string> GetUserNameAsync(string userId);
    }
}