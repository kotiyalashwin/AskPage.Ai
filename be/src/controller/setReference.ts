import type { Request, Response } from "express";
import { getWebpageContentForLLM } from "../utils/scrapper.js";
import { v4 as uuidv4 } from "uuid";
import { sessionContext } from "../index.js";

export const setReference = async (req: Request, res: Response) => {
  const { url } = req.body;
  const auth = (req as any).auth;
  const sessionId = uuidv4();
  const user = await prisma?.user.findUnique({
    where: {
      email: auth.email,
    },
  });

  if (!user) {
    res.status(201).json({ error: "Unable to set Reference" });
    return;
  }

  const current_url = await prisma?.uRLS.create({
    data: {
      url: url,
      status: "Failed",
      userId: user?.id,
    },
  });

  //use prisma instead of sessions
  const pageData = await getWebpageContentForLLM(url);

  if (pageData === "Privacy policy restricts this Page to be scrapped") {
    res.status(201).json({ result: pageData });
    return;
  }

  await prisma?.uRLS.update({
    where: {
      id: current_url?.id,
    },
    data: {
      status: "Success",
    },
  });
  sessionContext[sessionId] = pageData;
  res.status(200).json({ result: "Reference Set", sessionId: sessionId });
};
