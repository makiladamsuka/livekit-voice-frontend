"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { TranscriptMessage } from "@/hooks/useTranscription";

interface ChatHistoryProps {
  messages: TranscriptMessage[];
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatHistory({ messages, isOpen, onClose }: ChatHistoryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-gray-900/95 backdrop-blur-lg border-l border-gray-700 shadow-2xl z-20 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-700 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Chat History</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            No messages yet. Start speaking to see the conversation history.
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${
                message.isLocal
                  ? "bg-cyan-900/20 border border-cyan-500/30"
                  : "bg-purple-900/20 border border-purple-500/30"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`text-xs font-semibold ${
                    message.isLocal ? "text-cyan-400" : "text-purple-400"
                  }`}
                >
                  {message.isLocal ? "You" : "AI Agent"}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-sm text-gray-200">{message.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
