using System.Collections.Generic;
using System.IO;
using System.Linq;
using API.BLL.Helper;
using API.BLL.Base;
using ImageMagick;
using Microsoft.Extensions.Options;

namespace API.BLL.UseCases.Files
{
    public interface IFileService
    {
        File FindByIdentWithoutContext(FileIdent ident);
        Stream GetStreamByIdent(FileIdent ident);
        Stream GetImageViewStream(FileIdent ident, ImageSize size);
        DataTableSearchResult<File> FindBySearchValue(FileSearchOptions search);
 }

    public class FileService : IFileService
    {
        private readonly AppSettings appSettings;
        private readonly IFileDao fileDao;

        public FileService(
            IOptions<AppSettings> appSettings,
            IFileDao fileDao)
        {
            this.appSettings = appSettings.Value;
            this.fileDao = fileDao;
        }

        public File FindByIdentWithoutContext(FileIdent ident)
        {
            var file = fileDao.FindByIdentWithoutContext(ident);
            return new File(file)
            {
                DownloadPath = GetDownloadPath(file.Ident, file.AutHash),
                ViewPath = GetViewPath(file.Ident, file.AutHash)
            };
        }

        public Stream GetStreamByIdent(FileIdent ident)
        {
            var filePath = GetCombinedPath(ident);
            return new FileStream(filePath, FileMode.Open, FileAccess.Read);
        }

        public FileStream GetFileStreamByIdent(FileIdent ident) =>
            System.IO.File.OpenRead(GetCombinedPath(ident));

        public Stream GetImageViewStream(FileIdent fileIdent, ImageSize size)
        {
            var file = FindByIdentWithoutContext(fileIdent);
            
            if(!file.MimeType.Contains("image"))
                throw new FileNotFoundException("The mimetype of the requested file does not match to an image.");
            
            var image = GetFileStreamByIdent(file.Ident);
            if (size == ImageSize.Original)
            {
                return image;
            }
            
            using var resizedImage = new MagickImage(image);
            var resizeSize = new MagickGeometry((int)size, (int)size);
            resizedImage.Resize(resizeSize);
            var array = resizedImage.ToByteArray();
            return new MemoryStream(array);
        }

        public string GetCombinedPath(FileIdent fileIdent)
        {
            var basePath = appSettings.BasePath;
            var folder = fileIdent.Ident.ToString().Substring(0, 2);
            var fileName = fileIdent.Ident.ToString();

            return $"{basePath}/{folder}/{fileName}";
        }

        public string GetDownloadPath(FileIdent fileIdent, string autHash)
        {
            var baseUrl = appSettings.BaseUrlApi;
            var fileName = fileIdent.Ident.ToString();

            return $"{baseUrl}/file/getByIdent/{fileName}?hash{autHash}";
        }
        
        public string GetViewPath(FileIdent fileIdent, string autHash)
        {
            var baseUrl = appSettings.BaseUrlApi;
            var fileName = fileIdent.Ident.ToString();

            return $"{baseUrl}/file/viewByIdent/{fileName}?hash{autHash}";
        }
        
        public DataTableSearchResult<File> FindBySearchValue( FileSearchOptions search)
        {
            var dataTableSearchResult = fileDao.FindBySearchValue(search);

            var files = dataTableSearchResult.Data.Select(file => new File(file)
                {DownloadPath = GetDownloadPath(file.Ident, file.AutHash)}).ToList();

            var res = new DataTableSearchResult<File>(dataTableSearchResult)
            {
                Data = files
            };

            return res;
        }
        
    }
}