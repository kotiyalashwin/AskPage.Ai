import { useState } from "react";

interface TerminalProps {
  commands: string[];
}

export function Terminal({ commands }: TerminalProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyCommand = async (command: string, index: number) => {
    try {
      await navigator.clipboard.writeText(command);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy command:", err);
    }
  };

  if (commands.length === 0) return null;

  return (
    <div className="mt-2 bg-[#1E1E1E] rounded-lg overflow-hidden">
      <div className="flex items-center px-4 py-2 bg-[#2D2D2D] border-b border-gray-700">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
          <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
        </div>
        <span className="ml-4 text-xs text-gray-400">bash</span>
      </div>
      <div className="p-4 space-y-2">
        {commands.map((command, index) => (
          <div key={index} className="flex items-start group">
            <span className="text-green-500 mr-2">$</span>
            <pre className="text-gray-300 font-mono text-sm flex-1 whitespace-pre-wrap">
              {command}
            </pre>
            <button
              onClick={() => copyCommand(command, index)}
              className={`ml-2 p-1.5 rounded-md transition-all duration-200
                ${
                  copiedIndex === index
                    ? "bg-green-500"
                    : "bg-gray-700 opacity-0 group-hover:opacity-100"
                }
              `}
              title="Copy command"
            >
              {copiedIndex === index ? (
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
          </div>
        ))}
      </div>
    </div>
  );
}
