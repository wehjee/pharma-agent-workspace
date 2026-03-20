"use client";

import type { LucideIcon } from "lucide-react";
import type { Patient } from "@/data/mock";
import { ArrowRight, AlertCircle, RefreshCw } from "lucide-react";

interface Workflow {
  id: string;
  label: string;
  icon: LucideIcon;
  description: string;
}

interface Props {
  workflows: Workflow[];
  onSelect: (id: string) => void;
  patient: Patient;
}

export function IntentPanel({ workflows, onSelect, patient }: Props) {
  const dueRefills = patient.prescriptions.filter(
    (p) => p.status === "active" && p.refillsRemaining > 0 && !p.autoRefill
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {dueRefills.length > 0 && (
        <div className="bg-info-bg border border-info/20 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-info mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-info">Suggested: Prescription Refills Due</p>
            <p className="text-sm text-info/80 mt-0.5">
              {dueRefills.map((p) => p.name).join(", ")} — not on auto-refill,{" "}
              {dueRefills.length === 1 ? "has" : "have"} refills remaining.
            </p>
            <button
              onClick={() => onSelect("refill")}
              className="mt-2 text-sm font-medium text-info hover:underline flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Go to Refill &amp; Rx
            </button>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold mb-1">How can I help today?</h2>
        <p className="text-sm text-muted-foreground mb-4">Select the reason for the call to begin.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {workflows.map((w) => {
          const Icon = w.icon;
          return (
            <button
              key={w.id}
              onClick={() => onSelect(w.id)}
              className="group relative flex flex-col items-start gap-3 p-5 bg-card border rounded-xl hover:border-primary/30 hover:shadow-md transition-all text-left"
            >
              <div className="flex items-center justify-between w-full">
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div>
                <p className="font-medium text-sm">{w.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{w.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
