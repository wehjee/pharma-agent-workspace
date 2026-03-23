"use client";

import { useState, useEffect } from "react";
import {
  Phone,
  Printer,
  Building2,
  Stethoscope,
  Hash,
  Calendar,
  Pill,
  ExternalLink,
  X,
  Copy,
  CheckCircle2,
  Send,
} from "lucide-react";
import { prescribersDB, type Prescriber } from "@/data/mock";

interface Props {
  prescriberId: string;
  prescriberName: string;
  onViewDetails: (prescriber: Prescriber) => void;
}

export function PrescriberHoverCard({ prescriberId, prescriberName, onViewDetails }: Props) {
  const [open, setOpen] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const prescriber = prescribersDB[prescriberId];

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  };

  if (!prescriber) {
    return <span className="text-sm">{prescriberName}</span>;
  }

  return (
    <>
      <span
        role="link"
        tabIndex={0}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            e.stopPropagation();
            setOpen(true);
          }
        }}
        className="text-sm text-primary font-medium hover:underline underline-offset-2 decoration-primary/40 cursor-pointer transition-colors"
      >
        {prescriberName}
      </span>

      {/* Modal backdrop + dialog */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(false);
          }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Modal */}
          <div
            className="relative w-full max-w-md bg-card border rounded-2xl shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex items-start gap-4 px-6 pt-6 pb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Stethoscope className="w-6 h-6 text-primary" />
              </div>
              <div className="min-w-0 pr-8">
                <p className="text-base font-semibold">{prescriber.name}</p>
                <p className="text-sm text-muted-foreground">{prescriber.title} · {prescriber.specialty}</p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <Hash className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs font-mono text-muted-foreground">NPI: {prescriber.npi}</span>
                  <button
                    onClick={() => copyToClipboard(prescriber.npi, "npi")}
                    className="p-0.5 rounded hover:bg-muted transition-colors"
                  >
                    {copiedField === "npi" ? (
                      <CheckCircle2 className="w-3 h-3 text-success" />
                    ) : (
                      <Copy className="w-3 h-3 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Practice */}
            <div className="px-6 py-4 border-t space-y-3">
              <div className="flex items-start gap-2.5">
                <Building2 className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">{prescriber.practice}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{prescriber.address}</p>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="px-6 py-4 border-t space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{prescriber.phone}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(prescriber.phone, "phone")}
                  className="p-1 rounded hover:bg-muted transition-colors"
                >
                  {copiedField === "phone" ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                  )}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Printer className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{prescriber.fax}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(prescriber.fax, "fax")}
                  className="p-1 rounded hover:bg-muted transition-colors"
                >
                  {copiedField === "fax" ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="px-6 py-3 border-t flex items-center gap-6">
              <div className="flex items-center gap-1.5">
                <Pill className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{prescriber.rxCount} active Rx</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Last Rx: {prescriber.lastRxDate}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 border-t flex gap-3">
              <button
                onClick={() => {
                  setOpen(false);
                  onViewDetails(prescriber);
                }}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                View Full Details
              </button>
              <button
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                Send Fax Request
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
