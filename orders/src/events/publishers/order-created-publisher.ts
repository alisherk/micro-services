import { Publisher, OrderCreatedEvent, Subjects } from '@aktickets.org/common';


export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated; 
    
}