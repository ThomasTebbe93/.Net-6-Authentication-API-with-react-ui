using API.BLL.UseCases.RolesAndRights.Entities;
using FluentValidation;

namespace API.BLL.UseCases.RolesAndRights.Validation
{
    public class CustomRoleValidator : AbstractValidator<RoleRestEntity>
    {
        public CustomRoleValidator()
        {
            RuleFor(x => x.Name)
                .NotNull().WithMessage("validation.error.notNull")
                .NotEmpty().WithMessage("validation.error.notEmpty");
        }
    }
}