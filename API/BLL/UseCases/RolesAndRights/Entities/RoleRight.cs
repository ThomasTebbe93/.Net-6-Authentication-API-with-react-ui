using System;
using API.BLL.Base;

namespace API.BLL.UseCases.RolesAndRights.Entities
{
    public class RoleRight : BaseEntity<RoleRightIdent>
    {
        public RoleIdent RoleIdent { get; set; }
        public RightIdent RightIdent { get; set; }

        public RoleRight()
        {
        }

        public RoleRight(RoleRight existing)
        {
            RoleIdent = existing.RoleIdent;
            RightIdent = existing.RightIdent;
        }
    }


    public class RoleRightIdent : IdentBase
    {
        public RoleRightIdent(Guid ident) : base(ident)
        {
        }
    }
}