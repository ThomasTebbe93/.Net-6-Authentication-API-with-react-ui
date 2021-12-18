namespace API.BLL.UseCases.Authentication.Entities
{
    public class CreateUserHashConfirmRestEntity
    {
        public int CustomerId { get; set; }
        public string Hash { get; set; }
    }
}