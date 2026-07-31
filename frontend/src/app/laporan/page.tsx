"use client";

import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import Icon from "@/components/Icon";

const RANGE_TABS = ["Last 7 days", "30 days", "1 year"];

const SUMMARY_CARDS = [
  {
    icon: "payments",
    label: "Total Revenue",
    value: "$1,428,930",
    delta: "12.4%",
    note: "+$124k vs previous month",
  },
  {
    icon: "confirmation_number",
    label: "Tickets Sold",
    value: "42,851",
    delta: "8.2%",
    note: "Average 1,240 tickets / day",
  },
  {
    icon: "show_chart",
    label: "User Growth",
    value: "+18.5%",
    delta: "2.1%",
    note: "8,932 new registrations",
  },
];

const CATEGORY_SPLIT = [
  { label: "General Admission", pct: 65, color: "bg-primary" },
  { label: "VIP Experience", pct: 24, color: "bg-primary-container" },
  { label: "Early Bird", pct: 8, color: "bg-secondary" },
  { label: "Backstage Pass", pct: 3, color: "bg-outline" },
];

const TRANSACTIONS = [
  {
    id: "#TRX-9821",
    event: "Neon Dreams Festival",
    amount: "$240.00",
    status: "Success" as const,
  },
  {
    id: "#TRX-9820",
    event: "Midnight Jazz Session",
    amount: "$120.00",
    status: "Success" as const,
  },
  {
    id: "#TRX-9819",
    event: "Summer Rock Arena",
    amount: "$450.00",
    status: "Pending" as const,
  },
];

const LOCATIONS = [
  { city: "New York", pct: 32, color: "bg-primary" },
  { city: "London", pct: 24, color: "bg-primary-container" },
  { city: "Tokyo", pct: 18, color: "bg-secondary" },
];

export default function LaporanAnalitikPage() {
  const [range, setRange] = useState("Last 7 days");

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-1">
            Analytics Overview
          </h2>
          <p className="text-body-base text-on-surface-variant">
            Real-time performance monitoring and financial insights.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-surface-container-high rounded-xl p-1">
            {RANGE_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setRange(tab)}
                className={`px-4 py-2 text-label-sm font-label-sm rounded-lg transition-all ${
                  range === tab
                    ? "bg-white shadow-sm text-primary"
                    : "text-secondary hover:text-primary"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-label-md text-label-md hover:opacity-90 active:scale-95 transition-all shadow-md">
            <Icon name="file_download" className="text-[20px]" />
            Export Report
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SUMMARY_CARDS.map((card) => (
          <div
            key={card.label}
            className="bg-white p-6 rounded-xl border border-outline-variant shadow-sm relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Icon name={card.icon} className="text-6xl text-primary" />
            </div>
            <p className="text-label-sm font-label-sm text-secondary mb-2 uppercase tracking-wider">
              {card.label}
            </p>
            <div className="flex items-end gap-3">
              <h3 className="text-3xl font-bold text-on-surface">
                {card.value}
              </h3>
              <span className="flex items-center text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-xs font-semibold mb-1">
                <Icon name="trending_up" className="text-[14px]" />
                {card.delta}
              </span>
            </div>
            <p className="text-xs text-secondary mt-4">{card.note}</p>
          </div>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend Line Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-outline-variant shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h4 className="font-headline-md text-headline-md text-on-surface">
                Revenue Trend
              </h4>
              <p className="text-body-sm text-secondary">
                Daily performance over the last 30 days
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-primary"></span>
              <span className="text-label-sm text-secondary">Revenue</span>
            </div>
          </div>
          <div className="h-64 w-full relative flex items-end justify-between gap-1">
            <div className="absolute inset-0 flex items-end">
              <svg
                className="w-full h-full"
                preserveAspectRatio="none"
                viewBox="0 0 100 100"
              >
                <path
                  d="M0,80 Q10,75 20,60 T40,65 T60,40 T80,45 T100,20 V100 H0 Z"
                  fill="url(#chart-gradient)"
                  opacity={0.3}
                />
                <path
                  d="M0,80 Q10,75 20,60 T40,65 T60,40 T80,45 T100,20"
                  fill="none"
                  stroke="#3525cd"
                  strokeWidth={2}
                  vectorEffect="non-scaling-stroke"
                />
                <defs>
                  <linearGradient id="chart-gradient" x1={0} x2={0} y1={0} y2={1}>
                    <stop offset="0%" stopColor="#4f46e5" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="absolute -left-2 top-0 h-full flex flex-col justify-between text-[10px] text-secondary font-medium">
              <span>$200k</span>
              <span>$150k</span>
              <span>$100k</span>
              <span>$50k</span>
              <span>0</span>
            </div>
          </div>
          <div className="mt-4 flex justify-between px-4 text-[11px] text-secondary font-medium">
            <span>MAY 01</span>
            <span>MAY 08</span>
            <span>MAY 15</span>
            <span>MAY 22</span>
            <span>MAY 30</span>
          </div>
        </div>

        {/* Sales by Category Bar Chart */}
        <div className="bg-white p-6 rounded-xl border border-outline-variant shadow-sm">
          <h4 className="font-headline-md text-headline-md text-on-surface mb-1">
            Sales by Category
          </h4>
          <p className="text-body-sm text-secondary mb-8">
            Distribution of ticket types
          </p>
          <div className="space-y-6">
            {CATEGORY_SPLIT.map((cat) => (
              <div key={cat.label} className="space-y-2">
                <div className="flex justify-between text-label-sm">
                  <span className="text-on-surface">{cat.label}</span>
                  <span className="font-bold text-on-surface">
                    {cat.pct}%
                  </span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-2">
                  <div
                    className={`${cat.color} h-2 rounded-full`}
                    style={{ width: `${cat.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-8 border-t border-outline-variant">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-surface-container-high border-2 border-white flex items-center justify-center text-[10px] font-bold">
                  +12
                </div>
              </div>
              <p className="text-xs text-secondary leading-tight">
                Recent VIP bookings by verified members
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Data Table & Regional Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden">
          <div className="p-6 border-b border-outline-variant flex items-center justify-between">
            <h4 className="font-headline-md text-headline-md text-on-surface">
              Recent Transactions
            </h4>
            <button className="text-primary text-label-sm font-label-sm hover:underline">
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low text-secondary text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-semibold">Transaction ID</th>
                  <th className="px-6 py-4 font-semibold">Event</th>
                  <th className="px-6 py-4 font-semibold">Amount</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {TRANSACTIONS.map((trx) => (
                  <tr
                    key={trx.id}
                    className="hover:bg-surface-container-low transition-colors group"
                  >
                    <td className="px-6 py-4 text-body-sm font-medium text-on-surface">
                      {trx.id}
                    </td>
                    <td className="px-6 py-4 text-body-sm text-secondary">
                      {trx.event}
                    </td>
                    <td className="px-6 py-4 text-body-sm font-bold text-on-surface">
                      {trx.amount}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[10px] px-2 py-1 rounded font-bold uppercase ${
                          trx.status === "Success"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-error-container text-on-error-container"
                        }`}
                      >
                        {trx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-outline group-hover:text-primary transition-colors">
                        <Icon name="more_vert" className="text-[20px]" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Geographic/Regional Insights */}
        <div className="bg-white p-6 rounded-xl border border-outline-variant shadow-sm flex flex-col">
          <h4 className="font-headline-md text-headline-md text-on-surface mb-1">
            Top Locations
          </h4>
          <p className="text-body-sm text-secondary mb-6">
            Sales by metropolitan area
          </p>
          <div className="relative flex-1 min-h-[200px] mb-6 rounded-lg overflow-hidden border border-outline-variant bg-surface-container-high">
            <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-primary/40 rounded-full animate-ping"></div>
            <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-primary rounded-full"></div>
            <div className="absolute bottom-1/2 right-1/4 w-3 h-3 bg-primary/40 rounded-full animate-ping"></div>
            <div className="absolute bottom-1/2 right-1/4 w-1.5 h-1.5 bg-primary rounded-full"></div>
          </div>
          <div className="space-y-4">
            {LOCATIONS.map((loc) => (
              <div key={loc.city} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${loc.color}`}></span>
                  <span className="text-label-md font-label-md text-on-surface">
                    {loc.city}
                  </span>
                </div>
                <span className="text-label-md font-bold text-on-surface">
                  {loc.pct}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
