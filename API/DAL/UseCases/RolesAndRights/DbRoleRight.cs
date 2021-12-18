using System;
using System.ComponentModel.DataAnnotations.Schema;
using Dapper.FluentMap.Mapping;
using DapperExtensions.Mapper;

namespace API.DAL.UseCases.RolesAndRights
{
    [Table("role_rights")]
    public class DbRoleRight : DeletableDbEntity
    {
        [Column("RoleIdent")] public Guid RoleIdent { get; set; }
        [Column("RightIdent")] public Guid RightIdent { get; set; }
    }

    public class DbCustomRoleRightCrudMap : ClassMapper<DbRoleRight>
    {
        public DbCustomRoleRightCrudMap()
        {
            Table("role_rights");
            Map(p => p.Ident).Key(KeyType.Assigned);
            Map(p => p.RoleIdent).Column("RoleIdent");
            Map(p => p.RightIdent).Column("RightIdent");
            AutoMap();
        }
    }

    public class DbCustomRoleRightQueryMap : EntityMap<DbRoleRight>
    {
        public DbCustomRoleRightQueryMap()
        {
            Map(p => p.Ident).ToColumn("Ident");
            Map(p => p.RoleIdent).ToColumn("RoleIdent");
            Map(p => p.RightIdent).ToColumn("RightIdent");
        }
    }
}