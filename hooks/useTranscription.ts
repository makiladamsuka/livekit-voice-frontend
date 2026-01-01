import { useState, useEffect } from "react";
import { useRemoteParticipants, useLocalParticipant } from "@livekit/components-react";
import { Participant, TranscriptionSegment } from "livekit-client";

export interface TranscriptMessage {
  participant: string;
  text: string;
  timestamp: number;
  isFinal: boolean;
  isLocal: boolean;
}

export function useTranscription() {
  const [messages, setMessages] = useState<TranscriptMessage[]>([]);
  const [currentUserText, setCurrentUserText] = useState("");
  const [currentAIText, setCurrentAIText] = useState("");
  const remoteParticipants = useRemoteParticipants();
  const { localParticipant } = useLocalParticipant();

  useEffect(() => {
    if (!localParticipant) return;

    const handleLocalTranscription = (
      segments: TranscriptionSegment[]
    ) => {
      const text = segments.map((s) => s.text).join(" ");
      const isFinal = segments.some((s) => s.final);

      setCurrentUserText(text);

      if (isFinal && text) {
        setMessages((prev) => [
          ...prev,
          {
            participant: localParticipant.identity || "You",
            text,
            timestamp: Date.now(),
            isFinal: true,
            isLocal: true,
          },
        ]);
        setCurrentUserText("");
      }
    };

    localParticipant.on("transcriptionReceived", handleLocalTranscription);

    return () => {
      localParticipant.off("transcriptionReceived", handleLocalTranscription);
    };
  }, [localParticipant]);

  useEffect(() => {
    const handleRemoteTranscription = (
      participant: Participant,
      segments: TranscriptionSegment[]
    ) => {
      const text = segments.map((s) => s.text).join(" ");
      const isFinal = segments.some((s) => s.final);

      setCurrentAIText(text);

      if (isFinal && text) {
        setMessages((prev) => [
          ...prev,
          {
            participant: participant.identity || "AI Agent",
            text,
            timestamp: Date.now(),
            isFinal: true,
            isLocal: false,
          },
        ]);
        setCurrentAIText("");
      }
    };

    const handlers = new Map<Participant, (segments: TranscriptionSegment[]) => void>();

    remoteParticipants.forEach((participant) => {
      const handler = (segments: TranscriptionSegment[]) => {
        handleRemoteTranscription(participant, segments);
      };
      handlers.set(participant, handler);
      participant.on("transcriptionReceived", handler);
    });

    return () => {
      handlers.forEach((handler, participant) => {
        participant.off("transcriptionReceived", handler);
      });
    };
  }, [remoteParticipants]);

  return {
    messages,
    currentUserText,
    currentAIText,
  };
}
