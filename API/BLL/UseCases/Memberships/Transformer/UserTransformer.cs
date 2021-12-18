using API.BLL.Base;
using API.BLL.Extensions;
using API.BLL.UseCases.Memberships.Entities;
using API.BLL.UseCases.RolesAndRights.Entities;
using API.DAL.UseCases.Memberships;

namespace API.BLL.UseCases.Memberships.Transformer
{
    public class UserTransformer : ITransformer<User, DbUser>
    {
        public User ToEntity(DbUser entity)
        {
            return new User()
            {
                Ident = new UserIdent(entity.Ident),
                Deleted = entity.Deleted,
                FirstName = entity.FirstName,
                LastName = entity.LastName,
                UserName = entity.UserName,
                RoleIdent = entity.RoleIdent.IdentOrNull<RoleIdent>(),
                PasswordHash = entity.PasswordHash,
                PasswordSalt = entity.PasswordSalt,
                PasswordChangedDate = entity.PasswordChangedDate,
                PasswordForgottenHash = entity.PasswordForgottenHash,
                PasswordForgottenHashDate = entity.PasswordForgottenHashDate,
            };
        }

        public DbUser ToDbEntity(User entity)
        {
            return new DbUser()
            {
                Ident = entity.Ident.Ident,
                Deleted = entity.Deleted,
                FirstName = entity.FirstName,
                LastName = entity.LastName,
                UserName = entity.UserName,
                RoleIdent = entity.RoleIdent?.Ident,
                PasswordHash = entity.PasswordHash,
                PasswordSalt = entity.PasswordSalt,
                PasswordChangedDate = entity.PasswordChangedDate,
                PasswordForgottenHash = entity.PasswordForgottenHash,
                PasswordForgottenHashDate = entity.PasswordForgottenHashDate
            };
        }
    }
}