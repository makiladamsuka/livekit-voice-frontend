"use client";

import { useState, useEffect } from "react";
import { Mic, MicOff, AlertCircle } from "lucide-react";

interface ConnectionScreenProps {
  onConnect: (roomName: string, userName: string) => void;
}

export default function ConnectionScreen({ onConnect }: ConnectionScreenProps) {
  const [micPermission, setMicPermission] = useState<"granted" | "denied" | "prompt">("prompt");
  const [roomName, setRoomName] = useState("voice-room");
  const [userName, setUserName] = useState("User");
  const [error, setError] = useState("");

  useEffect(() => {
    // Check microphone permission on load
    if (navigator.mediaDevices) {
      navigator.permissions
        .query({ name: "microphone" as PermissionName })
        .then((result) => {
          setMicPermission(result.state as "granted" | "denied" | "prompt");
        })
        .catch(() => {
          setMicPermission("prompt");
        });
    }
  }, []);

  const handleConnect = async () => {
    setError("");

    // Request microphone permission
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicPermission("granted");
      onConnect(roomName, userName);
    } catch (err) {
      setMicPermission("denied");
      setError("Microphone access denied. Please allow microphone access to continue.");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            LiveKit Voice Agent
          </h1>
          <p className="text-gray-400">Connect to start your voice conversation</p>
        </div>

        <div className="bg-gray-900 rounded-2xl p-8 shadow-2xl border border-gray-800">
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-300">Room Name</label>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
              placeholder="Enter room name"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-300">Your Name</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
              placeholder="Enter your name"
            />
          </div>

          <div className="mb-6 p-4 bg-gray-800 rounded-lg flex items-center gap-3">
            {micPermission === "granted" ? (
              <Mic className="w-5 h-5 text-green-500" />
            ) : micPermission === "denied" ? (
              <MicOff className="w-5 h-5 text-red-500" />
            ) : (
              <Mic className="w-5 h-5 text-yellow-500" />
            )}
            <div>
              <div className="text-sm font-medium">
                Microphone Status:{" "}
                {micPermission === "granted" ? (
                  <span className="text-green-500">Granted</span>
                ) : micPermission === "denied" ? (
                  <span className="text-red-500">Denied</span>
                ) : (
                  <span className="text-yellow-500">Not requested</span>
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}

          <button
            onClick={handleConnect}
            className="w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 rounded-lg font-semibold text-white transition-all duration-200 shadow-lg hover:shadow-cyan-500/50"
          >
            Connect
          </button>
        </div>
      </div>
    </div>
  );
}
