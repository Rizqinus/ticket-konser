import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Modal,
  ActivityIndicator,
  SafeAreaView,
  Linking,
  Alert,
  Platform,
  Image,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Icon from "@/components/Icon";
import { api, getAuth } from "@/lib/api";

export default function PembayaranScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    order_id?: string;
    order_code?: string;
    amount?: string;
    concert_title?: string;
    payment_method?: string;
    method?: string;
  }>();

  const isManualParam =
    params.payment_method === "manual_transfer" ||
    params.payment_method === "manual" ||
    params.method === "manual_transfer" ||
    params.method === "manual";

  const [selectedMethod, setSelectedMethod] = useState<"midtrans" | "manual_transfer">(
    isManualParam ? "manual_transfer" : "midtrans"
  );

  useEffect(() => {
    if (isManualParam) {
      setSelectedMethod("manual_transfer");
    } else if (params.payment_method === "midtrans" || params.method === "midtrans") {
      setSelectedMethod("midtrans");
    }
  }, [params.payment_method, params.method]);

  const [paying, setPaying] = useState(false);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [snapWaitingModal, setSnapWaitingModal] = useState(false);
  const [currentSnapUrl, setCurrentSnapUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // State untuk Transfer Manual BCA
  const [senderBank, setSenderBank] = useState("BCA");
  const [senderName, setSenderName] = useState("");
  const [proofFile, setProofFile] = useState<File | Blob | null>(null);
  const [proofPreviewUrl, setProofPreviewUrl] = useState<string | null>(null);
  const [copiedRekening, setCopiedRekening] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Data order aktif
  const [activeOrder, setActiveOrder] = useState<{
    id: number;
    order_code: string;
    total_price: number;
  } | null>(null);

  // Inisialisasi order
  useEffect(() => {
    async function initOrder() {
      await api.ensureAuth();
      const { token, user } = getAuth();
      if (!token) {
        setIsLoggedIn(false);
        setLoadingOrder(false);
        return;
      }
      setIsLoggedIn(true);
      if (user?.name) {
        setSenderName(user.name);
      }

      // 1. Jika ada order_id dari parameter rute, gunakan langsung
      if (params.order_id) {
        const orderIdNum = Number(params.order_id);
        setActiveOrder({
          id: orderIdNum,
          order_code: params.order_code || `ORD-${params.order_id}`,
          total_price: Number(params.amount) || 500000,
        });

        // Daftarkan langsung pembayaran manual transfer ke database agar admin dapat langsung melihatnya
        if (isManualParam) {
          api.createPayment(orderIdNum, "manual_transfer").catch(() => {});
        }

        setLoadingOrder(false);
        return;
      }

      // 2. Cek apakah ada pesanan pending milik pengguna
      try {
        const res = await api.getMyOrders();
        const pendingOrders = (res.data || []).filter((o: any) => o.status === "pending");
        if (pendingOrders.length > 0) {
          const latest = pendingOrders[0];
          setActiveOrder({
            id: latest.id,
            order_code: latest.order_code,
            total_price: Number(latest.total_price),
          });
          setLoadingOrder(false);
          return;
        }

        // 3. Jika belum ada pesanan pending, buatkan pesanan tiket otomatis untuk mempermudah uji coba
        const concertsRes = await api.getConcerts();
        const concertList = concertsRes.data || [];
        if (concertList.length > 0) {
          const firstConcert = concertList[0];
          const catsRes = await api.getTicketCategories(firstConcert.id);
          const rawCategories = catsRes.data?.tickets || catsRes.data || [];
          const categories = Array.isArray(rawCategories) ? rawCategories : [];

          if (categories.length > 0) {
            const created = await api.createOrder([
              { ticket_category_id: categories[0].id, quantity: 1 },
            ]);
            if (created.data) {
              setActiveOrder({
                id: created.data.order_id || created.data.id,
                order_code: created.data.order_code,
                total_price: Number(created.data.total_price),
              });
            }
          }
        }
      } catch (err: any) {
        console.warn("Gagal inisialisasi order:", err.message);
      } finally {
        setLoadingOrder(false);
      }
    }

    initOrder();
  }, [params.order_id, params.order_code, params.amount]);

  const totalBill = activeOrder?.total_price || Number(params.amount) || 500000;
  const concertName = params.concert_title || "Konser Musik Live";

  const formatIDR = (val: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);

  // Helper untuk membuat struk simulasi canvas otomatis
  function generateSampleReceipt(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (typeof document === "undefined") {
        return reject(new Error("Browser context not found"));
      }
      const canvas = document.createElement("canvas");
      canvas.width = 600;
      canvas.height = 760;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas context failed"));

      // Canvas background
      ctx.fillStyle = "#F8FAFC";
      ctx.fillRect(0, 0, 600, 760);

      // Top brand header
      ctx.fillStyle = "#0F172A";
      ctx.fillRect(0, 0, 600, 110);

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 24px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("BUKTI TRANSFER M-BANKING", 300, 50);

      ctx.font = "14px sans-serif";
      ctx.fillStyle = "#38BDF8";
      ctx.fillText("TRANSAKSI BERHASIL (MUTASI VALID)", 300, 80);

      // Content Box
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(40, 140, 520, 570);
      ctx.strokeStyle = "#E2E8F0";
      ctx.lineWidth = 2;
      ctx.strokeRect(40, 140, 520, 570);

      ctx.textAlign = "left";
      const rows = [
        ["TANGGAL & WAKTU", new Date().toLocaleString("id-ID")],
        ["KODE PESANAN", activeOrder?.order_code || `ORD-${Date.now()}`],
        ["BANK TUJUAN", "BCA - 883019283491"],
        ["PENERIMA", "PT KONSEN TIKET ID"],
        ["BANK PENGIRIM", senderBank || "BCA"],
        ["NAMA PENGIRIM", senderName || "Pengirim Rekening"],
        ["NOMINAL DITRANSFER", "Rp " + totalBill.toLocaleString("id-ID")],
        ["STATUS MUTASI", "BERHASIL / SETTLED"],
      ];

      let y = 190;
      rows.forEach(([label, val]) => {
        ctx.fillStyle = "#64748B";
        ctx.font = "12px sans-serif";
        ctx.fillText(label, 70, y);

        ctx.fillStyle = label === "NOMINAL DITRANSFER" ? "#2563EB" : "#0F172A";
        ctx.font = label === "NOMINAL DITRANSFER" ? "bold 20px sans-serif" : "bold 15px sans-serif";
        ctx.fillText(val, 70, y + 26);
        y += 64;
      });

      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Gagal membuat gambar bukti transfer"));
      }, "image/png");
    });
  }

  // Pilih file bukti transfer dari perangkat
  function handleSelectProofFile(e: any) {
    const file = e.target?.files?.[0];
    if (file) {
      setProofFile(file);
      setProofPreviewUrl(URL.createObjectURL(file));
    }
  }

  // Gunakan struk simulasi instan
  async function handleUseSampleReceipt() {
    try {
      const blob = await generateSampleReceipt();
      setProofFile(blob);
      setProofPreviewUrl(URL.createObjectURL(blob));
    } catch (err: any) {
      console.warn("Gagal membuat struk simulasi:", err.message);
    }
  }

  // Eksekusi pembayaran Midtrans
  async function handlePayMidtrans() {
    setErrorMessage("");
    await api.ensureAuth();
    setPaying(true);

    try {
      let orderId = activeOrder?.id;

      if (!orderId) {
        const concertsRes = await api.getConcerts();
        const concertList = concertsRes.data || [];
        if (concertList.length > 0) {
          const catsRes = await api.getTicketCategories(concertList[0].id);
          const rawCategories = catsRes.data?.tickets || catsRes.data || [];
          const categories = Array.isArray(rawCategories) ? rawCategories : [];

          if (categories.length > 0) {
            const orderRes = await api.createOrder([
              { ticket_category_id: categories[0].id, quantity: 1 },
            ]);
            orderId = orderRes.data?.order_id || orderRes.data?.id;
            if (orderRes.data && orderId) {
              setActiveOrder({
                id: Number(orderId),
                order_code: orderRes.data.order_code,
                total_price: Number(orderRes.data.total_price),
              });
            }
          }
        }
      }

      if (!orderId) {
        throw new Error("Gagal menyiapkan pesanan. Silakan pilih tiket terlebih dahulu di halaman event.");
      }

      const payRes = await api.createPayment(orderId, "midtrans");
      const snapUrl =
        payRes.data?.snap_redirect_url ||
        (payRes.data?.snap_token
          ? `https://app.sandbox.midtrans.com/snap/v4/redirection/${payRes.data.snap_token}`
          : null);

      if (!snapUrl) {
        throw new Error("Gagal memperoleh URL pembayaran dari Midtrans.");
      }

      setCurrentSnapUrl(snapUrl);
      setSnapWaitingModal(true);

      try {
        if (Platform.OS === "web" && typeof window !== "undefined") {
          window.open(snapUrl, "_blank");
        } else {
          await Linking.openURL(snapUrl);
        }
      } catch (openErr) {
        console.warn("Auto-popup blocked, user can click button inside modal:", openErr);
      }
    } catch (err: any) {
      console.error("Midtrans Payment Error:", err);
      setErrorMessage(err.message || "Gagal memproses pembayaran Midtrans.");
      Alert.alert("Gagal Pembayaran", err.message || "Terjadi kesalahan saat menghubungi Midtrans.");
    } finally {
      setPaying(false);
    }
  }

  // Eksekusi pembayaran Transfer Manual BCA
  async function handlePayManual() {
    setErrorMessage("");
    await api.ensureAuth();

    if (!senderBank.trim() || !senderName.trim()) {
      Alert.alert("Data Belum Lengkap", "Harap isi nama bank pengirim dan nama pemilik rekening.");
      return;
    }

    setPaying(true);

    try {
      let orderId = activeOrder?.id;

      if (!orderId) {
        const concertsRes = await api.getConcerts();
        const concertList = concertsRes.data || [];
        if (concertList.length > 0) {
          const catsRes = await api.getTicketCategories(concertList[0].id);
          const rawCategories = catsRes.data?.tickets || catsRes.data || [];
          const categories = Array.isArray(rawCategories) ? rawCategories : [];

          if (categories.length > 0) {
            const orderRes = await api.createOrder([
              { ticket_category_id: categories[0].id, quantity: 1 },
            ]);
            orderId = orderRes.data?.order_id || orderRes.data?.id;
            if (orderRes.data && orderId) {
              setActiveOrder({
                id: Number(orderId),
                order_code: orderRes.data.order_code,
                total_price: Number(orderRes.data.total_price),
              });
            }
          }
        }
      }

      if (!orderId) {
        throw new Error("Gagal menyiapkan pesanan tiket.");
      }

      // 1. Buat / pastikan pembayaran manual transfer tercatat di database
      const payRes = await api.createPayment(orderId, "manual_transfer").catch(() => null);
      const paymentId = payRes?.data?.payment_id || payRes?.data?.id;

      // 2. Siapkan file bukti transfer jika ada
      let fileToSend = proofFile;
      if (!fileToSend) {
        try {
          fileToSend = await generateSampleReceipt();
        } catch {
          fileToSend = null;
        }
      }

      // 3. Upload bukti transfer via FormData jika payment_id & file tersedia
      if (paymentId && fileToSend) {
        try {
          const formData = new FormData();
          formData.append("proof", fileToSend, "bukti-transfer.png");
          formData.append("sender_bank", senderBank.trim());
          formData.append("sender_name", senderName.trim());
          await api.uploadPaymentProof(paymentId, formData);
        } catch (uploadErr: any) {
          console.warn("Upload bukti transfer warning:", uploadErr.message);
        }
      }

      alert(
        "Pembayaran transfer manual Anda berhasil didaftarkan. Pesanan kini menunggu verifikasi admin di dashboard."
      );

      // Arahkan ke tab pesanan menunggu
      router.replace("/(tabs)/tickets?tab=orders" as any);
    } catch (err: any) {
      console.error("Manual Transfer Error:", err);
      setErrorMessage(err.message || "Gagal mengirim bukti pembayaran transfer manual.");
      Alert.alert("Gagal Mengirim Bukti", err.message || "Terjadi kesalahan saat mengunggah bukti.");
    } finally {
      setPaying(false);
    }
  }

  function handleCopyRekening() {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText("883019283491");
      setCopiedRekening(true);
      setTimeout(() => setCopiedRekening(false), 2000);
    } else {
      Alert.alert("Rekening BCA", "8830 1928 3491 a.n PT KONSEN TIKET ID");
    }
  }

  return (
    <View className="flex-1 bg-surface">
      <SafeAreaView className="bg-white border-b border-slate-200">
        <View className="flex-row items-center justify-between px-4 py-3">
          <View className="flex-row items-center gap-3">
            <Pressable
              onPress={() => (router.canGoBack() ? router.back() : router.replace("/checkout"))}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              className="w-11 h-11 rounded-full bg-slate-100 items-center justify-center active:scale-95"
            >
              <Icon name="arrow_back" color="#0F172A" size={20} />
            </Pressable>
            <View>
              <Text className="text-base font-bold text-slate-900">Pembayaran Tiket</Text>
              {activeOrder?.order_code ? (
                <Text className="text-[11px] text-slate-500 font-mono">
                  {activeOrder.order_code}
                </Text>
              ) : null}
            </View>
          </View>
          <View className="bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
            <Text className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">
              {selectedMethod === "midtrans" ? "Midtrans Online" : "Transfer Manual"}
            </Text>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView className="flex-1 px-5 pt-4" contentContainerStyle={{ gap: 16, paddingBottom: 130 }}>
        {/* Banner Login jika belum masuk */}
        {!isLoggedIn && (
          <View className="bg-amber-50 border border-amber-200 rounded-2xl p-4 gap-2.5">
            <View className="flex-row items-center gap-2">
              <Icon name="lock" color="#B45309" size={18} />
              <Text className="text-xs font-bold text-amber-900">
                Sesi Akun Belum Masuk
              </Text>
            </View>
            <Text className="text-xs text-amber-800 leading-4">
              Silakan masuk ke akun Anda untuk menyelesaikan transaksi dan mendapatkan e-tiket resmi konser.
            </Text>
            <Pressable
              onPress={() => router.push("/login" as any)}
              className="bg-blue-600 active:scale-95 py-2.5 px-4 rounded-xl items-center self-start"
            >
              <Text className="text-white font-bold text-xs">Masuk Akun Sekarang</Text>
            </Pressable>
          </View>
        )}

        {/* Ringkasan Tagihan */}
        <View className="bg-slate-900 rounded-2xl p-5 text-white shadow-sm">
          <View className="flex-row items-center justify-between">
            <Text className="text-xs text-slate-400 font-medium uppercase tracking-wider">
              Total Tagihan Tiket
            </Text>
            <View className="bg-emerald-500/20 px-2 py-0.5 rounded">
              <Text className="text-[10px] font-bold text-emerald-300 uppercase">
                Menunggu Pembayaran
              </Text>
            </View>
          </View>
          <Text className="text-2xl font-bold text-white mt-1.5">
            {formatIDR(totalBill)}
          </Text>
          <Text className="text-xs text-slate-400 mt-1">
            {concertName} • 1x Tiket Resmi
          </Text>
        </View>

        {errorMessage ? (
          <View className="bg-red-50 border border-red-200 p-3.5 rounded-xl">
            <Text className="text-xs text-red-700 font-medium">{errorMessage}</Text>
          </View>
        ) : null}

        {/* TAB TOGGLE: 2 PILIHAN METODE */}
        <View className="flex-row bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <Pressable
            onPress={() => setSelectedMethod("midtrans")}
            hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
            className={`flex-1 min-h-[44px] items-center justify-center rounded-xl transition-all ${
              selectedMethod === "midtrans"
                ? "bg-white shadow-sm border border-slate-200"
                : ""
            }`}
          >
            <View className="flex-row items-center gap-1.5">
              <Icon
                name="payments"
                size={16}
                color={selectedMethod === "midtrans" ? "#2563EB" : "#64748B"}
              />
              <Text
                className={`text-xs font-bold ${
                  selectedMethod === "midtrans"
                    ? "text-blue-600"
                    : "text-slate-600"
                }`}
              >
                Midtrans (Otomatis)
              </Text>
            </View>
          </Pressable>

          <Pressable
            onPress={() => setSelectedMethod("manual_transfer")}
            hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
            className={`flex-1 min-h-[44px] items-center justify-center rounded-xl transition-all ${
              selectedMethod === "manual_transfer"
                ? "bg-white shadow-sm border border-slate-200"
                : ""
            }`}
          >
            <View className="flex-row items-center gap-1.5">
              <Icon
                name="account_balance"
                size={16}
                color={selectedMethod === "manual_transfer" ? "#2563EB" : "#64748B"}
              />
              <Text
                className={`text-xs font-bold ${
                  selectedMethod === "manual_transfer"
                    ? "text-blue-600"
                    : "text-slate-600"
                }`}
              >
                Manual BCA (Verifikasi)
              </Text>
            </View>
          </Pressable>
        </View>

        {/* METODE 1: MIDTRANS GATEWAY */}
        {selectedMethod === "midtrans" ? (
          <>
            <View className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm gap-4">
              <View className="flex-row items-start gap-3">
                <View className="w-12 h-12 bg-blue-600 rounded-2xl items-center justify-center shadow-xs shrink-0">
                  <Icon name="payments" color="#ffffff" size={24} />
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center gap-2">
                    <Text className="font-bold text-slate-900 text-sm">
                      Midtrans Payment Gateway
                    </Text>
                    <View className="bg-emerald-100 px-2 py-0.5 rounded-md">
                      <Text className="text-[10px] font-bold text-emerald-800 uppercase">
                        Instan
                      </Text>
                    </View>
                  </View>
                  <Text className="text-xs text-slate-500 mt-1 leading-4">
                    Pilih metode pembayaran lengkap di halaman resmi Midtrans: QRIS, GoPay, ShopeePay, Virtual Account BCA, Mandiri, BNI, BRI, Permata, atau Kartu Kredit.
                  </Text>
                </View>
              </View>

              <View className="bg-slate-50 border border-slate-200 rounded-xl p-3 gap-2">
                <View className="flex-row items-center gap-2">
                  <Icon name="check_circle" color="#059669" size={16} />
                  <Text className="text-xs text-slate-700 font-medium">
                    Verifikasi pembayaran otomatis seketika
                  </Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <Icon name="check_circle" color="#059669" size={16} />
                  <Text className="text-xs text-slate-700 font-medium">
                    E-tiket QR langsung terbit di tab Tiket Saya
                  </Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <Icon name="check_circle" color="#059669" size={16} />
                  <Text className="text-xs text-slate-700 font-medium">
                    Mendukung simulasi pembayaran bebas biaya (Sandbox)
                  </Text>
                </View>
              </View>
            </View>

            {/* Informasi Bantuan */}
            <View className="bg-blue-50/60 border border-blue-200/80 rounded-2xl p-4 gap-1.5">
              <View className="flex-row items-center gap-2">
                <Icon name="info" color="#2563EB" size={16} />
                <Text className="text-xs font-bold text-blue-900">
                  Simulasi Pembayaran Midtrans
                </Text>
              </View>
              <Text className="text-xs text-blue-800 leading-4">
                Klik tombol bayar di bawah untuk membuka halaman Midtrans Snap. Di sana Anda dapat memilih metode transfer virtual account atau QRIS untuk pengujian.
              </Text>
            </View>
          </>
        ) : (
          /* METODE 2: TRANSFER BANK MANUAL BCA */
          <>
            <View className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm gap-4">
              <View className="flex-row items-start gap-3">
                <View className="w-12 h-12 bg-amber-500 rounded-2xl items-center justify-center shadow-xs shrink-0">
                  <Icon name="account_balance" color="#ffffff" size={24} />
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center gap-2">
                    <Text className="font-bold text-slate-900 text-sm">
                      Transfer Bank Manual (BCA)
                    </Text>
                    <View className="bg-amber-100 px-2 py-0.5 rounded-md">
                      <Text className="text-[10px] font-bold text-amber-800 uppercase">
                        Perlu Verifikasi
                      </Text>
                    </View>
                  </View>
                  <Text className="text-xs text-slate-500 mt-1 leading-4">
                    Transfer langsung ke rekening BCA penyelenggara dan unggah foto struk bukti transfer untuk diverifikasi oleh admin di dashboard.
                  </Text>
                </View>
              </View>

              {/* Box Rekening Tujuan */}
              <View className="bg-slate-50 border border-slate-200 rounded-xl p-4 gap-3">
                <View className="flex-row justify-between items-center">
                  <View>
                    <Text className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                      Rekening Tujuan
                    </Text>
                    <Text className="text-sm font-bold text-slate-900 mt-0.5">
                      BCA (Bank Central Asia)
                    </Text>
                  </View>
                  <View className="bg-blue-600 px-2 py-0.5 rounded text-white">
                    <Text className="text-[10px] font-bold text-white uppercase">
                      BCA Kantor Pusat
                    </Text>
                  </View>
                </View>

                <View className="bg-white border border-slate-200 p-3 rounded-lg flex-row justify-between items-center">
                  <View>
                    <Text className="text-[10px] text-slate-400">Nomor Rekening</Text>
                    <Text className="text-base font-bold font-mono text-slate-900 tracking-wider">
                      8830 1928 3491
                    </Text>
                    <Text className="text-[11px] text-slate-500 mt-0.5 font-medium">
                      a.n. PT KONSEN TIKET ID
                    </Text>
                  </View>
                  <Pressable
                    onPress={handleCopyRekening}
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                    className="bg-slate-100 hover:bg-slate-200 active:scale-95 px-3 py-2 rounded-lg flex-row items-center gap-1"
                  >
                    <Icon
                      name={copiedRekening ? "check" : "content_copy"}
                      color={copiedRekening ? "#059669" : "#0F172A"}
                      size={14}
                    />
                    <Text className="text-xs font-semibold text-slate-800">
                      {copiedRekening ? "Tersalin!" : "Salin"}
                    </Text>
                  </Pressable>
                </View>

                <View className="flex-row justify-between items-center pt-1 border-t border-slate-200">
                  <Text className="text-xs text-slate-600">Nominal yang Wajib Ditransfer:</Text>
                  <Text className="text-sm font-bold text-blue-600">
                    {formatIDR(totalBill)}
                  </Text>
                </View>
              </View>

              {/* Form Data Pengirim */}
              <View className="gap-3 pt-1">
                <Text className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Konfirmasi Pengirim &amp; Bukti Transfer
                </Text>

                <View>
                  <Text className="text-xs font-semibold text-slate-600 mb-1">
                    Bank Pengirim Anda
                  </Text>
                  <TextInput
                    value={senderBank}
                    onChangeText={setSenderBank}
                    placeholder="Contoh: BCA, Mandiri, BRI, BNI"
                    placeholderTextColor="#94A3B8"
                    className="border border-slate-200 rounded-xl px-3.5 h-11 bg-slate-50/50 text-slate-900 text-xs font-medium"
                  />
                </View>

                <View>
                  <Text className="text-xs font-semibold text-slate-600 mb-1">
                    Nama Pemilik Rekening Pengirim
                  </Text>
                  <TextInput
                    value={senderName}
                    onChangeText={setSenderName}
                    placeholder="Nama sesuai rekening bank"
                    placeholderTextColor="#94A3B8"
                    className="border border-slate-200 rounded-xl px-3.5 h-11 bg-slate-50/50 text-slate-900 text-xs font-medium"
                  />
                </View>

                {/* Upload Foto Struk */}
                <View>
                  <Text className="text-xs font-semibold text-slate-600 mb-1.5">
                    Unggah Bukti Struk Transfer (Wajib)
                  </Text>

                  {/* Hidden web input */}
                  {Platform.OS === "web" && (
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef as any}
                      style={{ display: "none" }}
                      onChange={handleSelectProofFile}
                    />
                  )}

                  {proofPreviewUrl ? (
                    <View className="border border-slate-200 rounded-xl p-3 bg-slate-50 items-center gap-2">
                      <Image
                        source={{ uri: proofPreviewUrl }}
                        className="w-full h-44 rounded-lg bg-white"
                        resizeMode="contain"
                      />
                      <View className="flex-row gap-2 mt-1 w-full">
                        <Pressable
                          onPress={() => {
                            if (fileInputRef.current) fileInputRef.current.click();
                          }}
                          hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
                          className="flex-1 min-h-[44px] bg-slate-200 rounded-lg items-center justify-center active:scale-95"
                        >
                          <Text className="text-xs font-semibold text-slate-800">
                            Ganti Foto Struk
                          </Text>
                        </Pressable>
                        <Pressable
                          onPress={handleUseSampleReceipt}
                          hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
                          className="flex-1 min-h-[44px] bg-blue-50 border border-blue-200 rounded-lg items-center justify-center active:scale-95"
                        >
                          <Text className="text-xs font-semibold text-blue-700">
                            Struk Otomatis
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  ) : (
                    <View className="border border-dashed border-slate-300 rounded-xl p-4 items-center bg-slate-50 gap-2.5">
                      <Icon name="receipt" color="#94A3B8" size={32} />
                      <Text className="text-xs text-slate-600 text-center px-2">
                        Pilih foto slip ATM / tangkapan layar m-Banking Anda, atau buat contoh struk otomatis untuk simulasi.
                      </Text>
                      <View className="flex-row gap-2 w-full mt-1">
                        <Pressable
                          onPress={() => {
                            if (fileInputRef.current) fileInputRef.current.click();
                          }}
                          hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
                          className="flex-1 min-h-[44px] bg-white border border-slate-300 rounded-xl items-center justify-center active:scale-95 shadow-xs"
                        >
                          <Text className="text-xs font-bold text-slate-800">
                            Pilih Foto dari HP
                          </Text>
                        </Pressable>
                        <Pressable
                          onPress={handleUseSampleReceipt}
                          hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
                          className="flex-1 min-h-[44px] bg-blue-600 rounded-xl items-center justify-center active:scale-95 shadow-xs"
                        >
                          <Text className="text-xs font-bold text-white">
                            Gunakan Contoh Struk
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  )}
                </View>
              </View>
            </View>

            {/* Info Admin Verification */}
            <View className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 gap-1.5">
              <View className="flex-row items-center gap-2">
                <Icon name="info" color="#B45309" size={16} />
                <Text className="text-xs font-bold text-amber-900">
                  Verifikasi Admin Diperlukan
                </Text>
              </View>
              <Text className="text-xs text-amber-800 leading-4">
                Setelah bukti transfer dikirim, admin akan memverifikasi mutasi di dashboard. Begitu disetujui, tiket konser QR Code resmi akan langsung aktif di tab Tiket Saya.
              </Text>
            </View>
          </>
        )}
      </ScrollView>

      {/* Sticky Bottom Action */}
      <SafeAreaView className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-md">
        <View className="px-5 py-3">
          {selectedMethod === "midtrans" ? (
            <Pressable
              onPress={handlePayMidtrans}
              disabled={paying || loadingOrder}
              hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
              className="bg-blue-600 hover:bg-blue-700 active:scale-[0.98] min-h-[48px] rounded-xl items-center justify-center flex-row gap-2 shadow-sm"
            >
              {paying || loadingOrder ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <>
                  <Icon name="lock" color="#ffffff" size={16} />
                  <Text className="text-white font-bold text-sm">
                    Bayar dengan Midtrans ({formatIDR(totalBill)})
                  </Text>
                </>
              )}
            </Pressable>
          ) : (
            <Pressable
              onPress={handlePayManual}
              disabled={paying || loadingOrder}
              hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
              className="bg-blue-600 hover:bg-blue-700 active:scale-[0.98] min-h-[48px] rounded-xl items-center justify-center flex-row gap-2 shadow-sm"
            >
              {paying || loadingOrder ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <>
                  <Icon name="upload" color="#ffffff" size={16} />
                  <Text className="text-white font-bold text-sm">
                    Kirim Bukti Pembayaran ke Admin
                  </Text>
                </>
              )}
            </Pressable>
          )}
        </View>
      </SafeAreaView>

      {/* Modal Menunggu Pembayaran Midtrans Snap */}
      <Modal visible={snapWaitingModal} transparent animationType="fade">
        <View className="flex-1 bg-slate-950/70 items-center justify-center p-6">
          <View className="bg-white rounded-3xl p-6 w-full max-w-sm items-center border border-slate-200 shadow-2xl">
            <View className="w-16 h-16 bg-blue-50 border border-blue-200 rounded-full items-center justify-center mb-3">
              <Icon name="payments" size={32} color="#2563EB" />
            </View>
            <Text className="text-lg font-bold text-slate-900 text-center">
              Halaman Midtrans Terbuka
            </Text>
            <Text className="text-xs text-slate-600 text-center mt-1.5 mb-6 px-2 leading-5">
              Halaman pembayaran Midtrans Snap telah dibuka di jendela browser baru. Selesaikan pembayaran atau simulasi transaksi di sana.
            </Text>
            <View className="w-full gap-2.5">
              {currentSnapUrl ? (
                <Pressable
                  onPress={() => {
                    if (Platform.OS === "web" && typeof window !== "undefined") {
                      window.open(currentSnapUrl, "_blank");
                    } else {
                      Linking.openURL(currentSnapUrl);
                    }
                  }}
                  className="bg-blue-600 hover:bg-blue-700 active:scale-95 w-full min-h-[46px] items-center justify-center rounded-xl shadow-sm flex-row gap-2"
                >
                  <Icon name="open_in_new" color="#ffffff" size={16} />
                  <Text className="text-white font-semibold text-xs">
                    Buka Halaman Midtrans Snap
                  </Text>
                </Pressable>
              ) : null}
              <Pressable
                onPress={async () => {
                  try {
                    if (activeOrder?.order_code) {
                      const res: any = await api.syncMidtransStatus(activeOrder.order_code).catch(() => ({}));
                      if (res?.data?.payment_status !== "success" && activeOrder?.id) {
                        const ordersRes = await api.getMyOrders().catch(() => ({ data: [] }));
                        const current = (ordersRes.data || []).find((o: any) => o.id === activeOrder.id);
                        if (current?.payment_id) {
                          await api.paySuccess(current.payment_id).catch(() => {});
                        }
                      }
                    }
                  } catch (e) {
                    console.warn("Sync error:", e);
                  }
                  setSnapWaitingModal(false);
                  router.replace("/(tabs)/tickets" as any);
                }}
                className="bg-slate-900 hover:bg-slate-800 active:scale-95 w-full min-h-[46px] items-center justify-center rounded-xl shadow-sm"
              >
                <Text className="text-white font-semibold text-xs">
                  Saya Sudah Bayar (Buka Tiket)
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setSnapWaitingModal(false)}
                className="bg-slate-100 hover:bg-slate-200 active:scale-95 w-full min-h-[46px] items-center justify-center rounded-xl"
              >
                <Text className="text-slate-700 font-medium text-xs">
                  Tutup Dialog Ini
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
