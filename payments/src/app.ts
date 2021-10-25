import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@aktickets.org/common';
import { createChargeRouter } from './routes/new';

const app = express();
app.set('trust proxy', true); //make sure express is aware of nginx
app.use(express.json());

//run http not in secure mode in test
app.use(cookieSession({ signed: false, secure: process.env.NODE_ENV !== 'test'}));

app.use(currentUser); 

app.use(createChargeRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };