import { ValidationError } from 'express-validator';
import { CustomError  } from './custom-error';

export class RequestValidationError extends CustomError  {
  public statusCode = 400;
  constructor(public errors: ValidationError[]) {
    super('Invalid request parameters');

    //need this when extending a built-in class such as Error
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  public serializeErrors() {
    return this.errors.map((error) => {
      return { message: error.msg, field: error.param };
    });
  }
}
