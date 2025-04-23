import { Request, Response } from "express";
import { Bid } from "../models/Bid";

export const createBid = async (req: Request, res: Response) => {
  try {
    const { id, amount, userId, userName, userAvatar, lotId, time } = req.body;

    const newBid = await Bid.create({
      id,
      amount,
      userId,
      userName,
      userAvatar,
      lotId,
      time,
    });

    res.status(201).json(newBid);
  } catch (error) {
    console.error("Ошибка при создании ставки:", error);
    res.status(500).json({ message: "Ошибка при создании ставки" });
  }
};
