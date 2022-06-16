import request from "supertest";
import { app } from "../../app";
import { getAuthCookie } from "../../test/auth-helper-test";

const createTicket = async () => {
  const cookie = await getAuthCookie();

  return request(app).post("/api/tickets").send().set("Cookie", cookie).send({
    title: "test ticket",
    price: 20,
  });
};

it("fetch tickets list", async () => {
  await createTicket();
  await createTicket();

  const res = await request(app).get("/api/tickets").send().expect(200);

  expect(res.body.length).toEqual(2);
});
