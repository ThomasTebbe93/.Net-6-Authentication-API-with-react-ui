using API.BLL.Base;
using API.BLL.Extensions;
using API.BLL.UseCases.RolesAndRights.Entities;
using API.DAL.UseCases.RolesAndRights;

namespace API.BLL.UseCases.RolesAndRights.Transformer
{
    public class RoleRightTransformer : ITransformer<RoleRight, DbRoleRight>
    {
        public RoleRight ToEntity(DbRoleRight entity)
        {
            return new RoleRight()
            {
                Deleted = entity.Deleted,
                Ident = new RoleRightIdent(entity.Ident),
                RoleIdent = entity.RoleIdent.ToIdent<RoleIdent>(),
                RightIdent = entity.RightIdent.ToIdent<RightIdent>(),
            };
        }

        public DbRoleRight ToDbEntity(RoleRight entity)
        {
            return new DbRoleRight()
            {
                Deleted = entity.Deleted,
                Ident = entity.Ident.Ident,
                RoleIdent = entity.RoleIdent.Ident,
                RightIdent = entity.RightIdent.Ident,
            };
        }
    }
}