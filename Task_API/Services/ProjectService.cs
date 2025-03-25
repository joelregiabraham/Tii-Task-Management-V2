using System.Net.Http.Headers;
using System.Text.Json;

namespace Task_API.Services
{
    public class ProjectService : IProjectService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ProjectService(
            IHttpClientFactory httpClientFactory,
            IConfiguration configuration,
            IHttpContextAccessor httpContextAccessor)
        {
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
        }

        private HttpClient CreateClientWithAuthToken()
        {
            var client = _httpClientFactory.CreateClient();
            var projectApiUrl = _configuration["ServiceUrls:ProjectAPI"];
            client.BaseAddress = new Uri(projectApiUrl);

            // Get the JWT token from the current request
            var token = _httpContextAccessor.HttpContext?.Request.Headers["Authorization"]
                .ToString().Replace("Bearer ", "");

            // Forward the token to the Project API
            if (!string.IsNullOrEmpty(token))
            {
                client.DefaultRequestHeaders.Authorization =
                    new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
            }

            return client;
        }

        public async Task<bool> ProjectExistsAsync(int projectId)
        {
            try
            {
                var client = CreateClientWithAuthToken();
                var response = await client.GetAsync($"api/projects/{projectId}/exists");
                return response.IsSuccessStatusCode;
            }
            catch (Exception)
            {
                // In a real implementation, you would log this error
                return false;
            }
        }

        public async Task<bool> UserHasProjectAccessAsync(string userId, int projectId)
        {
            try
            {
                var client = CreateClientWithAuthToken();
                var response = await client.GetAsync($"api/projects/{projectId}/members/{userId}/access");
                return response.IsSuccessStatusCode;
            }
            catch (Exception)
            {
                // In a real implementation, you would log this error
                return false;
            }
        }

        public async Task<bool> UserHasProjectRoleAsync(string userId, int projectId, string[] allowedRoles)
        {
            try
            {
                var client = CreateClientWithAuthToken();
                var response = await client.GetAsync($"api/projects/{projectId}/members/{userId}/access");
                return response.IsSuccessStatusCode;
            }
            catch (Exception)
            {
                // In a production system, you would log this error
                return false;
            }
        }

        public async Task<bool> IsUserProjectMemberAsync(string userId, int projectId)
        {
            try
            {
                var client = CreateClientWithAuthToken();
                var response = await client.GetAsync($"api/projects/{projectId}/members/{userId}");
                return response.IsSuccessStatusCode;
            }
            catch (Exception)
            {
                // In a real implementation, you would log this error
                return false;
            }
        }
    }
}