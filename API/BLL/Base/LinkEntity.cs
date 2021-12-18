using System.ComponentModel.DataAnnotations;

namespace API.BLL.Base
{
    public class LinkEntity<TIdent> where TIdent : IdentBase
    {
        [Key] public TIdent Ident { get; set; }
        public int CustomerId { get; set; }
    }
}