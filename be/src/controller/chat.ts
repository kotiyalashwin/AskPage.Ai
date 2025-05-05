import { Request, Response } from "express";
import prisma from "../lib/db.js";

type Message = {
  text: string;
  isUser: boolean;
  timestamp: string;
};

export const SaveChat = async (req: Request, res: Response) => {
  try {
    const auth = (req as any).auth;
    const chats: Message[] = req.body;

    if (!auth || !chats) {
      res.status(201).json({ message: "Unable to add chats" });
    }

    await prisma.chats.create({
      data: {
        history: chats,
        usermail: auth.email,
      },
    });

    res.json({ message: "Chat Saved" });
  } catch (e) {
    console.log(e);
    res.status(201).json({ message: "Unable to save chat" });
  }
};
