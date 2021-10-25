import { Publisher, Subjects, TicketUpdatedEvent } from '@aktickets.org/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
