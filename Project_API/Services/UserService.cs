using System.Net.Http.Headers;

namespace Project_API.Services
{
    public class UserService : IUserService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserService(IHttpClientFactory httpClientFactory, IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
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

        // Add this in UserService.cs
        private string GetAuthToken()
        {
            // Check if we have HTTP context
            if (_httpContextAccessor == null || _httpContextAccessor.HttpContext == null)
                return null;

            // Get the Authorization header
            var authHeader = _httpContextAccessor.HttpContext.Request.Headers["Authorization"].FirstOrDefault();

            // Check if it's a Bearer token
            if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
                return null;

            // Extract the token
            return authHeader.Substring("Bearer ".Length).Trim();
        }

        public async Task<string> GetUserIdByUsernameAsync(string username)
        {
            try
            {
                var client = _httpClientFactory.CreateClient();
                client.DefaultRequestHeaders.Authorization =
                    new AuthenticationHeaderValue("Bearer", GetAuthToken());

                var authApiUrl = _configuration["ServiceUrls:AuthAPI"];
                client.BaseAddress = new Uri(authApiUrl);

                var response = await client.GetAsync($"api/users/by-username/{username}/id");
                if (response.IsSuccessStatusCode)
                {
                    return await response.Content.ReadAsStringAsync();
                }
                return null;
            }
            catch (Exception)
            {
                return null;
            }
        }
    }
}