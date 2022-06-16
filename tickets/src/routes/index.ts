import express, { Request, Response } from "express";
import { Ticket } from "./model/Ticket";

const router = express.Router();

router.get("/api/tickets", async (req: Request, res: Response) => {
  const tickets = await Ticket.find();
  res.status(200).json(tickets);
});

export { router as getTicketsRouter };
