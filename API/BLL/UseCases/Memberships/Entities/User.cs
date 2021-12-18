using System;
using API.BLL.Base;
using API.BLL.UseCases.RolesAndRights.Entities;
using Role = API.BLL.UseCases.RolesAndRights.Entities.Role;

namespace API.BLL.UseCases.Memberships.Entities
{
    public class User : BaseEntity<UserIdent>
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }
        public string PasswordHash { get; set; }
        public string PasswordSalt { get; set; }
        public DateTime PasswordChangedDate { get; set; }
        public string PasswordForgottenHash { get; set; }
        public Role Role { get; set; }
        public RoleIdent RoleIdent { get; set; }
        public DateTime? PasswordForgottenHashDate { get; set; }

        public User()
        {
        }

        public User(User entity)
        {
            Ident = entity.Ident;
            Deleted = entity.Deleted;
            FirstName = entity.FirstName;
            LastName = entity.LastName;
            UserName = entity.UserName;
            PasswordHash = entity.PasswordHash;
            PasswordSalt = entity.PasswordSalt;
            Role = entity.Role;
            RoleIdent = entity.RoleIdent;
            PasswordForgottenHash = entity.PasswordForgottenHash;
            PasswordForgottenHashDate = entity.PasswordForgottenHashDate;
        }
    }
    
    public static class UserExtensions
    {
        public static User ToOutputUser(this User user)
        {
            return new User(user)
            {
                PasswordHash = user.PasswordHash,
                PasswordSalt = user.PasswordSalt,
                PasswordForgottenHash = user.PasswordForgottenHash,
                PasswordForgottenHashDate = user.PasswordForgottenHashDate,
            };
        }
    }


    public class UserIdent : IdentBase
    {
        public UserIdent(Guid ident) : base(ident)
        {
        }
    }
}