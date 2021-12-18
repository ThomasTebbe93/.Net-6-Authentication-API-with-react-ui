using System.ComponentModel.DataAnnotations;

namespace API.BLL.Base
{
    public abstract class BaseEntity<TIdent> where TIdent : IdentBase
    {
        [Key] public TIdent Ident { get; set; }
        public bool Deleted { get; set; }
    }
}