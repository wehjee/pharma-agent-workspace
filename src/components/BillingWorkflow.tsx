"use client";

import { useState } from "react";
import type { Patient } from "@/data/mock";
import { CreditCard, DollarSign, FileText, Plus } from "lucide-react";

type Tab = "payment" | "balance" | "copay";

interface Props {
  patient: Patient;
}

export function BillingWorkflow({ patient }: Props) {
  const [tab, setTab] = useState<Tab>("payment");
  const [showAddCard, setShowAddCard] = useState(false);

  const tabs = [
    { id: "payment" as const, label: "Payment Method", icon: CreditCard },
    { id: "balance" as const, label: "Balance Owed", icon: DollarSign },
    { id: "copay" as const, label: "Copay Summary", icon: FileText },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
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

      {tab === "payment" && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">Cards on File</h3>
          {patient.cardOnFile ? (
            <div className="bg-card border rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-8 bg-gradient-to-br from-primary/20 to-primary/5 rounded-md flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{patient.cardOnFile.brand} ****{patient.cardOnFile.last4}</p>
                  <p className="text-xs text-muted-foreground">Expires {patient.cardOnFile.expiry}</p>
                </div>
              </div>
              <span className="text-xs bg-success-bg text-success px-2 py-0.5 rounded-full font-medium">Primary</span>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No card on file.</p>
          )}

          {showAddCard ? (
            <div className="bg-card border rounded-xl p-4 space-y-3">
              <h4 className="text-sm font-medium">Add New Card</h4>
              <div className="grid grid-cols-2 gap-3">
                <label className="block col-span-2">
                  <span className="text-xs font-medium text-muted-foreground">Card Number</span>
                  <input className="mt-1 w-full px-3 py-2 bg-muted/50 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="**** **** **** ****" />
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-muted-foreground">Expiry</span>
                  <input className="mt-1 w-full px-3 py-2 bg-muted/50 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="MM/YY" />
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-muted-foreground">Name on Card</span>
                  <input className="mt-1 w-full px-3 py-2 bg-muted/50 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Stephen Weinrib" />
                </label>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">Save Card</button>
                <button onClick={() => setShowAddCard(false)} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Cancel</button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAddCard(true)}
              className="flex items-center gap-2 px-3 py-2 border border-dashed rounded-lg text-sm text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add New Card
            </button>
          )}
        </div>
      )}

      {tab === "balance" && (
        <div className="space-y-4">
          <div className="bg-card border rounded-xl p-6 text-center">
            <p className="text-sm text-muted-foreground">Current Balance Owed</p>
            <p className="text-3xl font-bold text-foreground mt-1">$0.00</p>
            <p className="text-xs text-success mt-1">No outstanding balance</p>
          </div>
          <div className="bg-card border rounded-xl p-4">
            <h4 className="text-sm font-medium mb-3">Recent Payments</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Payment — Visa ****4521</span>
                <span>-$5.00 &middot; Mar 15</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Payment — Visa ****4521</span>
                <span>-$3.50 &middot; Feb 28</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "copay" && (
        <div className="bg-card border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Medication</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Supply</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Copay</th>
              </tr>
            </thead>
            <tbody>
              {patient.prescriptions.filter(p => p.status === "active").map((rx) => (
                <tr key={rx.rxNumber} className="border-b last:border-0">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium">{rx.name} {rx.dosage}</p>
                    <p className="text-xs text-muted-foreground">{rx.rxNumber}</p>
                  </td>
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
      )}
    </div>
  );
}
