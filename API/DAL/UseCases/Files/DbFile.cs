using System;
using System.ComponentModel.DataAnnotations.Schema;
using Dapper.FluentMap.Mapping;
using DapperExtensions.Mapper;

namespace API.DAL.UseCases.Files
{
    [Table("files")]
    public class DbFile : DeletableDbEntity
    {
        public string Name { get; set; }
        public string MimeType { get; set; }
        public long Size { get; set; }
        public string AutHash { get; set; }
        public DateTimeOffset CreateTime { get; set; }

    }
    public class DbFileCrudMap : ClassMapper<DbFile>
    {
        public DbFileCrudMap()
        {
            Table("files");
            Map(p => p.Ident).Key(KeyType.Assigned);
            Map(p => p.Name).Column("Name");
            Map(p => p.MimeType).Column("MimeType");
            Map(p => p.Size).Column("Size");
            Map(p => p.AutHash).Column("AutHash");
            Map(p => p.CreateTime).Column("CreateTime");
            AutoMap();
        }
    }

    public class DbFileQueryMap : EntityMap<DbFile>
    {
        public DbFileQueryMap()
        {
            Map(p => p.Ident).ToColumn("Ident");
            Map(p => p.Name).ToColumn("Name");
            Map(p => p.MimeType).ToColumn("MimeType");
            Map(p => p.Size).ToColumn("Size");
            Map(p => p.AutHash).ToColumn("AutHash");
            Map(p => p.CreateTime).ToColumn("CreateTime");
        }
    }
}