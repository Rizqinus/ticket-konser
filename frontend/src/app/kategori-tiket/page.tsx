"use client";

import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import Icon from "@/components/Icon";

const CATEGORIES = [
  {
    code: "V",
    name: "VIP Section",
    desc: "Includes merchandise & lounge",
    price: "Rp 2.500.000",
    capacity: "500",
    remaining: "75",
    remainingPct: 15,
    barColor: "bg-error",
    remainingColor: "text-error",
    status: "Hampir Habis",
    statusClass: "bg-error-container text-on-error-container",
    iconBg: "bg-primary/10 text-primary",
  },
  {
    code: "C1",
    name: "CAT 1",
    desc: "Festival Standing - Front",
    price: "Rp 1.200.000",
    capacity: "2.500",
    remaining: "1,500",
    remainingPct: 60,
    barColor: "bg-primary",
    remainingColor: "text-on-surface",
    status: "Tersedia",
    statusClass: "bg-secondary-container text-on-secondary-container",
    iconBg: "bg-secondary/10 text-secondary",
  },
  {
    code: "C2",
    name: "CAT 2",
    desc: "Tribune Seating",
    price: "Rp 800.000",
    capacity: "5.000",
    remaining: "4,500",
    remainingPct: 90,
    barColor: "bg-primary",
    remainingColor: "text-on-surface",
    status: "Tersedia",
    statusClass: "bg-secondary-container text-on-secondary-container",
    iconBg: "bg-tertiary-container/20 text-tertiary",
  },
];

export default function KategoriTiketPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-2">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">
            Manajemen Kategori Tiket
          </h2>
          <p className="font-body-base text-on-surface-variant">
            Kelola ketersediaan kuota dan penyesuaian harga tiket per
            kategori.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-surface-container-lowest border border-outline-variant rounded-xl p-2 pr-4 shadow-sm w-full md:w-auto">
          <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
            <Icon name="confirmation_number" />
          </div>
          <div className="flex-1">
            <label className="block text-[10px] uppercase tracking-wider font-bold text-outline">
              Pilih Event
            </label>
            <select className="bg-transparent border-none p-0 font-label-md text-primary focus:ring-0 outline-none cursor-pointer">
              <option>Neon Nights Tour 2024</option>
              <option>Summer Jazz Festival</option>
              <option>Indie Revival Concert</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-2">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <span className="p-2 bg-primary-fixed text-on-primary-fixed-variant rounded-lg">
              <Icon name="confirmation_number" />
            </span>
            <span className="text-emerald-600 font-label-md flex items-center">
              +12%
            </span>
          </div>
          <p className="text-body-sm text-on-surface-variant">
            Total Tiket Terjual
          </p>
          <h3 className="text-headline-md font-headline-md text-on-surface">
            12,450 / 15,000
          </h3>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <span className="p-2 bg-tertiary-fixed text-on-tertiary-fixed-variant rounded-lg">
              <Icon name="payments" />
            </span>
          </div>
          <p className="text-body-sm text-on-surface-variant">
            Estimasi Pendapatan
          </p>
          <h3 className="text-headline-md font-headline-md text-on-surface">
            Rp 8.42M
          </h3>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <span className="p-2 bg-secondary-fixed text-on-secondary-fixed-variant rounded-lg">
              <Icon name="trending_up" />
            </span>
          </div>
          <p className="text-body-sm text-on-surface-variant">
            Kategori Terlaris
          </p>
          <h3 className="text-headline-md font-headline-md text-on-surface">
            VIP Section
          </h3>
        </div>
        <button
          className="bg-primary text-on-primary rounded-xl p-6 shadow-lg flex flex-col justify-center items-center gap-2 hover:scale-[1.02] transition-transform"
          onClick={() => setModalOpen(true)}
        >
          <Icon name="add_circle" className="text-4xl" />
          <p className="font-label-md">Tambah Kategori Baru</p>
        </button>
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-low/30">
          <h4 className="font-headline-md text-on-surface">
            Rincian Kategori Tiket
          </h4>
          <div className="flex gap-2">
            <button className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors">
              <Icon name="filter_list" />
            </button>
            <button className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors">
              <Icon name="file_download" />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-6 py-4 font-label-md text-on-surface-variant uppercase tracking-wider">
                  Nama Kategori
                </th>
                <th className="px-6 py-4 font-label-md text-on-surface-variant uppercase tracking-wider">
                  Harga Satuan
                </th>
                <th className="px-6 py-4 font-label-md text-on-surface-variant uppercase tracking-wider">
                  Kapasitas Awal
                </th>
                <th className="px-6 py-4 font-label-md text-on-surface-variant uppercase tracking-wider">
                  Sisa Kuota
                </th>
                <th className="px-6 py-4 font-label-md text-on-surface-variant uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 font-label-md text-on-surface-variant uppercase tracking-wider text-right">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {CATEGORIES.map((cat) => (
                <tr
                  key={cat.name}
                  className="hover:bg-surface-container-low/20 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${cat.iconBg}`}
                      >
                        {cat.code}
                      </div>
                      <div>
                        <p className="font-label-md text-on-surface">
                          {cat.name}
                        </p>
                        <p className="text-xs text-on-surface-variant">
                          {cat.desc}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-body-sm text-on-surface">
                    {cat.price}
                  </td>
                  <td className="px-6 py-4 font-body-sm text-on-surface">
                    {cat.capacity}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-surface-container-highest rounded-full overflow-hidden">
                        <div
                          className={`${cat.barColor} h-full`}
                          style={{ width: `${cat.remainingPct}%` }}
                        />
                      </div>
                      <span className={`font-label-md ${cat.remainingColor}`}>
                        {cat.remaining}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-label-md ${cat.statusClass}`}
                    >
                      {cat.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
                      <Icon name="edit" />
                    </button>
                    <button className="p-2 text-on-surface-variant hover:text-error transition-colors">
                      <Icon name="delete" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-[100]">
          <div
            className="absolute inset-0 bg-on-background/40 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[600px] bg-surface-container-lowest rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
              <h3 className="font-headline-md text-on-surface">
                Tambah Kategori Tiket
              </h3>
              <button
                className="text-on-surface-variant hover:text-on-surface"
                onClick={() => setModalOpen(false)}
              >
                <Icon name="close" />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block font-label-md text-on-surface-variant mb-2">
                    Nama Kategori
                  </label>
                  <input
                    className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all font-body-base"
                    placeholder="e.g. Early Bird, VIP, Festival"
                    type="text"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block font-label-md text-on-surface-variant mb-2">
                    Harga (IDR)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-label-md">
                      Rp
                    </span>
                    <input
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all font-body-base"
                      placeholder="0"
                      type="number"
                    />
                  </div>
                </div>
                <div className="col-span-1">
                  <label className="block font-label-md text-on-surface-variant mb-2">
                    Kuota Awal
                  </label>
                  <input
                    className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all font-body-base"
                    placeholder="500"
                    type="number"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block font-label-md text-on-surface-variant mb-2">
                    Deskripsi Kategori
                  </label>
                  <textarea
                    className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all font-body-base resize-none"
                    placeholder="Apa yang didapatkan pembeli tiket ini?"
                    rows={3}
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-outline-variant flex justify-end gap-3 bg-surface-container-low/20">
              <button
                className="px-6 py-2.5 font-label-md text-primary hover:bg-primary/5 rounded-xl transition-colors"
                onClick={() => setModalOpen(false)}
              >
                Batal
              </button>
              <button className="px-8 py-2.5 font-label-md bg-primary text-on-primary rounded-xl hover:brightness-110 shadow-md transition-all">
                Simpan Kategori
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
