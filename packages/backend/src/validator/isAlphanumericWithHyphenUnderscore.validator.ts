// Third-party imports
import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ async: false })
class IsAlphanumericWithHyphenUnderscoreConstraint
  implements ValidatorConstraintInterface
{
  validate(text: string): boolean {
    // Check if the string contains only alphanumeric, '-' and '_' characters
    const regex = /^[a-zA-Z0-9-_]+$/;
    return regex.test(text);
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} should only contain alphanumeric, '-' and '_' characters.`;
  }
}

export function IsAlphanumericWithHyphenUnderscore(
  validationOptions?: ValidationOptions,
) {
  return function (target: object, propertyName: string) {
    registerDecorator({
      target: target.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsAlphanumericWithHyphenUnderscoreConstraint,
    });
  };
}

