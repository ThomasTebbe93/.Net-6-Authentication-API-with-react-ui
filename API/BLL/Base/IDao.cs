using System.Collections.Generic;

namespace API.BLL.Base
{
    public interface
        IDao<TEntity, TIdent, TTransformer>
    {
        TEntity FindByIdent(TIdent ident);
        TEntity FindByIdentWithoutContext(TIdent ident);
        List<TEntity> FindByIdents(HashSet<TIdent> idents);
        bool DeleteByIdent(TIdent ident);
        bool DeleteByIdents(HashSet<TIdent> ident);
        void Create(TEntity entity);
        void CreateMany(List<TEntity> entities);
        void Update(TEntity entity);
        void UpdateMany(List<TEntity> entities);
    }
}