"use client";

import { useState } from "react";
import type { Patient } from "@/data/mock";
import type { WorkflowId } from "@/app/page";
import { Command, Package, DollarSign, BookOpen, Clock, Hash } from "lucide-react";

interface Props {
  onNavigate: (id: WorkflowId) => void;
  patient: Patient;
}

export function QuickActions({ onNavigate, patient }: Props) {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const actions = [
    {
      key: "status",
      label: "Order Status",
      icon: Package,
      shortcut: "⌘1",
      action: () => {
        const latest = patient.orders[0];
        if (latest) {
          setResult(`${latest.orderNumber} — ${latest.status.replace("_", " ")} — ETA: ${latest.estimatedDelivery}`);
        }
      },
    },
    {
      key: "balance",
      label: "OTC Balance",
      icon: DollarSign,
      shortcut: "⌘2",
      action: () => {
        setResult(`OTC Balance: $${patient.otcBalance.toFixed(2)} of $${patient.otcTotal.toFixed(2)}`);
      },
    },
    {
      key: "catalog",
      label: "Send Catalog",
      icon: BookOpen,
      shortcut: "⌘3",
      action: () => {
        setResult(`Catalog request sent to ${patient.shippingAddress.street}, ${patient.shippingAddress.city}`);
      },
    },
    {
      key: "hours",
      label: "Hours",
      icon: Clock,
      shortcut: "⌘4",
      action: () => {
        setResult("Mon–Fri 8AM–11PM ET · Sat 8AM–6:30PM ET · Sun Closed");
      },
    },
    {
      key: "refnum",
      label: "Call Ref #",
      icon: Hash,
      shortcut: "⌘5",
      action: () => {
        setResult(`Call Reference: CW-${Date.now().toString().slice(-8)}`);
      },
    },
  ];

  return (
    <div className="border-t bg-card px-6 py-2 shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1.5 px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors rounded"
          >
            <Command className="w-3 h-3" />
            Quick Actions
          </button>

          {(open || true) && (
            <div className="flex items-center gap-1">
              {actions.map((a) => {
                const Icon = a.icon;
                return (
                  <button
                    key={a.key}
                    onClick={() => {
                      a.action();
                      setTimeout(() => setResult(null), 4000);
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                    title={a.shortcut}
                  >
                    <Icon className="w-3 h-3" />
                    {a.label}
                    <kbd className="hidden lg:inline text-[10px] bg-muted px-1 py-0.5 rounded font-mono">{a.shortcut}</kbd>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {result && (
          <div className="flex items-center gap-2 px-3 py-1 bg-accent rounded-lg animate-in fade-in text-xs text-accent-foreground font-medium">
            {result}
          </div>
        )}
      </div>
    </div>
  );
}
