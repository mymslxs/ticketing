import { NotFoundError } from "@lxs_tickets/common";
import express, { Request, Response } from "express";
import { Ticket } from "./model/Ticket";

const router = express.Router();

router.get("/api/tickets/:id", async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    throw new NotFoundError();
  }

  res.status(200).json(ticket);
});

export { router as getTicketDetailRouter };
