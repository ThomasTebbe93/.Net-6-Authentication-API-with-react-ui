using System;
using System.Collections.Generic;

namespace API.BLL.Base
{
    public class DataTableSearchResult<TEntity>
    {
        public List<TEntity> Data { get; set; }
        public Int64 TotalRowCount { get; set; }

        public DataTableSearchResult()
        {
        }

        public DataTableSearchResult(DataTableSearchResult<TEntity> entity)
        {
            Data = entity.Data;
            TotalRowCount = entity.TotalRowCount;
        }
    }
}