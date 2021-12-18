using System;
using System.Collections.Generic;
using System.Linq;
using API.BLL.Helper;
using API.BLL.UseCases.Files;
using API.BLL.Base;
using API.BLL.UseCases.Memberships.Entities;
using Dapper;
using DapperExtensions.Sql;
using Microsoft.Extensions.Options;
using Npgsql;

namespace API.DAL.UseCases.Files
{
    public class FileDao : AbstractPostgresqlDao<File, DbFile, FileIdent, FileTransformer>, IFileDao
    {
        public FileDao(IOptions<AppSettings> appSettings) : base(appSettings, "files")
        {
        }

        public DataTableSearchResult<File> FindBySearchValue(FileSearchOptions searchOptions)
        {
            var query = $@"WITH TempResult AS (SELECT {TableName}.* FROM {TableName} ";
            var queryFilter = new HashSet<string>();
            var queryOrder = "";

            var queryParams = new
            {
                name = $@"%{searchOptions.Name}%",
                skip = searchOptions.Skip,
                take = searchOptions.Take
            };

            queryFilter.Add($@"{TableName}.Deleted IS NOT true ");

            if (!string.IsNullOrEmpty(searchOptions.Name))
            {
                queryFilter.Add($@"{TableName}.Name ILIKE @name ");
            }

            switch (searchOptions.SortColumn)
            {
                case FileSortColumn.Name:
                    queryOrder = $@"ORDER BY {TableName}.Name {GetSearchDirection(searchOptions.IsDescending)} ";
                    break;
                case FileSortColumn.Size:
                    queryOrder = $@"ORDER BY {TableName}.Size {GetSearchDirection(searchOptions.IsDescending)} ";
                    break;
                case FileSortColumn.CreateTime:
                    queryOrder = $@"ORDER BY {TableName}.CreateTime {GetSearchDirection(searchOptions.IsDescending)} ";
                    break;
                default:
                    queryOrder = $@"ORDER BY {TableName}.Name {GetSearchDirection(searchOptions.IsDescending)} ";
                    break;
            }

            if (queryFilter.Count > 0)
                query += "WHERE " + string.Join("AND ", queryFilter);

            query += queryOrder;
            query += @"), TempCount AS (
                        SELECT COUNT(*) AS TotalRowCount FROM TempResult
                        ) 
                    SELECT * FROM TempResult as data, TempCount AS meta
                    Offset @skip Rows
                    Fetch Next @take Rows Only ";

            DapperExtensions.DapperExtensions.SqlDialect = new PostgreSqlDialect();

            var totalCount = (Int64)0;
            using var con = new NpgsqlConnection(ConnectionString);
            con.Open();
            var res = con.Query<File>(
                query,
                new[]
                {
                    typeof(DbFile), typeof(Int64)
                },
                (objects) =>
                {
                    var stockFile = (DbFile)objects[0];
                    totalCount = (Int64)objects[1];
                    return Transformer.ToEntity(stockFile);
                },
                queryParams,
                splitOn: "ident,TotalRowCount"
            ).ToList();
            return new DataTableSearchResult<File>()
            {
                Data = res,
                TotalRowCount = totalCount
            };
        }

        private string GetSearchDirection(bool? isDescending) => isDescending == true ? "DESC" : "ASC";
    }
}