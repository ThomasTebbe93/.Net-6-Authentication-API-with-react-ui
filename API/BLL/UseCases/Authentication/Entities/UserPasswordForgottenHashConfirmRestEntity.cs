using System;

namespace API.BLL.UseCases.Authentication.Entities
{
    public class UserPasswordForgottenHashConfirmRestEntity
    {
        public Guid UserIdent { get; set; }
        public string Hash { get; set; }
    }
}