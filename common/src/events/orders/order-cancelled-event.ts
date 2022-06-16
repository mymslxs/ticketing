import { Subjects } from "../subjects";
import { OrderStatus } from "../types/order-status";

export interface OrderCancelledEvent {
  subject: Subjects.OrderCancelled;
  data: {
    id: string;
    status: OrderStatus;
    version: number;
    ticket: {
      id: string;
      title: string;
      price: number;
    };
  };
}
