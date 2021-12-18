namespace API.BLL.Helper
{
    public class AppSettings
    {
        public string[] BasUrls { get; set; }
        public string Secret { get; set; }
        public string BasePath { get; set; }
        public string BaseUrl { get; set; }
        public string BaseUrlApi { get; set; }
        public string BaseUrlOffice { get; set; }
        public string ApplicationName { get; set; }
        public string SupervisorUserName { get; set; }
        public string SupervisorPassword { get; set; }
        public string DbConnection { get; set; }
        public string DefaultMailTo { get; set; }
        public bool IsMailSendingActive { get; set; }
        public string SmptHost { get; set; }
        public int SmptPort { get; set; }
        public string SmptEmailAddress { get; set; }
        public string SmptUser { get; set; }
        public string SmptPassword { get; set; }
        public bool IsDevServer { get; set; }
    }
}