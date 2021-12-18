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
    public class RightDao : AbstractPostgresqlDao<Right, DbRight, RightIdent, RightTransformer>, IRightDao
    {
        public RightDao(IOptions<AppSettings> appSettings) : base(appSettings, "rights")
        {
        }
        
        public List<Right> FindAll()
        {
            using var con = new NpgsqlConnection(ConnectionString);
            con.Open();

            var res = con.Query<DbRight>(
                $@"SELECT * FROM {TableName}",
                new { }
            );

            return res.Select(x => Transformer.ToEntity(x)).ToList();
        }
    }
}