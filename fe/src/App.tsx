import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import { Chat } from "./components/Chat";

type Response = {
  sessionId: string;
  result: string;
};

function App() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currMessage, setCurrMessage] = useState("Reference Set");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [authenticating, setAuthentication] = useState(false);

  useEffect(() => {
    chrome.cookies.get(
      {
        url: "http://localhost:3000",
        name: "authjs.session-token",
      },
      async (cookie) => {
        if (!cookie) {
          console.log("cookie_not_found");
          return;
        }

        // Send to endpoint with cookie in headers
        try {
          const apiResponse = await fetch("http://localhost:8080/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Cookie: `authjs.session-token=${cookie.value}`,
            },
            credentials: "include",
          });

          if (apiResponse.ok) {
            setAuthentication(true); // console.log("API Response:", responseData);
          }

          // Log to console (visible in extension background page)

          // Store response for UI display
          // setResponse(responseData);
          // setStatus('success');
        } catch (err) {
          console.error("API Error:", err);
          // setError(err.message || 'Unknown error');
          // setStatus('error');
        }
      }
    );
  }, []);

  useEffect(() => {
    chrome.storage.local.get("sessionId", (result) => {
      if (result.sessionId) {
        setSessionId(result.sessionId);
      }
    });
  }, []);

  const getCurrentTabURL = async () => {
    setIsLoading(true);
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
          setCurrMessage(response.data?.result);
          setError(true);
        }
        const data: Response = response.data;
        setSessionId(data.sessionId);
        chrome.storage.local.set({ sessionId: data.sessionId });
        setCurrMessage(data.result);
        console.log("Axios test response:", data);
      } catch (error) {
        console.error("Axios test error:", error);
        alert("Axios test failed.");
      }
    }
  };

  return (
    <div className="w-[400px] min-h-[500px] bg-[#0A0A0A] text-white flex flex-col  justify-center">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent animate-gradient">
          AskPage.AI
        </h1>
        <div className="rounded-xl overflow-hidden transition-all duration-300">
          {authenticating ? (
            sessionId ? (
              <Chat sessionId={sessionId} initialMessage={currMessage} />
            ) : (
              <div className="flex flex-col items-center justify-center space-y-4 p-8">
                {error ? (
                  <>
                    <p>{currMessage}</p>
                    <p className="underline">Use me on Public pages.</p>
                  </>
                ) : (
                  <>
                    <p className="text-gray-400 text-center mb-4">
                      Click below to analyze the current webpage and start
                      asking questions
                    </p>
                    <button
                      onClick={getCurrentTabURL}
                      className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg 
                hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105
                focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50
                shadow-lg hover:shadow-xl font-medium"
                    >
                      {isLoading ? "Analyzing page..." : "Analyze Page"}
                    </button>
                  </>
                )}
              </div>
            )
          ) : (
            <button
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg 
      hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105
      focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50
      shadow-lg hover:shadow-xl font-medium"
            >
              <a
                href="http://localhost:3000"
                target="_blank"
                rel="noopener noreferrer"
              >
                Login
              </a>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
