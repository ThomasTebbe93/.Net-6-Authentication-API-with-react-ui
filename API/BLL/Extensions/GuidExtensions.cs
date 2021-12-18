using System;
using API.BLL.Base;

namespace API.BLL.Extensions
{
    public static class GuidExtensions
    {
        public static T IdentOrNull<T>(this Guid? value) where T : IdentBase
        {
            return value.HasValue ? (T) Activator.CreateInstance(typeof(T), value.Value) : default(T);
        }

        public static T Ident<T>(this Guid value) where T : IdentBase
        {
            return (T) Activator.CreateInstance(typeof(T), value);
        }

        public static T ToIdent<T>(this Guid value) where T : IdentBase
        {
            return (T) Activator.CreateInstance(typeof(T), new object[] {value});
        }
    }
}