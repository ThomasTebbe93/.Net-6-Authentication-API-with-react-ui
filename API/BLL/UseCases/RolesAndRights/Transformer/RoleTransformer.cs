using API.BLL.Base;
using API.BLL.UseCases.RolesAndRights.Entities;
using API.DAL.UseCases.RolesAndRights;
using Role = API.BLL.UseCases.RolesAndRights.Entities.Role;

namespace API.BLL.UseCases.RolesAndRights.Transformer
{
    public class RoleTransformer : ITransformer<Role, DbRole>
    {
        public Role ToEntity(DbRole entity)
        {
            return new Role()
            {
                Deleted = entity.Deleted,
                Ident = new RoleIdent(entity.Ident),
                Name = entity.Name,
                Description = entity.Description,
            };
        }

        public DbRole ToDbEntity(Role entity)
        {
            return new DbRole()
            {
                Deleted = entity.Deleted,
                Ident = entity.Ident.Ident,
                Name = entity.Name,
                Description = entity.Description,
            };
        }
    }
}