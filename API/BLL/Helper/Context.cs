using API.BLL.UseCases.Memberships.Entities;

namespace API.BLL.Helper
{
    public class Context
    {
        public User User { get; set; }

        public Context(Context existing)
        {
            User = existing.User;
        }
        public Context()
        {
        }
    }
}