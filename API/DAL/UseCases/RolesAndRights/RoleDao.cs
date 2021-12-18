using System;
using System.Collections.Generic;
using System.Linq;
using API.BLL.Base;
using API.BLL.Helper;
using API.BLL.UseCases.RolesAndRights.Daos;
using API.BLL.UseCases.RolesAndRights.Entities;
using API.BLL.UseCases.RolesAndRights.Transformer;
using Dapper;
using DapperExtensions.Sql;
using Microsoft.Extensions.Options;
using Npgsql;
using Role = API.BLL.UseCases.RolesAndRights.Entities.Role;

namespace API.DAL.UseCases.RolesAndRights
{
    public class RoleDao :
        AbstractPostgresqlDao<Role, DbRole, RoleIdent, RoleTransformer>, IRoleDao
    {
        public RoleDao(IOptions<AppSettings> appSettings) : base(appSettings, "roles")
        {
        }

        public List<Role> GetAllForAutocomplete(string searchValue)
        {
            using var con = new NpgsqlConnection(ConnectionString);
            con.Open();

            var res = con.Query<DbRole>(
                $@"
                        SELECT *
                        FROM {TableName}
                        WHERE Deleted IS NOT True AND
                            Name ILIKE @searchValue",
                new
                {
                    searchValue = $"%{searchValue}%",
                }
            );

            return res.Select(x => Transformer.ToEntity(x)).ToList();
        }

        public DataTableSearchResult<Role> FindBySearchValue(
            RoleSearchOptions searchOptions)
        {
            var query = $@"WITH TempResult AS (SELECT * FROM {TableName} ";

            var queryFilter = new HashSet<string>();
            var queryOrder = "";

            var queryParams = new
            {
                name = $@"%{searchOptions.Name}%",
                description = $@"%{searchOptions.Description}%",
                skip = searchOptions.Skip,
                take = searchOptions.Take
            };

            queryFilter.Add($@"{TableName}.Deleted IS NOT true ");

            if (!string.IsNullOrEmpty(searchOptions.Name))
            {
                queryFilter.Add($@"{TableName}.name ILIKE @name ");
            }

            if (!string.IsNullOrEmpty(searchOptions.Description))
            {
                queryFilter.Add($@"{TableName}.description ILIKE @description ");
            }

            switch (searchOptions.SortColumn)
            {
                case CustomRoleSortColumn.Name:
                    queryOrder = $@"ORDER BY {TableName}.name {GetSearchDirection(searchOptions.IsDescending)} ";
                    break;
                case CustomRoleSortColumn.Description:
                    queryOrder = $@"ORDER BY {TableName}.description {GetSearchDirection(searchOptions.IsDescending)} ";
                    break;
                default:
                    queryOrder = $@"ORDER BY {TableName}.name {GetSearchDirection(searchOptions.IsDescending)} ";
                    break;
            }

            if (queryFilter.Count > 0)
                query += "WHERE " + string.Join("AND ", queryFilter);

            query += queryOrder;
            query += $@"), TempCount AS (
                        SELECT COUNT(*) AS TotalRowCount FROM TempResult
                        ) 
                    SELECT * FROM TempResult as data, TempCount AS meta
                    Offset @skip Rows
                    Fetch Next @take Rows Only ";

            DapperExtensions.DapperExtensions.SqlDialect = new PostgreSqlDialect();

            var totalCount = (Int64)0;
            using var con = new NpgsqlConnection(ConnectionString);
            con.Open();
            var res = con.Query<Role>(
                query,
                new[]
                {
                    typeof(DbRole), typeof(Int64)
                },
                (objects) =>
                {
                    var user = (DbRole)objects[0];
                    totalCount = (Int64)objects[1];
                    return Transformer.ToEntity(user);
                },
                queryParams,
                splitOn: "ident,TotalRowCount"
            ).ToList();
            return new DataTableSearchResult<Role>()
            {
                Data = res,
                TotalRowCount = totalCount
            };
        }

        private string GetSearchDirection(bool? isDescending) => isDescending == true ? "DESC" : "ASC";
    }
}