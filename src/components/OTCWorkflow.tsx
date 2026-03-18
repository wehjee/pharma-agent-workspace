"use client";

import { useState, useMemo } from "react";
import type { Patient } from "@/data/mock";
import { otcProducts } from "@/data/mock";
import { Search, Plus, Minus, ShoppingCart, BookOpen, DollarSign, Trash2 } from "lucide-react";

type Tab = "shop" | "balance" | "catalog";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
}

interface Props {
  patient: Patient;
}

export function OTCWorkflow({ patient }: Props) {
  const [tab, setTab] = useState<Tab>("shop");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [catalogRequested, setCatalogRequested] = useState(false);

  const filteredProducts = useMemo(() => {
    const q = search.toLowerCase();
    return otcProducts.filter(
      (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
  }, [search]);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const remainingBalance = patient.otcBalance - cartTotal;

  const addToCart = (product: typeof otcProducts[0]) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) => (i.productId === product.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { productId: product.id, name: product.name, price: product.price, qty: 1 }];
    });
  };

  const updateQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => (i.productId === productId ? { ...i, qty: Math.max(0, i.qty + delta) } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const tabs = [
    { id: "shop" as const, label: "Order OTC", icon: ShoppingCart },
    { id: "balance" as const, label: "Balance", icon: DollarSign },
    { id: "catalog" as const, label: "Catalog", icon: BookOpen },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
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

      {tab === "shop" && (
        <div className="flex gap-6">
          <div className="flex-1 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search OTC products by name or category..."
                className="w-full pl-9 pr-4 py-2.5 bg-card border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div className="grid grid-cols-1 gap-2">
              {filteredProducts.map((product) => {
                const inCart = cart.find((i) => i.productId === product.id);
                return (
                  <div
                    key={product.id}
                    className={`flex items-center justify-between p-3 bg-card border rounded-lg ${
                      !product.available ? "opacity-50" : ""
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{product.name}</p>
                        {!product.available && (
                          <span className="text-[10px] bg-destructive/10 text-destructive px-1.5 py-0.5 rounded font-medium">
                            Unavailable
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{product.category}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">${product.price.toFixed(2)}</span>
                      {product.available && (
                        inCart ? (
                          <div className="flex items-center gap-1">
                            <button onClick={() => updateQty(product.id, -1)} className="w-7 h-7 rounded-md bg-muted flex items-center justify-center hover:bg-muted-foreground/20">
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-sm font-medium">{inCart.qty}</span>
                            <button onClick={() => updateQty(product.id, 1)} className="w-7 h-7 rounded-md bg-muted flex items-center justify-center hover:bg-muted-foreground/20">
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart(product)}
                            disabled={remainingBalance < product.price}
                            className="px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-xs font-medium hover:bg-primary/90 disabled:opacity-40 transition-colors"
                          >
                            Add
                          </button>
                        )
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="w-72 shrink-0">
            <div className="bg-card border rounded-xl p-4 space-y-4 sticky top-0">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Cart ({cart.length})
              </h3>

              <div className={`text-center p-3 rounded-lg ${
                remainingBalance > 20 ? "bg-success-bg" : remainingBalance > 0 ? "bg-warning-bg" : "bg-red-50"
              }`}>
                <p className="text-xs text-muted-foreground">Remaining OTC Balance</p>
                <p className={`text-2xl font-bold ${
                  remainingBalance > 20 ? "text-success" : remainingBalance > 0 ? "text-warning" : "text-destructive"
                }`}>
                  ${remainingBalance.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">of ${patient.otcTotal.toFixed(2)}</p>
              </div>

              {cart.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">No items in cart</p>
              ) : (
                <div className="space-y-2">
                  {cart.map((item) => (
                    <div key={item.productId} className="flex items-center justify-between text-sm">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.qty} x ${item.price.toFixed(2)}</p>
                      </div>
                      <button onClick={() => updateQty(item.productId, -item.qty)} className="p-1 text-muted-foreground hover:text-destructive">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <div className="border-t pt-2 flex justify-between text-sm font-medium">
                    <span>Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <button className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                    Place OTC Order
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {tab === "balance" && (
        <div className="max-w-md space-y-4">
          <div className="bg-card border rounded-xl p-6 text-center space-y-2">
            <p className="text-sm text-muted-foreground">OTC Benefit Balance</p>
            <p className={`text-4xl font-bold ${
              patient.otcBalance > 30 ? "text-success" : patient.otcBalance > 10 ? "text-warning" : "text-destructive"
            }`}>
              ${patient.otcBalance.toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground">of ${patient.otcTotal.toFixed(2)} total benefit</p>
            <div className="w-full bg-muted rounded-full h-2 mt-3">
              <div
                className="bg-success rounded-full h-2 transition-all"
                style={{ width: `${(patient.otcBalance / patient.otcTotal) * 100}%` }}
              />
            </div>
          </div>
          <div className="bg-card border rounded-xl p-4 space-y-2 text-sm">
            <p className="font-medium">Recent OTC Activity</p>
            <div className="flex justify-between text-muted-foreground">
              <span>Acetaminophen 500mg</span>
              <span>-$8.99 &middot; Mar 1</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Vitamin D3 2000IU</span>
              <span>-$12.99 &middot; Feb 15</span>
            </div>
          </div>
        </div>
      )}

      {tab === "catalog" && (
        <div className="max-w-md space-y-4">
          <div className="bg-card border rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-sm">Request Updated OTC Catalog</h3>
            <p className="text-sm text-muted-foreground">
              Mail a physical catalog to the member&apos;s address on file.
            </p>
            <div className="bg-muted/50 rounded-lg p-3 text-sm">
              <p>{patient.shippingAddress.street}</p>
              <p>{patient.shippingAddress.city}, {patient.shippingAddress.state} {patient.shippingAddress.zip}</p>
            </div>
            {catalogRequested ? (
              <div className="flex items-center gap-2 text-sm text-success font-medium">
                <span className="w-5 h-5 rounded-full bg-success flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </span>
                Catalog request submitted
              </div>
            ) : (
              <button
                onClick={() => setCatalogRequested(true)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Send Catalog
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
