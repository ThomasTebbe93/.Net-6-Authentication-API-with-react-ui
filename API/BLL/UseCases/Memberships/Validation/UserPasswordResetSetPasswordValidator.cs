using API.BLL.UseCases.Memberships.Entities;
using FluentValidation;

namespace API.BLL.UseCases.Memberships.Validation
{
    public class UserPasswordResetSetPasswordValidator : AbstractValidator<UserPasswordResetSetPasswordRestEntity>
    {
        public UserPasswordResetSetPasswordValidator()
        {
            RuleFor(x => x.PasswordNew)
                .NotNull().WithMessage("validation.error.notNull")
                .NotEmpty().WithMessage("validation.error.notEmpty");
            RuleFor(x => x.PasswordNewRetyped)
                .NotNull().WithMessage("validation.error.notNull")
                .NotEmpty().WithMessage("validation.error.notEmpty");
            RuleFor(x => x)
                .Custom((user, context) =>
                    {
                        if (user.PasswordNew != null)
                        {
                            if (user.PasswordNew != user.PasswordNewRetyped)
                                context.AddFailure("PasswordNewRetyped", "validation.error.notSamePassword");
                            if (user.PasswordNew.Length < 8)
                                context.AddFailure("PasswordNew", "validation.error.toShortPassword");
                        }

                        if (user.PasswordNewRetyped != null)
                        {
                            if (user.PasswordNewRetyped != user.PasswordNew)
                                context.AddFailure("PasswordNewRetyped", "validation.error.notSamePassword");
                            if (user.PasswordNewRetyped.Length < 8)
                                context.AddFailure("PasswordNewRetyped", "validation.error.toShortPassword");
                        }
                    }
                );
        }
    }
}