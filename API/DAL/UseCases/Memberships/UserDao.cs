using System;
using System.Collections.Generic;
using System.Linq;
using API.BLL.Base;
using API.BLL.Helper;
using API.BLL.UseCases.Memberships.Daos;
using API.BLL.UseCases.Memberships.Entities;
using API.BLL.UseCases.Memberships.Transformer;
using Dapper;
using DapperExtensions.Sql;
using Microsoft.Extensions.Options;
using Npgsql;

namespace API.DAL.UseCases.Memberships
{
    public class UserDao : AbstractPostgresqlDao<User, DbUser, UserIdent, UserTransformer>, IUserDao
    {
        public UserDao(IOptions<AppSettings> appSettings) : base(appSettings, "users")
        {
        }

        public User GetUserByUserName(string userName)
        {
            var transformer = new UserTransformer();
            using NpgsqlConnection con = new NpgsqlConnection(ConnectionString);
            con.Open();

            var res = con.Query<DbUser>(
                $@"SELECT * 
                    FROM {TableName} 
                    WHERE Username = @userName AND 
                        Deleted IS NOT true",
                new
                {
                    userName
                });

            return res.Select(x => transformer.ToEntity(x)).FirstOrDefault();
        }

        public bool IsLoginUnique(string userName, Guid? userIdent)
        {
            using NpgsqlConnection con = new NpgsqlConnection(ConnectionString);
            con.Open();

            var res = con.Query<bool>(
                $@"SELECT CASE WHEN EXISTS (
		                    SELECT * FROM users
                            WHERE (@userIdent IS NOT NULL AND ident != @userIdent AND username = @userName) OR 
                                (ident != @userIdent AND username = @userName) OR 
                                (@userIdent IS NULL AND username = @userName)) 
	                    THEN 0
	                    ELSE 1
	                    END",
                new
                {
                    userName,
                    userIdent,
                });

            return res.FirstOrDefault();
        }

        public User FindByIdentForContext(UserIdent userIdent)
        {
            var transformer = new UserTransformer();
            using NpgsqlConnection con = new NpgsqlConnection(ConnectionString);
            con.Open();

            var res = con.Query<DbUser>(
                $@"
                        SELECT *
                        FROM {TableName}
                        WHERE Ident = @ident AND
                            Deleted IS NOT true
                    ",
                new
                {
                    ident = userIdent.Ident,
                });

            return res.Select(x => transformer.ToEntity(x)).FirstOrDefault();
        }

        public DataTableSearchResult<User> FindBySearchValue(UserSearchOptions searchOptions)
        {
            var query = $@"WITH TempResult AS (SELECT * FROM {TableName} ";
            var roleTable = "roles";
            var roleJoin = RoleJoin(roleTable);
            var joins = new List<string>();

            var queryFilter = new HashSet<string>();
            var queryOrder = "";

            var queryParams = new
            {
                firstname = $@"%{searchOptions.FirstName}%",
                lastname = $@"%{searchOptions.LastName}%",
                username = $@"%{searchOptions.UserName}%",
                role = $@"%{searchOptions.Role}%",
                skip = searchOptions.Skip,
                take = searchOptions.Take
            };

            queryFilter.Add($@"{TableName}.Deleted IS NOT true ");

            if (!string.IsNullOrEmpty(searchOptions.FirstName))
            {
                queryFilter.Add($@"{TableName}.FirstName ILIKE @firstname ");
            }

            if (!string.IsNullOrEmpty(searchOptions.LastName))
            {
                queryFilter.Add($@"{TableName}.LastName ILIKE @lastname ");
            }

            if (!string.IsNullOrEmpty(searchOptions.UserName))
            {
                queryFilter.Add($@"{TableName}.UserName ILIKE @username ");
            }

            if (!string.IsNullOrEmpty(searchOptions.Role))
            {
                queryFilter.Add($@"{roleTable}.Name ILIKE @role ");
                joins.Add(roleJoin);
            }

            switch (searchOptions.SortColumn)
            {
                case UserSortColumn.FirstName:
                    queryOrder = $@"ORDER BY {TableName}.FirstName {GetSearchDirection(searchOptions.IsDescending)} ";
                    break;
                case UserSortColumn.LastName:
                    queryOrder = $@"ORDER BY {TableName}.LastName {GetSearchDirection(searchOptions.IsDescending)} ";
                    break;
                case UserSortColumn.UserName:
                    queryOrder = $@"ORDER BY {TableName}.UserName {GetSearchDirection(searchOptions.IsDescending)} ";
                    break;
                case UserSortColumn.Role:
                    queryOrder = $@"ORDER BY {roleTable}.Name {GetSearchDirection(searchOptions.IsDescending)} ";
                    joins.Add(roleJoin);
                    break;
                default:
                    queryOrder = $@"ORDER BY {TableName}.FirstName {GetSearchDirection(searchOptions.IsDescending)} ";
                    break;
            }

            if (joins.Count > 0)
                query += String.Join(' ', joins.ToHashSet());

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
            var res = con.Query<User>(
                query,
                new[]
                {
                    typeof(DbUser), typeof(Int64)
                },
                (objects) =>
                {
                    var user = (DbUser)objects[0];
                    totalCount = (Int64)objects[1];
                    return Transformer.ToEntity(user);
                },
                queryParams,
                splitOn: "ident,TotalRowCount"
            ).ToList();
            return new DataTableSearchResult<User>()
            {
                Data = res,
                TotalRowCount = totalCount
            };
        }

        private string GetSearchDirection(bool? isDescending) => isDescending == true ? "DESC" : "ASC";

        private string RoleJoin(string role) =>
            $@"LEFT JOIN {role} AS {role} ON {role}.Ident = {TableName}.roleIdent ";
    }
}