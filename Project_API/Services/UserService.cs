using System.Net.Http.Headers;

namespace Project_API.Services
{
    public class UserService : IUserService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;

        public UserService(IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
        }

        public async Task<bool> UserExistsAsync(string userId)
        {
            try
            {
                var client = _httpClientFactory.CreateClient();
                var authApiUrl = _configuration["ServiceUrls:AuthAPI"];
                client.BaseAddress = new Uri(authApiUrl);

                var response = await client.GetAsync($"api/users/exists/{userId}");
                return response.IsSuccessStatusCode;
            }
            catch (Exception)
            {
                // In a real implementation, you would log this error
                return false;
            }
        }

        public async Task<string> GetUserNameAsync(string userId)
        {
            try
            {
                var client = _httpClientFactory.CreateClient();
                var authApiUrl = _configuration["ServiceUrls:AuthAPI"];
                client.BaseAddress = new Uri(authApiUrl);

                var response = await client.GetAsync($"api/users/{userId}/username");
                if (response.IsSuccessStatusCode)
                {
                    return await response.Content.ReadAsStringAsync();
                }
                return null;
            }
            catch (Exception)
            {
                // In a real implementation, you would log this error
                return null;
            }
        }
    }
}