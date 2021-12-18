using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.DAL
{
    public class DbEntity
    {
        [Key]
        [Required]
        [Column("ident", Order = 0)]
        public Guid Ident { get; set; }
    }
}