using System.Collections.Generic;
using API.BLL.Base;
using API.BLL.UseCases.RolesAndRights.Entities;
using API.BLL.UseCases.RolesAndRights.Transformer;

namespace API.BLL.UseCases.RolesAndRights.Daos
{
    public interface IRightDao : IDao<Right, RightIdent, RightTransformer>
    {
        List<Right> FindAll();
    }
}