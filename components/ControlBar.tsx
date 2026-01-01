"use client";

import { useState, useEffect } from "react";
import { Mic, MicOff, PhoneOff, MessageSquare } from "lucide-react";
import { useLocalParticipant } from "@livekit/components-react";

interface ControlBarProps {
  onDisconnect: () => void;
  onToggleChat: () => void;
  isChatOpen: boolean;
}

export default function ControlBar({ onDisconnect, onToggleChat, isChatOpen }: ControlBarProps) {
  const { localParticipant } = useLocalParticipant();
  const [isMuted, setIsMuted] = useState(false);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>("");

  useEffect(() => {
    // Get available audio input devices
    const getDevices = async () => {
      try {
        const deviceInfos = await navigator.mediaDevices.enumerateDevices();
        const audioInputs = deviceInfos.filter((device) => device.kind === "audioinput");
        setDevices(audioInputs);

        if (audioInputs.length > 0 && !selectedDevice) {
          setSelectedDevice(audioInputs[0].deviceId);
        }
      } catch (err) {
        console.error("Error enumerating devices:", err);
      }
    };

    getDevices();

    // Listen for device changes
    navigator.mediaDevices.addEventListener("devicechange", getDevices);
    return () => {
      navigator.mediaDevices.removeEventListener("devicechange", getDevices);
    };
  }, [selectedDevice]);

  const toggleMute = async () => {
    if (!localParticipant) return;

    try {
      await localParticipant.setMicrophoneEnabled(!isMuted);
      setIsMuted(!isMuted);
    } catch (err) {
      console.error("Error toggling mute:", err);
    }
  };

  const handleDeviceChange = async (deviceId: string) => {
    setSelectedDevice(deviceId);
    
    if (!localParticipant) return;

    try {
      // Re-enable microphone with new device
      await localParticipant.setMicrophoneEnabled(false);
      await localParticipant.setMicrophoneEnabled(true);
    } catch (err) {
      console.error("Error switching microphone:", err);
    }
  };

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-10">
      <div className="bg-gray-900/90 backdrop-blur-lg border border-gray-700 rounded-full px-6 py-4 shadow-2xl flex items-center gap-4">
        {/* Device Selector */}
        <select
          value={selectedDevice}
          onChange={(e) => handleDeviceChange(e.target.value)}
          className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          {devices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `Microphone ${device.deviceId.slice(0, 5)}`}
            </option>
          ))}
        </select>

        {/* Mute/Unmute Button */}
        <button
          onClick={toggleMute}
          className={`p-4 rounded-full transition-all duration-200 ${
            isMuted
              ? "bg-red-500 hover:bg-red-600"
              : "bg-cyan-500 hover:bg-cyan-600"
          } shadow-lg`}
        >
          {isMuted ? (
            <MicOff className="w-6 h-6 text-white" />
          ) : (
            <Mic className="w-6 h-6 text-white" />
          )}
        </button>

        {/* Chat Toggle */}
        <button
          onClick={onToggleChat}
          className={`p-3 rounded-full transition-all duration-200 ${
            isChatOpen
              ? "bg-purple-500 hover:bg-purple-600"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          <MessageSquare className="w-5 h-5 text-white" />
        </button>

        {/* Disconnect Button */}
        <button
          onClick={onDisconnect}
          className="p-3 rounded-full bg-red-500 hover:bg-red-600 transition-all duration-200"
        >
          <PhoneOff className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
}
