"use client";

import { useState, useEffect, useRef } from "react";
import { mockTranscript, type TranscriptEntry } from "@/data/mock";
import { Mic, User, Pill, MapPin, Hash, Calendar, Zap } from "lucide-react";

const entityIcons: Record<string, typeof Pill> = {
  medication: Pill,
  address: MapPin,
  rx_number: Hash,
  dob: Calendar,
  name: User,
  intent: Zap,
};

const entityColors: Record<string, string> = {
  medication: "bg-purple-100 text-purple-700 border-purple-200",
  address: "bg-blue-100 text-blue-700 border-blue-200",
  rx_number: "bg-orange-100 text-orange-700 border-orange-200",
  dob: "bg-green-100 text-green-700 border-green-200",
  name: "bg-pink-100 text-pink-700 border-pink-200",
  intent: "bg-amber-100 text-amber-700 border-amber-200",
};

interface Props {
  callActive: boolean;
}

export function TranscriptSidebar({ callActive }: Props) {
  const [entries, setEntries] = useState<TranscriptEntry[]>([]);
  const [prompts] = useState([
    "Read back address to caller",
    "Confirm DOB",
    "Provide order number",
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!callActive) {
      setEntries(mockTranscript);
      return;
    }

    let idx = 0;
    const interval = setInterval(() => {
      if (idx < mockTranscript.length) {
        setEntries((prev) => [...prev, mockTranscript[idx]]);
        idx++;
      } else {
        clearInterval(interval);
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [callActive]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [entries]);

  const allEntities = entries.flatMap((e) => e.entities ?? []);

  return (
    <div className="w-80 border-l bg-card flex flex-col shrink-0 h-full">
      <div className="px-4 py-3 border-b shrink-0">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Mic className="w-4 h-4 text-primary" />
          Live Transcript
        </h3>
        {callActive && (
          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            Listening...
          </p>
        )}
      </div>

      {allEntities.length > 0 && (
        <div className="px-4 py-3 border-b shrink-0 space-y-2">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Extracted</p>
          <div className="flex flex-wrap gap-1.5">
            {allEntities.map((entity, i) => {
              const Icon = entityIcons[entity.type] ?? Zap;
              const colorClass = entityColors[entity.type] ?? "bg-gray-100 text-gray-700 border-gray-200";
              return (
                <button
                  key={i}
                  className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium border ${colorClass} hover:opacity-80 transition-opacity cursor-pointer`}
                  title={`Click to auto-fill: ${entity.value}`}
                >
                  <Icon className="w-3 h-3" />
                  {entity.value}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {entries.map((entry) => (
          <div key={entry.id} className="flex gap-2">
            <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold ${
              entry.speaker === "agent"
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground"
            }`}>
              {entry.speaker === "agent" ? "A" : "C"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-medium text-muted-foreground">
                  {entry.speaker === "agent" ? "Agent" : "Caller"}
                </span>
                <span className="text-[10px] text-muted-foreground">{entry.timestamp}</span>
              </div>
              <p className="text-sm leading-relaxed mt-0.5">{entry.text}</p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="px-4 py-3 border-t shrink-0 space-y-2">
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Suggested Actions</p>
        <div className="space-y-1">
          {prompts.map((prompt) => (
            <button
              key={prompt}
              className="w-full text-left px-3 py-2 text-xs bg-accent text-accent-foreground rounded-lg hover:bg-primary/10 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
