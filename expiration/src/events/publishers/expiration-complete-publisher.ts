import {
  Publisher,
  ExpirationCompleteEvent,
  Subjects,
} from "@lxs_tickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
