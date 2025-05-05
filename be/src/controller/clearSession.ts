import type { Request, Response } from "express";
import { sessionContext } from "../index.js";

export const clrSession = async (req: Request, res: Response) => {
  try {
    const sessionId = req.query.sessionId as string;
    if (!sessionContext.hasOwnProperty(sessionId)) {
      throw new Error();
    }
    delete sessionContext[sessionId];
    console.log("Current Record After Delete:", sessionContext);
    res.json("Session Deleted");
  } catch {
    res.json("error deleting session");
  }
};
