"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Icon from "./Icon";
import GigpassLogo from "./GigpassLogo";
import { getToken, getUser, logout } from "@/lib/api";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Ringkasan Penjualan", icon: "dashboard" },
  { href: "/event", label: "Kelola Event", icon: "event" },
  { href: "/verifikasi", label: "Verifikasi Pembayaran", icon: "verified_user" },
  { href: "/pengguna", label: "Data Pengguna", icon: "group" },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }
    setUser(getUser());
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar Navigation */}
      <aside className="fixed left-0 top-0 h-full w-[260px] bg-white border-r border-slate-200 z-50 flex flex-col p-4">
        {/* Brand Header */}
        <div className="px-3 py-4 mb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <GigpassLogo size={36} className="shadow-md shadow-blue-600/20 shrink-0" />
            <div>
              <h1 className="text-base font-bold tracking-tight text-slate-900 leading-tight">
                Gigpass
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Pusat Kendali Admin
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 flex flex-col gap-1 sidebar-scroll overflow-y-auto pt-2">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  active
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Icon
                  name={item.icon}
                  className={`text-[20px] ${active ? "text-white" : "text-slate-500"}`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Quick Action & User Footer */}
        <div className="mt-auto pt-4 border-t border-slate-100 space-y-3">
          <Link
            href="/event"
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white py-2.5 px-4 rounded-xl text-xs font-semibold shadow-sm transition-all"
          >
            <Icon name="add" className="text-[18px]" />
            <span>Tambah Event Baru</span>
          </Link>

          <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                {(user?.name || "A").charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col truncate">
                <span className="text-xs font-semibold text-slate-900 truncate">
                  {user?.name || "Administrator"}
                </span>
                <span className="text-[11px] text-slate-500 truncate">
                  {user?.email || "admin@konser.id"}
                </span>
              </div>
            </div>
            <button
              onClick={logout}
              title="Keluar dari akun"
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
            >
              <Icon name="logout" className="text-[18px]" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-[260px] min-h-screen flex flex-col">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 h-16 flex justify-between items-center px-8">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md">
              <Icon
                name="search"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]"
              />
              <input
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all text-xs text-slate-800 placeholder:text-slate-400"
                placeholder="Cari event, pemesan, atau nomor tiket..."
                type="text"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-700 rounded-full border border-slate-200">
              Panel Pengelola
            </div>
          </div>
        </header>

        {/* Page Canvas */}
        <div className="p-8 max-w-[1300px] w-full mx-auto space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
}
