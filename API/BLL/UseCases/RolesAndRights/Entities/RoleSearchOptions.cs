using System.Text.Json.Serialization;
using API.BLL.Base;

namespace API.BLL.UseCases.RolesAndRights.Entities
{
    public class RoleSearchOptions : SearchOption
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public CustomRoleSortColumn? SortColumn { get; set; }
    }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum CustomRoleSortColumn
    {
        Name,
        Description
    }
}