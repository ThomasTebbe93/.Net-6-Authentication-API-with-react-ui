namespace API.BLL.Base
{
    public class SearchOption
    {
        public bool? IsDescending { get; set; }
        public int Skip { get; set; }
        public int Take { get; set; }
    }
}