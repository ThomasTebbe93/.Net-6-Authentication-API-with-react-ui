using System.Text.Json.Serialization;
using API.BLL.Base;

namespace API.BLL.UseCases.Memberships.Entities
{
    public class UserSearchOptions : SearchOption
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }
        public string Role { get; set; }
        public UserSortColumn? SortColumn { get; set; }
    }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum UserSortColumn
    {
        FirstName,
        LastName,
        UserName,
        Role
    }
}