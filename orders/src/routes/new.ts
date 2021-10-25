import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { Ticket } from '../models/Ticket';
import { Order } from '../models/Order';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';
import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from '@aktickets.org/common';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60; 

router.post(
  '/api/orders',
  requireAuth,
  [
    body('ticketId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('Ticket id must be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError();
    }

    //Make sure that ticket is not reserved
     const isReserved = await ticket.isReserved();

    if (isReserved) {
      throw new BadRequestError('Ticket is already reserved');
    }

    //Calculate an expiration date for this order
    const expiration = new Date(); 
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS); //expire in 15 min 


    //Build the order and save to database
    const order = Order.build({
      userId: req.currentUser!.id, 
      status: OrderStatus.Created, 
      expiresAt: expiration, 
      ticket
    }); 

    await order.save(); 

    //Publish an event saying that order is created
    new OrderCreatedPublisher(natsWrapper.client).publish({ 
      id: order.id, 
      status: order.status, 
      userId: order.userId, 
      expiresAt: order.expiresAt.toISOString(), 
      version: order.version,
      ticket: {
        id: ticket.id, 
        price: ticket.price
      }
    })


    res.status(201).send(order); 
  }
);

export { router as newOrderRouter };
