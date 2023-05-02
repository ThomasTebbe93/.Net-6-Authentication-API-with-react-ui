using System;
using System.Threading.Tasks;
using System.Transactions;
using Microsoft.AspNetCore.Http;

namespace API.BLL.Base;

public class DbTransactionMiddleware
{
    private readonly RequestDelegate next;

    public DbTransactionMiddleware(RequestDelegate next)
    {
        this.next = next;
    }

    public async Task Invoke(HttpContext httpContext)
    {
        // For HTTP GET opening transaction is not required
        if (httpContext.Request.Method.Equals("GET", StringComparison.CurrentCultureIgnoreCase))
        {
            await next(httpContext);
            return;
        }

        using var transactionScope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled);

        try
        {
            await next(httpContext);

            transactionScope.Complete();
        }
        finally
        {
            transactionScope.Dispose();
        }
    }
}