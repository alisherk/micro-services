import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/Order';
import { Ticket } from '../../models/Ticket';
import mongoose from 'mongoose';

const buildTicket = async () => {
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 15,
  });

  await ticket.save();

  return ticket;
};

it('fecthes orders for a particular user', async () => {
  //create three tickets and save to db
  const ticket1 = await buildTicket();
  const ticket2 = await buildTicket();
  const ticket3 = await buildTicket();

  const user1 = global.signup();
  const user2 = global.signup();

  //create one order as User #1
  await request(app)
    .post('/api/orders')
    .set('Cookie', user1)
    .send({ ticketId: ticket1.id })
    .expect(201);

  //create two orders as User #2
  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', user2)
    .send({ ticketId: ticket2.id })
    .expect(201);

  const { body: orderTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', user2)
    .send({ ticketId: ticket3.id })
    .expect(201);

  //make request to get orders for User #2
  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', user2)
    .expect(200);

  //Make sure we only get the orders for User #2
  expect(response.body).toHaveLength(2);

  expect(response.body[0].id).toEqual(orderOne.id); 

  expect(response.body[1].id).toEqual(orderTwo.id); 

  expect(response.body[0].ticket.id).toEqual(ticket2.id);

  expect(response.body[1].ticket.id).toEqual(ticket3.id);
});
