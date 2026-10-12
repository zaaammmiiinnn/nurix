"use client";

import React, { useState } from "react";

interface OrderItem {
  id: string;
  source: string;
  items: string;
  status: "Cooking" | "Dispatched" | "Delivered";
  amount: string;
  time: string;
}

const SAMPLE_ORDERS: OrderItem[] = [
  { id: "#DXB-8491", source: "WhatsApp Bot", items: "Truffle Burger x2, Hand-Cut Fries", status: "Cooking", amount: "AED 145", time: "3m ago" },
  { id: "#DXB-8490", source: "Online Portal", items: "Wagyu Ribeye, Sparkling Water", status: "Dispatched", amount: "AED 290", time: "11m ago" },
  { id: "#DXB-8489", source: "WhatsApp Bot", items: "Caesar Salad, Iced Matcha", status: "Delivered", amount: "AED 85", time: "24m ago" },
  { id: "#DXB-8488", source: "Direct Concierge", items: "Chef Tasting Menu x4", status: "Delivered", amount: "AED 1,200", time: "42m ago" },
];

export function DashboardSimulator() {
  const [filterPeriod, setFilterPeriod] = useState<"Today" | "7D" | "30D">("Today");
  const [selectedOrder, setSelectedOrder] = useState<OrderItem>(SAMPLE_ORDERS[0]);

  return (
    <div className="border border-stone bg-white p-6 sm:p-8 space-y-6">
      {/* Warning & Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone/80 text-[11px] font-mono text-olive">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
          <span className="text-charcoal font-semibold uppercase">INTERACTIVE OPERATIONS DASHBOARD DEMO</span>
        </div>
        <span className="px-2 py-0.5 bg-canvas border border-stone text-olive uppercase text-[10px]">
          ILLUSTRATIVE DATA · LIVE SUPABASE WEBSOCKET ARCHITECTURE
        </span>
      </div>

      {/* Mock Browser & App Frame */}
      <div className="border border-stone bg-canvas/30 overflow-hidden">
        {/* Top Filter & Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white border-b border-stone">
          <div className="flex items-center gap-3">
            <span className="font-display font-medium text-sm text-charcoal">F&B Hospitality Command Portal</span>
            <span className="px-2 py-0.5 text-[9px] font-mono bg-canvas border border-stone text-olive uppercase">
              DUBAI HUB 01
            </span>
          </div>

          <div className="flex items-center gap-1 border border-stone p-0.5 bg-canvas">
            {(["Today", "7D", "30D"] as const).map((period) => (
              <button
                key={period}
                type="button"
                onClick={() => setFilterPeriod(period)}
                className={`px-3 py-1 text-[11px] font-mono transition-colors cursor-pointer ${
                  filterPeriod === period ? "bg-charcoal text-white" : "text-olive hover:text-charcoal"
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-stone border-b border-stone">
          <div className="p-5 bg-white">
            <span className="mono-label block text-[10px] text-olive uppercase mb-1">TOTAL REVENUE ({filterPeriod})</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-display font-medium text-charcoal">AED 42,850</span>
              <span className="text-[11px] font-mono text-emerald-700">+18.4%</span>
            </div>
            <span className="text-[10px] font-mono text-olive mt-1 block">94% Automated Settlement</span>
          </div>

          <div className="p-5 bg-white">
            <span className="mono-label block text-[10px] text-olive uppercase mb-1">LIVE TICKETS</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-display font-medium text-charcoal">38 Orders</span>
              <span className="text-[11px] font-mono text-charcoal">Avg 12.4m Prep</span>
            </div>
            <span className="text-[10px] font-mono text-olive mt-1 block">Zero Backlog Delays</span>
          </div>

          <div className="p-5 bg-white">
            <span className="mono-label block text-[10px] text-olive uppercase mb-1">WHATSAPP CONVERSION</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-display font-medium text-charcoal">74.2%</span>
              <span className="text-[11px] font-mono text-emerald-700">+8.1% vs Phone</span>
            </div>
            <span className="text-[10px] font-mono text-olive mt-1 block">Auto Menu Recommendation</span>
          </div>
        </div>

        {/* Orders Table & Detail Drawer */}
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Orders Table */}
          <div className="lg:col-span-8 p-4 sm:p-5 border-r border-stone bg-white">
            <div className="flex items-center justify-between mb-3 text-xs font-mono text-olive">
              <span>LIVE INCOMING ORDERS (REAL-TIME STREAM)</span>
              <span>CLICK TO INSPECT</span>
            </div>

            <div className="space-y-2">
              {SAMPLE_ORDERS.map((order) => {
                const isSelected = selectedOrder.id === order.id;
                return (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`p-3.5 border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? "border-charcoal bg-canvas"
                        : "border-stone/70 bg-white hover:border-charcoal/40"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-semibold text-charcoal">{order.id}</span>
                        <span className="text-[10px] font-mono text-olive">via {order.source}</span>
                      </div>
                      <p className="text-xs text-charcoal/80 font-sans">{order.items}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="block font-mono text-xs font-medium text-charcoal">{order.amount}</span>
                      <span
                        className={`inline-block px-2 py-0.5 text-[9px] font-mono uppercase mt-1 ${
                          order.status === "Cooking"
                            ? "bg-amber-100 text-amber-800"
                            : order.status === "Dispatched"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Detail Panel */}
          <div className="lg:col-span-4 p-5 bg-canvas/40 space-y-4 text-xs font-sans">
            <span className="mono-label block text-[10px] text-olive uppercase">SELECTED DISPATCH DETAIL</span>
            <div className="bg-white border border-stone p-4 space-y-3 font-mono">
              <div className="flex justify-between border-b border-stone/60 pb-2">
                <span className="text-olive">REFERENCE</span>
                <span className="font-semibold text-charcoal">{selectedOrder.id}</span>
              </div>
              <div className="flex justify-between border-b border-stone/60 pb-2">
                <span className="text-olive">CHANNEL</span>
                <span className="text-charcoal">{selectedOrder.source}</span>
              </div>
              <div className="flex justify-between border-b border-stone/60 pb-2">
                <span className="text-olive">SETTLEMENT</span>
                <span className="text-charcoal">{selectedOrder.amount} (Online)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-olive">TIMEFRAME</span>
                <span className="text-charcoal">{selectedOrder.time}</span>
              </div>
            </div>

            <p className="text-olive text-xs leading-relaxed font-sans">
              Custom dashboards engineered with role-based access control (RBAC), multi-location filtering, and automated daily export to accountant drives.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
