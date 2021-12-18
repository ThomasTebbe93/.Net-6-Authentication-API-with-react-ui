using System;
using API.BLL.Base;
using API.BLL.UseCases.Memberships.Entities;
using API.DAL.UseCases.Files;

namespace API.BLL.UseCases.Files
{
    public class FileTransformer : ITransformer<File, DbFile>
    {
        public File ToEntity(DbFile entity)
        {
            return new File()
            {
                Ident = new FileIdent(entity.Ident),
                Deleted = entity.Deleted,
                Name = entity.Name,
                MimeType = entity.MimeType,
                Size = entity.Size,
                AutHash = entity.AutHash,
                CreateTime = entity.CreateTime,
            };
        }

        public DbFile ToDbEntity(File entity)
        {
            return new DbFile()
            {
                Ident = entity.Ident.Ident,
                Deleted = entity.Deleted,
                Name = entity.Name,
                MimeType = entity.MimeType,
                Size = entity.Size,
                AutHash = entity.AutHash,
                CreateTime = entity.CreateTime ?? DateTimeOffset.Now,
            };
        }
    }
}