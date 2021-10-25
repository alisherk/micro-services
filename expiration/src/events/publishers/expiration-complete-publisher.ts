import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from '@aktickets.org/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
