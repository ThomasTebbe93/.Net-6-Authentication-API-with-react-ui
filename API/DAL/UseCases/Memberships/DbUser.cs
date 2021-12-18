using System;
using System.ComponentModel.DataAnnotations.Schema;
using Dapper.FluentMap.Mapping;
using DapperExtensions.Mapper;

namespace API.DAL.UseCases.Memberships
{
    [Table("users")]
    public class DbUser : DeletableDbEntity
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }
        public string PasswordHash { get; set; }
        public string PasswordSalt { get; set; }
        public Guid? RoleIdent { get; set; }
        public DateTime PasswordChangedDate { get; set; }
        public string PasswordForgottenHash { get; set; }
        public DateTime? PasswordForgottenHashDate { get; set; }
    }

    public class DbUserCrudMap : ClassMapper<DbUser>
    {
        public DbUserCrudMap()
        {
            Table("users");
            Map(p => p.Ident).Key(KeyType.Assigned);
            Map(p => p.FirstName).Column("FirstName");
            Map(p => p.LastName).Column("LastName");
            Map(p => p.UserName).Column("Username");
            Map(p => p.RoleIdent).Column("RoleIdent");
            Map(p => p.PasswordHash).Column("PasswordHash");
            Map(p => p.PasswordSalt).Column("PasswordSalt");
            Map(p => p.PasswordChangedDate).Column("PasswordChangedDate");
            Map(p => p.PasswordForgottenHash).Column("PasswordForgottenHash");
            Map(p => p.PasswordForgottenHashDate).Column("PasswordForgottenHashDate");
            AutoMap();
        }
    }

    public class DbUserQueryMap : EntityMap<DbUser>
    {
        public DbUserQueryMap()
        {
            Map(p => p.Ident).ToColumn("Ident");
            Map(p => p.FirstName).ToColumn("FirstName");
            Map(p => p.LastName).ToColumn("LastName");
            Map(p => p.UserName).ToColumn("Username");
            Map(p => p.RoleIdent).ToColumn("RoleIdent");
            Map(p => p.PasswordHash).ToColumn("PasswordHash");
            Map(p => p.PasswordSalt).ToColumn("PasswordSalt");
            Map(p => p.PasswordChangedDate).ToColumn("PasswordChangedDate");
            Map(p => p.PasswordForgottenHash).ToColumn("PasswordForgottenHash");
            Map(p => p.PasswordForgottenHashDate).ToColumn("PasswordForgottenHashDate");
        }
    }
}