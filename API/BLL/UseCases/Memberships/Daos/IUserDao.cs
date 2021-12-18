using System;
using API.BLL.Base;
using API.BLL.UseCases.Memberships.Entities;
using API.BLL.UseCases.Memberships.Transformer;

namespace API.BLL.UseCases.Memberships.Daos
{
    public interface IUserDao : IDao<User, UserIdent, UserTransformer>
    {
        User GetUserByUserName(string userName);
        bool IsLoginUnique(string userName, Guid? userIdent);
        User FindByIdentForContext(UserIdent userIdent);
        DataTableSearchResult<User> FindBySearchValue(UserSearchOptions searchOptions);
    }
}