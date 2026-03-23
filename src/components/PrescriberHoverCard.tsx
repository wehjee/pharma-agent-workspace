"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Phone,
  Printer,
  MapPin,
  Building2,
  Stethoscope,
  Hash,
  Calendar,
  Pill,
  ExternalLink,
} from "lucide-react";
import { prescribersDB, type Prescriber } from "@/data/mock";

interface Props {
  prescriberId: string;
  prescriberName: string;
  onViewDetails: (prescriber: Prescriber) => void;
}

export function PrescriberHoverCard({ prescriberId, prescriberName, onViewDetails }: Props) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<"below" | "above">("below");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const prescriber = prescribersDB[prescriberId];

  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    // Calculate position
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setPosition(spaceBelow < 320 ? "above" : "below");
    }
    setOpen(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => setOpen(false), 200);
  }, []);

  // Keep card open when hovering the card itself
  const handleCardEnter = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (!prescriber) {
    return <span className="text-sm">{prescriberName}</span>;
  }

  return (
    <span className="relative inline-block">
      <span
        ref={triggerRef}
        role="link"
        tabIndex={0}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onViewDetails(prescriber);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            e.stopPropagation();
            onViewDetails(prescriber);
          }
        }}
        className="text-sm text-primary font-medium hover:underline underline-offset-2 decoration-primary/40 cursor-pointer transition-colors"
      >
        {prescriberName}
      </span>

      {open && (
        <div
          ref={cardRef}
          onMouseEnter={handleCardEnter}
          onMouseLeave={handleMouseLeave}
          className={`absolute left-0 z-50 w-80 bg-card border rounded-xl shadow-lg animate-in fade-in-0 zoom-in-95 duration-150 ${
            position === "below" ? "top-full mt-2" : "bottom-full mb-2"
          }`}
        >
          {/* Header */}
          <div className="flex items-start gap-3 px-4 pt-4 pb-3 border-b">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Stethoscope className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{prescriber.name}</p>
              <p className="text-xs text-muted-foreground">{prescriber.specialty}</p>
              <p className="text-xs text-muted-foreground">{prescriber.title}</p>
            </div>
          </div>

          {/* Details */}
          <div className="px-4 py-3 space-y-2.5">
            <div className="flex items-start gap-2.5">
              <Building2 className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-medium">{prescriber.practice}</p>
                <p className="text-[11px] text-muted-foreground">{prescriber.address}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs">{prescriber.phone}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Printer className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs">{prescriber.fax}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs">NPI: {prescriber.npi}</span>
            </div>

            <div className="flex items-center gap-4 pt-1 border-t">
              <div className="flex items-center gap-1.5">
                <Pill className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs">{prescriber.rxCount} active Rx</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs">Last Rx: {prescriber.lastRxDate}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t">
            <span
              role="link"
              tabIndex={0}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setOpen(false);
                onViewDetails(prescriber);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpen(false);
                  onViewDetails(prescriber);
                }
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-primary/5 hover:bg-primary/10 text-primary text-xs font-medium rounded-lg transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View Full Details
            </span>
          </div>
        </div>
      )}
    </span>
  );
}
