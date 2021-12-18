using API.BLL.UseCases.Memberships.Daos;
using API.BLL.UseCases.Memberships.Entities;
using API.BLL.Extensions;
using FluentValidation;

namespace API.BLL.UseCases.Memberships.Validation
{
    public class UserValidator : AbstractValidator<UserRestEntity>
    {
        public UserValidator(IUserDao userDao)
        {
            RuleFor(x => x.FirstName)
                .NotNull().WithMessage("validation.error.notNull")
                .NotEmpty().WithMessage("validation.error.notEmpty");
            RuleFor(x => x.LastName)
                .NotNull().WithMessage("validation.error.notNull")
                .NotEmpty().WithMessage("validation.error.notEmpty");
            RuleFor(x => x.UserName)
                .NotNull().WithMessage("validation.error.notNull")
                .NotEmpty().WithMessage("validation.error.notEmpty");
            
            RuleFor(x => x)
                .Custom((user, context) =>
                    {
                        if (!userDao.IsLoginUnique(user.UserName, user.Ident))
                            context.AddFailure("UserName", "validation.error.duplicateLogin");
                        if (!string.IsNullOrEmpty(user.UserName) &&
                            !user.UserName.IsValidEmail())
                            context.AddFailure("UserName", "validation.error.notValidMailAddress");

                        if (user.Ident == null)
                        {
                            if (string.IsNullOrEmpty(user.Password))
                                context.AddFailure("Password", "validation.error.notEmpty");
                            if (string.IsNullOrEmpty(user.PasswordRetyped))
                                context.AddFailure("PasswordRetyped", "validation.error.notEmpty");
                        }
                        if (user.Password != null)
                        {
                            if (user.Password != user.PasswordRetyped)
                                context.AddFailure("PasswordRetyped", "validation.error.notSamePassword");
                            if (user.Password.Length < 8)
                                context.AddFailure("Password", "validation.error.toShortPassword");
                        }
                        if (user.PasswordRetyped != null)
                        {
                            if (user.PasswordRetyped != user.Password)
                                context.AddFailure("PasswordRetyped","validation.error.notSamePassword");
                            if (user.PasswordRetyped.Length < 8)
                                context.AddFailure("PasswordRetyped","validation.error.toShortPassword");
                        }
                    }
                );
        }
    }
}