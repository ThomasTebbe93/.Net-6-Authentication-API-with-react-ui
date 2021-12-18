using System;
using System.Collections.Generic;
using System.Linq;
using API.BLL.Helper;
using API.BLL.UseCases.RolesAndRights.Daos;
using API.BLL.UseCases.RolesAndRights.Entities;
using API.BLL.UseCases.RolesAndRights.Transformer;
using Dapper;
using DapperExtensions.Sql;
using Microsoft.Extensions.Options;
using Npgsql;

namespace API.DAL.UseCases.RolesAndRights
{
    public class RoleRightDao :
        AbstractPostgresqlDao<RoleRight, DbRoleRight, RoleRightIdent, RoleRightTransformer>,
        IRoleRightDao
    {
        public RoleRightDao(IOptions<AppSettings> appSettings) : base(appSettings, "role_rights")
        {
        }

        public List<RoleRight> FindByCustomRoleIdent(RoleIdent roleIdent)
        {
            DapperExtensions.DapperExtensions.SqlDialect = new PostgreSqlDialect();
            using var con = new NpgsqlConnection(ConnectionString);
            con.Open();

            var res = con.Query<DbRoleRight>(
                $@"
                        SELECT *
                        FROM {TableName}
                        WHERE RoleIdent = @roleIdent
                    ",
                new
                {
                    roleIdent = roleIdent.Ident
                }
            );

            return res.Select(x => Transformer.ToEntity(x)).ToList();
        }
        public bool DeleteHardByRoleIdents(ISet<RoleIdent> roleIdents)
        {
            DapperExtensions.DapperExtensions.SqlDialect = new PostgreSqlDialect();
            try
            {
                using var con = new NpgsqlConnection(ConnectionString);
                con.Open();

                var affectedRows = con.Execute(
                    $@"
                        DELETE FROM {TableName}
                        WHERE roleident = ANY(@idents) 
                    ",
                    new
                    {
                        idents = roleIdents.Select(x => x.Ident).ToList()
                    }
                );
                return affectedRows > 0;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }
    }
}