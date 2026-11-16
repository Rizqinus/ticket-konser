import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Icon from "@/components/Icon";
import { api, getAuth } from "@/lib/api";

export default function CheckoutScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    concert_id?: string;
    concert_title?: string;
    items?: string;
    total?: string;
  }>();

  const [paying, setPaying] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"midtrans" | "manual_transfer">("midtrans");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    // Pastikan sesi autentikasi siap dan isi form dari data pengguna jika ada
    api.ensureAuth().then(() => {
      const { user } = getAuth();
      if (user) {
        setForm({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
        });
      }
    });
  }, []);

  function set(key: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [key]: v }));
  }

  async function handlePay() {
    setPaying(true);
    try {
      // Pastikan sesi login aktif di background
      await api.ensureAuth();

      // Siapkan item pemesanan
      let orderItems: { ticket_category_id: number; quantity: number }[] = [];
      if (params.items) {
        try {
          orderItems = JSON.parse(params.items);
        } catch {
          orderItems = [];
        }
      }

      // Default jika tidak ada item spesifik
      if (orderItems.length === 0) {
        orderItems = [{ ticket_category_id: 1, quantity: 1 }];
      }

      let createdOrderId: any = null;
      let createdOrderCode = `ORD-${Date.now()}`;
      let createdTotal = grandTotal;
      let createdPaymentId: any = null;

      try {
        // Buat pesanan sekaligus daftarkan metode pembayaran yang dipilih
        const res = await api.createOrder(orderItems, paymentMethod);
        if (res.data) {
          createdOrderId = res.data.order_id || res.data.id;
          createdOrderCode = res.data.order_code || createdOrderCode;
          createdTotal = Number(res.data.total_price) || grandTotal;
          createdPaymentId = res.data.payment_id;
        }

        // Pastikan record pembayaran langsung tercatat di database sehingga admin dapat memverifikasinya
        if (createdOrderId && !createdPaymentId) {
          try {
            const payRes = await api.createPayment(createdOrderId, paymentMethod);
            createdPaymentId = payRes.data?.payment_id || payRes.data?.id;
          } catch (payErr: any) {
            console.warn("Pendaftaran pembayaran otomatis:", payErr.message);
          }
        }
      } catch (orderErr: any) {
        console.warn("Pemesanan dibuat saat proses pembayaran:", orderErr.message);
      }

      // Selalu arahkan ke halaman pembayaran dengan data lengkap
      router.push({
        pathname: "/pembayaran",
        params: {
          order_id: createdOrderId ? String(createdOrderId) : undefined,
          order_code: createdOrderCode,
          amount: String(createdTotal),
          concert_title: params.concert_title || "Coldplay World Tour",
          payment_method: paymentMethod,
          payment_id: createdPaymentId ? String(createdPaymentId) : undefined,
        },
      } as any);
    } catch (err: any) {
      console.warn("Gagal membuat pesanan di checkout:", err.message);
      // Fallback: tetap buka pembayaran agar pengguna tidak macet
      router.push({
        pathname: "/pembayaran",
        params: {
          amount: String(grandTotal),
          concert_title: params.concert_title || "Coldplay World Tour",
          payment_method: paymentMethod,
        },
      } as any);
    } finally {
      setPaying(false);
    }
  }

  const rawTotal = Number(params.total) || 500000;
  const serviceFee = 10000;
  const grandTotal = rawTotal + serviceFee;

  const formatIDR = (val: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <View className="flex-1 bg-surface">
      <SafeAreaView className="bg-white border-b border-slate-200">
        <View className="flex-row items-center gap-3 px-4 py-3">
          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.replace("/pilih-tiket"))}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            className="w-11 h-11 rounded-full bg-slate-100 items-center justify-center active:scale-95"
          >
            <Icon name="arrow_back" color="#0F172A" size={20} />
          </Pressable>
          <Text className="text-base font-bold text-slate-900">Konfirmasi Pemesanan</Text>
        </View>
      </SafeAreaView>

      <ScrollView className="flex-1 px-5 pt-4" contentContainerStyle={{ gap: 20, paddingBottom: 110 }}>
        {/* Security Badge */}
        <View className="flex-row items-center gap-3 bg-emerald-50 border border-emerald-200 p-4 rounded-2xl">
          <Icon name="verified_user" color="#059669" size={22} />
          <View className="flex-1">
            <Text className="font-bold text-xs text-emerald-900">Pemesanan Tiket Terverifikasi</Text>
            <Text className="text-[11px] text-emerald-700 mt-0.5">
              Identitas pemesan akan dicantumkan pada kode e-tiket resmi konser.
            </Text>
          </View>
        </View>

        {/* Contact Info Form */}
        <View>
          <Text className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Informasi Pemesan
          </Text>
          <View className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm gap-3">
            <View>
              <Text className="text-xs font-semibold text-slate-700 mb-1">Nama Lengkap</Text>
              <View className="flex-row items-center border border-slate-200 rounded-xl px-3.5 h-12 bg-slate-50/50">
                <Icon name="person" color="#64748B" size={18} />
                <TextInput
                  className="flex-1 ml-2 text-slate-900 text-sm"
                  placeholder="Nama sesuai KTP/Paspor"
                  placeholderTextColor="#94A3B8"
                  value={form.name}
                  onChangeText={(v) => set("name", v)}
                />
              </View>
            </View>

            <View>
              <Text className="text-xs font-semibold text-slate-700 mb-1">Alamat Email</Text>
              <View className="flex-row items-center border border-slate-200 rounded-xl px-3.5 h-12 bg-slate-50/50">
                <Icon name="mail" color="#64748B" size={18} />
                <TextInput
                  className="flex-1 ml-2 text-slate-900 text-sm"
                  placeholder="Tiket QR dikirim ke email ini"
                  placeholderTextColor="#94A3B8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={form.email}
                  onChangeText={(v) => set("email", v)}
                />
              </View>
            </View>

            <View>
              <Text className="text-xs font-semibold text-slate-700 mb-1">Nomor WhatsApp / Telepon</Text>
              <View className="flex-row items-center border border-slate-200 rounded-xl px-3.5 h-12 bg-slate-50/50">
                <Icon name="call" color="#64748B" size={18} />
                <TextInput
                  className="flex-1 ml-2 text-slate-900 text-sm"
                  placeholder="08xxxxxxxxxx"
                  placeholderTextColor="#94A3B8"
                  keyboardType="phone-pad"
                  value={form.phone}
                  onChangeText={(v) => set("phone", v)}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Pilihan Metode Pembayaran (2 Pilihan) */}
        <View>
          <Text className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Pilihan Metode Pembayaran
          </Text>
          <View className="gap-3">
            {/* Pilihan 1: Midtrans Gateway */}
            <Pressable
              onPress={() => setPaymentMethod("midtrans")}
              hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
              className={`p-4 rounded-2xl border transition-all ${
                paymentMethod === "midtrans"
                  ? "bg-blue-50/50 border-blue-600 shadow-xs"
                  : "bg-white border-slate-200"
              }`}
            >
              <View className="flex-row items-start gap-3">
                <View
                  className={`w-10 h-10 rounded-xl items-center justify-center shrink-0 ${
                    paymentMethod === "midtrans"
                      ? "bg-blue-600"
                      : "bg-slate-100"
                  }`}
                >
                  <Icon
                    name="payments"
                    color={paymentMethod === "midtrans" ? "#ffffff" : "#64748B"}
                    size={20}
                  />
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-sm font-bold text-slate-900">
                      Midtrans Payment Gateway
                    </Text>
                    <View className="bg-emerald-100 px-2 py-0.5 rounded-full">
                      <Text className="text-[10px] font-bold text-emerald-800 uppercase">
                        Otomatis
                      </Text>
                    </View>
                  </View>
                  <Text className="text-xs text-slate-500 mt-1 leading-4">
                    QRIS, Virtual Account BCA, Mandiri, BNI, BRI, GoPay, dan E-Wallet. Verifikasi instan detik itu juga tanpa perlu konfirmasi admin.
                  </Text>
                </View>
                <View
                  className={`w-5 h-5 rounded-full border items-center justify-center mt-0.5 ${
                    paymentMethod === "midtrans"
                      ? "border-blue-600 bg-blue-600"
                      : "border-slate-300 bg-white"
                  }`}
                >
                  {paymentMethod === "midtrans" && (
                    <View className="w-2 h-2 rounded-full bg-white" />
                  )}
                </View>
              </View>
            </Pressable>

            {/* Pilihan 2: Transfer Bank Manual */}
            <Pressable
              onPress={() => setPaymentMethod("manual_transfer")}
              hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
              className={`p-4 rounded-2xl border transition-all ${
                paymentMethod === "manual_transfer"
                  ? "bg-blue-50/50 border-blue-600 shadow-xs"
                  : "bg-white border-slate-200"
              }`}
            >
              <View className="flex-row items-start gap-3">
                <View
                  className={`w-10 h-10 rounded-xl items-center justify-center shrink-0 ${
                    paymentMethod === "manual_transfer"
                      ? "bg-blue-600"
                      : "bg-slate-100"
                  }`}
                >
                  <Icon
                    name="account_balance"
                    color={paymentMethod === "manual_transfer" ? "#ffffff" : "#64748B"}
                    size={20}
                  />
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-sm font-bold text-slate-900">
                      Transfer Bank Manual (BCA)
                    </Text>
                    <View className="bg-amber-100 px-2 py-0.5 rounded-full">
                      <Text className="text-[10px] font-bold text-amber-800 uppercase">
                        Perlu Verifikasi
                      </Text>
                    </View>
                  </View>
                  <Text className="text-xs text-slate-500 mt-1 leading-4">
                    Transfer langsung ke rekening BCA penyelenggara konser. Wajib mengunggah foto bukti struk transfer untuk diverifikasi admin.
                  </Text>
                </View>
                <View
                  className={`w-5 h-5 rounded-full border items-center justify-center mt-0.5 ${
                    paymentMethod === "manual_transfer"
                      ? "border-blue-600 bg-blue-600"
                      : "border-slate-300 bg-white"
                  }`}
                >
                  {paymentMethod === "manual_transfer" && (
                    <View className="w-2 h-2 rounded-full bg-white" />
                  )}
                </View>
              </View>
            </Pressable>
          </View>
        </View>

        {/* Pricing Summary */}
        <View>
          <Text className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Rincian Pembayaran
          </Text>
          <View className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm gap-2.5">
            <View className="flex-row justify-between items-center">
              <Text className="text-xs text-slate-600">Subtotal Tiket</Text>
              <Text className="text-xs font-semibold text-slate-900">{formatIDR(rawTotal)}</Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-xs text-slate-600">Biaya Layanan &amp; Pajak</Text>
              <Text className="text-xs font-semibold text-slate-900">{formatIDR(serviceFee)}</Text>
            </View>
            <View className="h-[1px] bg-slate-100 my-1" />
            <View className="flex-row justify-between items-center">
              <Text className="font-bold text-slate-900 text-sm">Total Tagihan</Text>
              <Text className="font-bold text-blue-600 text-lg">{formatIDR(grandTotal)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <SafeAreaView className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-md">
        <View className="px-5 py-3">
          <Pressable
            onPress={handlePay}
            disabled={paying}
            hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
            className="bg-blue-600 hover:bg-blue-700 active:scale-[0.98] min-h-[48px] rounded-xl items-center justify-center flex-row gap-2 shadow-sm"
          >
            {paying ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <>
                <Text className="text-white font-bold text-sm">
                  {paymentMethod === "midtrans"
                    ? "Lanjut ke Pembayaran Midtrans"
                    : "Lanjut ke Transfer Manual BCA"}
                </Text>
                <Icon name="arrow_forward" color="#ffffff" size={16} />
              </>
            )}
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}
