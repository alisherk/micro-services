import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@aktickets.org/common';
import { createTicketRouter } from './routes/new';
import { showTicketRouter } from './routes/show';
import { indexTicketsRouter } from './routes/index'; 
import { updateTicketRouter } from './routes/update';

const app = express();
app.set('trust proxy', true); //make sure express is aware of nginx
app.use(express.json());

//run http not in secure mode in test
app.use(cookieSession({ signed: false, secure: process.env.NODE_ENV !== 'test'}));

app.use(currentUser)

app.use(createTicketRouter);

app.use(showTicketRouter);

app.use(indexTicketsRouter);

app.use(updateTicketRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };