"use client";

import { Check, ShieldCheck, MapPin, Phone, CreditCard, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import type { Patient } from "@/data/mock";

interface Props {
  patient: Patient;
  verified: { name: boolean; dob: boolean; address: boolean };
  onVerify: (field: "name" | "dob" | "address") => void;
  allVerified: boolean;
}

export function PatientBanner({ patient, verified, onVerify, allVerified }: Props) {
  const [expanded, setExpanded] = useState(false);
  const verifiedCount = [verified.name, verified.dob, verified.address].filter(Boolean).length;

  return (
    <div className="bg-card border-b shrink-0">
      <div className="flex items-center justify-between px-6 h-16">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-semibold text-sm">
                {patient.firstName[0]}{patient.lastName[0]}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{patient.firstName} {patient.lastName}</span>
                {allVerified && (
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-success-bg text-success rounded-full text-xs font-medium">
                    <ShieldCheck className="w-3 h-3" />
                    Verified
                  </span>
                )}
              </div>
              <span className="text-sm text-muted-foreground">
                {patient.memberId} &middot; {patient.plan}
              </span>
            </div>
          </div>

          <div className="h-8 w-px bg-border" />

          <div className="flex items-center gap-1">
            {(["name", "dob", "address"] as const).map((field) => (
              <button
                key={field}
                onClick={() => onVerify(field)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                  verified[field]
                    ? "bg-success-bg text-success"
                    : "bg-warning-bg text-warning hover:bg-warning/20 cursor-pointer"
                }`}
              >
                {verified[field] ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <span className="w-3 h-3 rounded-full border-2 border-warning" />
                )}
                {field === "name" ? "Name" : field === "dob" ? "DOB" : "Address"}
              </button>
            ))}
            <span className="text-xs text-muted-foreground ml-1">{verifiedCount}/3</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5 text-sm">
            <div className={`px-3 py-1 rounded-lg font-semibold text-sm ${
              patient.otcBalance > 30 ? "bg-success-bg text-success" :
              patient.otcBalance > 10 ? "bg-warning-bg text-warning" :
              "bg-red-50 text-destructive"
            }`}>
              OTC ${patient.otcBalance.toFixed(2)}
            </div>
            <span className="text-muted-foreground text-xs">/ ${patient.otcTotal.toFixed(2)}</span>
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 rounded hover:bg-muted transition-colors text-muted-foreground"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="px-6 pb-4 grid grid-cols-4 gap-6 border-t pt-4">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">Shipping Address</p>
              <p className="text-sm">{patient.shippingAddress.street}</p>
              <p className="text-sm">{patient.shippingAddress.city}, {patient.shippingAddress.state} {patient.shippingAddress.zip}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Phone className="w-4 h-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">Phone</p>
              <p className="text-sm">{patient.phone}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CreditCard className="w-4 h-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">Card on File</p>
              <p className="text-sm">
                {patient.cardOnFile
                  ? `${patient.cardOnFile.brand} ****${patient.cardOnFile.last4} (${patient.cardOnFile.expiry})`
                  : "None"}
              </p>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">DOB</p>
            <p className="text-sm">{patient.dob}</p>
            <p className="text-xs text-muted-foreground mt-2">Active Prescriptions</p>
            <p className="text-sm font-medium">{patient.prescriptions.filter(p => p.status === "active").length}</p>
          </div>
        </div>
      )}
    </div>
  );
}
