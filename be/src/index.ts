import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getWebpageContentForLLM } from "./utils/scrapper";
import { refPrompt } from "./utils/referencePrompt";
import { parseAIResult } from "./utils/parseResult";
import { v4 as uuidv4 } from "uuid";
import { getAskPrompt } from "./utils/askPrompt";

dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const app = express();
app.use(express.json());

const sessionContext: {
  [sessionId: string]: string | null;
} = {};

app.post("/setreference", async (req, res) => {
  const { url } = req.body;
  const sessionId = uuidv4();

  const pageData = await getWebpageContentForLLM(url);
  // const prompt = refPrompt(pageData);
  // const result = await model.generateContent(prompt);
  // const response = parseAIResult(result);
  sessionContext[sessionId] = pageData;
  res.status(200).json({ result: "Reference Set", sessionId: sessionId });
});

app.post("/ask", async (req, res) => {
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

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
