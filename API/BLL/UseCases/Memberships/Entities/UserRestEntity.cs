using System;
using API.BLL.Extensions;
using API.BLL.UseCases.RolesAndRights.Entities;

namespace API.BLL.UseCases.Memberships.Entities
{
    public class UserRestEntity
    {
        public Guid? Ident { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string PasswordRetyped { get; set; }
        public string PasswordHash { get; set; }
        public string PasswordSalt { get; set; }
        public DateTime PasswordChangedDate { get; set; }
        public bool? Deleted { get; set; }
        public string PasswordForgottenHash { get; set; }
        public Guid? RoleIdent { get; set; }
        public DateTime? PasswordForgottenHashDate { get; set; }

        public UserRestEntity()
        {
        }

        public UserRestEntity(UserRestEntity entity)
        {
            Ident = entity.Ident;
            Deleted = entity.Deleted;
            FirstName = entity.FirstName;
            LastName = entity.LastName;
            UserName = entity.UserName;
            Password = entity.Password;
            RoleIdent = entity.RoleIdent;
            PasswordRetyped = entity.PasswordRetyped;
            PasswordHash = entity.PasswordHash;
            PasswordSalt = entity.PasswordSalt;
            PasswordChangedDate = entity.PasswordChangedDate;
            PasswordForgottenHash = entity.PasswordForgottenHash;
            PasswordForgottenHashDate = entity.PasswordForgottenHashDate;
        }

        public User ToEntity() => new User()
        {
            Ident = new UserIdent(Ident ?? Guid.NewGuid()),
            Deleted = Deleted ?? false,
            FirstName = FirstName,
            LastName = LastName,
            UserName = UserName,
            RoleIdent = RoleIdent.IdentOrNull<RoleIdent>(),
            PasswordHash = PasswordHash,
            PasswordSalt = PasswordSalt,
            PasswordChangedDate = PasswordChangedDate,
            PasswordForgottenHash = PasswordForgottenHash ?? "",
            PasswordForgottenHashDate = PasswordForgottenHashDate,
        };
    }
}