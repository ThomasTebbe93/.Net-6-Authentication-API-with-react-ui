namespace API.BLL.UseCases.Authentication.Entities
{
    public class AuthenticationRestEntity
    {
        public string UserName { get; set; }
        public string Password { get; set; }

        public AuthenticationRestEntity()
        {
        }

        public AuthenticationRestEntity(AuthenticationRestEntity entity)
        {
            UserName = entity.UserName;
            Password = entity.Password;
        }
    }
}