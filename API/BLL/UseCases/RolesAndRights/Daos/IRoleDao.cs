using System.Collections.Generic;
using API.BLL.Base;
using API.BLL.Helper;
using API.BLL.UseCases.RolesAndRights.Entities;
using API.BLL.UseCases.RolesAndRights.Transformer;
using Role = API.BLL.UseCases.RolesAndRights.Entities.Role;

namespace API.BLL.UseCases.RolesAndRights.Daos
{
    public interface IRoleDao : IDao<Role, RoleIdent, RoleTransformer>
    {
        List<Role> GetAllForAutocomplete(string searchValue);

        DataTableSearchResult<Role> FindBySearchValue(RoleSearchOptions searchOptions);
    }
}