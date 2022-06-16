import express, { Request, Response, NextFunction } from "express";
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from "@lxs_tickets/common";
import { Order, OrderStatus } from "../models/order";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.delete(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate("ticket");

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Canceled;
    await order.save();

    // Publish Event
    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      version: order.version,
      ticket: {
        id: order.ticket.id,
        title: order.ticket.title,
        price: order.ticket.price,
      },
    });

    res.send(order);
  }
);

export { router as deleteOrderRouter };
