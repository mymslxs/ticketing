import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketUpdatedEvent } from "@lxs_tickets/common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const ticket = await Ticket.findLatest({
      id: data.id,
      version: data.version,
    });

    if (!ticket) {
      throw new Error("Ticket not found.");
    }

    ticket.set({ title: data.title, price: data.price });
    await ticket.save();

    msg.ack();
  }
}
