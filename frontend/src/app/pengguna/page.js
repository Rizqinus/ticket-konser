"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import AdminLayout from "@/components/AdminLayout";
import Icon from "@/components/Icon";
import { api } from "@/lib/api";

const ROLE_STYLE = {
  admin: "bg-slate-900 text-white font-semibold",
  user: "bg-blue-50 text-blue-700 border border-blue-200 font-semibold",
};

export default function KelolaPenggunaPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  const fetchUsers = useCallback(async (silent = false) => {
    if (!silent) {
      setRefreshing(true);
      if (users.length === 0) setLoading(true);
    }
    try {
      const res = await api.getUsers();
      setUsers(res.data || []);
      setFetchError(null);
    } catch (err) {
      console.error("Gagal memuat data pengguna:", err);
      setFetchError(err.message || "Gagal memuat data pengguna dari server");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [users.length]);

  useEffect(() => {
    fetchUsers(false);
    const interval = setInterval(() => {
      fetchUsers(true);
    }, 5000);
    return () => clearInterval(interval);
  }, [fetchUsers]);

  async function handleToggleRole(user) {
    const newRole = user.role === "admin" ? "user" : "admin";
    const roleLabel = newRole === "admin" ? "Admin" : "User";

    if (
      !confirm(
        `Ubah role akun "${user.name}" (${user.email}) menjadi ${roleLabel}?`
      )
    ) {
      return;
    }

    setUpdatingId(user.id);
    try {
      await api.updateUserRole(user.id, newRole);
      alert(`Role pengguna berhasil diubah menjadi ${roleLabel}.`);
      fetchUsers(true);
    } catch (err) {
      alert(err.message || "Gagal memperbarui role pengguna.");
    } finally {
      setUpdatingId(null);
    }
  }

  const filtered = useMemo(() => {
    const term = query.toLowerCase().trim();
    return users.filter((u) => {
      const matchesSearch =
        (u.name || "").toLowerCase().includes(term) ||
        (u.email || "").toLowerCase().includes(term) ||
        (u.phone || "").toLowerCase().includes(term) ||
        (u.role || "").toLowerCase().includes(term);

      if (!matchesSearch) return false;
      if (roleFilter === "admin") return u.role === "admin";
      if (roleFilter === "user") return u.role === "user";
      return true;
    });
  }, [users, query, roleFilter]);

  const adminCount = users.filter((u) => u.role === "admin").length;
  const regularCount = users.filter((u) => u.role === "user").length;

  const STATS = [
    {
      icon: "group",
      label: "Total Pengguna",
      value: users.length,
      iconBg: "bg-blue-50 text-blue-700",
    },
    {
      icon: "admin_panel_settings",
      label: "Total Admin",
      value: adminCount,
      iconBg: "bg-slate-100 text-slate-800",
    },
    {
      icon: "person",
      label: "Total User",
      value: regularCount,
      iconBg: "bg-emerald-50 text-emerald-700",
    },
  ];

  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Data Pengguna
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Daftar akun pengguna yang terdaftar di sistem.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchUsers(false)}
            disabled={refreshing}
            className="px-3.5 py-2 flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer"
            title="Segarkan data pengguna dari database"
          >
            <Icon
              name="refresh"
              className={`text-[18px] text-slate-600 ${
                refreshing ? "animate-spin text-blue-600" : ""
              }`}
            />
            <span>{refreshing ? "Memperbarui..." : "Segarkan Data"}</span>
          </button>
        </div>
      </div>

      {/* Alert Error Koneksi API */}
      {fetchError && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-rose-800 shadow-xs mb-4">
          <div className="flex items-center gap-2.5">
            <Icon name="error" className="text-rose-600 text-lg shrink-0" />
            <span>Koneksi API: {fetchError}. Pastikan server backend terhubung ke database.</span>
          </div>
          <button
            onClick={() => fetchUsers(false)}
            className="px-3 py-1.5 bg-white border border-rose-300 text-rose-700 rounded-xl font-semibold hover:bg-rose-50 shrink-0 cursor-pointer"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3.5">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold ${stat.iconBg}`}
              >
                <Icon name={stat.icon} className="text-[20px]" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
                  {loading ? "..." : stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Data Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Daftar Pengguna ({filtered.length} dari {users.length})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola data pengguna terdaftar dan pengaturan role.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Filter Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <button
                onClick={() => setRoleFilter("all")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  roleFilter === "all"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Semua ({users.length})
              </button>
              <button
                onClick={() => setRoleFilter("admin")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  roleFilter === "admin"
                    ? "bg-white text-slate-900 shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Admin ({adminCount})
              </button>
              <button
                onClick={() => setRoleFilter("user")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  roleFilter === "user"
                    ? "bg-white text-slate-900 shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                User ({regularCount})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative flex-1 md:w-64">
              <Icon
                name="search"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]"
              />
              <input
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all placeholder:text-slate-400"
                placeholder="Cari nama, email, telepon..."
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Pengguna
                </th>
                <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  No. Telepon
                </th>
                <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Tanggal Terdaftar
                </th>
                <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 text-xs">
                    Memuat data pengguna dari database...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500 text-xs">
                    {query
                      ? `Tidak ditemukan pengguna yang cocok dengan pencarian "${query}".`
                      : "Belum ada akun pengguna yang terdaftar."}
                  </td>
                </tr>
              ) : (
                filtered.map((user) => {
                  const roleKey = (user.role || "user").toLowerCase();
                  const isAdmin = roleKey === "admin";
                  const initial = (user.name || "U").charAt(0).toUpperCase();

                  return (
                    <tr
                      key={user.id || user.email}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs ${
                              isAdmin
                                ? "bg-slate-900 text-white"
                                : "bg-blue-600 text-white"
                            }`}
                          >
                            {initial}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 text-xs">
                              {user.name || "Pengguna"}
                            </p>
                            <p className="text-[11px] text-slate-500 font-mono">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-xs text-slate-600 font-mono">
                        {user.phone || "-"}
                      </td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                            isAdmin
                              ? "bg-slate-900 text-white"
                              : "bg-blue-50 text-blue-700 border border-blue-200"
                          }`}
                        >
                          {isAdmin ? "Admin" : "User"}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-xs text-slate-500">
                        {user.created_at
                          ? new Date(user.created_at).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })
                          : "-"}
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <button
                          onClick={() => handleToggleRole(user)}
                          disabled={updatingId === user.id}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95 cursor-pointer inline-flex items-center gap-1 ${
                            isAdmin
                              ? "bg-slate-100 hover:bg-slate-200 text-slate-700"
                              : "bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200"
                          }`}
                          title={`Ubah role akun menjadi ${isAdmin ? "User" : "Admin"}`}
                        >
                          <Icon
                            name={isAdmin ? "person" : "admin_panel_settings"}
                            className="text-[14px]"
                          />
                          <span>
                            {updatingId === user.id
                              ? "Menyimpan..."
                              : isAdmin
                              ? "Jadikan User"
                              : "Jadikan Admin"}
                          </span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
