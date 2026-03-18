export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dob: string;
  phone: string;
  memberId: string;
  plan: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  otcBalance: number;
  otcTotal: number;
  cardOnFile: { last4: string; expiry: string; brand: string } | null;
  prescriptions: Prescription[];
  orders: Order[];
  autoRefills: string[];
  communicationPrefs: { email: boolean; sms: boolean; mail: boolean };
}

export interface Prescription {
  rxNumber: string;
  name: string;
  dosage: string;
  supply: number;
  prescriber: string;
  prescriberFax: string;
  copay: number;
  lastFilled: string;
  refillsRemaining: number;
  autoRefill: boolean;
  status: "active" | "inactive" | "pending_transfer";
}

export interface Order {
  orderNumber: string;
  date: string;
  items: string[];
  status: "processing" | "shipped" | "in_transit" | "delivered" | "cancelled";
  tracking: string;
  estimatedDelivery: string;
  total: number;
}

export interface OTCProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  available: boolean;
}

export interface TranscriptEntry {
  id: number;
  speaker: "agent" | "caller";
  text: string;
  timestamp: string;
  entities?: { type: string; value: string }[];
}

export const mockPatient: Patient = {
  id: "CW-8834721",
  firstName: "Stephen",
  lastName: "Weinrib",
  dob: "03/15/1948",
  phone: "(941) 555-0173",
  memberId: "H1234567890",
  plan: "Humana Gold Plus",
  shippingAddress: {
    street: "42 Brigadoon Way",
    city: "Sarasota",
    state: "FL",
    zip: "34243",
  },
  otcBalance: 42.0,
  otcTotal: 100.0,
  cardOnFile: { last4: "4521", expiry: "10/26", brand: "Visa" },
  prescriptions: [
    {
      rxNumber: "RX-7742891",
      name: "Atorvastatin",
      dosage: "20mg",
      supply: 90,
      prescriber: "Dr. Edward Fine",
      prescriberFax: "(941) 555-0200",
      copay: 0,
      lastFilled: "2025-12-18",
      refillsRemaining: 3,
      autoRefill: true,
      status: "active",
    },
    {
      rxNumber: "RX-7742892",
      name: "Duloxetine",
      dosage: "30mg",
      supply: 90,
      prescriber: "Iliam Clavello, PA",
      prescriberFax: "(941) 555-0201",
      copay: 5.0,
      lastFilled: "2025-12-18",
      refillsRemaining: 2,
      autoRefill: false,
      status: "active",
    },
    {
      rxNumber: "RX-7742893",
      name: "Losartan",
      dosage: "50mg",
      supply: 90,
      prescriber: "Dr. Paul Lawrence",
      prescriberFax: "(941) 555-0202",
      copay: 0,
      lastFilled: "2025-11-01",
      refillsRemaining: 5,
      autoRefill: false,
      status: "active",
    },
    {
      rxNumber: "RX-7742894",
      name: "Rosuvastatin",
      dosage: "10mg",
      supply: 30,
      prescriber: "Dr. Paul Lawrence",
      prescriberFax: "(941) 555-0202",
      copay: 3.5,
      lastFilled: "2026-01-15",
      refillsRemaining: 0,
      autoRefill: false,
      status: "active",
    },
  ],
  orders: [
    {
      orderNumber: "ORD-928374651",
      date: "2026-03-15",
      items: ["Atorvastatin 20mg (90-day)", "Duloxetine 30mg (90-day)"],
      status: "in_transit",
      tracking: "1Z999AA10123456784",
      estimatedDelivery: "2026-03-20",
      total: 5.0,
    },
    {
      orderNumber: "ORD-928374502",
      date: "2026-02-28",
      items: ["Rosuvastatin 10mg (30-day)"],
      status: "delivered",
      tracking: "1Z999AA10123456700",
      estimatedDelivery: "2026-03-05",
      total: 3.5,
    },
  ],
  autoRefills: ["RX-7742891"],
  communicationPrefs: { email: true, sms: true, mail: false },
};

export const otcProducts: OTCProduct[] = [
  { id: "OTC-001", name: "Acetaminophen 500mg (100ct)", category: "Pain Relief", price: 8.99, available: true },
  { id: "OTC-002", name: "Ibuprofen 200mg (50ct)", category: "Pain Relief", price: 6.49, available: true },
  { id: "OTC-003", name: "Vitamin D3 2000IU (120ct)", category: "Vitamins", price: 12.99, available: true },
  { id: "OTC-004", name: "Fish Oil 1000mg (90ct)", category: "Vitamins", price: 14.99, available: true },
  { id: "OTC-005", name: "Multivitamin Senior (60ct)", category: "Vitamins", price: 11.49, available: true },
  { id: "OTC-006", name: "Hydrocortisone Cream 1% (1oz)", category: "First Aid", price: 5.99, available: true },
  { id: "OTC-007", name: "Digital Thermometer", category: "Health Devices", price: 9.99, available: true },
  { id: "OTC-008", name: "Blood Pressure Monitor", category: "Health Devices", price: 34.99, available: true },
  { id: "OTC-009", name: "Cetirizine 10mg (30ct)", category: "Allergy", price: 7.49, available: true },
  { id: "OTC-010", name: "Calcium + D3 600mg (60ct)", category: "Vitamins", price: 9.99, available: false },
];

export const mockTranscript: TranscriptEntry[] = [
  { id: 0, speaker: "agent", text: "Thank you for calling CenterWell Pharmacy. My name is Katie. How can I help?", timestamp: "0:00" },
  { id: 1, speaker: "caller", text: "Yes, I want to renew two prescriptions that I have been using all along.", timestamp: "0:05", entities: [{ type: "intent", value: "refill" }] },
  { id: 2, speaker: "agent", text: "Alright, may I have your full name?", timestamp: "0:12" },
  { id: 3, speaker: "caller", text: "Stephen Weinrib. S-T-E-P-H-E-N W-E-I-N-R-I-B.", timestamp: "0:18", entities: [{ type: "name", value: "Stephen Weinrib" }] },
  { id: 4, speaker: "agent", text: "Thank you. And your date of birth?", timestamp: "0:28" },
  { id: 5, speaker: "caller", text: "March 15, 1948.", timestamp: "0:32", entities: [{ type: "dob", value: "03/15/1948" }] },
  { id: 6, speaker: "agent", text: "And your shipping address?", timestamp: "0:36" },
  { id: 7, speaker: "caller", text: "42 Brigadoon Way, Sarasota, Florida 34243.", timestamp: "0:42", entities: [{ type: "address", value: "42 Brigadoon Way, Sarasota, FL 34243" }] },
  { id: 8, speaker: "caller", text: "One is atorvastatin 20mg, prescription number RX-7742891.", timestamp: "1:05", entities: [{ type: "medication", value: "Atorvastatin 20mg" }, { type: "rx_number", value: "RX-7742891" }] },
  { id: 9, speaker: "caller", text: "The second one is Duloxetine 30mg. Prescription number RX-7742892.", timestamp: "1:18", entities: [{ type: "medication", value: "Duloxetine 30mg" }, { type: "rx_number", value: "RX-7742892" }] },
];
