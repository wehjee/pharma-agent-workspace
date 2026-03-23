"use client";

import {
  ArrowLeft,
  Phone,
  Printer,
  MapPin,
  Building2,
  Stethoscope,
  Hash,
  Calendar,
  Pill,
  Send,
  Copy,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";
import type { Prescriber, Prescription } from "@/data/mock";

interface Props {
  prescriber: Prescriber;
  relatedRx: Prescription[];
  onBack: () => void;
}

export function PrescriberDetail({ prescriber, relatedRx, onBack }: Props) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const CopyButton = ({ text, field }: { text: string; field: string }) => (
    <button
      onClick={() => copyToClipboard(text, field)}
      className="ml-2 p-1 rounded hover:bg-muted transition-colors"
      title="Copy to clipboard"
    >
      {copiedField === field ? (
        <CheckCircle2 className="w-3 h-3 text-success" />
      ) : (
        <Copy className="w-3 h-3 text-muted-foreground" />
      )}
    </button>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to workflow
      </button>

      {/* Header card */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="bg-primary/5 px-6 py-5 flex items-start gap-4">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Stethoscope className="w-7 h-7 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-semibold tracking-tight">{prescriber.name}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{prescriber.title} · {prescriber.specialty}</p>
            <div className="flex items-center gap-1.5 mt-2">
              <Hash className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs font-mono text-muted-foreground">NPI: {prescriber.npi}</span>
              <CopyButton text={prescriber.npi} field="npi" />
            </div>
          </div>
        </div>
      </div>

      {/* Contact & practice */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card border rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <Building2 className="w-4 h-4 text-muted-foreground" />
            Practice
          </h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium">{prescriber.practice}</p>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-muted-foreground mt-0.5" />
              <p className="text-sm">{prescriber.address}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold">Contact</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-sm">{prescriber.phone}</span>
              </div>
              <CopyButton text={prescriber.phone} field="phone" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Printer className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-sm">{prescriber.fax}</span>
              </div>
              <CopyButton text={prescriber.fax} field="fax" />
            </div>
          </div>
          <button className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            <Send className="w-3.5 h-3.5" />
            Send Fax Request
          </button>
        </div>
      </div>

      {/* Related prescriptions */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <Pill className="w-4 h-4 text-muted-foreground" />
            Prescriptions from {prescriber.name}
          </h2>
        </div>
        {relatedRx.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Medication</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Rx Number</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Supply</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Last Filled</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Status</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-5 py-3">Refills</th>
              </tr>
            </thead>
            <tbody>
              {relatedRx.map((rx) => (
                <tr key={rx.rxNumber} className="border-b last:border-0">
                  <td className="px-5 py-3">
                    <p className="text-sm font-medium">{rx.name} {rx.dosage}</p>
                  </td>
                  <td className="px-5 py-3 text-sm font-mono text-muted-foreground">{rx.rxNumber}</td>
                  <td className="px-5 py-3 text-sm">{rx.supply}-day</td>
                  <td className="px-5 py-3 text-sm flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 text-muted-foreground" />
                    {rx.lastFilled}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium ${
                      rx.status === "active"
                        ? "bg-success-bg text-success"
                        : rx.status === "pending_transfer"
                        ? "bg-warning-bg text-warning"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {rx.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-right">{rx.refillsRemaining}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="px-5 py-8 text-center text-sm text-muted-foreground">
            No prescriptions found for this prescriber.
          </div>
        )}
      </div>
    </div>
  );
}
