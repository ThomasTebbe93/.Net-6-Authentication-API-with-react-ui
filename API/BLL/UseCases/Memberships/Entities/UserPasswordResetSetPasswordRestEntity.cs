using System;

namespace API.BLL.UseCases.Memberships.Entities
{
    public class UserPasswordResetSetPasswordRestEntity
    {
        public Guid UserIdent { get; set; }
        public string Hash { get; set; }
        public string PasswordNew { get; set; }
        public string PasswordNewRetyped { get; set; }
        
        public UserPasswordResetSetPasswordRestEntity()
        {
        }

        public UserPasswordResetSetPasswordRestEntity(UserPasswordResetSetPasswordRestEntity entity)
        {
            UserIdent = entity.UserIdent;
            Hash = entity.Hash;
            PasswordNew = entity.PasswordNew;
            PasswordNewRetyped = entity.PasswordNewRetyped;
        }
        
    }
}