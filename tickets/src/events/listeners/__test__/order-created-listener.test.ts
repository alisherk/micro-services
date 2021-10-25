import { Ticket } from '../../../models/Ticket';
import { OrderCreatedListener } from '../order-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCreatedEvent, OrderStatus } from '@aktickets.org/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    title: 'concert',
    price: 10,
    userId: 'testUserId',
  });

  await ticket.save();

  const data: OrderCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: 'testUserId',
    expiresAt: '7474447',
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { data, msg, listener, ticket };
};

it('sets the orderId of the ticket', async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toEqual(data.id);
});

it('acks message', async () => {
 const { listener, data, msg } = await setup();

 await listener.onMessage(data, msg); 

 expect(msg.ack).toHaveBeenCalled();

});

it('publishes a ticket updated event', async()=> {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg); 

  expect(natsWrapper.client.publish).toHaveBeenCalled(); 

  const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])

  expect(ticketUpdatedData.orderId).toEqual(data.id)

})
