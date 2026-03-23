"use client";

import { useState, useEffect } from "react";
import { X, FileText, BarChart3, Clock, MessageSquare, Phone, Users } from "lucide-react";

const TOPICS = [
  { name: "Refills & Prescriptions", pct: 25.8, count: 82, color: "bg-purple-500" },
  { name: "OTC & Wellness", pct: 25.8, count: 82, color: "bg-blue-500" },
  { name: "Order Management & Delivery", pct: 15.1, count: 48, color: "bg-emerald-500" },
  { name: "Claims & Billing", pct: 6.9, count: 22, color: "bg-amber-500" },
  { name: "Account & Access", pct: 6.0, count: 19, color: "bg-pink-500" },
  { name: "Coverage & Costs", pct: 5.7, count: 18, color: "bg-orange-500" },
  { name: "Prescriber & Provider Services", pct: 3.1, count: 10, color: "bg-indigo-500" },
  { name: "Other", pct: 11.6, count: 37, color: "bg-gray-400" },
];

const SUBTOPICS = [
  { name: "OTC order & hotline help", count: 40, pct: 12.6 },
  { name: "New Rx: first fill", count: 27, pct: 8.5 },
  { name: "OTC catalog inquiry", count: 23, pct: 7.2 },
  { name: "Auto-refill on/off", count: 20, pct: 6.3 },
  { name: "OTC benefit balance inquiry", count: 19, pct: 6.0 },
  { name: "Manual refill request", count: 18, pct: 5.7 },
  { name: "Estimated delivery date", count: 17, pct: 5.3 },
  { name: "Drug copay amount", count: 12, pct: 3.8 },
  { name: "Payment method update", count: 10, pct: 3.1 },
  { name: "Rx transfer in", count: 9, pct: 2.8 },
];

export function ProjectBackground() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Trigger button — fixed bottom right */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-2.5 bg-card border rounded-xl shadow-lg text-sm font-medium hover:bg-muted transition-colors"
      >
        <FileText className="w-4 h-4 text-primary" />
        Project Background
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-black/40" />

          <div
            className="relative w-full max-w-3xl max-h-[85vh] bg-card border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between px-8 pt-8 pb-4 shrink-0">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">Project Background</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Analysis of 200 evaluation questions from CenterWell Pharmacy call conversations
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-8 pb-8 space-y-8">
              {/* Key metrics */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { icon: MessageSquare, label: "Eval Questions", value: "200" },
                  { icon: Phone, label: "Call Categories", value: "8" },
                  { icon: Clock, label: "Avg Duration", value: "48.5s" },
                  { icon: Users, label: "Max Duration", value: "6m 48s" },
                ].map((m) => (
                  <div key={m.label} className="bg-muted/50 rounded-xl p-4 text-center">
                    <m.icon className="w-4 h-4 text-muted-foreground mx-auto mb-2" />
                    <p className="text-xl font-semibold tracking-tight">{m.value}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{m.label}</p>
                  </div>
                ))}
              </div>

              {/* Topic distribution */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold">Call Volume by Category</h3>
                </div>

                {/* Stacked bar */}
                <div className="flex h-3 rounded-full overflow-hidden">
                  {TOPICS.map((t) => (
                    <div
                      key={t.name}
                      className={`${t.color} transition-all`}
                      style={{ width: `${t.pct}%` }}
                      title={`${t.name}: ${t.pct}%`}
                    />
                  ))}
                </div>

                {/* Legend */}
                <div className="grid grid-cols-2 gap-2">
                  {TOPICS.map((t) => (
                    <div key={t.name} className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted/30">
                      <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${t.color}`} />
                        <span className="text-xs font-medium">{t.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{t.count}</span>
                        <span className="text-xs font-semibold w-10 text-right">{t.pct}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top subtopics */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Top 10 Question Types</h3>
                <div className="space-y-2">
                  {SUBTOPICS.map((s, i) => (
                    <div key={s.name} className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground w-5 text-right shrink-0">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium truncate">{s.name}</span>
                          <span className="text-xs text-muted-foreground shrink-0 ml-2">{s.count} ({s.pct}%)</span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary/60 rounded-full"
                            style={{ width: `${(s.pct / SUBTOPICS[0].pct) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key insights */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold">Key Insights</h3>
                <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                  <div className="flex gap-2">
                    <span className="text-primary shrink-0">•</span>
                    <p><strong className="text-foreground">Two categories dominate equally</strong> — Refills & Prescriptions and OTC & Wellness each account for ~26% of all questions, together covering over half of inbound volume.</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-primary shrink-0">•</span>
                    <p><strong className="text-foreground">Order tracking is the third pillar</strong> — 15% of questions relate to delivery status, ETAs, and order management.</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-primary shrink-0">•</span>
                    <p><strong className="text-foreground">Identity verification is universal</strong> — Every single call begins with name, DOB, and address confirmation, making this the highest-friction repetitive task.</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-primary shrink-0">•</span>
                    <p><strong className="text-foreground">OTC is fragmented across 3 subtopics</strong> — Orders, catalog inquiries, and balance checks are distinct workflows but all relate to the same benefit, suggesting a unified OTC workspace.</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-primary shrink-0">•</span>
                    <p><strong className="text-foreground">Long-tail complexity exists</strong> — Categories like prior authorization, clinical support, and diabetes management are low-volume but high-complexity, requiring specialized agent knowledge.</p>
                  </div>
                </div>
              </div>

              {/* Data source */}
              <div className="px-4 py-3 bg-muted/40 rounded-xl">
                <p className="text-[11px] text-muted-foreground">
                  Source: <span className="font-mono">aa_cwpcc_top_200_eval_questions_v0.1_sme.csv</span> — Top 200 evaluation questions from real CenterWell Pharmacy call center conversations, ranked by frequency and annotated by subject matter experts.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
