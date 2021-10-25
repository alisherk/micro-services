import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/Ticket';
import mongoose from 'mongoose';

it('fetches the order associated to user', async () => {
  //create a ticket
  const ticket = Ticket.build({ id: mongoose.Types.ObjectId().toHexString(), title: 'concert', price: 10 });

  await ticket.save();

  //build the order with the ticket
  const user = global.signup();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  //make a request to fetch the order

  await request(app).get(`/api/orders/${order.id}`).set('Cookie', user).send().expect(200);
});
