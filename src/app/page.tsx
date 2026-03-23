"use client";

import { useState, useCallback } from "react";
import { IncomingCall } from "@/components/IncomingCall";
import { VerificationGate } from "@/components/VerificationGate";
import { PatientBanner } from "@/components/PatientBanner";
import { IntentPanel } from "@/components/IntentPanel";
import { RefillWorkflow } from "@/components/RefillWorkflow";
import { OTCWorkflow } from "@/components/OTCWorkflow";
import { OrderManagement } from "@/components/OrderManagement";
import { BillingWorkflow } from "@/components/BillingWorkflow";
import { AccountWorkflow } from "@/components/AccountWorkflow";
import { TranscriptSidebar } from "@/components/TranscriptSidebar";
import { WrapUp } from "@/components/WrapUp";
import { QuickActions } from "@/components/QuickActions";
import { TopBar } from "@/components/TopBar";
import { mockIVRContext, mockPatientDB, type Patient } from "@/data/mock";
import {
  Pill,
  ShoppingBag,
  Truck,
  CreditCard,
  UserCog,
} from "lucide-react";

export type CallPhase = "incoming" | "verification" | "active";
export type WorkflowId = "home" | "refill" | "otc" | "orders" | "billing" | "account" | "wrapup";

const WORKFLOWS = [
  { id: "refill" as const, label: "Refill & Rx", icon: Pill, description: "Refill, auto-refill, transfer, new Rx" },
  { id: "otc" as const, label: "OTC & Wellness", icon: ShoppingBag, description: "Product search, balance, catalog" },
  { id: "orders" as const, label: "Orders & Delivery", icon: Truck, description: "Track, ETA, expedite, cancel" },
  { id: "billing" as const, label: "Billing & Payments", icon: CreditCard, description: "Payment, balance, copay, plan" },
  { id: "account" as const, label: "Account", icon: UserCog, description: "Profile, address, preferences" },
];

export default function Home() {
  // Call phase: incoming → verification → active
  const [callPhase, setCallPhase] = useState<CallPhase>("incoming");
  const [patient, setPatient] = useState<Patient | null>(null);

  const [activeWorkflow, setActiveWorkflow] = useState<WorkflowId>("home");
  const [verified, setVerified] = useState({ name: false, dob: false, address: false });
  const [showTranscript, setShowTranscript] = useState(true);
  const [callActive, setCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  const handleAcceptCall = useCallback(() => {
    setCallPhase("verification");
    setCallActive(true);
  }, []);

  const handleVerified = useCallback((verifiedPatient: Patient) => {
    setPatient(verifiedPatient);
    setVerified({ name: true, dob: true, address: true });
    setCallPhase("active");
  }, []);

  const handleVerify = useCallback((field: "name" | "dob" | "address") => {
    setVerified((prev) => ({ ...prev, [field]: true }));
  }, []);

  const allVerified = verified.name && verified.dob && verified.address;

  const renderWorkflow = () => {
    if (!patient) return null;
    switch (activeWorkflow) {
      case "refill":
        return <RefillWorkflow patient={patient} onComplete={() => setActiveWorkflow("wrapup")} />;
      case "otc":
        return <OTCWorkflow patient={patient} />;
      case "orders":
        return <OrderManagement patient={patient} />;
      case "billing":
        return <BillingWorkflow patient={patient} />;
      case "account":
        return <AccountWorkflow patient={patient} />;
      case "wrapup":
        return <WrapUp patient={patient} onNewIntent={() => setActiveWorkflow("home")} />;
      default:
        return (
          <IntentPanel
            workflows={WORKFLOWS}
            onSelect={(id) => setActiveWorkflow(id as WorkflowId)}
            patient={patient}
          />
        );
    }
  };

  // ─── Incoming call screen ───
  if (callPhase === "incoming") {
    return (
      <div className="flex flex-col h-screen overflow-hidden">
        <TopBar
          callActive={false}
          callDuration={0}
          setCallDuration={() => {}}
          onEndCall={() => {}}
          onToggleTranscript={() => setShowTranscript(!showTranscript)}
          showTranscript={showTranscript}
        />
        <IncomingCall
          ivrContext={mockIVRContext}
          onAccept={handleAcceptCall}
          onTransfer={() => {}}
        />
      </div>
    );
  }

  // ─── Verification gate ───
  if (callPhase === "verification") {
    return (
      <div className="flex flex-col h-screen overflow-hidden">
        <TopBar
          callActive={callActive}
          callDuration={callDuration}
          setCallDuration={setCallDuration}
          onEndCall={() => {
            setCallActive(false);
            setCallPhase("incoming");
          }}
          onToggleTranscript={() => setShowTranscript(!showTranscript)}
          showTranscript={showTranscript}
        />
        <div className="flex flex-1 overflow-hidden">
          <VerificationGate
            patients={mockPatientDB}
            ivrContext={mockIVRContext}
            onVerified={handleVerified}
          />
          {showTranscript && <TranscriptSidebar callActive={callActive} />}
        </div>
      </div>
    );
  }

  // ─── Active call — full dashboard ───
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopBar
        callActive={callActive}
        callDuration={callDuration}
        setCallDuration={setCallDuration}
        onEndCall={() => {
          setCallActive(false);
          setActiveWorkflow("wrapup");
        }}
        onToggleTranscript={() => setShowTranscript(!showTranscript)}
        showTranscript={showTranscript}
      />

      {patient && (
        <PatientBanner
          patient={patient}
          verified={verified}
          onVerify={handleVerify}
          allVerified={allVerified}
        />
      )}

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-col flex-1 overflow-hidden">
          {activeWorkflow !== "home" && activeWorkflow !== "wrapup" && (
            <div className="flex items-center gap-1 px-6 pt-4 pb-0">
              <button
                onClick={() => setActiveWorkflow("home")}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Home
              </button>
              <span className="text-sm text-muted-foreground">/</span>
              <span className="text-sm font-medium">
                {WORKFLOWS.find((w) => w.id === activeWorkflow)?.label ?? "Wrap Up"}
              </span>
            </div>
          )}

          <main className="flex-1 overflow-y-auto p-6">
            {renderWorkflow()}
          </main>

          <QuickActions
            onNavigate={(id) => setActiveWorkflow(id)}
            patient={patient!}
          />
        </div>

        {showTranscript && (
          <TranscriptSidebar callActive={callActive} />
        )}
      </div>
    </div>
  );
}
