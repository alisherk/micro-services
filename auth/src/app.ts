import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler, NotFoundError } from '@aktickets.org/common';

const app = express();
app.set('trust proxy', true); //make sure express is aware of nginx
app.use(express.json());
//run http not secure in test
app.use(cookieSession({ signed: false, secure: process.env.NODE_ENV !== 'test'}));

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };