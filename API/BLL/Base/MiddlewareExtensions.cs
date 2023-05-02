using Microsoft.AspNetCore.Builder;

namespace API.BLL.Base;

public static class MiddlewareExtensions
{
    public static IApplicationBuilder UseDbTransaction(this IApplicationBuilder app)
        => app.UseMiddleware<DbTransactionMiddleware>();
}