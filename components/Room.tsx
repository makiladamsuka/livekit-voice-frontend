"use client";

import { useState } from "react";
import { LiveKitRoom } from "@livekit/components-react";
import { useLocalParticipant, useRemoteParticipants } from "@livekit/components-react";
import AudioVisualizer from "./AudioVisualizer";
import TranscriptView from "./TranscriptView";
import ControlBar from "./ControlBar";
import ChatHistory from "./ChatHistory";
import { useTranscription } from "@/hooks/useTranscription";

interface RoomContentProps {
  onDisconnect: () => void;
}

function RoomContent({ onDisconnect }: RoomContentProps) {
  const { localParticipant } = useLocalParticipant();
  const remoteParticipants = useRemoteParticipants();
  const { messages, currentUserText, currentAIText } = useTranscription();
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        {/* Audio Visualizers */}
        <div className="flex gap-16 mb-12">
          <AudioVisualizer participant={localParticipant} isLocal={true} />
          <AudioVisualizer participant={remoteParticipants[0]} isLocal={false} />
        </div>

        {/* Transcript Display */}
        <div className="w-full max-w-5xl">
          <TranscriptView
            currentUserText={currentUserText}
            currentAIText={currentAIText}
          />
        </div>
      </div>

      {/* Control Bar */}
      <ControlBar
        onDisconnect={onDisconnect}
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
        isChatOpen={isChatOpen}
      />

      {/* Chat History */}
      <ChatHistory
        messages={messages}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  );
}

interface RoomProps {
  token: string;
  serverUrl: string;
  onDisconnect: () => void;
}

export default function Room({ token, serverUrl, onDisconnect }: RoomProps) {
  return (
    <LiveKitRoom
      token={token}
      serverUrl={serverUrl}
      connect={true}
      audio={true}
      video={false}
      onDisconnected={onDisconnect}
      className="h-screen"
    >
      <RoomContent onDisconnect={onDisconnect} />
    </LiveKitRoom>
  );
}
