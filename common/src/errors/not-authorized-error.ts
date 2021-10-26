import { CustomError } from './custom-error';


export class NotAuthorizedError extends CustomError {
  public statusCode = 401;
  constructor() {
    super('Not authorized');

    //only because we are extending a built in class
    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  public serializeErrors() {
    return [{ message: 'Not authorized' }];
  }
}
