import { useState } from "react";
import "./App.css";
import axios from "axios";

type Response = {
  sessionId: string;
  result: string;
};

function App() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currMessage, setCurrMessage] = useState("");
  const [question, setQuestion] = useState("");

  const getCurrentTabURL = async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    if (tab && tab.url) {
      try {
        const url = tab.url;
        const response = await axios.post<Response>(
          "http://localhost:3000/setreference",
          {
            url: url,
          }
        );
        if (response.status !== 200) {
          alert("Failed to set reference");
        }
        const data: Response = response.data;
        setSessionId(data.sessionId);
        setCurrMessage(data.result);
        console.log("Axios test response:", data);
        alert(JSON.stringify(response.data));
      } catch (error) {
        console.error("Axios test error:", error);
        alert("Axios test failed.");
      }
    }
  };

  const askPageAi = async () => {
    setCurrMessage("Asking Page.Ai...");
    const response = await axios.post<{ answer: string }>(
      "http://localhost:3000/ask",
      {
        sessionId,
        question,
      }
    );
    const data = response.data;
    setCurrMessage(data.answer);
  };
  return (
    <>
      <h1>Welcome to AskPage.Ai</h1>
      <div>
        {sessionId ? (
          <div>
            <div>{currMessage}</div>
            <div>
              <input
                value={question}
                onChange={(e) => {
                  setQuestion(e.target.value);
                }}
                type="text"
                placeholder="Ask a question..."
              />
              <button onClick={askPageAi}>Send</button>
            </div>
          </div>
        ) : (
          <button onClick={getCurrentTabURL}>Ask Page.Ai</button>
        )}
      </div>
    </>
  );
}

export default App;
