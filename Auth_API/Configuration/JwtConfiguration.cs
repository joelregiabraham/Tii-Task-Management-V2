namespace Auth_API.Configuration
{
    public class JwtConfiguration
    {
        public string ValidIssuer { get; set; }
        public string ValidAudience { get; set; }
        public string SecretKey { get; set; }
        public int ExpiresInMinutes { get; set; }
    }
}