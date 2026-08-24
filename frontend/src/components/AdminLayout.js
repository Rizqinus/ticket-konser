"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Icon from "./Icon";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/artis", label: "Artis", icon: "person" },
  { href: "/event", label: "Event", icon: "event" },
  {
    href: "/kategori-tiket",
    label: "Kategori Tiket",
    icon: "confirmation_number",
  },
  {
    href: "/verifikasi",
    label: "Verifikasi Transaksi",
    icon: "verified_user",
  },
  { href: "/pengguna", label: "Pengguna", icon: "group" },
  { href: "/laporan", label: "Laporan", icon: "assessment" },
  { href: "/pengaturan", label: "Pengaturan", icon: "settings" },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen">
      {/* SideNavBar */}
      <aside className="fixed left-0 top-0 h-full w-[280px] bg-surface-container-low border-r border-outline-variant z-50 flex flex-col p-4 gap-2">
        <div className="px-4 py-6 mb-4">
          <h1 className="text-headline-md font-headline-md font-bold text-primary">
            Concert Manager
          </h1>
          <p className="text-body-sm font-body-sm text-on-surface-variant">
            Enterprise Admin
          </p>
        </div>
        <nav className="flex-1 flex flex-col gap-1 sidebar-scroll overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-label-md transition-transform duration-150 active:scale-95 ${
                  active
                    ? "bg-primary-container text-on-primary-container"
                    : "text-on-surface-variant hover:bg-surface-container-highest transition-colors"
                }`}
              >
                <Icon name={item.icon} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto pt-4 border-t border-outline-variant">
          <button className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary py-3 px-4 rounded-xl font-label-md hover:opacity-90 transition-opacity">
            <Icon name="add" />
            <span>Create Event</span>
          </button>
          <div className="flex items-center gap-3 mt-6 px-2">
            <Image
              className="w-10 h-10 rounded-full border-2 border-primary-fixed object-cover"
              alt="Admin avatar"
              width={40}
              height={40}
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_bZDoRi1mk3_G2y07_BlTm5-PKltf3l--MW-_qa0QdQidit1AN8uzu17_4L1KexGn6O9N9eUQ1c0Fu_nMXZgzy7pPbx2I0zkWDEjI6iNuiL2g74Aw0K0W-_PNIFwhhWNZl7CL8NrWvyp2deRKpYtXgVuogsgoMSFjxui2B_JtkdBKVdWKlOUxOYz-SJvNjMN81YK60GNtu88CqiUNmuoCUD4ZsWYm5_NPTvDX2AOrY-BHPr63-ApWuDKmbNQmAjYFoHj2sCVFGtQ"
            />
            <div className="flex flex-col">
              <span className="text-label-md font-label-md text-on-surface">
                Admin Utama
              </span>
              <span className="text-label-sm font-label-sm text-on-surface-variant">
                Admin Avatar
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-[280px] min-h-screen flex flex-col">
        {/* TopNavBar */}
        <header className="sticky top-0 z-40 w-full bg-surface/80 backdrop-blur-md border-b border-outline-variant h-16 flex justify-between items-center px-gutter">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md">
              <Icon
                name="search"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
              />
              <input
                className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all text-body-sm"
                placeholder="Search data or events..."
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-on-surface-variant hover:text-primary transition-colors relative">
              <Icon name="notifications" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
            </button>
            <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
              <Icon name="settings" />
            </button>
            <div className="h-8 w-[1px] bg-outline-variant mx-2"></div>
            <div className="flex items-center gap-2">
              <span className="text-label-md font-label-md text-primary font-bold border-b-2 border-primary pb-1">
                Concert Admin
              </span>
            </div>
          </div>
        </header>

        {/* Page Canvas */}
        <div className="p-gutter max-w-[calc(1440px-280px)] w-full mx-auto space-y-gutter">
          {children}
        </div>
      </main>
    </div>
  );
}
