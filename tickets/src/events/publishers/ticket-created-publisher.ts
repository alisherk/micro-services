import { Publisher, Subjects, TicketCreatedEvent } from '@aktickets.org/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
