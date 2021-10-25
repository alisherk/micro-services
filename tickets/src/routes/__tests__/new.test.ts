import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/Ticket';
import { natsWrapper } from '../../nats-wrapper';

it('has a route handler listening to /api/tickets for post request', async () => {
  const response = await request(app).post('/api/tickets').send({});

  expect(response.status).not.toEqual(404);
});

it('returns status other than 401 if user is signed', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send({});

  expect(response.status).not.toEqual(401);
});

it('returns error if invalid title is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send({
      title: '',
      price: 10,
    })
    .expect(400);
});

it('returns error if invalid price is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send({
      title: 'Hat',
      price: '',
    })
    .expect(400);
});

it('creates a ticket with valid inputs', async () => {
 let tickets = await Ticket.find({}); 
 
 expect(tickets.length).toEqual(0);

 const title = 'hat'

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send({
      title,
      price: 20,
    })
    .expect(201);

    tickets = await Ticket.find({}); 
    expect(tickets.length).toEqual(1); 
    expect(tickets[0].price).toEqual(20)
    expect(tickets[0].title).toEqual(title)
});

it('published an event', async () => {

  const title = 'hat'

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send({
      title,
      price: 20,
    })
    .expect(201);

   expect(natsWrapper.client.publish).toHaveBeenCalled();

});
