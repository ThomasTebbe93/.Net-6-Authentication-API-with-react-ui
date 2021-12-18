using API.BLL.UseCases.Memberships.Entities;

namespace API.BLL.UseCases.Memberships.Merger
{
    public class UserMerger
    {
        public UserRestEntity Merge(UserRestEntity newUser, User oldUser)
        {
            if (oldUser == null) return newUser;
            return new UserRestEntity()
            {
                Ident = newUser.Ident ?? oldUser.Ident.Ident,
                Deleted = newUser.Deleted ?? oldUser.Deleted,
                FirstName = newUser.FirstName ?? oldUser.FirstName,
                LastName = newUser.LastName ?? oldUser.LastName,
                UserName = newUser.UserName ?? oldUser.UserName,
                RoleIdent = newUser.RoleIdent,
                Password = newUser.Password,
                PasswordHash = newUser.PasswordHash ?? oldUser.PasswordHash,
                PasswordSalt = newUser.PasswordSalt ?? oldUser.PasswordSalt,
                PasswordChangedDate = newUser.PasswordChangedDate,
                PasswordForgottenHash = oldUser.PasswordForgottenHash,
                PasswordForgottenHashDate = oldUser.PasswordForgottenHashDate,
            };
        }
    }
}