"use client";

import { useState, useEffect } from "react";
import {
  Phone,
  PhoneForwarded,
  Clock,
  User,
  MapPin,
  Pill,
  ShoppingBag,
  CreditCard,
  HelpCircle,
  Zap,
} from "lucide-react";

export interface IVRContext {
  callerNumber: string;
  queueName: string;
  waitTime: number; // seconds
  ivrSelection?: string;
  ivrIntent?: string;
  callerIdMatch?: { name: string; memberId: string } | null;
}

interface Props {
  ivrContext: IVRContext;
  onAccept: () => void;
  onTransfer: () => void;
}

const ivrIntentMeta: Record<string, { icon: typeof Pill; label: string; color: string }> = {
  refill: { icon: Pill, label: "Prescription Refill", color: "bg-purple-100 text-purple-700 border-purple-200" },
  otc: { icon: ShoppingBag, label: "OTC & Benefits", color: "bg-blue-100 text-blue-700 border-blue-200" },
  billing: { icon: CreditCard, label: "Billing Inquiry", color: "bg-amber-100 text-amber-700 border-amber-200" },
  general: { icon: HelpCircle, label: "General Inquiry", color: "bg-gray-100 text-gray-700 border-gray-200" },
};

export function IncomingCall({ ivrContext, onAccept, onTransfer }: Props) {
  const [ringPulse, setRingPulse] = useState(true);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const toggle = setInterval(() => setRingPulse((p) => !p), 600);
    return () => clearInterval(toggle);
  }, []);

  const intent = ivrContext.ivrIntent ? ivrIntentMeta[ivrContext.ivrIntent] : null;

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6">
      <div className="w-full max-w-md space-y-6">
        {/* Ringing indicator */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div
              className={`w-20 h-20 rounded-full bg-success/20 flex items-center justify-center transition-transform duration-300 ${
                ringPulse ? "scale-110" : "scale-100"
              }`}
            >
              <div className="w-14 h-14 rounded-full bg-success/30 flex items-center justify-center">
                <Phone className="w-7 h-7 text-success" />
              </div>
            </div>
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-success animate-ping" />
          </div>
          <div className="text-center">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Incoming Call</p>
            <p className="text-2xl font-semibold tracking-tight mt-1">{ivrContext.callerNumber}</p>
          </div>
        </div>

        {/* Call context card */}
        <div className="bg-card border rounded-xl p-5 space-y-4">
          {/* Queue + wait time */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-sm font-medium">{ivrContext.queueName}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-sm">
                Wait: {Math.floor(ivrContext.waitTime / 60)}:{(ivrContext.waitTime % 60).toString().padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* IVR Pre-screen */}
          {ivrContext.ivrSelection && (
            <div className="border-t pt-4 space-y-2.5">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3 h-3" />
                IVR Pre-Screen
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Phone tree path:</span>
                  <span className="font-medium font-mono text-xs bg-muted px-2 py-0.5 rounded">
                    {ivrContext.ivrSelection}
                  </span>
                </div>
                {intent && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Detected intent:</span>
                    <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${intent.color}`}>
                      <intent.icon className="w-3 h-3" />
                      {intent.label}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Caller ID match hint */}
          {ivrContext.callerIdMatch && (
            <div className="border-t pt-4">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Possible Match
              </p>
              <div className="flex items-center gap-3 px-3 py-2.5 bg-info-bg rounded-lg border border-info/20">
                <div className="w-8 h-8 rounded-full bg-info/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-info" />
                </div>
                <div>
                  <p className="text-sm font-medium">{ivrContext.callerIdMatch.name}</p>
                  <p className="text-xs text-muted-foreground">ID: {ivrContext.callerIdMatch.memberId}</p>
                </div>
                <span className="ml-auto text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  Caller ID
                </span>
              </div>
            </div>
          )}

          {/* Ring timer */}
          <div className="border-t pt-3 flex items-center justify-center">
            <span className="text-xs text-muted-foreground">
              Ringing for {elapsed}s
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={onTransfer}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
          >
            <PhoneForwarded className="w-4 h-4" />
            Transfer
          </button>
          <button
            onClick={onAccept}
            className="flex-[2] flex items-center justify-center gap-2 px-4 py-3 bg-success text-white rounded-xl text-sm font-semibold hover:bg-success/90 transition-colors"
          >
            <Phone className="w-4 h-4" />
            Accept Call
          </button>
        </div>
      </div>
    </div>
  );
}
