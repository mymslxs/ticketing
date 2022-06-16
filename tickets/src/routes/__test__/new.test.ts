import request from "supertest";
import { app } from "../../app";
import { getAuthCookie } from "../../test/auth-helper-test";
import { Ticket } from "../model/Ticket";
import { natsWrapper } from "../../nats-wrapper";

it("has a route handler listening to /api/tickets for post requests", async () => {
  const response = await request(app).post("/api/tickets").send({});

  expect(response.status).not.toEqual(404);
});

it("can only be accessed if user is signed in", async () => {
  await request(app).post("/api/tickets").send({}).expect(401);
});

it("returns a status other than 401 if user is signed", async () => {
  const cookie = await getAuthCookie();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({});
  expect(response.status).not.toEqual(401);
});

it("returns an error if invalid title is provided", async () => {
  const cookie = await getAuthCookie();
  await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 10,
    })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      price: 10,
    })
    .expect(400);
});

it("returns an error if invalid price is provided", async () => {
  const cookie = await getAuthCookie();
  await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "some title",
      price: -5,
    })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "some title",
    })
    .expect(400);
});

it("creates a ticket with valid inputs", async () => {
  let tickets = await Ticket.find();
  expect(tickets.length).toEqual(0);

  const cookie = await getAuthCookie();
  await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "some title",
      price: 5,
    })
    .expect(201);

  tickets = await Ticket.find();
  expect(tickets.length).toEqual(1);
});

it("publishes a event", async () => {
  const cookie = await getAuthCookie();
  await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "some title",
      price: 5,
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
