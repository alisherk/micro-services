import {
  Subjects,
  PaymentCreatedEvent,
  Publisher,
} from '@aktickets.org/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
