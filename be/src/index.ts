import express, { Request } from "express";
import dotenv from "dotenv";
import cookiePaser from "cookie-parser";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getAskPrompt } from "./utils/askPrompt.js";
import { setReference } from "./controller/setReference.js";
import { clrSession } from "./controller/clearSession.js";
import { Verify } from "./controller/verify.js";
import { authenticateJWT } from "./middleware/decode.js";
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const app = express();
app.use(express.json());
app.use(cookiePaser());
type sessionContextRecord = Record<string, string>;
export const sessionContext: sessionContextRecord = {};

app.post("/setreference", authenticateJWT, setReference);

app.post("/ask", async (req, res) => {
  // console.log("Current Record:", sessionContext);
  const globalsearch = req.query.globalsearch as string;
  let suggestion = false;
  if (globalsearch === "true") {
    suggestion = true;
  }
  console.log(suggestion);
  console.log(sessionContext);
  const { sessionId, question } = req.body;
  if (!sessionId) {
    res.status(201).json({ message: "SessionId is required" });
    return;
  }
  const context = sessionContext[sessionId];
  if (!context) {
    res.status(201).json({ message: "No context for this session" });
    return;
  }
  const askPrompt = getAskPrompt(context, question, suggestion);
  console.log(askPrompt);
  const result = await model.generateContent(askPrompt);
  res.json({ answer: result.response.text() });
});

app.delete("/clearsession", clrSession);

app.post("/verify", authenticateJWT, Verify);

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
