using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using API.BLL.Base;
using API.BLL.Extensions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;

namespace API.BLL.UseCases.Files
{
    [ApiController]
    [Route("[controller]")]
    public class FileController : DefaultController
    {
        private readonly IFileService fileService;

        public FileController(IFileService fileService, IRequestService requestService) : base(requestService)
        {
            this.fileService = fileService;
        }

        [HttpGet("getByIdent/{ident}")]
        public IActionResult Download(Guid ident)
        {
            var fileIdent = ident.ToIdent<FileIdent>();
            var file = fileService.FindByIdentWithoutContext(fileIdent);

            var stream = fileService.GetStreamByIdent(fileIdent);

            if (stream == null)
                return NotFound();

            return File(stream, file.MimeType, file.Name);
        }

        [HttpGet("viewByIdent/{ident}/{size}")]
        public IActionResult View(Guid ident, ImageSize size)
        {
            var fileIdent = ident.ToIdent<FileIdent>();

            var image = fileService.GetImageViewStream(fileIdent, size);

            return File(image, "image/jpeg");
        }

        [HttpGet("viewByIdent/{ident}")]
        public IActionResult View(Guid ident)
        {
            var fileIdent = ident.ToIdent<FileIdent>();

            var image = fileService.GetImageViewStream(fileIdent, ImageSize.Original);

            return File(image, "image/jpeg");
        }

        [HttpPost("findBySearchValueAndCreatorIdent")]
        [ActionName("JSONMethod")]
        public IActionResult FindBySearchValueAndCreatorIdent(FileSearchOptions searchOptions)
        {
            if (!Context.User.Role.Rights.Select(x => x.Key).ToHashSet()
                    .Contains(Rights.AdministrationFiles))
                Ok(new RequestResult()
                {
                    PermissionFailure = new PermissionFailure()
                    {
                        FailureMessage = PermissionFailureMessage.MissingPermission,
                        UnderlyingRight = Rights.AdministrationFiles
                    },
                    StatusCode = Base.StatusCode.PermissionFailure
                });

            var res = fileService.FindBySearchValue(searchOptions);

            return Ok(res);
        }
    }
}