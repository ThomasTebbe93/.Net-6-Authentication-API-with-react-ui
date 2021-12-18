using API.BLL.Base;
using API.BLL.UseCases.RolesAndRights.Entities;
using API.DAL.UseCases.RolesAndRights;

namespace API.BLL.UseCases.RolesAndRights.Transformer
{
    public class RightTransformer: ITransformer<Right, DbRight>
    {
        public Right ToEntity(DbRight entity)
        {
            return new Right()
            {
                Ident = new RightIdent(entity.Ident),
                Key = entity.Key,
                Name = entity.Name,
                Description = entity.Description,
            };
        }

        public DbRight ToDbEntity(Right entity)
        {
            return new DbRight()
            {
                Ident = entity.Ident.Ident,
                Key = entity.Key,
                Name = entity.Name,
                Description = entity.Description,
            };
        }
    }
}