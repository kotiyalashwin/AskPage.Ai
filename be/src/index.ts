import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getAskPrompt } from "./utils/askPrompt";
import { setReference } from "./controller/setReference";
import { clrSession } from "./controller/clearSession";
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const app = express();
app.use(express.json());
type sessionContextRecord = Record<string, string>;
export const sessionContext: sessionContextRecord = {};
// const sessionContext: {
//   [sessionId: string]: string | null;
// } = {};

app.post("/setreference", setReference);

app.post("/ask", async (req, res) => {
  console.log("Current Record:", sessionContext);
  const { sessionId, question } = req.body;
  if (!sessionId) {
    res.json({ message: "SessionId is required" });
    return;
  }
  const context = sessionContext[sessionId];
  if (!context) {
    res.json({ message: "No context for this session" });
    return;
  }
  const askPrompt = getAskPrompt(context, question);
  const result = await model.generateContent(askPrompt);
  res.json({ answer: result.response.text() });
});

app.delete("/clearsession", clrSession);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
