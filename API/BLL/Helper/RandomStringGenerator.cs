using System;
using System.Linq;

namespace API.BLL.Helper
{
    public static class RandomStringGenerator
    {
        public static string New(int length)
        {
            var random = new Random();
            var chars = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz!§$%&/(){[]}\\=?+-*#,;:._@^°<>|0123456789";
            return new string(Enumerable.Repeat(chars, length)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }
    }
}