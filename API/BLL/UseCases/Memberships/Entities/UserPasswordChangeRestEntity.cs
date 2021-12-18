namespace API.BLL.UseCases.Memberships.Entities
{
    public class UserPasswordChangeRestEntity
    {
        public string Password { get; set; }
        public string PasswordNew { get; set; }
        public string PasswordNewRetyped { get; set; }
        
        public UserPasswordChangeRestEntity()
        {
        }

        public UserPasswordChangeRestEntity(UserPasswordChangeRestEntity entity)
        {
            Password = entity.Password;
            PasswordNew = entity.PasswordNew;
            PasswordNewRetyped = entity.PasswordNewRetyped;
        }
        
    }
}