import { isEmpty, registerDecorator, ValidationOptions } from 'class-validator';
import { isValidObjectId } from 'mongoose';

export function IsObjectIdValidator(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isObjectIdValidator',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!isEmpty(value)) return isValidObjectId(value);
          return true;
        },
      },
    });
  };
}
