import {
  isDateString,
  isEmpty,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

import * as moment from 'moment';

export function DateStringValidator(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'dateStringValidator',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!isEmpty(value)) {
            if (isDateString(value, { strict: true }))
              return moment(value, 'YYYY-MM-DD', true).isValid();

            return false;
          }

          return true;
        },
      },
    });
  };
}
