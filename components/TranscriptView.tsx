"use client";

import { useIsSpeaking, useLocalParticipant, useRemoteParticipants } from "@livekit/components-react";

interface TranscriptViewProps {
  currentUserText: string;
  currentAIText: string;
}

export default function TranscriptView({ currentUserText, currentAIText }: TranscriptViewProps) {
  const { localParticipant } = useLocalParticipant();
  const remoteParticipants = useRemoteParticipants();
  const userIsSpeaking = useIsSpeaking(localParticipant);
  const aiIsSpeaking = useIsSpeaking(remoteParticipants[0]);

  // Determine which text to show as large/small based on who's speaking
  const userTextSize = userIsSpeaking || (!aiIsSpeaking && currentUserText) ? "text-4xl" : "text-lg";
  const aiTextSize = aiIsSpeaking || (!userIsSpeaking && currentAIText) ? "text-4xl" : "text-lg";
  
  const userTextColor = userIsSpeaking || (!aiIsSpeaking && currentUserText) ? "text-white" : "text-gray-500";
  const aiTextColor = aiIsSpeaking || (!userIsSpeaking && currentAIText) ? "text-white" : "text-gray-500";

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] px-8 gap-6">
      {/* User's Text */}
      {currentUserText && (
        <div className={`transition-all duration-300 ease-in-out ${userTextSize} ${userTextColor} font-medium text-center max-w-4xl`}>
          <span className="text-cyan-400 text-sm font-semibold block mb-2">You:</span>
          {currentUserText}
        </div>
      )}

      {/* AI's Text */}
      {currentAIText && (
        <div className={`transition-all duration-300 ease-in-out ${aiTextSize} ${aiTextColor} font-medium text-center max-w-4xl`}>
          <span className="text-purple-400 text-sm font-semibold block mb-2">AI:</span>
          {currentAIText}
        </div>
      )}

      {/* Placeholder when no one is speaking */}
      {!currentUserText && !currentAIText && (
        <div className="text-gray-600 text-xl text-center">
          Start speaking to see live transcription...
        </div>
      )}
    </div>
  );
}
