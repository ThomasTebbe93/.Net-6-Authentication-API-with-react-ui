using API.BLL.UseCases.RolesAndRights.Entities;

namespace API.BLL.UseCases.RolesAndRights.Merger
{
    public class RoleMerger
    {
        public RoleRestEntity Merge(RoleRestEntity newRole, Role oldRole)
        {
            if (oldRole == null) return newRole;
            return new RoleRestEntity()
            {
                Ident = newRole.Ident ?? oldRole.Ident.Ident,
                Deleted = newRole.Deleted ?? oldRole.Deleted,
                Name = newRole.Name,
                Description = newRole.Description,
                Rights = newRole.Rights
            };
        }
    }
}