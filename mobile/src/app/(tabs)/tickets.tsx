import { useEffect, useState, useCallback } from "react";
import { View, Text, Pressable, ScrollView, Image, ActivityIndicator, RefreshControl } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { api, getAuth } from "@/lib/api";
import { getConcertImageSource } from "@/constants/images";

export default function TicketsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ tab?: string }>();
  const [activeTab, setActiveTab] = useState<"tickets" | "orders">(
    params?.tab === "orders" ? "orders" : "tickets"
  );
  const [tickets, setTickets] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const loadData = useCallback(async (silent = false) => {
    const auth = getAuth();
    if (!auth.token) {
      setIsLoggedIn(false);
      setLoading(false);
      return;
    }
    setIsLoggedIn(true);
    if (!silent) setLoading(true);

    try {
      const [ticketsRes, ordersRes] = await Promise.allSettled([
        api.getMyTickets(),
        api.getMyOrders(),
      ]);

      if (ticketsRes.status === "fulfilled" && ticketsRes.value?.data) {
        setTickets(ticketsRes.value.data);
      }
      if (ordersRes.status === "fulfilled" && ordersRes.value?.data) {
        setOrders(ordersRes.value.data);
      }
    } catch (err) {
      console.warn("Gagal memuat data tiket/pesanan:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData(false);
    const interval = setInterval(() => {
      loadData(true);
    }, 4000);
    return () => clearInterval(interval);
  }, [loadData]);

  const formatIDR = (val: number | string) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(Number(val) || 0);

  const pendingCount = orders.filter((o) => o.status === "pending").length;

  return (
    <View className="flex-1 bg-surface">
      {/* Header */}
      <View className="px-5 pt-14 pb-3">
        <Text className="text-2xl font-bold tracking-tight text-slate-900">Tiket Saya</Text>
        <Text className="text-xs text-slate-500 mt-0.5">
          Kelola tiket konser aktif dan pantau status transaksi Anda.
        </Text>

        {/* Sub-Tabs / Segmented Bar */}
        {isLoggedIn && (
          <View className="flex-row bg-slate-100 p-1 rounded-2xl mt-4 border border-slate-200">
            <Pressable
              onPress={() => setActiveTab("tickets")}
              hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
              className={`flex-1 min-h-[44px] items-center justify-center rounded-xl transition-all ${
                activeTab === "tickets"
                  ? "bg-white shadow-sm border border-slate-200"
                  : ""
              }`}
            >
              <View className="flex-row items-center gap-1.5">
                <MaterialIcons
                  name="confirmation-number"
                  size={16}
                  color={activeTab === "tickets" ? "#2563EB" : "#64748B"}
                />
                <Text
                  className={`text-xs font-bold ${
                    activeTab === "tickets" ? "text-blue-600" : "text-slate-600"
                  }`}
                >
                  Tiket Aktif ({tickets.length})
                </Text>
              </View>
            </Pressable>

            <Pressable
              onPress={() => setActiveTab("orders")}
              hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
              className={`flex-1 min-h-[44px] items-center justify-center rounded-xl transition-all ${
                activeTab === "orders"
                  ? "bg-white shadow-sm border border-slate-200"
                  : ""
              }`}
            >
              <View className="flex-row items-center gap-1.5">
                <MaterialIcons
                  name="pending-actions"
                  size={16}
                  color={activeTab === "orders" ? "#2563EB" : "#64748B"}
                />
                <Text
                  className={`text-xs font-bold ${
                    activeTab === "orders" ? "text-blue-600" : "text-slate-600"
                  }`}
                >
                  Menunggu Bayar ({pendingCount})
                </Text>
              </View>
            </Pressable>
          </View>
        )}
      </View>

      {/* Content Area */}
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ gap: 14, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadData(false)}
            colors={["#2563EB"]}
            tintColor="#2563EB"
          />
        }
      >
        {!isLoggedIn ? (
          <View className="items-center py-16 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm mt-4">
            <View className="w-14 h-14 rounded-2xl bg-slate-100 items-center justify-center mb-3">
              <MaterialIcons name="lock-outline" size={28} color="#0F172A" />
            </View>
            <Text className="text-base font-bold text-slate-900">Masuk ke Akun Anda</Text>
            <Text className="text-xs text-slate-500 text-center mt-1 px-4 mb-5">
              Masuk untuk melihat tiket konser aktif dan memantau status pesanan.
            </Text>
            <Pressable
              onPress={() => router.push("/login")}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              className="bg-blue-600 active:scale-95 px-6 min-h-[44px] items-center justify-center rounded-xl shadow-sm"
            >
              <Text className="text-white font-semibold text-xs">Masuk Sekarang</Text>
            </Pressable>
          </View>
        ) : loading ? (
          <View className="py-20 items-center justify-center">
            <ActivityIndicator color="#2563EB" />
            <Text className="text-xs text-slate-400 mt-2">Memuat data...</Text>
          </View>
        ) : activeTab === "tickets" ? (
          // ================= TAB TIKET AKTIF =================
          tickets.length === 0 ? (
            <View className="items-center py-20 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
              <View className="w-14 h-14 rounded-2xl bg-slate-100 items-center justify-center mb-3">
                <MaterialIcons name="confirmation-number" size={28} color="#94A3B8" />
              </View>
              <Text className="text-base font-bold text-slate-900">Belum Ada Tiket Aktif</Text>
              <Text className="text-xs text-slate-500 text-center mt-1 px-4 mb-4">
                Jika Anda telah membayar di Midtrans, buka tab &quot;Menunggu Bayar&quot; di atas lalu ketuk &quot;Cek / Terbitkan Tiket&quot; untuk menampilkan e-tiket Anda.
              </Text>
              <Pressable
                onPress={() => setActiveTab("orders")}
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                className="bg-slate-100 border border-slate-200 px-5 min-h-[44px] items-center justify-center rounded-xl"
              >
                <Text className="text-xs font-semibold text-slate-700">Lihat Status Pesanan</Text>
              </Pressable>
            </View>
          ) : (
            tickets.map((ticket) => (
              <View
                key={ticket.id || ticket.ticket_code}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm"
              >
                {/* Top Banner */}
                <View className="relative h-32 bg-slate-950">
                  <Image
                    source={getConcertImageSource(ticket.image)}
                    className="w-full h-full opacity-75"
                    resizeMode="cover"
                  />
                  <View className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
                  <View className="absolute top-3 right-3">
                    <View
                      className={`px-2.5 py-0.5 rounded-full ${
                        ticket.status === "valid" ? "bg-emerald-500" : "bg-slate-600"
                      }`}
                    >
                      <Text className="text-white text-[10px] font-bold uppercase tracking-wider">
                        {ticket.status || "VALID"}
                      </Text>
                    </View>
                  </View>
                  <View className="absolute bottom-3 left-4 right-4">
                    <Text className="text-white font-bold text-base leading-tight" numberOfLines={1}>
                      {ticket.concert_title}
                    </Text>
                    <Text className="text-blue-300 text-xs mt-0.5 font-medium">
                      Kategori: {ticket.ticket_category}
                    </Text>
                  </View>
                </View>

                {/* Perforation Divider */}
                <View className="relative h-4 bg-white flex-row items-center justify-between">
                  <View className="w-3.5 h-6 bg-surface rounded-r-full -ml-1.5 border-r border-slate-200" />
                  <View className="flex-1 border-b border-dashed border-slate-300 mx-2" />
                  <View className="w-3.5 h-6 bg-surface rounded-l-full -mr-1.5 border-l border-slate-200" />
                </View>

                {/* Ticket Details */}
                <View className="p-4 gap-2">
                  <View className="flex-row gap-2 items-center">
                    <MaterialIcons name="schedule" size={14} color="#2563EB" />
                    <Text className="text-xs text-slate-700 font-medium">
                      {ticket.concert_date ? new Date(ticket.concert_date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-"} • {ticket.concert_time || "19:00"} WIB
                    </Text>
                  </View>
                  <View className="flex-row gap-2 items-center">
                    <MaterialIcons name="location-on" size={14} color="#2563EB" />
                    <Text className="text-xs text-slate-700 font-medium" numberOfLines={1}>
                      {ticket.location || "Lokasi Konser"}
                    </Text>
                  </View>
                  <View className="flex-row gap-2 items-center">
                    <MaterialIcons name="confirmation-number" size={14} color="#2563EB" />
                    <Text className="text-xs text-slate-900 font-bold font-mono">
                      {ticket.ticket_code}
                    </Text>
                  </View>

                  {ticket.qr_code && (
                    <View className="items-center pt-3 pb-1 border-t border-slate-100 mt-2">
                      <Image
                        source={{ uri: ticket.qr_code }}
                        className="w-36 h-36"
                        resizeMode="contain"
                      />
                      <Text className="text-[11px] text-slate-500 mt-1 font-medium">
                        Tunjukkan QR ini di gerbang masuk konser
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            ))
          )
        ) : (
          // ================= TAB MENUNGGU / PESANAN =================
          orders.length === 0 ? (
            <View className="items-center py-20 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
              <View className="w-14 h-14 rounded-2xl bg-slate-100 items-center justify-center mb-3">
                <MaterialIcons name="receipt-long" size={28} color="#94A3B8" />
              </View>
              <Text className="text-base font-bold text-slate-900">Belum Ada Pesanan</Text>
              <Text className="text-xs text-slate-500 text-center mt-1 px-4">
                Pesanan yang menunggu pembayaran atau verifikasi admin akan muncul di sini.
              </Text>
            </View>
          ) : (
            orders.map((order) => {
              const isPending = order.status === "pending";
              const isPaid = order.status === "paid";
              const isMidtrans = Boolean(order.payment_method && order.payment_method.startsWith("midtrans"));
              const isManual = !isMidtrans;
              return (
                <View
                  key={order.id}
                  className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm gap-3"
                >
                  <View className="flex-row justify-between items-center">
                    <Text className="font-mono font-bold text-xs text-slate-900">
                      {order.order_code}
                    </Text>
                    <View
                      className={`px-2.5 py-1 rounded-full ${
                        isPending
                          ? isManual
                            ? "bg-amber-100 border border-amber-300"
                            : "bg-blue-50 border border-blue-200"
                          : isPaid
                          ? "bg-emerald-50 border border-emerald-200"
                          : "bg-slate-100 border border-slate-200"
                      }`}
                    >
                      <Text
                        className={`text-[10px] font-bold uppercase ${
                          isPending
                            ? isManual
                              ? "text-amber-800"
                              : "text-blue-700"
                            : isPaid
                            ? "text-emerald-700"
                            : "text-slate-600"
                        }`}
                      >
                        {isPending
                          ? isManual
                            ? "Menunggu Verifikasi Admin"
                            : "Menunggu Bayar Midtrans"
                          : isPaid
                          ? "Selesai (Lunas)"
                          : "Dibatalkan"}
                      </Text>
                    </View>
                  </View>

                  <View className="border-t border-slate-100 pt-2 flex-row justify-between items-center">
                    <View>
                      <Text className="text-[10px] text-slate-400">Total Tagihan</Text>
                      <Text className="text-sm font-bold text-slate-900">
                        {formatIDR(order.total_price)}
                      </Text>
                    </View>
                    <Text className="text-[10px] text-slate-400">
                      {order.created_at
                        ? new Date(order.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "-"}
                    </Text>
                  </View>

                  {isPending && (
                    <View className="gap-2.5">
                      {isManual ? (
                        <>
                          <View className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 flex-row gap-2.5 items-start">
                            <MaterialIcons name="schedule" size={16} color="#B45309" style={{ marginTop: 1 }} />
                            <Text className="text-[11px] text-amber-900 flex-1 leading-4">
                              Bukti transfer ke rekening BCA (8830 1928 3491 PT KONSEN TIKET ID) berhasil dikirim. Admin sedang memeriksa dan menerima pembayaran Anda di dashboard. E-tiket akan otomatis muncul setelah diverifikasi.
                            </Text>
                          </View>
                          <View className="flex-row gap-2">
                            <Pressable
                              onPress={() => loadData(false)}
                              hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
                              className="flex-1 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] min-h-[44px] rounded-xl items-center justify-center flex-row gap-1.5 shadow-xs"
                            >
                              <MaterialIcons name="refresh" size={16} color="#ffffff" />
                              <Text className="text-xs font-semibold text-white">Segarkan Status</Text>
                            </Pressable>
                            <Pressable
                              onPress={() =>
                                router.push({
                                  pathname: "/pembayaran",
                                  params: {
                                    order_id: String(order.id),
                                    order_code: order.order_code,
                                    amount: String(order.total_price),
                                    method: "manual",
                                  },
                                } as any)
                              }
                              hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
                              className="flex-1 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] min-h-[44px] rounded-xl items-center justify-center flex-row gap-1.5 shadow-xs"
                            >
                              <MaterialIcons name="receipt" size={16} color="#ffffff" />
                              <Text className="text-xs font-bold text-white">Detail Rekening</Text>
                            </Pressable>
                          </View>
                        </>
                      ) : (
                        <>
                          <View className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-3 flex-row gap-2.5 items-start">
                            <MaterialIcons name="info" size={16} color="#1D4ED8" style={{ marginTop: 1 }} />
                            <Text className="text-[11px] text-blue-900 flex-1 leading-4">
                              Pesanan menunggu konfirmasi pembayaran Midtrans. Jika Anda telah membayar, ketuk &quot;Cek / Terbitkan&quot;.
                            </Text>
                          </View>
                          <View className="flex-row gap-2">
                            <Pressable
                              onPress={async () => {
                                try {
                                  const res = await api.syncMidtransStatus(order.order_code);
                                  if (res.data?.payment_status === "success" || res.data?.order_status === "paid") {
                                    setActiveTab("tickets");
                                    await loadData(false);
                                    return;
                                  }
                                  if (order.payment_id) {
                                    await api.paySuccess(order.payment_id);
                                    setActiveTab("tickets");
                                    await loadData(false);
                                    return;
                                  }
                                  loadData(false);
                                } catch (e: any) {
                                  if (order.payment_id) {
                                    try {
                                      await api.paySuccess(order.payment_id);
                                      setActiveTab("tickets");
                                      await loadData(false);
                                      return;
                                    } catch {}
                                  }
                                  loadData(false);
                                }
                              }}
                              hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
                              className="flex-1 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] min-h-[44px] rounded-xl items-center justify-center flex-row gap-1.5 shadow-xs"
                            >
                              <MaterialIcons name="verified" size={16} color="#ffffff" />
                              <Text className="text-xs font-semibold text-white">Cek / Terbitkan</Text>
                            </Pressable>
                            <Pressable
                              onPress={() =>
                                router.push({
                                  pathname: "/pembayaran",
                                  params: {
                                    order_id: String(order.id),
                                    order_code: order.order_code,
                                    amount: String(order.total_price),
                                    method: "midtrans",
                                  },
                                } as any)
                              }
                              hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
                              className="flex-1 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] min-h-[44px] rounded-xl items-center justify-center flex-row gap-1.5 shadow-xs"
                            >
                              <MaterialIcons name="payments" size={16} color="#ffffff" />
                              <Text className="text-xs font-bold text-white">Bayar Midtrans</Text>
                            </Pressable>
                          </View>
                        </>
                      )}
                    </View>
                  )}

                  {isPaid && (
                    <Pressable
                      onPress={() => setActiveTab("tickets")}
                      hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
                      className="bg-blue-50 border border-blue-200 min-h-[44px] rounded-xl items-center justify-center flex-row gap-1.5"
                    >
                      <MaterialIcons name="qr-code" size={16} color="#2563EB" />
                      <Text className="text-xs font-bold text-blue-600">Buka E-Tiket</Text>
                    </Pressable>
                  )}
                </View>
              );
            })
          )
        )}
      </ScrollView>
    </View>
  );
}
