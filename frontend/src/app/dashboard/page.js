"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminLayout from "@/components/AdminLayout";
import Icon from "@/components/Icon";
import { api } from "@/lib/api";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    total_concerts: 0,
    total_tickets: 0,
    total_revenue: 0,
    total_pending_verifications: 0,
    total_orders: 0,
  });
  const [recentPayments, setRecentPayments] = useState([]);
  const [filterTab, setFilterTab] = useState("all"); // "all" | "waiting" | "success"
  const [syncingCode, setSyncingCode] = useState(null);
  const [previewTrx, setPreviewTrx] = useState(null);
  const [proofBlobUrl, setProofBlobUrl] = useState(null);
  const [verifyingId, setVerifyingId] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  async function loadDashboard(silent = false) {
    if (!silent) setRefreshing(true);
    try {
      const [dashRes, paymentsRes] = await Promise.allSettled([
        api.getDashboard(),
        api.getPayments(""),
      ]);

      if (dashRes.status === "fulfilled" && dashRes.value?.data) {
        setStats(dashRes.value.data);
      }
      if (paymentsRes.status === "fulfilled") {
        const list = Array.isArray(paymentsRes.value?.data)
          ? paymentsRes.value.data
          : Array.isArray(paymentsRes.value)
          ? paymentsRes.value
          : [];
        setRecentPayments(list);
        setFetchError(null);
      }
      if (paymentsRes.status === "rejected") {
        setFetchError(paymentsRes.reason?.message || "Gagal memuat data pembayaran");
      }
    } catch (err) {
      console.error("Gagal memuat data dashboard:", err);
      setFetchError(err.message || "Gagal memuat data dashboard");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  // Muat data awal dan jalankan auto-polling setiap 3.5 detik agar transaksi baru langsung muncul
  useEffect(() => {
    loadDashboard();
    const interval = setInterval(() => {
      loadDashboard(true);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // Ambil gambar bukti transfer secara terotentikasi saat modal preview dibuka
  useEffect(() => {
    let active = true;
    async function loadProof() {
      if (previewTrx && previewTrx.has_proof) {
        try {
          const token = localStorage.getItem("token");
          const res = await fetch(
            `http://localhost:5000/api/admin/payments/${previewTrx.id}/proof`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (res.ok) {
            const blob = await res.blob();
            if (active) setProofBlobUrl(URL.createObjectURL(blob));
          }
        } catch (e) {
          console.error("Gagal memuat foto bukti transfer:", e);
        }
      } else {
        setProofBlobUrl(null);
      }
    }

    loadProof();
    return () => {
      active = false;
    };
  }, [previewTrx]);

  async function handleSyncMidtrans(orderCode) {
    setSyncingCode(orderCode);
    try {
      const res = await api.syncMidtransStatus(orderCode);
      alert(res.message || "Status Midtrans berhasil diperbarui.");
      loadDashboard(true);
    } catch (err) {
      alert(err.message || "Gagal sinkronisasi status Midtrans.");
    } finally {
      setSyncingCode(null);
    }
  }

  async function handleVerify(id) {
    if (!confirm("Terima dan setujui pembayaran ini? Tiket konser resmi akan otomatis diterbitkan ke akun pembeli.")) return;
    setVerifyingId(id);
    try {
      const res = await api.verifyPayment(id);
      alert(res.message || "Pembayaran berhasil diterima dan diverifikasi! Tiket resmi telah terbit.");
      setPreviewTrx(null);
      loadDashboard(true);
    } catch (err) {
      alert(err.message || "Gagal memverifikasi pembayaran.");
    } finally {
      setVerifyingId(null);
    }
  }

  async function handleReject(id) {
    const reason = prompt(
      "Masukkan alasan penolakan pembayaran (opsional):",
      "Nominal tidak sesuai atau mutasi bank belum masuk."
    );
    if (reason === null) return;
    setRejectingId(id);
    try {
      await api.rejectPayment(id, reason);
      alert("Pembayaran berhasil ditolak.");
      setPreviewTrx(null);
      loadDashboard(true);
    } catch (err) {
      alert(err.message || "Gagal menolak pembayaran.");
    } finally {
      setRejectingId(null);
    }
  }

  const formatIDR = (val) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val || 0);

  const pendingPayments = recentPayments.filter(
    (p) => (p.payment_status || "").toLowerCase().trim() === "pending"
  );

  const STAT_CARDS = [
    {
      icon: "event",
      label: "Event Aktif",
      value: stats.total_concerts || 0,
      delta: "Konser Berjalan",
      badgeColor: "bg-slate-100 text-slate-700",
      iconBg: "bg-slate-100 text-slate-800",
    },
    {
      icon: "confirmation_number",
      label: "Tiket Terbit",
      value: (stats.total_tickets || 0).toLocaleString("id-ID"),
      delta: "Total Unit",
      badgeColor: "bg-blue-50 text-blue-700 border border-blue-200",
      iconBg: "bg-blue-50 text-blue-700",
    },
    {
      icon: "payments",
      label: "Total Pendapatan",
      value: formatIDR(stats.total_revenue),
      delta: "Transaksi Berhasil",
      badgeColor: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      iconBg: "bg-emerald-50 text-emerald-700",
    },
    {
      icon: "pending_actions",
      label: "Perlu Verifikasi",
      value: stats.total_pending_verifications || pendingPayments.length || 0,
      delta: pendingPayments.length > 0 ? "Menunggu Penerimaan" : "Semua Terverifikasi",
      isCritical: (stats.total_pending_verifications || pendingPayments.length) > 0,
      badgeColor:
        (stats.total_pending_verifications || pendingPayments.length) > 0
          ? "bg-amber-100 text-amber-900 border border-amber-300 font-bold animate-pulse"
          : "bg-slate-100 text-slate-600",
      iconBg:
        (stats.total_pending_verifications || pendingPayments.length) > 0
          ? "bg-amber-100 text-amber-800"
          : "bg-slate-100 text-slate-700",
    },
  ];

  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Ringkasan Penjualan & Tiket
          </h2>
          <p className="text-sm text-slate-600 mt-0.5">
            Pantau metrik penjualan, kapasitas event, dan verifikasi penerimaan pembayaran masuk.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => loadDashboard(false)}
            disabled={refreshing}
            className="px-3.5 py-2 flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-95"
            title="Segarkan data terbaru secara manual"
          >
            <Icon
              name="refresh"
              className={`text-[18px] text-slate-600 ${
                refreshing ? "animate-spin text-blue-600" : ""
              }`}
            />
            <span>{refreshing ? "Memperbarui..." : "Segarkan"}</span>
          </button>
          <Link
            href="/event"
            className="px-4 py-2 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-xl text-xs font-semibold shadow-xs transition-all"
          >
            <Icon name="add" className="text-[18px]" />
            <span>Buat Event Baru</span>
          </Link>
        </div>
      </div>

      {/* Alert Error Koneksi API */}
      {fetchError && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs text-rose-800 shadow-xs">
          <div className="flex items-center gap-2.5">
            <Icon name="error" className="text-rose-600 text-lg shrink-0" />
            <span>Koneksi API: {fetchError}. Pastikan server backend aktif di http://localhost:5000.</span>
          </div>
          <button
            onClick={() => loadDashboard(false)}
            className="px-3 py-1.5 bg-white border border-rose-300 text-rose-700 rounded-xl font-semibold hover:bg-rose-50 shrink-0"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((card) => (
          <div
            key={card.label}
            className={`bg-white p-5 rounded-2xl border transition-all ${
              card.isCritical
                ? "border-amber-300 bg-amber-50/30 shadow-sm"
                : "border-slate-200/90 shadow-sm hover:border-slate-300"
            }`}
          >
            <div className="flex justify-between items-center mb-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${card.iconBg}`}
              >
                <Icon name={card.icon} className="text-[20px]" />
              </div>
              <span
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${card.badgeColor}`}
              >
                {card.delta}
              </span>
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {card.label}
            </p>
            <h3 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
              {loading ? "..." : card.value}
            </h3>
          </div>
        ))}
      </div>

      {/* Kotak Notifikasi Penerimaan Pembayaran Masuk (Jika Ada Yang Pending) */}
      {pendingPayments.length > 0 && (
        <div className="bg-amber-50/80 border border-amber-300/80 rounded-2xl p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs shrink-0">
                <Icon name="notification_important" className="text-xl" />
              </div>
              <div>
                <h4 className="font-bold text-amber-950 text-base">
                  Penerimaan Pembayaran Masuk ({pendingPayments.length} Menunggu)
                </h4>
                <p className="text-xs text-amber-800 mt-0.5">
                  Pembeli telah menyelesaikan pembayaran. Silakan periksa mutasi rekening penerima dan terima pembayaran untuk menerbitkan tiket resmi.
                </p>
              </div>
            </div>
            <Link
              href="/verifikasi"
              className="px-3.5 py-1.5 bg-amber-900 hover:bg-amber-950 text-white rounded-xl text-xs font-semibold transition-all inline-flex items-center gap-1.5 shadow-xs shrink-0"
            >
              <span>Buka Menu Verifikasi</span>
              <Icon name="arrow_forward" className="text-[14px]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pendingPayments.slice(0, 6).map((p) => {
              const isMidtrans = p.payment_method?.startsWith("midtrans");
              return (
                <div
                  key={p.id}
                  className="bg-white p-4 rounded-xl border border-amber-200/90 shadow-2xs flex flex-col justify-between gap-3"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="font-mono text-xs font-bold text-blue-600">
                        {p.order_code}
                      </span>
                      <h5 className="font-semibold text-slate-900 text-sm mt-0.5">
                        {p.sender_name || p.customer_name || "Pembeli"}
                      </h5>
                      <p className="text-xs text-slate-500">
                        {p.concerts || "Konser Musik"} ({p.ticket_categories || "Reguler"})
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-slate-900 block">
                        {formatIDR(p.total_price)}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold inline-block mt-1">
                        {isMidtrans ? "Midtrans" : "Transfer BCA"}
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-[11px] text-slate-600 flex flex-col gap-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Pengirim:</span>
                      <span className="font-medium text-slate-800">
                        {p.sender_bank || "Bank Transfer"} a.n. {p.sender_name || p.customer_name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Rekening Penerima:</span>
                      <span className="font-semibold text-blue-700">
                        BCA: 8830 1928 3491 (PT KONSEN TIKET ID)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                    {!isMidtrans && (
                      <button
                        onClick={() => setPreviewTrx(p)}
                        className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-all inline-flex items-center justify-center gap-1.5"
                      >
                        <Icon name="image" className="text-[15px]" />
                        <span>Cek Bukti</span>
                      </button>
                    )}
                    {isMidtrans && (
                      <button
                        onClick={() => handleSyncMidtrans(p.order_code)}
                        disabled={syncingCode === p.order_code}
                        className="py-2 px-3 bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold transition-all inline-flex items-center justify-center gap-1"
                      >
                        <Icon name="sync" className="text-[14px]" />
                        <span>{syncingCode === p.order_code ? "Cek..." : "Midtrans"}</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleVerify(p.id)}
                      disabled={verifyingId === p.id}
                      className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-lg text-xs font-bold transition-all inline-flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Icon name="check_circle" className="text-[15px]" />
                      <span>{verifyingId === p.id ? "Memproses..." : "Terima Pembayaran"}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Transactions & Payments Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Penerimaan Pembayaran & Transaksi Terbaru
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Pantau arus pembayaran tiket masuk dari Midtrans otomatis maupun transfer manual.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <button
                onClick={() => setFilterTab("all")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  filterTab === "all"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Semua ({recentPayments.length})
              </button>
              <button
                onClick={() => setFilterTab("waiting")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  filterTab === "waiting"
                    ? "bg-white text-amber-800 shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Perlu Verifikasi ({pendingPayments.length})
              </button>
              <button
                onClick={() => setFilterTab("success")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  filterTab === "success"
                    ? "bg-white text-emerald-800 shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Lunas ({recentPayments.filter((p) => (p.payment_status || "").toLowerCase().trim() === "success").length})
              </button>
            </div>

            <Link
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 ml-1"
              href="/verifikasi"
            >
              <span>Halaman Verifikasi Lengkap</span>
              <Icon name="arrow_forward" className="text-[14px]" />
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Kode Pesanan
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Pelanggan & Pengirim
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Rekening Penerima
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Konser / Event
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Jumlah Bayar
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Waktu
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                  Aksi & Penerimaan
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {recentPayments
                .filter((trx) => {
                  const status = (trx.payment_status || "").toLowerCase().trim();
                  if (filterTab === "waiting") return status === "pending";
                  if (filterTab === "success") return status === "success";
                  return true;
                })
                .slice(0, 30).length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-12 text-center text-slate-500 text-xs"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Icon name="inbox" className="text-3xl text-slate-300" />
                      <p className="font-medium">
                        {loading
                          ? "Memuat data penerimaan pembayaran..."
                          : "Belum ada transaksi pembayaran pada kategori ini."}
                      </p>
                      <button
                        onClick={() => loadDashboard(false)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 mt-1"
                      >
                        <Icon name="refresh" className="text-[14px]" />
                        <span>Perbarui Data</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                recentPayments
                  .filter((trx) => {
                    const status = (trx.payment_status || "").toLowerCase().trim();
                    if (filterTab === "waiting") return status === "pending";
                    if (filterTab === "success") return status === "success";
                    return true;
                  })
                  .slice(0, 30)
                  .map((trx) => {
                    const isMidtrans = trx.payment_method?.startsWith("midtrans");
                    const status = (trx.payment_status || "").toLowerCase().trim();
                    const isSuccess = status === "success";
                    const isPending = status === "pending";

                    return (
                      <tr
                        key={trx.id}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="px-4 py-3.5 font-mono text-xs font-semibold text-slate-900">
                          {trx.order_code || `#ORD-${trx.order_id}`}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex flex-col">
                            <span className="font-medium text-slate-900 text-xs">
                              {trx.customer_name || trx.sender_name || "Pembeli"}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              {isMidtrans
                                ? "Midtrans Gateway (Otomatis)"
                                : `${trx.sender_bank || "Bank Transfer"} a.n. ${trx.sender_name || "-"}`}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          {isMidtrans ? (
                            <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md font-mono">
                              Midtrans Escrow
                            </span>
                          ) : (
                            <div className="flex flex-col">
                              <span className="text-xs font-semibold text-blue-700">
                                BCA 8830 1928 3491
                              </span>
                              <span className="text-[10px] text-slate-500">
                                a.n. PT KONSEN TIKET ID
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-xs text-slate-700">
                          <span className="line-clamp-1 font-medium">
                            {trx.concerts || "Konser Musik"}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {trx.ticket_categories || "Reguler"} ({trx.quantity || 1} tiket)
                          </span>
                        </td>
                        <td className="px-4 py-3.5 font-semibold text-slate-900 text-xs">
                          {formatIDR(trx.amount || trx.total_price)}
                        </td>
                        <td className="px-4 py-3.5 text-xs text-slate-500">
                          {trx.created_at
                            ? new Date(trx.created_at).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "-"}
                        </td>
                        <td className="px-4 py-3.5">
                          {isSuccess ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] rounded-full font-semibold">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              {isMidtrans ? "Lunas (Midtrans)" : "Lunas (Disetujui)"}
                            </span>
                          ) : isPending ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-50 border border-amber-200 text-amber-800 text-[11px] rounded-full font-semibold">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                              {isMidtrans ? "Menunggu Bayar" : "Perlu Verifikasi"}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-rose-50 border border-rose-200 text-rose-800 text-[11px] rounded-full font-semibold">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                              Ditolak
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          {isPending ? (
                            <div className="inline-flex items-center gap-1.5 justify-end">
                              {isMidtrans && (
                                <button
                                  onClick={() => handleSyncMidtrans(trx.order_code)}
                                  disabled={syncingCode === trx.order_code}
                                  className="px-2.5 py-1.5 bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-700 active:scale-95 rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-1"
                                >
                                  <Icon name="sync" className="text-[13px]" />
                                  <span>
                                    {syncingCode === trx.order_code
                                      ? "Cek..."
                                      : "Midtrans"}
                                  </span>
                                </button>
                              )}
                              {!isMidtrans && (
                                <button
                                  onClick={() => setPreviewTrx(trx)}
                                  title="Periksa Foto Bukti Transfer"
                                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-1"
                                >
                                  <Icon name="image" className="text-[14px]" />
                                  <span>Bukti</span>
                                </button>
                              )}
                              <button
                                onClick={() => handleVerify(trx.id)}
                                disabled={verifyingId === trx.id}
                                title="Terima Pembayaran & Terbitkan Tiket"
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1 shadow-xs"
                              >
                                <Icon name="check" className="text-[14px]" />
                                <span>
                                  {verifyingId === trx.id ? "..." : "Terima"}
                                </span>
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setPreviewTrx(trx)}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 rounded-lg text-xs font-semibold transition-all inline-block"
                            >
                              Detail
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Preview Bukti Transfer & Konfirmasi Penerimaan */}
      {previewTrx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setPreviewTrx(null)}
          />
          <div className="relative bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-10 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Penerimaan Pembayaran ({previewTrx.order_code})
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pelanggan: {previewTrx.customer_name || previewTrx.sender_name} ({previewTrx.customer_email || "-"})
                </p>
              </div>
              <button
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-500 transition-colors"
                onClick={() => setPreviewTrx(null)}
              >
                <Icon name="close" className="text-lg" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto bg-slate-50 flex-1 space-y-4">
              {/* Box Bukti Transfer */}
              {previewTrx.payment_method?.startsWith("midtrans") ? (
                <div className="bg-white p-5 rounded-xl border border-slate-200 text-center">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-2.5">
                    <Icon name="payments" className="text-2xl" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    Transaksi Midtrans Gateway
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Verifikasi dilakukan secara otomatis oleh sistem payment gateway Midtrans. Anda juga dapat menerima pembayaran langsung secara manual di bawah.
                  </p>
                </div>
              ) : (
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                    Foto Bukti Transfer Pelanggan
                  </span>
                  <div className="w-full aspect-[4/3] rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                    {proofBlobUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={proofBlobUrl}
                        alt={`Bukti transfer ${previewTrx.order_code}`}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-center p-4 text-slate-400">
                        <Icon name="image" className="text-3xl mb-1 text-slate-300" />
                        <p className="text-xs">
                          {previewTrx.has_proof
                            ? "Memuat foto bukti transfer..."
                            : "Pelanggan belum mengunggah bukti transfer."}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Rincian Rekening & Nominal */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2.5 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <span className="text-slate-500">Bank Pengirim:</span>
                  <span className="font-semibold text-slate-900">
                    {previewTrx.sender_bank || "Transfer Bank"}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <span className="text-slate-500">Nama Pemilik Rekening Pengirim:</span>
                  <span className="font-semibold text-slate-900">
                    {previewTrx.sender_name || previewTrx.customer_name || "-"}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <span className="text-slate-500">Rekening Tujuan / Penerima:</span>
                  <span className="font-bold text-blue-700">
                    BCA 8830 1928 3491 a.n. PT KONSEN TIKET ID
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <span className="text-slate-500">Event & Tiket:</span>
                  <span className="font-medium text-slate-900">
                    {previewTrx.concerts || "Konser Musik"} ({previewTrx.ticket_categories || "Reguler"})
                  </span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-slate-700 font-semibold">Total Tagihan:</span>
                  <span className="font-bold text-base text-blue-600">
                    {formatIDR(previewTrx.total_price || previewTrx.amount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 border-t border-slate-100 bg-white flex flex-wrap justify-end gap-2.5">
              <button
                onClick={() => setPreviewTrx(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold transition-all"
              >
                Tutup
              </button>

              {previewTrx.payment_status === "pending" && (
                <>
                  <button
                    onClick={() => handleReject(previewTrx.id)}
                    disabled={rejectingId === previewTrx.id}
                    className="px-4 py-2 border border-rose-300 text-rose-700 hover:bg-rose-50 rounded-xl text-xs font-semibold transition-all"
                  >
                    {rejectingId === previewTrx.id ? "Menolak..." : "Tolak Pembayaran"}
                  </button>

                  <button
                    onClick={() => handleVerify(previewTrx.id)}
                    disabled={verifyingId === previewTrx.id}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <Icon name="check_circle" className="text-base" />
                    <span>
                      {verifyingId === previewTrx.id
                        ? "Menerbitkan Tiket..."
                        : "Terima Pembayaran (Setujui & Terbitkan Tiket)"}
                    </span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
