import { NextFunction, Response, Request } from "express";

export const authenticateJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Import decode dynamically from next-auth/jwt since it is ESM only package
    const { decode } = await import("next-auth/jwt");
    const sessionToken = req.cookies["authjs.session-token"];

    const decoded = await decode({
      token: sessionToken,
      secret: process.env.AUTH_SECRET as string,
      salt: "authjs.session-token",
    });
    (req as any).auth = decoded;
    next();
  } catch (error) {
    console.log("Failed to authenticate", error);
    res.status(403).json({ error: "Unauthorized" });
  }
};
