"use client";

import { useState } from "react";
import ConnectionScreen from "@/components/ConnectionScreen";
import Room from "@/components/Room";

export default function Home() {
  const [token, setToken] = useState("");
  const [connected, setConnected] = useState(false);

  const handleConnect = async (roomName: string, userName: string) => {
    try {
      const response = await fetch(
        `/api/token?room=${encodeURIComponent(roomName)}&username=${encodeURIComponent(userName)}`
      );

      if (!response.ok) {
        throw new Error("Failed to get token");
      }

      const data = await response.json();
      setToken(data.token);
      setConnected(true);
    } catch (error) {
      console.error("Error connecting:", error);
      alert("Failed to connect. Please try again.");
    }
  };

  const handleDisconnect = () => {
    setConnected(false);
    setToken("");
  };

  const serverUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL || "";

  if (!connected) {
    return <ConnectionScreen onConnect={handleConnect} />;
  }

  return <Room token={token} serverUrl={serverUrl} onDisconnect={handleDisconnect} />;
}
