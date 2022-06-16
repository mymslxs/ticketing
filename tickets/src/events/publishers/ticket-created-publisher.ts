import { Publisher, Subjects, TicketCreatedEvent } from "@lxs_tickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
