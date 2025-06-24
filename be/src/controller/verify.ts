import { Request, Response } from "express";
import prisma from "../lib/db.js";

export const Verify = async (req: Request, res: Response) => {
  try {
    const auth = (req as any).auth;
    if (!auth || !auth.email) {
      res.status(401).json("Not Verified");
      return;
    }

    const token = await prisma.user.findFirst({
      where: {
        email: auth.email,
      },
      select: {
        platformToken: true,
      },
    });
    console.log("from DB:", token?.platformToken);
    console.log("from Cookie:", auth.platformToken);
    if (token?.platformToken === auth.platformToken) {
      res.json({ message: "Authenticated" });
    } else {
      res.status(401).json("not verified");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json("Error Occured");
  }
};
