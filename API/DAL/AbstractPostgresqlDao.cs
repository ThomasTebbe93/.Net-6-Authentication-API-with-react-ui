using System;
using System.Collections.Generic;
using System.Linq;
using API.BLL.Base;
using API.BLL.Helper;
using Dapper;
using DapperExtensions;
using DapperExtensions.Sql;
using Microsoft.Extensions.Options;
using Npgsql;

namespace API.DAL
{
    public abstract class
        AbstractPostgresqlDao<TEntity, TDbEntity, TIdent, TTransformer> : IDao<TEntity, TIdent, TTransformer>
        where TDbEntity : DbEntity
        where TIdent : IdentBase
        where TTransformer : ITransformer<TEntity, TDbEntity>, new()
    {
        protected readonly string ConnectionString;
        protected TTransformer Transformer;
        protected string TableName { get; }

        protected AbstractPostgresqlDao(IOptions<AppSettings> appSettings, string tableName)
        {
            ConnectionString = appSettings.Value.DbConnection;
            Transformer = new TTransformer();
            TableName = tableName;
        }

        public TEntity FindByIdent(TIdent ident)
        {
            DapperExtensions.DapperExtensions.SqlDialect = new PostgreSqlDialect();
            using var con = new NpgsqlConnection(ConnectionString);
            con.Open();

            var res = con.Query<TDbEntity>(
                $@"
                        SELECT *
                        FROM {TableName}
                        WHERE Ident = @ident
                    ",
                new
                {
                    ident = ident.Ident,
                }
            ).First();

            return Transformer.ToEntity(res);
        }

        public TEntity FindByIdentWithoutContext(TIdent ident)
        {
            DapperExtensions.DapperExtensions.SqlDialect = new PostgreSqlDialect();
            using var con = new NpgsqlConnection(ConnectionString);
            con.Open();

            var res = con.Query<TDbEntity>(
                $@"
                        SELECT *
                        FROM {TableName}
                        WHERE Ident = @ident
                    ",
                new
                {
                    ident = ident.Ident
                }
            ).First();

            return Transformer.ToEntity(res);
        }

        public List<TEntity> FindByIdents(HashSet<TIdent> idents)
        {
            if (idents.Count < 1) return new List<TEntity>();

            DapperExtensions.DapperExtensions.SqlDialect = new PostgreSqlDialect();
            using var con = new NpgsqlConnection(ConnectionString);
            con.Open();

            var res = con.Query<TDbEntity>(
                $@"
                        SELECT *
                        FROM {TableName}
                        WHERE Ident = ANY(@idents)
                    ",
                new
                {
                    idents = idents.Select(x => x.Ident).ToList(),
                }
            );

            return res.Select(x => Transformer.ToEntity(x)).ToList();
        }

        public bool DeleteByIdent(TIdent ident)
        {
            DapperExtensions.DapperExtensions.SqlDialect = new PostgreSqlDialect();
            try
            {
                using var con = new NpgsqlConnection(ConnectionString);
                con.Open();

                var affectedRows = con.Execute(
                    $@"
                        UPDATE {TableName}
                        SET Deleted = TRUE
                        WHERE Ident = @ident
                    ",
                    new
                    {
                        ident = ident.Ident,
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

        public bool DeleteByIdents(HashSet<TIdent> idents)
        {
            DapperExtensions.DapperExtensions.SqlDialect = new PostgreSqlDialect();
            try
            {
                using var con = new NpgsqlConnection(ConnectionString);
                con.Open();

                var affectedRows = con.Execute(
                    $@"
                        UPDATE {TableName}
                        SET Deleted = TRUE
                        WHERE Ident ANY(@idents)
                    ",
                    new
                    {
                        idents = idents.Select(x => x.Ident).ToList(),
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

        public void Create(TEntity entity)
        {
            var entry = Transformer.ToDbEntity(entity);
            DapperExtensions.DapperExtensions.SqlDialect = new PostgreSqlDialect();
            using var con = new NpgsqlConnection(ConnectionString);
            con.Open();
            con.Insert(entry);
        }

        public void CreateMany(List<TEntity> entities)
        {
            var entries = entities.Select(x => Transformer.ToDbEntity(x)).ToList();
            DapperExtensions.DapperExtensions.SqlDialect = new PostgreSqlDialect();
            using var con = new NpgsqlConnection(ConnectionString);
            con.Open();
            con.Insert<TDbEntity>(entries);
        }

        public void Update(TEntity entity)
        {
            var entry = Transformer.ToDbEntity(entity);
            DapperExtensions.DapperExtensions.SqlDialect = new PostgreSqlDialect();
            using var con = new NpgsqlConnection(ConnectionString);
            con.Open();
            con.Update(entry);
        }

        public void UpdateMany(List<TEntity> entities)
        {
            var entries = entities.Select(x => Transformer.ToDbEntity(x));
            DapperExtensions.DapperExtensions.SqlDialect = new PostgreSqlDialect();
            using var con = new NpgsqlConnection(ConnectionString);
            con.Open();
            foreach (var entry in entries)
            {
                con.Update(entry);
            }
        }
    }
}