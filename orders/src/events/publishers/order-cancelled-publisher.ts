import {
  Subjects,
  Publisher,
  OrderCancelledEvent,
} from '@aktickets.org/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
