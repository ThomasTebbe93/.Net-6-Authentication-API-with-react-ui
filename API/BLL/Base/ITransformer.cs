namespace API.BLL.Base
{
    public interface ITransformer<TEntiy, TDBEntity>
    {
        TEntiy ToEntity(TDBEntity entity);

        TDBEntity ToDbEntity(TEntiy entity);
    }
}