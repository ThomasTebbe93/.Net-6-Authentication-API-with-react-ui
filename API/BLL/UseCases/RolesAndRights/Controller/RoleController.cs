using System;
using System.Collections.Generic;
using System.Linq;
using API.BLL.Base;
using API.BLL.UseCases.RolesAndRights.Entities;
using API.BLL.UseCases.RolesAndRights.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.BLL.UseCases.RolesAndRights.Controller
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class RoleController : DefaultController
    {
        private readonly IRoleService roleService;

        public RoleController(IRoleService roleService, IRequestService requestService) : base(
            requestService)
        {
            this.roleService = roleService;
        }

        [HttpGet("getByIdent/{ident}")]
        public IActionResult GetByIdent(Guid ident)
        {
            if (!Context.User.Role.Rights.Select(x => x.Key).ToHashSet()
                .Contains(Rights.AdministrationRoles))
                Ok( new RequestResult()
                {
                    PermissionFailure = new PermissionFailure()
                    {
                        FailureMessage = PermissionFailureMessage.MissingPermission,
                        UnderlyingRight = Rights.AdministrationRoles
                    },
                    StatusCode = Base.StatusCode.PermissionFailure
                });
            var materialType = roleService.FindByIdent(new RoleIdent(ident));

            return Ok(materialType);
        }

        [HttpGet("deleteByIdent/{ident}")]
        public IActionResult DeleteByIdent(Guid ident)
        {            
            if (!Context.User.Role.Rights.Select(x => x.Key).ToHashSet()
                .Contains(Rights.AdministrationRolesDelete))
                return Ok(new RequestResult()
                {
                    PermissionFailure = new PermissionFailure()
                    {
                        FailureMessage = PermissionFailureMessage.MissingPermission,
                        UnderlyingRight = Rights.AdministrationRolesDelete
                    },
                    StatusCode = Base.StatusCode.PermissionFailure
                });
        
            var res = roleService.DeleteByIdent(new RoleIdent(ident));
            return Ok(res);
        }
        
        [HttpPost("autocomplete")]
        [ActionName("JSONMethod")]
        public IActionResult AutoComplete(AutoCompleteOptions autoCompleteOptions)
        {
            var stocks = roleService.Autocomplete(autoCompleteOptions.SearchValue);
            return Ok(stocks);
        }

        [HttpPost("findBySearchValue")]
        [ActionName("JSONMethod")]
        public IActionResult FindBySearchValue(RoleSearchOptions searchOptions)
        {
            if (!Context.User.Role.Rights.Select(x => x.Key).ToHashSet()
                .Contains(Rights.AdministrationRoles))
                Ok( new RequestResult()
                {
                    PermissionFailure = new PermissionFailure()
                    {
                        FailureMessage = PermissionFailureMessage.MissingPermission,
                        UnderlyingRight = Rights.AdministrationRoles
                    },
                    StatusCode = Base.StatusCode.PermissionFailure
                });
            var stock = roleService.FindBySearchValue(searchOptions);

            return Ok(stock);
        }

        [HttpPost("createorupdate")]
        [ActionName("JSONMethod")]
        public IActionResult CreateOrUpdate(List<RoleRestEntity> roles)
        {
            var res = roleService.CreateOrUpdate(Context, roles);

            return Ok(res);
        }
    }
}