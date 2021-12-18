
using API.BLL.UseCases.Memberships.Entities;

namespace API.BLL.UseCases.Register.Entities
{
    public class 
        UserRegisterRestEntity : UserRestEntity
    {
        public string Hash { get; set; }
        
        public UserRestEntity ToUserRestEntity() => new UserRestEntity()
        {
            Ident = Ident,
            Deleted = Deleted ?? false,
            FirstName = FirstName,
            LastName = LastName,
            UserName = UserName,
            Password = Password,
            PasswordRetyped = PasswordRetyped,
            PasswordHash = PasswordHash,
            PasswordSalt = PasswordSalt,
            PasswordChangedDate = PasswordChangedDate,
        };
    }
}