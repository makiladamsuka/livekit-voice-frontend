"use client";

import { useEffect, useRef } from "react";
import { useIsSpeaking } from "@livekit/components-react";
import { Participant } from "livekit-client";

interface AudioVisualizerProps {
  participant: Participant | undefined;
  isLocal?: boolean;
}

export default function AudioVisualizer({ participant, isLocal = false }: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isSpeaking = useIsSpeaking(participant);
  const animationFrameRef = useRef<number>();

  const color = isLocal ? "#22d3ee" : "#a855f7"; // Cyan for user, Purple for AI

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const baseRadius = 60;

    let phase = 0;
    const bars = 32;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw circular frequency visualization
      for (let i = 0; i < bars; i++) {
        const angle = (i / bars) * Math.PI * 2;
        
        // Create wave effect based on speaking state
        const amplitude = isSpeaking 
          ? 20 + Math.sin(phase + i * 0.3) * 15 
          : 5 + Math.sin(phase + i * 0.2) * 3;
        
        const innerRadius = baseRadius;
        const outerRadius = baseRadius + amplitude;

        const x1 = centerX + Math.cos(angle) * innerRadius;
        const y1 = centerY + Math.sin(angle) * innerRadius;
        const x2 = centerX + Math.cos(angle) * outerRadius;
        const y2 = centerY + Math.sin(angle) * outerRadius;

        // Draw bar
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.shadowBlur = isSpeaking ? 10 : 5;
        ctx.shadowColor = color;
        ctx.stroke();
      }

      // Draw center circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius - 10, 0, Math.PI * 2);
      ctx.fillStyle = `${color}22`;
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.shadowBlur = isSpeaking ? 15 : 8;
      ctx.shadowColor = color;
      ctx.stroke();

      phase += isSpeaking ? 0.1 : 0.03;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isSpeaking, color]);

  return (
    <div className="flex flex-col items-center gap-4">
      <canvas
        ref={canvasRef}
        width={300}
        height={300}
        className="rounded-full"
      />
      <div className="text-center">
        <p className="text-sm font-medium" style={{ color }}>
          {isLocal ? "You" : "AI Agent"}
        </p>
        <p className="text-xs text-gray-500">
          {isSpeaking ? "Speaking..." : "Idle"}
        </p>
      </div>
    </div>
  );
}
