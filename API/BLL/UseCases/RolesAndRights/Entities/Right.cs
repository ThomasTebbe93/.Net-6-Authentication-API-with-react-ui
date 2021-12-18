using System;
using API.BLL.Base;

namespace API.BLL.UseCases.RolesAndRights.Entities
{
    public class Right
    {
        public RightIdent Ident { get; set; }
        public string Name { get; set; }
        public string Key { get; set; }
        public string Description { get; set; }
        
        public Right(){}

        public Right(Right existing)
        {
            Ident = existing.Ident;
            Name = existing.Name;
            Key = existing.Key;
            Description = existing.Description;
        }
    }
    
    
    public class RightIdent : IdentBase
    {
        public RightIdent(Guid ident) : base(ident)
        {
        }
    }
}