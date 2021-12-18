using API.BLL.Base;

namespace API.BLL.UseCases.Files
{
    public interface IFileDao : IDao<File, FileIdent, FileTransformer>
    {
        DataTableSearchResult<File> FindBySearchValue(FileSearchOptions searchOptions);
    }
}