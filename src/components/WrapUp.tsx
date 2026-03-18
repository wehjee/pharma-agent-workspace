"use client";

import type { Patient } from "@/data/mock";
import { FileText, Copy, CheckCircle2, RotateCcw } from "lucide-react";
import { useState } from "react";

interface Props {
  patient: Patient;
  onNewIntent: () => void;
}

export function WrapUp({ patient, onNewIntent }: Props) {
  const [copied, setCopied] = useState(false);
  const latestOrder = patient.orders[0];

  const script = `Thank you for calling CenterWell Pharmacy, ${patient.firstName}. Here's a quick summary of today's call:

• Order ${latestOrder?.orderNumber ?? "N/A"} has been placed for your medications.
• Estimated delivery: 3–5 business days to ${patient.shippingAddress.street}, ${patient.shippingAddress.city}, ${patient.shippingAddress.state} ${patient.shippingAddress.zip}.
• Total copay: $${latestOrder?.total.toFixed(2) ?? "0.00"}${patient.cardOnFile ? ` on your ${patient.cardOnFile.brand} ending in ${patient.cardOnFile.last4}` : ""}.

Is there anything else I can help you with today?`;

  const handleCopy = () => {
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-success-bg flex items-center justify-center">
          <CheckCircle2 className="w-5 h-5 text-success" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Call Wrap-Up</h2>
          <p className="text-sm text-muted-foreground">Review summary and read back to caller.</p>
        </div>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b bg-muted/30">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold">Read-Back Script</span>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <div className="p-5">
          <pre className="text-sm leading-relaxed whitespace-pre-wrap font-sans">{script}</pre>
        </div>
      </div>

      <div className="bg-card border rounded-xl p-5">
        <h3 className="text-sm font-semibold mb-3">Call Details</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Member</p>
            <p className="font-medium">{patient.firstName} {patient.lastName}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Member ID</p>
            <p className="font-medium">{patient.memberId}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Order Number</p>
            <p className="font-medium">{latestOrder?.orderNumber ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Items</p>
            {latestOrder?.items.map((item, i) => (
              <p key={i} className="font-medium">{item}</p>
            ))}
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Delivery</p>
            <p className="font-medium">{latestOrder?.estimatedDelivery ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="font-medium">${latestOrder?.total.toFixed(2) ?? "0.00"}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onNewIntent}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          New Intent
        </button>
        <button className="px-4 py-2.5 border rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          End &amp; Dispose Call
        </button>
      </div>
    </div>
  );
}
