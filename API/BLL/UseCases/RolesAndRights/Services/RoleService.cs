using System;
using System.Collections.Generic;
using System.Linq;
using API.BLL.Base;
using API.BLL.Extensions;
using API.BLL.Helper;
using API.BLL.UseCases.RolesAndRights.Daos;
using API.BLL.UseCases.RolesAndRights.Entities;
using API.BLL.UseCases.RolesAndRights.Merger;
using API.BLL.UseCases.RolesAndRights.Validation;
using Role = API.BLL.UseCases.RolesAndRights.Entities.Role;

namespace API.BLL.UseCases.RolesAndRights.Services
{
    public interface IRoleService
    {
        Role FindByIdent(RoleIdent ident);
        List<Role> Autocomplete(string searchValue);
        DataTableSearchResult<Role> FindBySearchValue(RoleSearchOptions search);
        RequestResult CreateOrUpdate(Context context, List<RoleRestEntity> roles);
        RequestResult DeleteByIdent(RoleIdent ident);
    }

    public class RoleService : IRoleService
    {
        private readonly IRoleDao roleDao;
        private readonly IRightDao rightDao;
        private readonly IRoleRightDao roleRightDao;
        private readonly RoleMerger merger;

        public RoleService(
            IRoleDao roleDao,
            IRightDao rightDao,
            RoleMerger merger,
            IRoleRightDao roleRightDao)
        {
            this.roleDao = roleDao;
            this.rightDao = rightDao;
            this.merger = merger;
            this.roleRightDao = roleRightDao;
        }

        public DataTableSearchResult<Role> FindBySearchValue(RoleSearchOptions search) =>
            roleDao.FindBySearchValue(search);

        public RequestResult CreateOrUpdate(Context context, List<RoleRestEntity> roles)
        {
            var validator = new CustomRoleValidator();

            var results = roles.Select(role => validator.Validate(role));
            var validationFailures = results.SelectMany(x => x.Errors).ToList();
            if (validationFailures.Any())
                return new RequestResult()
                {
                    ValidationFailures = validationFailures,
                    StatusCode = StatusCode.ValidationError
                };

            try
            {
                var enrichedRoles = Enrich(roles);
                var oldRoles = roleDao.FindByIdents(roles.Where(role => role.Ident != null)
                    .Select(role => new RoleIdent((Guid)role.Ident))
                    .ToHashSet());
                var mergedRoles = enrichedRoles.Select(user =>
                    merger.Merge(user, oldRoles.FirstOrDefault(x => x.Ident.Ident == user.Ident))).ToList();

                var toUpdate = mergedRoles.Where(x => x.Ident != null).Select(x => x.ToEntity()).ToList();
                var toCreate = mergedRoles.Where(x => x.Ident == null).Select(x => x.ToEntity()).ToList();

                var allRoles = toCreate.Concat(toUpdate).ToList();

                var roleRightsToCreate = allRoles.SelectMany(role => role.Rights.Select(right => new RoleRight()
                {
                    Ident = Guid.NewGuid().ToIdent<RoleRightIdent>(),
                    RightIdent = right.Ident,
                    RoleIdent = role.Ident,
                })).ToList();

                if (!context.User.Role.Rights.Select(x => x.Key).ToHashSet()
                        .Contains(Rights.AdministrationRolesCreate) && toCreate.Count > 0)
                    return new RequestResult()
                    {
                        PermissionFailure = new PermissionFailure()
                        {
                            FailureMessage = PermissionFailureMessage.MissingPermission,
                            UnderlyingRight = Rights.AdministrationRolesCreate
                        },
                        StatusCode = StatusCode.PermissionFailure
                    };

                if (!context.User.Role.Rights.Select(x => x.Key).ToHashSet()
                        .Contains(Rights.AdministrationRolesEdit) && toUpdate.Count > 0)
                    return new RequestResult()
                    {
                        PermissionFailure = new PermissionFailure()
                        {
                            FailureMessage = PermissionFailureMessage.MissingPermission,
                            UnderlyingRight = Rights.AdministrationRolesEdit
                        },
                        StatusCode = StatusCode.PermissionFailure
                    };

                roleDao.CreateMany(toCreate);
                roleDao.UpdateMany(toUpdate);

                var roleIdentsWithExistingRights = allRoles.Select(role => role.Ident).ToHashSet();
                roleRightDao.DeleteHardByRoleIdents(roleIdentsWithExistingRights);
                roleRightDao.CreateMany(roleRightsToCreate);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return new RequestResult()
                {
                    StatusCode = StatusCode.InternalServerError,
                    Exception = e
                };
            }

            return new RequestResult()
            {
                StatusCode = StatusCode.Ok
            };
        }

        
        private List<RoleRestEntity> Enrich(List<RoleRestEntity> roles)
        {
            var rights = rightDao.FindAll();

            var res = roles.Select(role => new RoleRestEntity(role)
            {
                Rights = rights.Where(right => role.Rights.Any(newRight => newRight.Key == right.Key)).ToList()
            }).ToList();

            return res;
        }

        public List<Role> Autocomplete(string searchValue) =>
            roleDao.GetAllForAutocomplete(searchValue);

        public Role FindByIdent(RoleIdent ident)
        {
            var role = roleDao.FindByIdent(ident);

            var roleRightsIdents = roleRightDao.FindByCustomRoleIdent(role.Ident)
                .Select(x => x.RightIdent).ToHashSet();
            var roleRights = rightDao.FindByIdents(roleRightsIdents).ToList();

            return new Role(role)
            {
                Rights = roleRights
            };
        }

        public RequestResult DeleteByIdent(RoleIdent ident)
        {
            try
            {
                roleDao.DeleteByIdent(ident);
            }
            catch (Exception e)
            {
                return new RequestResult()
                {
                    StatusCode = StatusCode.InternalServerError,
                    Exception = e
                };
            }

            return new RequestResult()
            {
                StatusCode = StatusCode.Ok
            };
        }
    }
}