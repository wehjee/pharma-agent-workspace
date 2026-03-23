"use client";

import { useState, useCallback, useMemo } from "react";
import {
  Shield,
  User,
  Calendar,
  MapPin,
  CheckCircle2,
  Search,
  AlertCircle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { Patient } from "@/data/mock";
import type { IVRContext } from "./IncomingCall";

interface Props {
  patients: Patient[];
  ivrContext: IVRContext;
  onVerified: (patient: Patient) => void;
}

type VerificationStep = "search" | "confirm";

interface FieldState {
  value: string;
  verified: boolean;
  error: boolean;
}

export function VerificationGate({ patients, ivrContext, onVerified }: Props) {
  const [step, setStep] = useState<VerificationStep>("search");
  const [matchedPatient, setMatchedPatient] = useState<Patient | null>(null);
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [showManualLookup, setShowManualLookup] = useState(false);
  const [manualMemberId, setManualMemberId] = useState("");

  const [fields, setFields] = useState<Record<string, FieldState>>({
    name: { value: "", verified: false, error: false },
    dob: { value: "", verified: false, error: false },
    address: { value: "", verified: false, error: false },
  });

  const allVerified = fields.name.verified && fields.dob.verified && fields.address.verified;

  const updateField = useCallback((field: string, value: string) => {
    setFields((prev) => ({
      ...prev,
      [field]: { ...prev[field], value, verified: false, error: false },
    }));
  }, []);

  // Search as agent types the caller's name
  const handleNameSearch = useCallback(
    (value: string) => {
      updateField("name", value);
      if (value.length < 2) {
        setSearchResults([]);
        return;
      }
      const query = value.toLowerCase();
      const results = patients.filter(
        (p) =>
          `${p.firstName} ${p.lastName}`.toLowerCase().includes(query) ||
          p.lastName.toLowerCase().includes(query) ||
          p.firstName.toLowerCase().includes(query)
      );
      setSearchResults(results);
    },
    [patients, updateField]
  );

  // Select a match from results
  const selectPatient = useCallback((patient: Patient) => {
    setMatchedPatient(patient);
    setSearchResults([]);
    setStep("confirm");
    setFields({
      name: { value: `${patient.firstName} ${patient.lastName}`, verified: false, error: false },
      dob: { value: "", verified: false, error: false },
      address: { value: "", verified: false, error: false },
    });
  }, []);

  // Manual member ID lookup
  const handleManualLookup = useCallback(() => {
    const found = patients.find((p) => p.memberId.toLowerCase() === manualMemberId.trim().toLowerCase());
    if (found) {
      selectPatient(found);
      setShowManualLookup(false);
    }
  }, [patients, manualMemberId, selectPatient]);

  // Verify a field against the matched patient's data
  const verifyField = useCallback(
    (field: string) => {
      if (!matchedPatient) return;
      const value = fields[field].value.trim().toLowerCase();
      let matches = false;

      switch (field) {
        case "name":
          matches =
            value === `${matchedPatient.firstName} ${matchedPatient.lastName}`.toLowerCase() ||
            value === matchedPatient.lastName.toLowerCase();
          break;
        case "dob": {
          const normalized = value.replace(/[/\-.\s]/g, "");
          const patientDob = matchedPatient.dob.replace(/[/\-.\s]/g, "");
          matches = normalized === patientDob;
          // Also try common formats
          if (!matches) {
            const parts = matchedPatient.dob.split("/");
            if (parts.length === 3) {
              const alt1 = `${parts[0]}${parts[1]}${parts[2]}`; // MMDDYYYY
              const alt2 = `${parseInt(parts[0])}/${parseInt(parts[1])}/${parts[2]}`; // M/D/YYYY
              matches = normalized === alt1 || value === alt2.toLowerCase();
            }
          }
          break;
        }
        case "address": {
          const patientAddr = `${matchedPatient.shippingAddress.street}, ${matchedPatient.shippingAddress.city}, ${matchedPatient.shippingAddress.state} ${matchedPatient.shippingAddress.zip}`.toLowerCase();
          // Partial match — street at minimum
          matches =
            value === patientAddr ||
            patientAddr.includes(value) ||
            value.includes(matchedPatient.shippingAddress.street.toLowerCase());
          break;
        }
      }

      setFields((prev) => ({
        ...prev,
        [field]: { ...prev[field], verified: matches, error: !matches },
      }));
    },
    [matchedPatient, fields]
  );

  // Auto-populate name when caller ID matched
  const callerIdHint = useMemo(() => {
    if (!ivrContext.callerIdMatch) return null;
    return patients.find((p) => p.memberId === ivrContext.callerIdMatch!.memberId);
  }, [ivrContext.callerIdMatch, patients]);

  const fieldMeta = [
    { key: "name", label: "Full Name", icon: User, placeholder: "Type caller's name...", autoFocus: true },
    { key: "dob", label: "Date of Birth", icon: Calendar, placeholder: "MM/DD/YYYY" },
    {
      key: "address",
      label: "Shipping Address",
      icon: MapPin,
      placeholder: "Street address, city, state zip",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 py-8">
      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Verify Member Identity</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              All three fields must be verified before proceeding
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2">
          {["name", "dob", "address"].map((key, i) => (
            <div key={key} className="flex-1 flex items-center gap-2">
              <div
                className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                  fields[key].verified
                    ? "bg-success"
                    : fields[key].error
                    ? "bg-destructive"
                    : step === "confirm" && i === ["name", "dob", "address"].indexOf(
                        Object.keys(fields).find((k) => !fields[k].verified && !fields[k].error) ?? "name"
                      )
                    ? "bg-primary/40"
                    : "bg-muted"
                }`}
              />
            </div>
          ))}
        </div>

        {/* Verification card */}
        <div className="bg-card border rounded-xl overflow-hidden">
          {/* Caller ID hint */}
          {callerIdHint && step === "search" && (
            <button
              onClick={() => selectPatient(callerIdHint)}
              className="w-full flex items-center gap-3 px-5 py-3 bg-info-bg border-b hover:bg-info-bg/70 transition-colors text-left"
            >
              <div className="w-8 h-8 rounded-full bg-info/20 flex items-center justify-center">
                <User className="w-4 h-4 text-info" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {callerIdHint.firstName} {callerIdHint.lastName}
                </p>
                <p className="text-xs text-muted-foreground">Caller ID match — tap to start verification</p>
              </div>
              <ArrowRight className="w-4 h-4 text-info" />
            </button>
          )}

          {/* Search step */}
          {step === "search" && (
            <div className="p-5 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={fields.name.value}
                  onChange={(e) => handleNameSearch(e.target.value)}
                  placeholder="Search by caller's name..."
                  className="w-full pl-10 pr-4 py-3 bg-muted/50 border rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  autoFocus
                />
              </div>

              {/* Search results */}
              {searchResults.length > 0 && (
                <div className="border rounded-lg divide-y max-h-48 overflow-y-auto">
                  {searchResults.slice(0, 4).map((p) => (
                    <button
                      key={p.id}
                      onClick={() => selectPatient(p)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                        {p.firstName[0]}
                        {p.lastName[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">
                          {p.firstName} {p.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {p.memberId} · {p.plan}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              )}

              {fields.name.value.length >= 2 && searchResults.length === 0 && (
                <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">No members found</span>
                </div>
              )}

              {/* Manual lookup toggle */}
              <button
                onClick={() => setShowManualLookup(!showManualLookup)}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {showManualLookup ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                Manual Member ID Lookup
              </button>

              {showManualLookup && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={manualMemberId}
                    onChange={(e) => setManualMemberId(e.target.value)}
                    placeholder="Enter Member ID..."
                    className="flex-1 px-3 py-2 bg-muted/50 border rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <button
                    onClick={handleManualLookup}
                    disabled={!manualMemberId.trim()}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-primary/90 transition-colors"
                  >
                    Lookup
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Confirm step — verify all 3 fields */}
          {step === "confirm" && matchedPatient && (
            <div className="divide-y">
              {/* Match header */}
              <div className="flex items-center gap-3 px-5 py-4 bg-muted/30">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                  {matchedPatient.firstName[0]}
                  {matchedPatient.lastName[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    {matchedPatient.firstName} {matchedPatient.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {matchedPatient.memberId} · {matchedPatient.plan}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setStep("search");
                    setMatchedPatient(null);
                    setFields({
                      name: { value: "", verified: false, error: false },
                      dob: { value: "", verified: false, error: false },
                      address: { value: "", verified: false, error: false },
                    });
                  }}
                  className="ml-auto text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Change
                </button>
              </div>

              {/* Verification fields */}
              {fieldMeta.map(({ key, label, icon: Icon, placeholder }) => {
                const field = fields[key];
                return (
                  <div key={key} className="px-5 py-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 text-sm font-medium">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                        {label}
                      </label>
                      {field.verified && (
                        <span className="flex items-center gap-1 text-xs text-success font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Verified
                        </span>
                      )}
                      {field.error && (
                        <span className="flex items-center gap-1 text-xs text-destructive font-medium">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Mismatch
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={field.value}
                        onChange={(e) => updateField(key, e.target.value)}
                        placeholder={placeholder}
                        disabled={field.verified}
                        className={`flex-1 px-3 py-2.5 border rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-colors ${
                          field.verified
                            ? "bg-success-bg border-success/30 text-success"
                            : field.error
                            ? "bg-destructive/5 border-destructive/30 focus:ring-destructive/20 focus:border-destructive"
                            : "bg-muted/50 focus:ring-primary/20 focus:border-primary"
                        }`}
                        autoFocus={key === "name"}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && field.value.trim()) {
                            verifyField(key);
                          }
                        }}
                      />
                      {!field.verified && (
                        <button
                          onClick={() => verifyField(key)}
                          disabled={!field.value.trim()}
                          className="px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-primary/90 transition-colors whitespace-nowrap"
                        >
                          Verify
                        </button>
                      )}
                    </div>
                    {field.error && (
                      <p className="text-xs text-destructive">
                        Does not match records. Ask the caller to repeat.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Continue button */}
        {step === "confirm" && (
          <button
            onClick={() => matchedPatient && onVerified(matchedPatient)}
            disabled={!allVerified}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all ${
              allVerified
                ? "bg-success text-white hover:bg-success/90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            {allVerified ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Identity Verified — Continue to Workspace
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                Verify all fields to continue
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
