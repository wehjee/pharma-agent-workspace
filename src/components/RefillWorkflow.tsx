"use client";

import { useState } from "react";
import type { Patient, Prescription } from "@/data/mock";
import { Check, ChevronRight, Pill, RotateCcw, ArrowLeftRight, Plus, ToggleLeft, ToggleRight } from "lucide-react";

type Tab = "refill" | "auto" | "transfer" | "new";

interface Props {
  patient: Patient;
  onComplete: () => void;
}

export function RefillWorkflow({ patient, onComplete }: Props) {
  const [tab, setTab] = useState<Tab>("refill");
  const [step, setStep] = useState(0);
  const [selectedRx, setSelectedRx] = useState<string[]>([]);
  const [autoRefillChanges, setAutoRefillChanges] = useState<Record<string, boolean>>({});

  const tabs = [
    { id: "refill" as const, label: "Manual Refill", icon: RotateCcw },
    { id: "auto" as const, label: "Auto-Refill", icon: ToggleLeft },
    { id: "transfer" as const, label: "Transfer In", icon: ArrowLeftRight },
    { id: "new" as const, label: "New Rx", icon: Plus },
  ];

  const activeRx = patient.prescriptions.filter((p) => p.status === "active");
  const steps = ["Select Medications", "Confirm Details", "Shipping & Payment", "Review & Submit"];

  const toggleRx = (rxNum: string) => {
    setSelectedRx((prev) =>
      prev.includes(rxNum) ? prev.filter((r) => r !== rxNum) : [...prev, rxNum]
    );
  };

  const toggleAutoRefill = (rxNum: string) => {
    const current = autoRefillChanges[rxNum] ?? patient.prescriptions.find(p => p.rxNumber === rxNum)?.autoRefill ?? false;
    setAutoRefillChanges(prev => ({ ...prev, [rxNum]: !current }));
  };

  const selectedPrescriptions = activeRx.filter((p) => selectedRx.includes(p.rxNumber));
  const totalCopay = selectedPrescriptions.reduce((sum, p) => sum + p.copay, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); setStep(0); setSelectedRx([]); }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                tab === t.id ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === "refill" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
                  i < step ? "bg-success-bg text-success" :
                  i === step ? "bg-primary text-primary-foreground" :
                  "bg-muted text-muted-foreground"
                }`}>
                  {i < step ? <Check className="w-3 h-3" /> : <span>{i + 1}</span>}
                  {s}
                </div>
                {i < steps.length - 1 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
              </div>
            ))}
          </div>

          {step === 0 && (
            <div className="space-y-2">
              {activeRx.map((rx) => (
                <RxCard
                  key={rx.rxNumber}
                  rx={rx}
                  selected={selectedRx.includes(rx.rxNumber)}
                  onToggle={() => toggleRx(rx.rxNumber)}
                />
              ))}
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setStep(1)}
                  disabled={selectedRx.length === 0}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium disabled:opacity-40 hover:bg-primary/90 transition-colors"
                >
                  Continue ({selectedRx.length} selected)
                </button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-3">
              <div className="bg-card border rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Medication</th>
                      <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Prescriber</th>
                      <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Supply</th>
                      <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Copay</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPrescriptions.map((rx) => (
                      <tr key={rx.rxNumber} className="border-b last:border-0">
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium">{rx.name} {rx.dosage}</p>
                          <p className="text-xs text-muted-foreground">{rx.rxNumber}</p>
                        </td>
                        <td className="px-4 py-3 text-sm">{rx.prescriber}</td>
                        <td className="px-4 py-3 text-sm">{rx.supply}-day</td>
                        <td className="px-4 py-3 text-sm text-right font-medium">
                          {rx.copay === 0 ? (
                            <span className="text-success">$0.00</span>
                          ) : (
                            `$${rx.copay.toFixed(2)}`
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between">
                <button onClick={() => setStep(0)} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Back
                </button>
                <button onClick={() => setStep(2)} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="bg-card border rounded-xl p-4 space-y-3">
                <h3 className="text-sm font-semibold">Shipping</h3>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-sm">{patient.shippingAddress.street}</p>
                  <p className="text-sm">{patient.shippingAddress.city}, {patient.shippingAddress.state} {patient.shippingAddress.zip}</p>
                  <p className="text-xs text-muted-foreground mt-1">Standard delivery: 3–5 business days</p>
                </div>
              </div>
              <div className="bg-card border rounded-xl p-4 space-y-3">
                <h3 className="text-sm font-semibold">Payment</h3>
                {patient.cardOnFile ? (
                  <div className="bg-muted/50 rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-5 bg-primary/10 rounded flex items-center justify-center text-[10px] font-bold text-primary">
                        {patient.cardOnFile.brand}
                      </div>
                      <span className="text-sm">****{patient.cardOnFile.last4}</span>
                      <span className="text-xs text-muted-foreground">Exp {patient.cardOnFile.expiry}</span>
                    </div>
                    <span className="text-sm font-semibold">${totalCopay.toFixed(2)}</span>
                  </div>
                ) : (
                  <p className="text-sm text-warning">No card on file — invoice will be sent.</p>
                )}
              </div>
              <div className="flex justify-between">
                <button onClick={() => setStep(1)} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Back</button>
                <button onClick={() => setStep(3)} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="bg-card border rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-semibold">Order Summary — Read Back to Caller</h3>
                <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm leading-relaxed">
                  <p>
                    &ldquo;You called today to refill{" "}
                    <strong>{selectedPrescriptions.map((p) => `${p.name} ${p.dosage}`).join(" and ")}</strong>.
                  </p>
                  <p>
                    Delivery in <strong>3–5 business days</strong> to{" "}
                    <strong>{patient.shippingAddress.street}, {patient.shippingAddress.city}, {patient.shippingAddress.state} {patient.shippingAddress.zip}</strong>.
                  </p>
                  <p>
                    Total copay: <strong>${totalCopay.toFixed(2)}</strong>
                    {patient.cardOnFile && <> on card ending in <strong>{patient.cardOnFile.last4}</strong></>}.&rdquo;
                  </p>
                </div>
              </div>
              <div className="flex justify-between">
                <button onClick={() => setStep(2)} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Back</button>
                <button
                  onClick={onComplete}
                  className="px-5 py-2.5 bg-success text-white rounded-lg text-sm font-semibold hover:bg-success/90 transition-colors"
                >
                  Place Order
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "auto" && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground mb-3">Toggle auto-refill for active prescriptions.</p>
          {activeRx.map((rx) => {
            const isOn = autoRefillChanges[rx.rxNumber] ?? rx.autoRefill;
            return (
              <div key={rx.rxNumber} className="flex items-center justify-between bg-card border rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <Pill className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{rx.name} {rx.dosage}</p>
                    <p className="text-xs text-muted-foreground">{rx.rxNumber} &middot; {rx.supply}-day supply</p>
                  </div>
                </div>
                <button onClick={() => toggleAutoRefill(rx.rxNumber)} className="flex items-center gap-2">
                  {isOn ? (
                    <ToggleRight className="w-8 h-8 text-success" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-muted-foreground" />
                  )}
                  <span className={`text-xs font-medium ${isOn ? "text-success" : "text-muted-foreground"}`}>
                    {isOn ? "ON" : "OFF"}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {tab === "transfer" && (
        <div className="bg-card border rounded-xl p-6 space-y-4 max-w-lg">
          <h3 className="font-semibold text-sm">Transfer Prescription In</h3>
          <p className="text-sm text-muted-foreground">Enter the details of the prescription to transfer from another pharmacy.</p>
          <div className="space-y-3">
            <label className="block">
              <span className="text-xs font-medium text-muted-foreground">Medication Name</span>
              <input className="mt-1 w-full px-3 py-2 bg-muted/50 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="e.g. Lisinopril 10mg" />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-muted-foreground">Transferring Pharmacy Name</span>
              <input className="mt-1 w-full px-3 py-2 bg-muted/50 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="e.g. Walgreens" />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-muted-foreground">Pharmacy Phone / Fax</span>
              <input className="mt-1 w-full px-3 py-2 bg-muted/50 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="(555) 555-0100" />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-muted-foreground">Rx Number (if known)</span>
              <input className="mt-1 w-full px-3 py-2 bg-muted/50 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Optional" />
            </label>
          </div>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            Initiate Transfer
          </button>
        </div>
      )}

      {tab === "new" && (
        <div className="bg-card border rounded-xl p-6 space-y-4 max-w-lg">
          <h3 className="font-semibold text-sm">New Prescription — First Fill</h3>
          <p className="text-sm text-muted-foreground">The prescriber will need to send the Rx to CenterWell. Enter details to fax a request.</p>
          <div className="space-y-3">
            <label className="block">
              <span className="text-xs font-medium text-muted-foreground">Medication Name</span>
              <input className="mt-1 w-full px-3 py-2 bg-muted/50 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="e.g. Metformin 500mg" />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-muted-foreground">Prescriber Name</span>
              <input className="mt-1 w-full px-3 py-2 bg-muted/50 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Dr. Jane Smith" />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-muted-foreground">Prescriber Fax</span>
              <input className="mt-1 w-full px-3 py-2 bg-muted/50 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="(555) 555-0200" />
            </label>
          </div>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            Send Fax Request
          </button>
        </div>
      )}
    </div>
  );
}

function RxCard({ rx, selected, onToggle }: { rx: Prescription; selected: boolean; onToggle: () => void }) {
  const canRefill = rx.refillsRemaining > 0;

  return (
    <button
      onClick={canRefill ? onToggle : undefined}
      disabled={!canRefill}
      className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left ${
        !canRefill
          ? "bg-muted/30 border-border opacity-60 cursor-not-allowed"
          : selected
          ? "bg-accent border-primary/30 shadow-sm"
          : "bg-card border-border hover:border-primary/20 hover:shadow-sm"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
          selected ? "bg-primary border-primary" : "border-muted-foreground/30"
        }`}>
          {selected && <Check className="w-3 h-3 text-white" />}
        </div>
        <Pill className="w-4 h-4 text-primary" />
        <div>
          <p className="text-sm font-medium">{rx.name} {rx.dosage}</p>
          <p className="text-xs text-muted-foreground">{rx.rxNumber} &middot; {rx.prescriber}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium">{rx.supply}-day</p>
        <p className="text-xs text-muted-foreground">
          {canRefill ? `${rx.refillsRemaining} refills left` : "No refills"}
        </p>
        <p className="text-xs font-medium mt-0.5">
          {rx.copay === 0 ? <span className="text-success">$0.00</span> : `$${rx.copay.toFixed(2)}`}
        </p>
      </div>
    </button>
  );
}
