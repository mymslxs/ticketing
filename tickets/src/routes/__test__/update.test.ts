import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { natsWrapper } from "../../nats-wrapper";
import { getAuthCookie } from "../../test/auth-helper-test";

const createTicket = async () => {
  const cookie = await getAuthCookie();

  return request(app).post("/api/tickets").send().set("Cookie", cookie).send({
    title: "test ticket",
    price: 20,
  });
};

it("returns 404 if ticket with provided id does not exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const cookie = await getAuthCookie();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", cookie)
    .send({
      title: "updated title",
      price: 20,
    })
    .expect(404);
});

it("returns a 401 if user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: "updated title",
      price: 20,
    })
    .expect(401);
});

it("return 401 if user does not own the ticket", async () => {
  const res = await createTicket();
  const cookie = await getAuthCookie();

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "updated title",
      price: 20,
    })
    .expect(401);
});

it("return 400 if user provides invalid body params", async () => {
  const cookie = await getAuthCookie();

  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "Test ticket",
      price: 20,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "Test ticket",
      price: -20,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 20,
    })
    .expect(400);
});

it("returns 200 if valid data provided", async () => {
  const cookie = await getAuthCookie();

  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "Test ticket",
      price: 20,
    })
    .expect(201);

  const updatedRes = await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "Test ticket v2",
      price: 30,
    })
    .expect(200);

  expect(updatedRes.body.title).toEqual("Test ticket v2");
  expect(updatedRes.body.price).toEqual(30);
});

it("publishes a event", async () => {
  const cookie = await getAuthCookie();

  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "Test ticket",
      price: 20,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "Test ticket v2",
      price: 30,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
