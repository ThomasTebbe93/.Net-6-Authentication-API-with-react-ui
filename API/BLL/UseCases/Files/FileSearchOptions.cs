using System.Text.Json.Serialization;
using API.BLL.Base;

namespace API.BLL.UseCases.Files
{
    public class FileSearchOptions: SearchOption
    {
        public string Name { get; set; }
        public FileSortColumn? SortColumn { get; set; }
    }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum FileSortColumn
    {
        Name,
        Size,
        CreateTime
    }
}