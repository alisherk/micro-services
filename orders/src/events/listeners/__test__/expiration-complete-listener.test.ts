import { ExpirationCompleteListener } from '../expiration-complete-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Order } from '../../../models/Order';
import { OrderStatus, ExpirationCompleteEvent } from '@aktickets.org/common';
import { Ticket } from '../../../models/Ticket';
import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';

const setup = async () => {
  //create an instance of the listener
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });

  await ticket.save();

  const order = Order.build({
    status: OrderStatus.Created,
    userId: 'dhhdhe',
    expiresAt: new Date(),
    ticket,
  });

  await order.save();

  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id,
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { order, listener, ticket, data, msg };
};

it('updates order status to cancelled', async () => {
  const { order, listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id); 

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled); 
});

it('emits order cancelled event', async () => {
  const { order, listener, data, msg } = await setup();

  await listener.onMessage(data, msg); 

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]); 

  expect(eventData.id).toEqual(order.id);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg); 

  expect(msg.ack).toHaveBeenCalled();
});
