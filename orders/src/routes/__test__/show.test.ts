import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { getAuthCookie } from "../../test/auth-helper-test";
import { Order, OrderStatus } from "../../models/order";
import { Ticket } from "../../models/ticket";

it("fetches the order", async () => {
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
    .get(`/api/orders/${body.order.id}`)
    .set("Cookie", user)
    .expect(200);

  expect(res.body.id).toEqual(body.order.id);
});

it("return an error if user tries to fetch another user's order", async () => {
  const ticket = Ticket.build({
    title: "AC/DC Concert",
    price: 300,
  });
  await ticket.save();

  const userOne = await getAuthCookie();
  const userTwo = await getAuthCookie();

  const { body } = await request(app)
    .post("/api/orders")
    .set("Cookie", userOne)
    .send({ ticketId: ticket.id })
    .expect(201);

  const res = await request(app)
    .get(`/api/orders/${body.order.id}`)
    .set("Cookie", userTwo)
    .expect(401);
});
