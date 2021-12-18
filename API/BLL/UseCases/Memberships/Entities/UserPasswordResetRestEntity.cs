namespace API.BLL.UseCases.Memberships.Entities
{
    public class UserPasswordResetRestEntity
    {
        public string UserName { get; set; }
        
        public UserPasswordResetRestEntity()
        {
        }

        public UserPasswordResetRestEntity(UserPasswordResetRestEntity entity)
        {
            UserName = entity.UserName;
        }
        
    }
}