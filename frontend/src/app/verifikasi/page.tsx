"use client";

import { useState } from "react";
import Image from "next/image";
import AdminLayout from "@/components/AdminLayout";
import Icon from "@/components/Icon";

const TRANSACTIONS = [
  {
    id: "#TRX-98210",
    initials: "AS",
    name: "Andi Saputra",
    event: "Neon Nights World Tour",
    ticketClass: "VIP Gold",
    ticketClassStyle: "bg-primary-fixed text-on-primary-fixed",
    qty: 2,
    total: "Rp 4.500.000",
    bank: "Bank Central Asia (BCA)",
    transferDate: "24 Oct 2023, 14:32",
    proof:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDYk1M8G8k8BMggiSsjmgByuWL5AqTVm9a7U4tZRfRBfNWKfbWwLwrUu8vCnYB7k1Ds3Sm5VpoekXRBmWX_DRitRbgtk-0UwzSgarBdMigp6dOwbU2iEcfOZPykJXZbSqVbyFcyelgKImr_Fi2rM9Wr5N7-Qvmj2-GaIAdjq_LFUfNs_-3gxSjVLIEL8Rs3YVjg0KPf-CMSUujwULbLsL9C6eCgi88E6djkOXSLs7fO6QARBQs5BT8vmPBOdjw6rj_r9G8C5QF4LgE",
  },
  {
    id: "#TRX-98211",
    initials: "ML",
    name: "Maya Lestari",
    event: "Acoustic Session 2024",
    ticketClass: "General",
    ticketClassStyle:
      "bg-surface-container-highest text-on-surface-variant",
    qty: 1,
    total: "Rp 850.000",
    bank: "Bank Mandiri",
    transferDate: "24 Oct 2023, 16:05",
    proof:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDYk1M8G8k8BMggiSsjmgByuWL5AqTVm9a7U4tZRfRBfNWKfbWwLwrUu8vCnYB7k1Ds3Sm5VpoekXRBmWX_DRitRbgtk-0UwzSgarBdMigp6dOwbU2iEcfOZPykJXZbSqVbyFcyelgKImr_Fi2rM9Wr5N7-Qvmj2-GaIAdjq_LFUfNs_-3gxSjVLIEL8Rs3YVjg0KPf-CMSUujwULbLsL9C6eCgi88E6djkOXSLs7fO6QARBQs5BT8vmPBOdjw6rj_r9G8C5QF4LgE",
  },
];

const FILTERS = ["All", "Menunggu Verifikasi", "Disetujui", "Ditolak"];

export default function VerifikasiTransaksiPage() {
  const [activeFilter, setActiveFilter] = useState("Menunggu Verifikasi");
  const [previewTrx, setPreviewTrx] = useState<
    (typeof TRANSACTIONS)[number] | null
  >(null);

  return (
    <AdminLayout>
      <div className="mb-2 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">
            Verifikasi Transaksi
          </h2>
          <p className="font-body-base text-body-base text-on-surface-variant">
            Review dan kelola bukti pembayaran tiket konser.
          </p>
        </div>
        <div className="flex gap-2 p-1 bg-surface-container-highest rounded-xl">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 text-label-md font-label-md rounded-lg transition-all ${
                activeFilter === filter
                  ? "bg-surface shadow-sm text-primary"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-2">
        <div className="bg-white border border-outline-variant p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <p className="text-label-md font-label-md text-on-surface-variant">
            Total Pending
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-headline-lg font-headline-lg text-primary">
              24
            </span>
            <span className="text-label-sm font-label-sm text-primary">
              +3 hari ini
            </span>
          </div>
        </div>
        <div className="bg-white border border-outline-variant p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <p className="text-label-md font-label-md text-on-surface-variant">
            Nominal Pending
          </p>
          <p className="text-headline-lg font-headline-lg text-on-surface">
            Rp 42.5M
          </p>
        </div>
        <div className="bg-white border border-outline-variant p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <p className="text-label-md font-label-md text-on-surface-variant">
            Efisiensi Verifikasi
          </p>
          <p className="text-headline-lg font-headline-lg text-on-surface">
            94.2%
          </p>
        </div>
        <div className="bg-white border border-outline-variant p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <p className="text-label-md font-label-md text-on-surface-variant">
            Avg. Response Time
          </p>
          <p className="text-headline-lg font-headline-lg text-on-surface">
            12 Menit
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-6 py-4 text-label-md font-semibold text-on-surface-variant uppercase tracking-wider">
                  ID Transaksi
                </th>
                <th className="px-6 py-4 text-label-md font-semibold text-on-surface-variant uppercase tracking-wider">
                  Nama Pelanggan
                </th>
                <th className="px-6 py-4 text-label-md font-semibold text-on-surface-variant uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-4 text-label-md font-semibold text-on-surface-variant uppercase tracking-wider">
                  Kelas Tiket
                </th>
                <th className="px-6 py-4 text-label-md font-semibold text-on-surface-variant uppercase tracking-wider text-center">
                  Jumlah
                </th>
                <th className="px-6 py-4 text-label-md font-semibold text-on-surface-variant uppercase tracking-wider">
                  Total Bayar
                </th>
                <th className="px-6 py-4 text-label-md font-semibold text-on-surface-variant uppercase tracking-wider text-center">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {TRANSACTIONS.map((trx) => (
                <tr
                  key={trx.id}
                  className="hover:bg-surface-container-low/50 transition-colors cursor-pointer"
                  onClick={() => setPreviewTrx(trx)}
                >
                  <td className="px-6 py-4 font-label-md text-primary">
                    {trx.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container text-[10px] font-bold">
                        {trx.initials}
                      </div>
                      <span className="font-body-base text-body-base">
                        {trx.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-body-sm text-body-sm">
                    {trx.event}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-label-sm font-label-sm ${trx.ticketClassStyle}`}
                    >
                      {trx.ticketClass}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center font-body-base">
                    {trx.qty}
                  </td>
                  <td className="px-6 py-4 font-label-md font-bold">
                    {trx.total}
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className="flex justify-center gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-primary text-on-primary hover:bg-primary/90 transition-all shadow-sm">
                        <Icon name="check" className="text-[20px]" />
                      </button>
                      <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-error text-error hover:bg-error/10 transition-all">
                        <Icon name="close" className="text-[20px]" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 bg-surface-container-low flex justify-between items-center">
          <span className="text-body-sm text-on-surface-variant">
            Showing {TRANSACTIONS.length} of 24 transactions
          </span>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 border border-outline-variant rounded hover:bg-surface transition-colors disabled:opacity-50"
              disabled
            >
              <Icon name="chevron_left" className="text-[18px]" />
            </button>
            <button className="px-3 py-1 border border-outline-variant rounded hover:bg-surface transition-colors">
              <Icon name="chevron_right" className="text-[18px]" />
            </button>
          </div>
        </div>
      </div>

      {/* Proof of Payment Modal */}
      {previewTrx && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-on-background/40 backdrop-blur-sm"
            onClick={() => setPreviewTrx(null)}
          />
          <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-outline-variant flex justify-between items-center sticky top-0 bg-white">
              <div>
                <h3 className="text-headline-md font-headline-md text-on-surface">
                  Proof of Payment
                </h3>
                <p className="text-body-sm text-on-surface-variant">
                  Transaction ID: {previewTrx.id} - {previewTrx.name}
                </p>
              </div>
              <button
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-highest transition-colors"
                onClick={() => setPreviewTrx(null)}
              >
                <Icon name="close" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto bg-surface-container-low flex-1 flex flex-col items-center">
              <div className="w-full max-w-md bg-white p-4 shadow-xl rounded-lg border border-outline-variant">
                <div className="relative aspect-[3/4] rounded-md overflow-hidden bg-surface-dim">
                  <Image
                    className="object-contain"
                    src={previewTrx.proof}
                    alt={`Bukti transfer ${previewTrx.name}`}
                    fill
                    sizes="400px"
                  />
                </div>
                <div className="mt-4 space-y-3">
                  <div className="flex justify-between border-b border-outline-variant pb-2">
                    <span className="text-label-sm text-on-surface-variant">
                      Bank Pengirim
                    </span>
                    <span className="font-label-md text-on-surface">
                      {previewTrx.bank}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-outline-variant pb-2">
                    <span className="text-label-sm text-on-surface-variant">
                      Nama Pengirim
                    </span>
                    <span className="font-label-md text-on-surface">
                      {previewTrx.name}
                    </span>
                  </div>
                  <div className="flex justify-between pb-2">
                    <span className="text-label-sm text-on-surface-variant">
                      Tanggal Transfer
                    </span>
                    <span className="font-label-md text-on-surface">
                      {previewTrx.transferDate}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-8 w-full max-w-md flex flex-col gap-4">
                <div className="p-4 bg-primary-fixed/20 border border-primary/20 rounded-xl flex gap-3">
                  <Icon name="info" className="text-primary" />
                  <p className="text-body-sm text-on-primary-fixed-variant">
                    Pastikan nominal transfer sesuai dengan total tagihan
                    termasuk 3 digit kode unik.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-outline-variant flex justify-end gap-3 sticky bottom-0 bg-white">
              <button className="px-6 py-2.5 rounded-full border border-error text-error font-label-md hover:bg-error/5 transition-all">
                Reject Transaction
              </button>
              <button className="px-8 py-2.5 rounded-full bg-primary text-on-primary font-label-md shadow-lg shadow-primary/20 hover:bg-primary/90 hover:scale-[1.02] active:scale-95 transition-all">
                Verify &amp; Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
