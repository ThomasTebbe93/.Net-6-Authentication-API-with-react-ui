using System;
using System.Text;
using API.BLL.Base;
using API.BLL.Helper;
using API.BLL.UseCases.Authentication.Services;
using API.BLL.UseCases.Files;
using API.BLL.UseCases.Mailing;
using API.BLL.UseCases.Memberships.Daos;
using API.BLL.UseCases.Memberships.Merger;
using API.BLL.UseCases.Memberships.Services;
using API.BLL.UseCases.Register.Services;
using API.BLL.UseCases.RolesAndRights.Daos;
using API.BLL.UseCases.RolesAndRights.Merger;
using API.BLL.UseCases.RolesAndRights.Services;
using API.DAL.UseCases.Files;
using API.DAL.UseCases.Memberships;
using API.DAL.UseCases.RolesAndRights;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors();
            services.AddControllers();

            // configure strongly typed settings objects
            var appSettingsSection = Configuration.GetSection("AppSettings");
            services.Configure<AppSettings>(appSettingsSection);
            services.Configure<IISServerOptions>(options => { options.MaxRequestBodySize = int.MaxValue; });
            services.Configure<KestrelServerOptions>(options =>
            {
                options.Limits.MaxRequestBodySize = int.MaxValue; // if don't set default value is: 30 MB
            });
            services.Configure<FormOptions>(x =>
            {
                x.ValueLengthLimit = int.MaxValue;
                x.MultipartBodyLengthLimit = int.MaxValue; // if don't set default value is: 128 MB
                x.MultipartHeadersLengthLimit = int.MaxValue;
            });
            var appSettings = appSettingsSection.Get<AppSettings>();

            // configure jwt authentication
            var key = Encoding.ASCII.GetBytes(appSettings.Secret);
            services.AddAuthentication()
                .AddJwtBearer(x =>
                {
                    x.RequireHttpsMetadata = false;
                    x.SaveToken = false;
                    x.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(key),
                        ValidateIssuer = false,
                        ValidateAudience = false,
                        ValidateLifetime = true,
                        ClockSkew = TimeSpan.Zero
                    };
                })
                .AddCookie(options =>
                {
                    options.ExpireTimeSpan = TimeSpan.FromMinutes(20);
                    options.SlidingExpiration = true;
                    options.Cookie.Domain = appSettings.Domain;
                    options.Cookie.SameSite = SameSiteMode.Strict;
                    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
                });

            RegisterModules(services);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseCookiePolicy();
            app.UseExceptionHandler("/error");
            app.UseHttpsRedirection();
            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseDbTransaction();
            app.UseCors(x => x
                .AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader());

            app.UseEndpoints(endpoints => { endpoints.MapControllers(); });
        }

        private void RegisterModules(IServiceCollection services)
        {
            // configure DI for application services
            services.AddScoped<IRequestService, RequestService>();
            services.AddScoped<IAuthenticationService, AuthenticationService>();
            services.AddScoped<IRegisterService, RegisterService>();

            services.AddScoped<IUserDao, UserDao>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<UserMerger>();

            services.AddScoped<IRoleDao, RoleDao>();
            services.AddScoped<IRoleService, RoleService>();
            services.AddScoped<RoleMerger>();
            services.AddScoped<IRoleRightDao, RoleRightDao>();

            services.AddScoped<IRightDao, RightDao>();

            services.AddScoped<IFileDao, FileDao>();
            services.AddScoped<IFileService, FileService>();

            services.AddScoped<IMailService, MailService>();
        }
    }
}