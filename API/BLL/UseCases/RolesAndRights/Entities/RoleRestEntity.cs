using System;
using System.Collections.Generic;

namespace API.BLL.UseCases.RolesAndRights.Entities
{
    public class RoleRestEntity
    {
        public Guid? Ident { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool? Deleted { get; set; }
        public List<Right> Rights { get; set; }

        public RoleRestEntity()
        {
        }

        public RoleRestEntity(RoleRestEntity entity)
        {
            Ident = entity.Ident;
            Deleted = entity.Deleted;
            Name = entity.Name;
            Description = entity.Description;
            Rights = entity.Rights;
        }

        public Role ToEntity() => new Role()
        {
            Ident = new RoleIdent(Ident ?? Guid.NewGuid()),
            Deleted = Deleted ?? false,
            Name = Name,
            Description = Description,
            Rights = Rights
        };
    }
}