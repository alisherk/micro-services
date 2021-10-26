import { CustomError } from './custom-error'


export class DatabaseConnectionError extends CustomError  {
  public reason = 'Error connecting to database';
  public statusCode = 500; 
  constructor() {
    super('Error connecting to db');

    //only because we are extending a built in class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  public serializeErrors() {
    return [ { message: this.reason }]
  }
}
