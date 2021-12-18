using System.ComponentModel.DataAnnotations.Schema;

namespace API.DAL
{
    public class DeletableDbEntity : DbEntity
    {
        [Column("deleted")] 
        public bool Deleted { get; set; }
    }
}