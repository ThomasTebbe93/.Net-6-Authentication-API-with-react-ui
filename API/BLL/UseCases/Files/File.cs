using System;
using System.IO;
using API.BLL.Base;
using API.BLL.UseCases.Memberships.Entities;

namespace API.BLL.UseCases.Files
{
    public class File : BaseEntity<FileIdent>
    {
        public string Name { get; set; }
        public Guid ClientIdent { get; set; }
        public string MimeType { get; set; }
        public long Size { get; set; }
        public string AutHash { get; set; }
        public string DownloadPath { get; set; }
        public string ViewPath { get; set; }
        public DateTimeOffset? CreateTime { get; set; }
        
        public Stream Stream  { get; set; }
        
        public File(){}

        public File(File existing)
        {
            Ident = existing.Ident;
            Deleted = existing.Deleted;
            Name = existing.Name;
            ClientIdent = existing.ClientIdent;
            MimeType = existing.MimeType;
            Size = existing.Size;
            AutHash = existing.AutHash;
            DownloadPath = existing.DownloadPath;
            ViewPath = existing.ViewPath;
            Stream = existing.Stream;
            CreateTime = existing.CreateTime ?? DateTimeOffset.Now;
        }
    }
    
    public class FileIdent : IdentBase
    {
        public FileIdent(Guid ident) : base(ident)
        {
        }
    }
}