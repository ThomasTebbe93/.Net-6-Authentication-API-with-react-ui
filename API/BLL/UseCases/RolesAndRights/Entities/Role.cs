using System;
using System.Collections.Generic;
using API.BLL.Base;

namespace API.BLL.UseCases.RolesAndRights.Entities
{
    public class Role : BaseEntity<RoleIdent>
    {
        public List<Right> Rights { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

        public Role()
        {
        }

        public Role(Role existing)
        {
            Ident = existing.Ident;
            Deleted = existing.Deleted;
            Rights = existing.Rights;
            Name = existing.Name;
            Description = existing.Description;
        }
    }

    public class RoleIdent : IdentBase
    {
        public RoleIdent(Guid ident) : base(ident)
        {
        }
    }
}