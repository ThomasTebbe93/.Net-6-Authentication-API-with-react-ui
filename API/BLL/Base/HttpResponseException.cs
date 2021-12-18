using System;

namespace API.BLL.Base
{
    public class HttpResponseException : Exception
    {
        public int StatusCode { get; set; }

        public HttpResponseException(int statusCode)
        {
            StatusCode = statusCode;
        }
    }
}