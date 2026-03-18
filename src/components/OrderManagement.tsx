"use client";

import { useState } from "react";
import type { Patient } from "@/data/mock";
import { Package, Truck, CheckCircle2, XCircle, Clock, MapPin, Zap, Ban } from "lucide-react";

interface Props {
  patient: Patient;
}

const statusConfig = {
  processing: { icon: Clock, label: "Processing", color: "text-warning", bg: "bg-warning-bg" },
  shipped: { icon: Package, label: "Shipped", color: "text-info", bg: "bg-info-bg" },
  in_transit: { icon: Truck, label: "In Transit", color: "text-primary", bg: "bg-accent" },
  delivered: { icon: CheckCircle2, label: "Delivered", color: "text-success", bg: "bg-success-bg" },
  cancelled: { icon: XCircle, label: "Cancelled", color: "text-destructive", bg: "bg-red-50" },
};

export function OrderManagement({ patient }: Props) {
  const [expediteConfirm, setExpediteConfirm] = useState<string | null>(null);
  const [cancelConfirm, setCancelConfirm] = useState<string | null>(null);

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Orders & Delivery</h2>
        <p className="text-sm text-muted-foreground">Track, expedite, or manage active orders.</p>
      </div>

      {patient.orders.map((order) => {
        const config = statusConfig[order.status];
        const StatusIcon = config.icon;
        const isActive = order.status !== "delivered" && order.status !== "cancelled";

        return (
          <div key={order.orderNumber} className="bg-card border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg ${config.bg} flex items-center justify-center`}>
                  <StatusIcon className={`w-4.5 h-4.5 ${config.color}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">{order.orderNumber}</p>
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${config.bg} ${config.color}`}>
                      {config.label}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">Placed {order.date}</p>
                </div>
              </div>
              <p className="text-sm font-semibold">${order.total.toFixed(2)}</p>
            </div>

            <div className="p-4 space-y-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Items</p>
                {order.items.map((item, i) => (
                  <p key={i} className="text-sm">{item}</p>
                ))}
              </div>

              <div className="flex gap-6">
                {isActive && (
                  <div className="flex items-start gap-2">
                    <Truck className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Est. Delivery</p>
                      <p className="text-sm font-medium">{order.estimatedDelivery}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Shipping To</p>
                    <p className="text-sm">{patient.shippingAddress.street}, {patient.shippingAddress.city}</p>
                  </div>
                </div>
                {order.tracking && (
                  <div>
                    <p className="text-xs text-muted-foreground">Tracking</p>
                    <p className="text-sm font-mono text-xs">{order.tracking}</p>
                  </div>
                )}
              </div>

              {isActive && (
                <div className="flex gap-2 pt-2 border-t">
                  {expediteConfirm === order.orderNumber ? (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Expedite shipping?</span>
                      <button
                        onClick={() => setExpediteConfirm(null)}
                        className="px-3 py-1 bg-primary text-primary-foreground rounded-md text-xs font-medium"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setExpediteConfirm(null)}
                        className="px-3 py-1 bg-muted rounded-md text-xs font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setExpediteConfirm(order.orderNumber)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary bg-accent rounded-md hover:bg-primary/10"
                    >
                      <Zap className="w-3 h-3" />
                      Expedite
                    </button>
                  )}

                  {cancelConfirm === order.orderNumber ? (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Cancel this order?</span>
                      <button
                        onClick={() => setCancelConfirm(null)}
                        className="px-3 py-1 bg-destructive text-white rounded-md text-xs font-medium"
                      >
                        Yes, Cancel
                      </button>
                      <button
                        onClick={() => setCancelConfirm(null)}
                        className="px-3 py-1 bg-muted rounded-md text-xs font-medium"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setCancelConfirm(order.orderNumber)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-destructive bg-red-50 rounded-md hover:bg-red-100"
                    >
                      <Ban className="w-3 h-3" />
                      Cancel Order
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
