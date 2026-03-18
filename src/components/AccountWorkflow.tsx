"use client";

import { useState } from "react";
import type { Patient } from "@/data/mock";
import { MapPin, Phone, Mail, MessageSquare, Save } from "lucide-react";

interface Props {
  patient: Patient;
}

export function AccountWorkflow({ patient }: Props) {
  const [address, setAddress] = useState(patient.shippingAddress);
  const [phone, setPhone] = useState(patient.phone);
  const [prefs, setPrefs] = useState(patient.communicationPrefs);
  const [saved, setSaved] = useState<string | null>(null);

  const handleSave = (section: string) => {
    setSaved(section);
    setTimeout(() => setSaved(null), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Account Management</h2>
        <p className="text-sm text-muted-foreground">Update profile, address, phone, and communication preferences.</p>
      </div>

      <div className="bg-card border rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold">Shipping Address</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <label className="block col-span-2">
            <span className="text-xs font-medium text-muted-foreground">Street</span>
            <input
              value={address.street}
              onChange={(e) => setAddress({ ...address, street: e.target.value })}
              className="mt-1 w-full px-3 py-2 bg-muted/50 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-muted-foreground">City</span>
            <input
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
              className="mt-1 w-full px-3 py-2 bg-muted/50 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs font-medium text-muted-foreground">State</span>
              <input
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value })}
                className="mt-1 w-full px-3 py-2 bg-muted/50 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-muted-foreground">ZIP</span>
              <input
                value={address.zip}
                onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                className="mt-1 w-full px-3 py-2 bg-muted/50 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </label>
          </div>
        </div>
        <button
          onClick={() => handleSave("address")}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Save className="w-3.5 h-3.5" />
          {saved === "address" ? "Saved!" : "Update Address"}
        </button>
      </div>

      <div className="bg-card border rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold">Phone Number</h3>
        </div>
        <label className="block">
          <span className="text-xs font-medium text-muted-foreground">Cell Phone</span>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 w-full px-3 py-2 bg-muted/50 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 max-w-xs"
          />
        </label>
        <button
          onClick={() => handleSave("phone")}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Save className="w-3.5 h-3.5" />
          {saved === "phone" ? "Saved!" : "Update Phone"}
        </button>
      </div>

      <div className="bg-card border rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold">Communication Preferences</h3>
        </div>
        <div className="space-y-3">
          {(
            [
              { key: "email" as const, label: "Email notifications", icon: Mail },
              { key: "sms" as const, label: "SMS / Text messages", icon: MessageSquare },
              { key: "mail" as const, label: "Physical mail", icon: MapPin },
            ] as const
          ).map(({ key, label, icon: Icon }) => (
            <label key={key} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer">
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{label}</span>
              </div>
              <input
                type="checkbox"
                checked={prefs[key]}
                onChange={() => setPrefs({ ...prefs, [key]: !prefs[key] })}
                className="w-4 h-4 rounded text-primary accent-primary"
              />
            </label>
          ))}
        </div>
        <button
          onClick={() => handleSave("prefs")}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Save className="w-3.5 h-3.5" />
          {saved === "prefs" ? "Saved!" : "Save Preferences"}
        </button>
      </div>
    </div>
  );
}
