using System.Collections.Generic;
using API.BLL.Base;
using API.BLL.UseCases.Memberships.Entities;

namespace API.BLL.UseCases.Authentication.Entities
{
    public class AuthenticationUser : BaseEntity<UserIdent>
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }
        public List<string> Rights { get; set; }
        public string Token { get; set; }

        public AuthenticationUser()
        {
        }

        public AuthenticationUser(AuthenticationUser entity)
        {
            Ident = entity.Ident;
            Deleted = entity.Deleted;
            FirstName = entity.FirstName;
            LastName = entity.LastName;
            UserName = entity.UserName;
            Token = entity.Token;
            Rights = entity.Rights;
        }

        public AuthenticationUser(User entity)
        {
            Ident = entity.Ident;
            FirstName = entity.FirstName;
            LastName = entity.LastName;
            UserName = entity.UserName;
        }
    }
}