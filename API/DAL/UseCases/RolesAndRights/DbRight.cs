using System.ComponentModel.DataAnnotations.Schema;
using Dapper.FluentMap.Mapping;
using DapperExtensions.Mapper;

namespace API.DAL.UseCases.RolesAndRights
{
    [Table("rights")]
    public class DbRight : DbEntity
    {
        [Column("Name")] public string Name { get; set; }
        [Column("Description")] public string Description { get; set; }
        [Column("Key")] public string Key { get; set; }
    }

    public class DbRightCrudMap : ClassMapper<DbRight>
    {
        public DbRightCrudMap()
        {
            Table("rights");
            Map(p => p.Ident).Key(KeyType.Assigned);
            Map(p => p.Name).Column("Name");
            Map(p => p.Key).Column("Key");
            Map(p => p.Description).Column("Description");
            AutoMap();
        }
    }

    public class DbRightQueryMap : EntityMap<DbRight>
    {
        public DbRightQueryMap()
        {
            Map(p => p.Ident).ToColumn("Ident");
            Map(p => p.Name).ToColumn("Name");
            Map(p => p.Key).ToColumn("Key");
            Map(p => p.Description).ToColumn("Description");
        }
    }
}