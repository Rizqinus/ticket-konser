"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import AdminLayout from "@/components/AdminLayout";
import Icon from "@/components/Icon";

const STATS = [
  { icon: "group", label: "Total Users", value: "12,482", iconBg: "bg-primary-container/10 text-primary" },
  { icon: "verified", label: "Active Now", value: "842", iconBg: "bg-emerald-100 text-emerald-700", valueClass: "text-emerald-700" },
  { icon: "admin_panel_settings", label: "Administrators", value: "14", iconBg: "bg-amber-100 text-amber-700" },
  { icon: "person_off", label: "Inactive", value: "128", iconBg: "bg-rose-100 text-rose-700" },
];

const USERS = [
  {
    name: "Marcus Thorne",
    email: "marcus.t@concerthub.com",
    role: "Admin" as const,
    date: "Oct 24, 2023",
    active: true,
    photo:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDB8rm6a65-zNXsQlwsEC_Jac2uArfD9jIlYhsfv7EsnA1HfEG7S07Y7BOY8bWCpTga15c3gJGUHcojvbxvWz8ZheVAdx_9Jo2KhnXVeTEz6tY41mxi_hqmIifPwVT4OPPyRfyFJ179RyCu4uI56yjWfdz6QfnAhx-y19ZicqtOWoo9kw8VhadEZmoIYYNB0Qp8oCylpsbZxPApascdltIp_jIva98wO6Xgs8UQbVgXLa8bVHq_o1N4u_GidwB18soJHznm5NqcHPo",
  },
  {
    name: "Elara Vance",
    email: "elara.vance@staff.io",
    role: "Staff" as const,
    date: "Nov 12, 2023",
    active: true,
    photo:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuArgyoDIjB5fbOlhz0qEAfz7V2btSga_HOjkeWiRalMwCOy4EL9Ibg4JehhxufZA6ke25noQomdjab_S0zXc-epjfYnyeHmFtbMPFoHfgz1xGMD5J7qAufx5atsLbxAeD-Kv3GFI52c1_h2KayT3PJLwmFmatlR_oLsHeMRctBkVwv29piXP3rtVT-JTBSiKXkTZrx0nPjhhlFZkPtSqTp4gzEe6SrmoZmG5IIvVlRmPD6aDIGn50ao6oI9_LQyzRdYA9KsZGI3hdQ",
  },
  {
    name: "Julian Sol",
    email: "jsol@musicfan.net",
    role: "Customer" as const,
    date: "Jan 05, 2024",
    active: false,
    photo:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAv_U1PjMuKZWI40O5-ntuu8dgftC5RIG41JfM1wYLlRRWsHDbpnBE8hUBq1OoeDhE7v_egAuBfVuEX3H-MhYcnqYI7pXAec_rIgcFZ6LVCg0Q-pGw9ill8yzuGA1HXLMh1XL18R1WeWXwoytPpdx3p21IBI-CJydNUETxQWeI_egsLQpTjX3lkzh7-AkVMeGQm0qAmWHH1_x8bjzM19rQlnHkGgSGTQYm5q7RG56oyGXLplTjiadtuekhxGCa8p6TdWoxsRPbEuHY",
  },
  {
    name: "Aris Thorne",
    email: "aris.t@concerthub.com",
    role: "Admin" as const,
    date: "Dec 12, 2023",
    active: true,
    photo:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCTZh21AcJhowkrkPnXKJkWMU6GOxh1nMJHD_URrrFwyfRqJy8FQtnmJC3U7AVaWMyEgJxf1G6gNGE5vPkynH1aEuALYrRnBTaeimj4pEgSo5dhWZLvLbt7w1XKv3kzcVa1u60rKSjbIg3OHiJ1BDkaLVwHmsbj5Etj4oSLaAH-mS8JC6Guguu2_X2GE_xQy4yAOWeg8SjtPL3RoZ4fpFZzH6KxTPuQdFwJDcaXG1Lc8L0I3XIaxpwDB12XuR-guotQcuWUF8mOJX8",
  },
];

const ROLE_STYLE: Record<string, string> = {
  Admin: "bg-primary-container/10 text-primary border border-primary-container/20",
  Staff: "bg-surface-container-highest text-secondary border border-outline-variant",
  Customer: "bg-tertiary-fixed text-tertiary border border-tertiary-container/20",
};

export default function KelolaPenggunaPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const term = query.toLowerCase();
    return USERS.filter(
      (u) =>
        u.name.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        u.role.toLowerCase().includes(term)
    );
  }, [query]);

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-1">
            User Management
          </h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Oversee and manage administrator, staff, and customer access
            across the platform.
          </p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-primary-container text-white font-semibold rounded-lg shadow-md hover:brightness-110 active:scale-95 transition-all">
          <Icon name="person_add" />
          <span className="font-label-md text-label-md">Add New User</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="bg-white p-6 rounded-xl border border-outline-variant shadow-sm flex items-center gap-4"
          >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.iconBg}`}>
              <Icon name={stat.icon} />
            </div>
            <div>
              <p className="text-label-sm text-secondary">{stat.label}</p>
              <p className={`text-headline-md font-bold ${stat.valueClass ?? ""}`}>
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Data Table Section */}
      <div className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-outline-variant bg-surface-container-low flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h3 className="font-headline-md text-headline-md text-on-surface">
            Registered Users
          </h3>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-72">
              <Icon
                name="search"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]"
              />
              <input
                className="w-full pl-10 pr-4 py-2 bg-white border border-outline-variant rounded-lg text-body-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="Search name, email, role..."
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <button className="p-2 text-secondary hover:bg-surface-variant rounded-lg transition-colors">
              <Icon name="filter_list" />
            </button>
            <button className="p-2 text-secondary hover:bg-surface-variant rounded-lg transition-colors">
              <Icon name="download" />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-lowest">
                <th className="px-6 py-4 text-label-sm font-semibold text-secondary uppercase tracking-wider border-b border-outline-variant">
                  User Info
                </th>
                <th className="px-6 py-4 text-label-sm font-semibold text-secondary uppercase tracking-wider border-b border-outline-variant">
                  Role
                </th>
                <th className="px-6 py-4 text-label-sm font-semibold text-secondary uppercase tracking-wider border-b border-outline-variant">
                  Registration Date
                </th>
                <th className="px-6 py-4 text-label-sm font-semibold text-secondary uppercase tracking-wider border-b border-outline-variant">
                  Status
                </th>
                <th className="px-6 py-4 text-label-sm font-semibold text-secondary uppercase tracking-wider border-b border-outline-variant text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {filtered.map((user) => (
                <tr
                  key={user.email}
                  className="hover:bg-surface-container-low/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden relative shrink-0">
                        <Image
                          className="object-cover"
                          src={user.photo}
                          alt={user.name}
                          fill
                          sizes="40px"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-label-md text-label-md text-on-surface">
                          {user.name}
                        </span>
                        <span className="text-body-sm text-on-surface-variant">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${ROLE_STYLE[user.role]}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-body-sm text-on-surface-variant">
                    {user.date}
                  </td>
                  <td className="px-6 py-4">
                    {user.active ? (
                      <span className="flex items-center gap-1.5 text-emerald-600 font-semibold text-body-sm">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-secondary font-semibold text-body-sm opacity-50">
                        <span className="w-2 h-2 bg-outline rounded-full"></span>
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-secondary hover:text-primary hover:bg-primary-container/10 rounded-lg transition-all">
                        <Icon name="edit" className="text-[20px]" />
                      </button>
                      <button className="p-2 text-secondary hover:text-error hover:bg-error-container/20 rounded-lg transition-all">
                        <Icon name="delete" className="text-[20px]" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-on-surface-variant text-body-sm"
                  >
                    Tidak ada pengguna yang cocok dengan pencarian &quot;{query}
                    &quot;.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-outline-variant bg-surface-container-lowest flex items-center justify-between">
          <p className="text-label-sm text-on-surface-variant">
            Showing <span className="font-bold">1-{filtered.length}</span> of{" "}
            <span className="font-bold">12,482</span> users
          </p>
          <div className="flex items-center gap-1">
            <button
              className="p-2 rounded-lg hover:bg-surface-container-low disabled:opacity-30"
              disabled
            >
              <Icon name="chevron_left" />
            </button>
            <button className="w-8 h-8 rounded-lg bg-primary text-white font-bold text-label-sm">
              1
            </button>
            <button className="w-8 h-8 rounded-lg hover:bg-surface-container-low text-secondary font-bold text-label-sm">
              2
            </button>
            <button className="w-8 h-8 rounded-lg hover:bg-surface-container-low text-secondary font-bold text-label-sm">
              3
            </button>
            <span className="px-2 text-secondary">...</span>
            <button className="w-8 h-8 rounded-lg hover:bg-surface-container-low text-secondary font-bold text-label-sm">
              312
            </button>
            <button className="p-2 rounded-lg hover:bg-surface-container-low">
              <Icon name="chevron_right" />
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
