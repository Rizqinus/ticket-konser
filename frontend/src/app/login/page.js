"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Icon from "@/components/Icon";
import GigpassLogo from "@/components/GigpassLogo";
import { api } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await api.login(email.trim(), password);
      if (res.data?.user?.role !== "admin") {
        setError("Akses ditolak: Akun Anda terdaftar sebagai penonton, bukan administrator.");
        setSubmitting(false);
        return;
      }
      router.push("/dashboard");
    } catch (err) {
      setError(err.message || "Gagal masuk. Periksa kembali email dan kata sandi Anda.");
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-950 text-slate-100 overflow-x-hidden">
      {/* Kolom Kiri: Visual Panggung & Identitas Gigpass (Tampil Penuh di Layar Desktop) */}
      <div className="hidden lg:flex lg:w-7/12 xl:w-2/3 relative flex-col justify-between p-12 xl:p-16 overflow-hidden">
        {/* Background Foto Panggung Konser Riil */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/concerts/stadium-concert.jpg"
            alt="Panggung Konser Stadion Gigpass"
            fill
            className="object-cover"
            priority
          />
          {/* Lapisan Gradien Gelap untuk Kenyamanan Baca */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/40" />
        </div>

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <GigpassLogo size={42} className="shadow-lg shadow-blue-600/30 shrink-0" />
          <div>
            <span className="text-xl font-extrabold tracking-tight text-white">Gigpass</span>
            <span className="block text-xs text-blue-200 font-medium">Platform Tiket & Konser Musik</span>
          </div>
        </div>

        {/* Hero Copywriting */}
        <div className="relative z-10 max-w-xl my-auto py-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-semibold mb-6 backdrop-blur-xs">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            Pusat Operasional Tiket Musik
          </div>

          <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-tight mb-4">
            Kelola Penjualan Tiket Konser & Panggung Musik Terpusat.
          </h1>

          <p className="text-sm xl:text-base text-slate-300 leading-relaxed max-w-lg">
            Pantau arus tiket penonton, kelola pesanan masuk, dan atur alokasi kuota kategori tiket panggung konser Anda secara terpadu.
          </p>
        </div>

        {/* Footer Kolom Kiri */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Sistem Operasional Aktif</span>
          </div>
          <span>© 2026 Gigpass. Seluruh hak cipta dilindungi.</span>
        </div>
      </div>

      {/* Kolom Kanan: Formulir Masuk Full Height */}
      <div className="w-full lg:w-5/12 xl:w-1/3 min-h-screen bg-white text-slate-900 flex flex-col justify-between p-6 sm:p-10 xl:p-12 shadow-2xl z-10">
        {/* Header Form & Mobile Brand */}
        <div>
          {/* Header untuk tampilan mobile */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8 pt-2">
            <GigpassLogo size={36} className="shadow-md shadow-blue-600/20 shrink-0" />
            <div>
              <span className="text-lg font-bold text-slate-900 leading-none">Gigpass</span>
              <span className="block text-[11px] text-slate-500">Portal Pengelola Konser</span>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Masuk ke Panel Pengelola
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Masukkan email dan kata sandi akun administrator Anda untuk membuka pusat kendali tiket.
            </p>
          </div>

          {/* Pesan Error */}
          {error && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-medium flex items-start gap-2.5 animate-shake">
              <Icon name="error" className="text-rose-600 text-[18px] shrink-0 mt-0.5" />
              <span className="leading-5">{error}</span>
            </div>
          )}

          {/* Form Input */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label
                className="block text-xs font-bold uppercase tracking-wider text-slate-700"
                htmlFor="email"
              >
                Email Administrator
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <Icon name="mail" className="text-[18px]" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="admin@skibidi.com"
                  className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 transition-all outline-none focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700"
                  htmlFor="password"
                >
                  Kata Sandi
                </label>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <Icon name="lock" className="text-[18px]" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Ketik kata sandi akun"
                  className="block w-full pl-10 pr-11 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 transition-all outline-none focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Sembunyikan kata sandi" : "Lihat kata sandi"}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  <Icon
                    name={showPassword ? "visibility_off" : "visibility"}
                    className="text-[18px]"
                  />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center cursor-pointer select-none">
                <input
                  id="remember"
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-600/20 focus:ring-2 cursor-pointer"
                />
                <span className="ml-2 text-xs text-slate-600">Ingat sesi di peramban ini</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-12 bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white rounded-xl font-semibold text-sm shadow-md transition-all duration-150 flex items-center justify-center gap-2 group disabled:opacity-60 cursor-pointer mt-4"
            >
              <span>{submitting ? "Memverifikasi Akses..." : "Masuk ke Panel Pengelola"}</span>
              <Icon
                name="arrow_forward"
                className="text-[18px] transition-transform group-hover:translate-x-1"
              />
            </button>
          </form>

          {/* Kotak Petunjuk Akses */}
          <div className="mt-6 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
            <span className="font-semibold text-slate-800 block mb-0.5">Catatan Akses Admin:</span>
            Pastikan akun Anda memiliki peran (*role*) administrator. Pengguna biasa disarankan masuk melalui aplikasi mobile penonton.
          </div>
        </div>

        {/* Footer Form */}
        <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Icon name="verified_user" className="text-emerald-600 text-base" />
            <span>Sesi Terenkripsi SSL</span>
          </div>
          <span className="font-medium text-slate-400">Gigpass v1.0</span>
        </div>
      </div>
    </div>
  );
}
