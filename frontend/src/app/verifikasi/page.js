"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import AdminLayout from "@/components/AdminLayout";
import Icon from "@/components/Icon";
import { api, apiFetch } from "@/lib/api";

const FILTERS = [
  { label: "Menunggu Verifikasi", value: "waiting" },
  { label: "Disetujui", value: "approved" },
  { label: "Ditolak", value: "rejected" },
  { label: "Semua", value: "" },
];

export default function VerifikasiTransaksiPage() {
  const [activeFilter, setActiveFilter] = useState("waiting");
  const [allPayments, setAllPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [previewTrx, setPreviewTrx] = useState(null);
  const [proofBlobUrl, setProofBlobUrl] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  const fetchPayments = useCallback(async (silent = false) => {
    if (!silent) {
      setRefreshing(true);
      if (allPayments.length === 0) setLoading(true);
    }
    try {
      const res = await api.getPayments("");
      setAllPayments(res.data || []);
      setFetchError(null);
    } catch (err) {
      console.error("Gagal memuat transaksi:", err);
      setFetchError(err.message || "Gagal memuat transaksi");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [allPayments.length]);

  // Muat pertama kali dan jalankan polling otomatis setiap 3.5 detik
  useEffect(() => {
    fetchPayments(false);
    const interval = setInterval(() => {
      fetchPayments(true);
    }, 3500);
    return () => clearInterval(interval);
  }, [fetchPayments]);

  // Ambil gambar bukti transfer secara terotentikasi saat modal preview dibuka
  useEffect(() => {
    let active = true;
    async function loadProofImage() {
      if (previewTrx && previewTrx.has_proof) {
        try {
          const token = localStorage.getItem("token");
          const res = await fetch(
            `http://localhost:5000/api/admin/payments/${previewTrx.id}/proof`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (res.ok) {
            const blob = await res.blob();
            if (active) setProofBlobUrl(URL.createObjectURL(blob));
          }
        } catch (e) {
          console.error("Gagal memuat bukti transfer:", e);
        }
      } else {
        setProofBlobUrl(null);
      }
    }

    loadProofImage();

    return () => {
      active = false;
    };
  }, [previewTrx]);

  async function handleVerify(id) {
    if (!confirm("Terima dan setujui verifikasi pembayaran ini? Tiket konser resmi akan otomatis diterbitkan.")) return;
    setProcessingId(id);
    try {
      await api.verifyPayment(id);
      alert("Pembayaran berhasil diterima dan diverifikasi!");
      setPreviewTrx(null);
      fetchPayments(true);
    } catch (err) {
      alert(err.message || "Gagal memverifikasi pembayaran.");
    } finally {
      setProcessingId(null);
    }
  }

  async function handleReject() {
    if (!previewTrx) return;
    setProcessingId(previewTrx.id);
    try {
      await api.rejectPayment(previewTrx.id, rejectReason);
      alert("Pembayaran berhasil ditolak.");
      setShowRejectModal(false);
      setPreviewTrx(null);
      setRejectReason("");
      fetchPayments(true);
    } catch (err) {
      alert(err.message || "Gagal menolak pembayaran.");
    } finally {
      setProcessingId(null);
    }
  }

  async function handleSyncMidtrans(orderCode) {
    setProcessingId(orderCode);
    try {
      const res = await api.syncMidtransStatus(orderCode);
      alert(res.message || "Status Midtrans berhasil diperbarui.");
      if (previewTrx && previewTrx.order_code === orderCode) {
        setPreviewTrx(null);
      }
      fetchPayments(true);
    } catch (err) {
      alert(err.message || "Gagal sinkronisasi status Midtrans.");
    } finally {
      setProcessingId(null);
    }
  }

  const formatIDR = (val) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val || 0);

  const waitingCount = allPayments.filter((p) => p.payment_status === "pending").length;
  const approvedCount = allPayments.filter((p) => p.payment_status === "success").length;
  const rejectedCount = allPayments.filter((p) => p.payment_status === "failed").length;
  const allCount = allPayments.length;

  const filteredPayments = allPayments.filter((p) => {
    if (activeFilter === "waiting") return p.payment_status === "pending";
    if (activeFilter === "approved") return p.payment_status === "success";
    if (activeFilter === "rejected") return p.payment_status === "failed";
    return true;
  });

  const totalPendingNominal = allPayments
    .filter((p) => p.payment_status === "pending")
    .reduce((sum, p) => sum + Number(p.total_price || 0), 0);

  const filterButtons = [
    { label: "Menunggu Verifikasi", value: "waiting", count: waitingCount },
    { label: "Disetujui", value: "approved", count: approvedCount },
    { label: "Ditolak", value: "rejected", count: rejectedCount },
    { label: "Semua", value: "", count: allCount },
  ];

  return (
    <AdminLayout>
      <div className="mb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">
            Penerimaan & Verifikasi Transaksi
          </h2>
          <p className="font-body-base text-body-base text-on-surface-variant">
            Review dan validasi bukti pembayaran transfer manual serta pantau pembayaran otomatis Midtrans.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => fetchPayments(false)}
            disabled={refreshing}
            className="px-3.5 py-2 flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-95"
            title="Segarkan data terbaru"
          >
            <Icon
              name="refresh"
              className={`text-[18px] text-slate-600 ${
                refreshing ? "animate-spin text-blue-600" : ""
              }`}
            />
            <span>{refreshing ? "Memperbarui..." : "Segarkan"}</span>
          </button>
          <div className="flex flex-wrap gap-1.5 p-1 bg-surface-container-highest rounded-xl">
            {filterButtons.map((f) => (
              <button
                key={f.value}
                onClick={() => setActiveFilter(f.value)}
                className={`px-3.5 py-2 text-label-md font-label-md rounded-lg transition-all flex items-center gap-2 ${
                  activeFilter === f.value
                    ? "bg-surface shadow-sm text-primary font-bold"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <span>{f.label}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-mono ${
                    activeFilter === f.value
                      ? "bg-primary-fixed text-primary font-bold"
                      : "bg-surface-container text-on-surface-variant"
                  }`}
                >
                  {f.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Alert Error / Sesi */}
      {fetchError && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-rose-800 shadow-xs mb-4">
          <div className="flex items-center gap-2.5">
            <Icon name="error" className="text-rose-600 text-lg shrink-0" />
            <span>Koneksi / Sesi: {fetchError}. Silakan segarkan halaman atau masuk kembali jika sesi telah berakhir.</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchPayments(false)}
              className="px-3 py-1.5 bg-white border border-rose-300 text-rose-700 rounded-xl font-semibold hover:bg-rose-50 shrink-0"
            >
              Coba Lagi
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "/login";
              }}
              className="px-3 py-1.5 bg-rose-600 text-white rounded-xl font-semibold hover:bg-rose-700 shrink-0"
            >
              Masuk Akun Ulang
            </button>
          </div>
        </div>
      )}

      {/* Info Banner Sistem Verifikasi */}
      <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 flex items-start gap-3 mb-4">
        <Icon name="info" className="text-blue-600 text-lg mt-0.5 shrink-0" />
        <div className="text-xs text-blue-900 leading-5">
          <span className="font-semibold">Informasi Rekening Penerima:</span> Seluruh transfer bank manual masuk ke rekening <b>Bank BCA: 8830 1928 3491 a.n. PT KONSEN TIKET ID</b>. Untuk pembayaran melalui <b>Midtrans Gateway</b> (QRIS, VA, E-Wallet) status akan diverifikasi otomatis oleh payment gateway.
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
        <div className="bg-white border border-outline-variant p-6 rounded-xl shadow-sm">
          <p className="text-label-md font-label-md text-on-surface-variant">
            Total Perlu Diproses (Manual)
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-headline-lg font-headline-lg text-primary">
              {waitingCount}
            </span>
            <span className="text-label-sm text-on-surface-variant">Transaksi</span>
          </div>
        </div>
        <div className="bg-white border border-outline-variant p-6 rounded-xl shadow-sm">
          <p className="text-label-md font-label-md text-on-surface-variant">
            Total Nominal Antrean
          </p>
          <p className="text-headline-lg font-headline-lg text-on-surface">
            {formatIDR(totalPendingNominal)}
          </p>
        </div>
        <div className="bg-white border border-outline-variant p-6 rounded-xl shadow-sm">
          <p className="text-label-md font-label-md text-on-surface-variant">
            Transaksi Disetujui / Lunas
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-headline-lg font-headline-lg text-emerald-600">
              {approvedCount}
            </span>
            <span className="text-label-sm text-on-surface-variant">Berhasil</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-5 py-4 text-label-md font-semibold text-on-surface-variant uppercase tracking-wider">
                  Order Code
                </th>
                <th className="px-5 py-4 text-label-md font-semibold text-on-surface-variant uppercase tracking-wider">
                  Pelanggan & Pengirim
                </th>
                <th className="px-5 py-4 text-label-md font-semibold text-on-surface-variant uppercase tracking-wider">
                  Rekening Penerima
                </th>
                <th className="px-5 py-4 text-label-md font-semibold text-on-surface-variant uppercase tracking-wider">
                  Event / Konser
                </th>
                <th className="px-5 py-4 text-label-md font-semibold text-on-surface-variant uppercase tracking-wider">
                  Kategori Tiket
                </th>
                <th className="px-5 py-4 text-label-md font-semibold text-on-surface-variant uppercase tracking-wider text-center">
                  Qty
                </th>
                <th className="px-5 py-4 text-label-md font-semibold text-on-surface-variant uppercase tracking-wider">
                  Total Bayar
                </th>
                <th className="px-5 py-4 text-label-md font-semibold text-on-surface-variant uppercase tracking-wider">
                  Status
                </th>
                <th className="px-5 py-4 text-label-md font-semibold text-on-surface-variant uppercase tracking-wider text-center">
                  Aksi & Penerimaan
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-6 py-8 text-center text-on-surface-variant font-body-sm"
                  >
                    {loading
                      ? "Memuat transaksi..."
                      : "Tidak ada transaksi pembayaran pada kategori ini."}
                  </td>
                </tr>
              ) : (
                filteredPayments.map((trx) => {
                  const isMidtrans = trx.payment_method?.startsWith("midtrans");
                  const isPending = trx.payment_status === "pending";
                  const isSuccess = trx.payment_status === "success";

                  return (
                    <tr
                      key={trx.id}
                      className="hover:bg-surface-container-low/50 transition-colors cursor-pointer"
                      onClick={() => setPreviewTrx(trx)}
                    >
                      <td className="px-5 py-4 font-mono font-semibold text-label-md text-primary">
                        {trx.order_code}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col">
                          <span className="font-body-base font-medium">
                            {trx.sender_name || trx.customer_name}
                          </span>
                          <span className="text-label-sm text-on-surface-variant">
                            {isMidtrans
                              ? "Midtrans (Otomatis)"
                              : `${trx.sender_bank || "Bank"} a.n. ${trx.sender_name || "-"}`}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        {isMidtrans ? (
                          <span className="inline-flex items-center text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-mono">
                            Midtrans Escrow
                          </span>
                        ) : (
                          <div className="flex flex-col">
                            <span className="text-xs font-semibold text-blue-700">
                              BCA 8830 1928 3491
                            </span>
                            <span className="text-[10px] text-slate-500">
                              PT KONSEN TIKET ID
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4 font-body-sm text-body-sm">
                        {trx.concerts || "Konser Musik"}
                      </td>
                      <td className="px-5 py-4">
                        <span className="px-3 py-1 rounded-full text-label-sm font-label-sm bg-primary-fixed text-primary font-medium">
                          {trx.ticket_categories || "Reguler"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center font-body-base">
                        {trx.quantity || 1}
                      </td>
                      <td className="px-5 py-4 font-label-md font-bold">
                        {formatIDR(trx.total_price)}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-label-sm font-semibold ${
                            isSuccess
                              ? "bg-green-100 text-green-800"
                              : trx.payment_status === "failed"
                              ? "bg-red-100 text-red-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {isSuccess
                            ? isMidtrans ? "Lunas (Midtrans)" : "Disetujui"
                            : trx.payment_status === "failed"
                            ? "Ditolak"
                            : isMidtrans ? "Menunggu Bayar" : "Perlu Verifikasi"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div
                          className="flex justify-center items-center gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {isPending && isMidtrans && (
                            <button
                              title="Sinkronkan Status dari Midtrans"
                              disabled={processingId === trx.order_code}
                              onClick={() => handleSyncMidtrans(trx.order_code)}
                              className="px-2.5 py-1.5 flex items-center gap-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 active:scale-95 transition-all text-xs font-semibold shadow-xs"
                            >
                              <Icon name="sync" className="text-[14px]" />
                              <span>{processingId === trx.order_code ? "Cek..." : "Midtrans"}</span>
                            </button>
                          )}
                          {isPending && (
                            <>
                              <button
                                title="Terima Pembayaran & Terbitkan Tiket"
                                disabled={processingId === trx.id}
                                onClick={() => handleVerify(trx.id)}
                                className="px-2.5 py-1.5 flex items-center gap-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-xs text-xs font-semibold active:scale-95"
                              >
                                <Icon name="check" className="text-[16px]" />
                                <span>Terima</span>
                              </button>
                              <button
                                title="Tolak Pembayaran"
                                onClick={() => {
                                  setPreviewTrx(trx);
                                  setShowRejectModal(true);
                                }}
                                className="px-2 py-1.5 flex items-center gap-1 rounded-lg border border-rose-300 text-rose-700 hover:bg-rose-50 transition-all text-xs font-semibold"
                              >
                                <Icon name="close" className="text-[14px]" />
                                <span>Tolak</span>
                              </button>
                            </>
                          )}
                          <button
                            title="Lihat Detail & Bukti"
                            onClick={() => setPreviewTrx(trx)}
                            className="px-2.5 py-1.5 rounded-lg border border-outline-variant text-label-sm hover:bg-surface-container-highest transition-all"
                          >
                            Detail
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Proof & Details Modal */}
      {previewTrx && !showRejectModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setPreviewTrx(null)}
          />
          <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-outline-variant flex justify-between items-center sticky top-0 bg-white">
              <div>
                <h3 className="text-headline-md font-headline-md text-on-surface">
                  Detail Pembayaran ({previewTrx.order_code})
                </h3>
                <p className="text-body-sm text-on-surface-variant">
                  Pelanggan: {previewTrx.sender_name || previewTrx.customer_name} ({previewTrx.customer_email || "-"})
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
              {previewTrx.payment_method?.startsWith("midtrans") ? (
                <div className="w-full max-w-md bg-white p-6 shadow-md rounded-2xl border border-outline-variant text-center">
                  <div className="w-14 h-14 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-3 text-blue-600">
                    <Icon name="payments" className="text-3xl" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">
                    Midtrans Payment Gateway
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 mb-4 leading-4">
                    Transaksi diverifikasi secara otomatis oleh sistem payment gateway. Tidak memerlukan upload bukti transfer manual.
                  </p>

                  <div className="bg-slate-50 rounded-xl p-4 text-left space-y-2.5 border border-slate-200">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Status Pembayaran:</span>
                      <span
                        className={`font-semibold ${
                          previewTrx.payment_status === "success"
                            ? "text-emerald-700"
                            : previewTrx.payment_status === "failed"
                            ? "text-rose-700"
                            : "text-amber-700"
                        }`}
                      >
                        {previewTrx.payment_status === "success"
                          ? "Lunas (Otomatis)"
                          : previewTrx.payment_status === "failed"
                          ? "Dibatalkan / Expired"
                          : "Menunggu Pembayaran Pembeli"}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Kode Pesanan:</span>
                      <span className="font-mono font-semibold text-slate-900">
                        {previewTrx.order_code}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Nama Pelanggan:</span>
                      <span className="font-medium text-slate-900">
                        {previewTrx.customer_name}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Email:</span>
                      <span className="text-slate-900">
                        {previewTrx.customer_email || "-"}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Kategori Tiket:</span>
                      <span className="text-slate-900">
                        {previewTrx.ticket_categories || "Reguler"} ({previewTrx.quantity || 1} tiket)
                      </span>
                    </div>
                    <div className="flex justify-between text-xs border-t border-slate-200 pt-2">
                      <span className="text-slate-500">Total Nominal:</span>
                      <span className="font-bold text-blue-600">
                        {formatIDR(previewTrx.total_price)}
                      </span>
                    </div>
                  </div>

                  {previewTrx.payment_status === "pending" && (
                    <button
                      onClick={() => handleSyncMidtrans(previewTrx.order_code)}
                      disabled={processingId === previewTrx.order_code}
                      className="mt-4 w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <Icon name="sync" className="text-[16px]" />
                      <span>
                        {processingId === previewTrx.order_code
                          ? "Mengecek status..."
                          : "Sinkronkan Status dari Midtrans"}
                      </span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="w-full max-w-md bg-white p-4 shadow-xl rounded-lg border border-outline-variant">
                  <div className="relative aspect-[3/4] rounded-md overflow-hidden bg-surface-dim flex items-center justify-center">
                    {proofBlobUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        className="w-full h-full object-contain"
                        src={proofBlobUrl}
                        alt={`Bukti transfer ${previewTrx.order_code}`}
                      />
                    ) : (
                      <div className="text-center p-4 text-on-surface-variant text-sm">
                        <Icon name="image" className="text-4xl mb-2 text-outline" />
                        <p>
                          {previewTrx.has_proof
                            ? "Memuat foto bukti transfer..."
                            : "Belum ada bukti transfer yang diunggah."}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 space-y-3">
                    <div className="flex justify-between border-b border-outline-variant pb-2">
                      <span className="text-label-sm text-on-surface-variant">Bank Pengirim</span>
                      <span className="font-label-md text-on-surface">
                        {previewTrx.sender_bank || "-"}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-outline-variant pb-2">
                      <span className="text-label-sm text-on-surface-variant">Nama Pemilik Rekening Pengirim</span>
                      <span className="font-label-md text-on-surface">
                        {previewTrx.sender_name || "-"}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-outline-variant pb-2">
                      <span className="text-label-sm text-on-surface-variant">Rekening Penerima</span>
                      <span className="font-label-md font-bold text-blue-700">
                        BCA 8830 1928 3491 a.n. PT KONSEN TIKET ID
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-outline-variant pb-2">
                      <span className="text-label-sm text-on-surface-variant">Total Tagihan</span>
                      <span className="font-label-md font-bold text-primary">
                        {formatIDR(previewTrx.total_price)}
                      </span>
                    </div>
                    {previewTrx.reject_reason && (
                      <div className="flex flex-col gap-1 p-3 bg-red-50 rounded-lg border border-red-200">
                        <span className="text-xs font-bold text-red-700">Alasan Penolakan:</span>
                        <span className="text-xs text-red-600">{previewTrx.reject_reason}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {previewTrx.payment_status === "pending" && (
              <div className="p-6 border-t border-outline-variant flex flex-wrap justify-end gap-3 sticky bottom-0 bg-white">
                <button
                  onClick={() => setShowRejectModal(true)}
                  className="px-6 py-2.5 rounded-full border border-error text-error font-label-md hover:bg-error/5 transition-all"
                >
                  Tolak Pembayaran
                </button>
                {previewTrx.payment_method?.startsWith("midtrans") && (
                  <button
                    disabled={processingId === previewTrx.order_code}
                    onClick={() => handleSyncMidtrans(previewTrx.order_code)}
                    className="px-5 py-2.5 rounded-full border border-blue-600 text-blue-600 font-label-md hover:bg-blue-50 transition-all inline-flex items-center gap-1.5"
                  >
                    <Icon name="sync" className="text-[16px]" />
                    <span>Cek Status Midtrans</span>
                  </button>
                )}
                <button
                  disabled={processingId === previewTrx.id}
                  onClick={() => handleVerify(previewTrx.id)}
                  className="px-8 py-2.5 rounded-full bg-emerald-600 text-white font-label-md shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all font-bold"
                >
                  Terima Pembayaran (Setujui & Terbitkan Tiket)
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowRejectModal(false)}
          />
          <div className="relative bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-on-surface mb-2">Tolak Pembayaran</h3>
            <p className="text-sm text-on-surface-variant mb-4">
              Masukkan alasan penolakan bukti transfer ini agar pembeli mendapat notifikasi.
            </p>
            <textarea
              className="w-full border border-outline-variant rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
              rows={3}
              placeholder="Contoh: Bukti transfer buram / mutasi rekening belum masuk"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 text-sm text-on-surface-variant hover:bg-surface-container-highest rounded-lg"
              >
                Batal
              </button>
              <button
                disabled={processingId === previewTrx?.id}
                onClick={handleReject}
                className="px-6 py-2 text-sm bg-error text-white font-medium rounded-lg hover:bg-red-700"
              >
                Konfirmasi Tolak
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
