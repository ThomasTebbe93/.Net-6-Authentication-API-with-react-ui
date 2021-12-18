using System;
using System.Collections.Generic;
using FluentValidation.Results;

namespace API.BLL.Base
{
    public class RequestResult
    {
        public IList<ValidationFailure> ValidationFailures { get; set; }
        public PermissionFailure PermissionFailure { get; set; }
        public StatusCode StatusCode { get; set; }
        public Exception Exception { get; set; }

        public RequestResult()
        {
        }

        public RequestResult(RequestResult existing)
        {
            ValidationFailures = existing.ValidationFailures;
            PermissionFailure = existing.PermissionFailure;
            StatusCode = existing.StatusCode;
            Exception = existing.Exception;
        }
    }

    public enum StatusCode
    {
        Unauthorized = 401,
        PermissionFailure = 403,
        ValidationError = 442,
        Ok = 200,
        InternalServerError = 500
    }
}