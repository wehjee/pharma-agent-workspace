"use client";

import { useEffect } from "react";
import { Phone, PhoneOff, MessageSquare, Clock } from "lucide-react";

interface TopBarProps {
  callActive: boolean;
  callDuration: number;
  setCallDuration: (d: number) => void;
  onEndCall: () => void;
  onToggleTranscript: () => void;
  showTranscript: boolean;
  onLogoClick?: () => void;
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function TopBar({ callActive, callDuration, setCallDuration, onEndCall, onToggleTranscript, showTranscript, onLogoClick }: TopBarProps) {
  useEffect(() => {
    if (!callActive) return;
    const interval = setInterval(() => setCallDuration(callDuration + 1), 1000);
    return () => clearInterval(interval);
  }, [callActive, callDuration, setCallDuration]);

  return (
    <header className="flex items-center justify-between h-14 px-6 bg-card border-b shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onLogoClick}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          title="Back to start"
        >
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-sm font-bold">CW</span>
          </div>
          <span className="font-semibold text-[15px] tracking-tight">CenterWell</span>
          <span className="text-muted-foreground text-sm">Agent Workspace</span>
        </button>
      </div>

      <div className="flex items-center gap-4">
        {callActive && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-success-bg rounded-full">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <Phone className="w-3.5 h-3.5 text-success" />
            <span className="text-sm font-medium text-success flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              {formatDuration(callDuration)}
            </span>
          </div>
        )}

        <button
          onClick={onToggleTranscript}
          className={`p-2 rounded-lg transition-colors ${
            showTranscript ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
          title="Toggle transcript"
        >
          <MessageSquare className="w-4 h-4" />
        </button>

        {callActive ? (
          <button
            onClick={onEndCall}
            className="flex items-center gap-2 px-3 py-1.5 bg-destructive text-white rounded-lg text-sm font-medium hover:bg-destructive/90 transition-colors"
          >
            <PhoneOff className="w-3.5 h-3.5" />
            End Call
          </button>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full">
            <span className="w-2 h-2 rounded-full bg-muted-foreground" />
            <span className="text-sm text-muted-foreground">No active call</span>
          </div>
        )}
      </div>
    </header>
  );
}
