import type { Request, Response } from "express";
import { getWebpageContentForLLM } from "../utils/scrapper.js";
import { v4 as uuidv4 } from "uuid";
import { sessionContext } from "../index.js";

export const setReference = async (req: Request, res: Response) => {
  const { url } = req.body;
  const sessionId = uuidv4();

  const pageData = await getWebpageContentForLLM(url);
  if (pageData === "Privacy policy restricts this Page to be scrapped") {
    res.status(201).json({ result: pageData });
    return;
  }
  sessionContext[sessionId] = pageData;
  res.status(200).json({ result: "Reference Set", sessionId: sessionId });
};
