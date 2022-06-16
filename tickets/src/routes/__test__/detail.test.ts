import request from "supertest";
import { app } from "../../app";
import { getAuthCookie } from "../../test/auth-helper-test";
import mongoose from "mongoose";

it("returns 404 if ticket is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

it("returns ticket if ticket is found", async () => {
  const cookie = await getAuthCookie();

  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "test ticket",
      price: 20,
    })
    .expect(201);

  await request(app).get(`/api/tickets/${res.body.id}`).send().expect(200);
});
