import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { getAuthCookie } from "../../test/auth-helper-test";
import { Order, OrderStatus } from "../../models/order";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

it("cancels an order", async () => {
  const ticket = Ticket.build({
    title: "AC/DC Concert",
    price: 300,
  });
  await ticket.save();

  const user = await getAuthCookie();

  const { body } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  const res = await request(app)
    .delete(`/api/orders/${body.order.id}`)
    .set("Cookie", user)
    .expect(200);

  expect(res.body.status).toEqual(OrderStatus.Canceled);
});

it("emits an order cancelled event", async () => {
  const ticket = Ticket.build({
    title: "AC/DC Concert",
    price: 300,
  });
  await ticket.save();

  const user = await getAuthCookie();

  const { body } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  const res = await request(app)
    .delete(`/api/orders/${body.order.id}`)
    .set("Cookie", user)
    .expect(200);

  expect(res.body.status).toEqual(OrderStatus.Canceled);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
