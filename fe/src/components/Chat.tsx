import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Globe } from "lucide-react";

interface ChatProps {
  sessionId: string;
  initialMessage: string;
}

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
  isLoading?: boolean;
  copied?: boolean;
}

export function Chat({ sessionId, initialMessage }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState("");
  const [globalsearch, setGlobalSearch] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const savechat = async () => {
    try {
      console.log(messages);
      const response = await axios.post(
        "http://localhost:8080/savechat",
        messages
      );
      console.log(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  const toggleGLobalSearch = () => {
    setGlobalSearch((s) => !s);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setMessages(
        messages.map((msg, i) => (i === index ? { ...msg, copied: true } : msg))
      );
      setTimeout(() => {
        setMessages(
          messages.map((msg, i) =>
            i === index ? { ...msg, copied: false } : msg
          )
        );
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  useEffect(() => {
    if (initialMessage) {
      setMessages([
        {
          text: initialMessage,
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    }
  }, [initialMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const askPageAi = async () => {
    if (!question.trim()) return;

    // Add user message
    const userMessage: Message = {
      text: question,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");

    // Add loading message
    const loadingMessage: Message = {
      text: "Thinking...",
      isUser: false,
      timestamp: new Date(),
      isLoading: true,
    };
    setMessages((prev) => [...prev, loadingMessage]);

    try {
      const response = await axios.post<{ answer: string }>(
        `http://localhost:8080/ask?globalsearch=${globalsearch}`,
        {
          sessionId,
          question: userMessage.text,
        }
      );

      // Replace loading message with actual response
      setMessages((prev) =>
        prev
          .filter((msg) => !msg.isLoading)
          .concat({
            text: response.data.answer,
            isUser: false,
            timestamp: new Date(),
          })
      );
    } catch {
      // Replace loading message with error message
      setMessages((prev) =>
        prev
          .filter((msg) => !msg.isLoading)
          .concat({
            text: "Sorry, I couldn't process your request.",
            isUser: false,
            timestamp: new Date(),
          })
      );
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      askPageAi();
    }
  };

  const renderMessageContent = (message: Message) => {
    const remainingText = message.text;

    return (
      <div>
        <p>{remainingText}</p>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[450px]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.isUser ? "justify-end" : "justify-start"
            } 
              animate-fade-in-up`}
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            <div
              className={`max-w-[80%] break-words rounded-2xl px-4 py-2 
                ${
                  message.isUser
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-sm"
                    : "bg-[#1A1A1A] text-gray-100 rounded-bl-sm"
                }
                ${message.isLoading ? "animate-pulse" : ""}
                shadow-lg backdrop-blur-sm relative group`}
            >
              {renderMessageContent(message)}
              <p
                className={`text-[10px] mt-1 ${
                  message.isUser ? "text-blue-100" : "text-gray-400"
                }`}
              >
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              {!message.isUser && !message.isLoading && (
                <button
                  onClick={() => copyToClipboard(message.text, index)}
                  className={`absolute top-2 right-2 p-1.5 rounded-full 
                    ${
                      message.copied
                        ? "bg-green-500"
                        : "bg-gray-700 opacity-0 group-hover:opacity-100"
                    }
                    transition-all duration-200 hover:scale-110`}
                  title="Copy to clipboard"
                >
                  {message.copied ? (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                      />
                    </svg>
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="border-t border-gray-800 p-4 bg-[#0A0A0A]">
        <div className="flex space-x-2">
          <button onClick={toggleGLobalSearch}>
            <Globe fill={globalsearch ? "blue" : ""} />
          </button>
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyPress}
            type="text"
            placeholder="Type your question..."
            className="flex-1 px-4 py-2 bg-[#1A1A1A] text-white border border-gray-800 rounded-full 
              focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
              placeholder-gray-500 transition-all duration-300"
          />
          <button
            onClick={askPageAi}
            disabled={!question.trim()}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full
              hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105
              disabled:from-gray-700 disabled:to-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed
              disabled:hover:scale-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            Send
          </button>
        </div>

        {messages && (
          <div className="flex justify-center ">
            <button
              disabled={messages.length === 1}
              className={`   mt-2 text-center px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full
              hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105
              disabled:from-gray-700 disabled:to-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed
              disabled:hover:scale-100 focus:outline-none focus:ring-2 focus:ring-purple-500`}
              onClick={savechat}
            >
              Save this chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
