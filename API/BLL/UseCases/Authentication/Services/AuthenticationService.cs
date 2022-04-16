using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using API.BLL.Base;
using API.BLL.Helper;
using API.BLL.UseCases.Authentication.Entities;
using API.BLL.UseCases.Memberships.Daos;
using API.BLL.UseCases.Memberships.Entities;
using API.BLL.Extensions;
using API.BLL.UseCases.RolesAndRights.Daos;
using API.BLL.UseCases.RolesAndRights.Services;
using FluentValidation.Results;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace API.BLL.UseCases.Authentication.Services
{
    public interface IAuthenticationService
    {
        IActionResult Authenticate(string username, string password);
        bool IsPasswordValid(string input, string hashFromDb, string slatFromDb);
        string ConvertToHash(string password, byte[] salt);
        byte[] GenerateSalt();
        string GenerateUrlHash();
        string GenerateToken(AuthenticationUser user);
        AuthenticationUser GetAuthUser(User user);
        AuthenticationUser GetSuperVisorAuthUser();
        Task SetCookie(AuthenticationUser user, HttpContext httpContext);
        Task<IActionResult> AuthenticateWithCookie(string username, string password, HttpContext httpContext);
    }

    public class AuthenticationService : IAuthenticationService
    {
        private readonly AppSettings appSettings;
        private readonly IUserDao userDao;
        private readonly IRoleService roleService;
        private readonly IRightDao rightDao;

        public AuthenticationService(
            IOptions<AppSettings> appSettings,
            IUserDao userDao,
            IRoleService roleService,
            IRightDao rightDao)
        {
            this.appSettings = appSettings.Value;
            this.userDao = userDao;
            this.roleService = roleService;
            this.rightDao = rightDao;
        }

        public bool IsPasswordValid(string input, string hashFromDb, string slatFromDb) =>
            hashFromDb == ConvertToHash(input, Convert.FromBase64String(slatFromDb));

        public string ConvertToHash(string password, byte[] salt) =>
            Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: password,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA1,
                iterationCount: 10000,
                numBytesRequested: 256 / 8));

        public byte[] GenerateSalt()
        {
            var salt = new byte[128 / 8];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(salt);

            return salt;
        }

        public string GenerateUrlHash() => Convert.ToBase64String(GenerateSalt()).Replace('+', '0');

        public string GenerateToken(AuthenticationUser user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(appSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.Ident.Ident.ToString()),
                    new Claim("CreateTime", DateTime.Now
                        .ToString("yyyy'-'MM'-'dd'T'HH':'mm':'ss'.'fff"))
                }),
                Expires = DateTime.UtcNow.AddDays(10),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public IActionResult Authenticate(string username, string password)
        {
            AuthenticationUser authUser;

            if (username == appSettings.SupervisorUserName && password != appSettings.SupervisorPassword)
                return new OkObjectResult(new RequestResult()
                {
                    ValidationFailures = new List<ValidationFailure>()
                    {
                        new ValidationFailure("Password", "validation.error.userNameOrPasswordInvalid")
                    },
                    StatusCode = StatusCode.Unauthorized
                });

            if (username == appSettings.SupervisorUserName && password == appSettings.SupervisorPassword)
            {
                authUser = GetSuperVisorAuthUser();
                authUser.Token = GenerateToken(authUser);

                return new OkObjectResult(authUser);
            }

            var user = userDao.GetUserByUserName(username);
            if (user == null)
                return new OkObjectResult(new RequestResult()
                {
                    ValidationFailures = new List<ValidationFailure>()
                    {
                        new ValidationFailure("Password", "validation.error.userNameOrPasswordInvalid")
                    },
                    StatusCode = StatusCode.Unauthorized
                });

            if (!IsPasswordValid(password, user.PasswordHash, user.PasswordSalt))
                return new OkObjectResult(new RequestResult()
                {
                    ValidationFailures = new List<ValidationFailure>()
                    {
                        new ValidationFailure("Password", "validation.error.userNameOrPasswordInvalid")
                    },
                    StatusCode = StatusCode.Unauthorized
                });

            authUser = GetAuthUser(user);
            authUser.Token = GenerateToken(authUser);

            return new OkObjectResult(authUser);
        }

        public async Task<IActionResult> AuthenticateWithCookie(string username, string password,
            HttpContext httpContext)
        {
            AuthenticationUser authUser;

            if (username == appSettings.SupervisorUserName && password != appSettings.SupervisorPassword)
                return new OkObjectResult(new RequestResult()
                {
                    ValidationFailures = new List<ValidationFailure>()
                    {
                        new ValidationFailure("Password", "validation.error.userNameOrPasswordInvalid")
                    },
                    StatusCode = StatusCode.Unauthorized
                });

            if (username == appSettings.SupervisorUserName && password == appSettings.SupervisorPassword)
            {
                authUser = GetSuperVisorAuthUser();
                await SetCookie(authUser, httpContext);

                return new OkObjectResult(authUser);
            }

            var user = userDao.GetUserByUserName(username);
            if (user == null)
                return new OkObjectResult(new RequestResult()
                {
                    ValidationFailures = new List<ValidationFailure>()
                    {
                        new ValidationFailure("Password", "validation.error.userNameOrPasswordInvalid")
                    },
                    StatusCode = StatusCode.Unauthorized
                });

            if (!IsPasswordValid(password, user.PasswordHash, user.PasswordSalt))
                return new OkObjectResult(new RequestResult()
                {
                    ValidationFailures = new List<ValidationFailure>()
                    {
                        new ValidationFailure("Password", "validation.error.userNameOrPasswordInvalid")
                    },
                    StatusCode = StatusCode.Unauthorized
                });

            authUser = GetAuthUser(user);
            await SetCookie(authUser, httpContext);

            return new OkObjectResult(authUser);
        }

        public async Task SetCookie(AuthenticationUser user, HttpContext httpContext)
        {
            var claimsIdentity = new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.Name, user.Ident.Ident.ToString()),
                new Claim("CreateTime", DateTime.Now
                    .ToString("yyyy'-'MM'-'dd'T'HH':'mm':'ss'.'fff"))
            }, CookieAuthenticationDefaults.AuthenticationScheme);

            await httpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(claimsIdentity));
        }

        public AuthenticationUser GetSuperVisorAuthUser()
        {
            return new AuthenticationUser()
            {
                Ident = Guid.Empty.ToIdent<UserIdent>(),
                FirstName = "Admin",
                LastName = "Admin",
                UserName = "Admin",
                Rights = rightDao.FindAll().Select(right => right.Key).ToList(),
            };
        }

        public AuthenticationUser GetAuthUser(User user)
        {
            var role = user.Role != null
                ? roleService.FindByIdent(user.RoleIdent)
                : null;

            return new AuthenticationUser(user)
            {
                Rights = role?.Rights?.Select(right => right.Key)?.ToList(),
            };
        }
    }
}