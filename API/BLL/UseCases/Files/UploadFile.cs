using System;

namespace API.BLL.UseCases.Files
{
    public class UploadFile
    {
        public string Name { get; set; }
        public Guid ClientIdent { get; set; }
        public string MimeType { get; set; }
        
        public UploadFile(){}
    }
}