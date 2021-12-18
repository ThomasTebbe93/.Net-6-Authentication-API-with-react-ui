using System.ComponentModel.DataAnnotations.Schema;
using Dapper.FluentMap.Mapping;
using DapperExtensions.Mapper;

namespace API.DAL.UseCases.RolesAndRights
{
    [Table("roles")]
    public class DbRole : DeletableDbEntity
    {
        [Column("Name")] public string Name { get; set; }
        [Column("Description")] public string Description { get; set; }
    }

    public class DbRoleCrudMap : ClassMapper<DbRole>
    {
        public DbRoleCrudMap()
        {
            Table("roles");
            Map(p => p.Ident).Key(KeyType.Assigned);
            Map(p => p.Name).Column("Name");
            Map(p => p.Description).Column("Description");
            AutoMap();
        }
    }

    public class DbRoleQueryMap : EntityMap<DbRole>
    {
        public DbRoleQueryMap()
        {
            Map(p => p.Ident).ToColumn("Ident");
            Map(p => p.Name).ToColumn("Name");
            Map(p => p.Description).ToColumn("Description");
        }
    }
}