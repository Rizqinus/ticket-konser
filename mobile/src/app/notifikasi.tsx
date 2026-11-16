import { useState } from "react";
import { View, Text, Pressable, ScrollView, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import Icon from "@/components/Icon";

const FILTERS = ["Semua", "Tiket & Pesanan", "Pembaruan Jadwal", "Promo"];

const NOTIFS = [
  {
    id: "n1",
    icon: "confirmation_number",
    title: "Tiket Berhasil Dikonfirmasi",
    time: "2 menit lalu",
    body: "Pemesanan tiket Pesta Semesta Musik 2026 telah selesai. E-tiket telah aktif di dompet digital Anda.",
  },
  {
    id: "n2",
    icon: "event",
    title: "Jadwal Konser Mendatang",
    time: "1 hari lalu",
    body: "Pengingat: Konser Malam Akustik Senopati di Bandung dimulai besok pukul 19:30 WIB. Gerbang venue dibuka mulai pukul 18:00 WIB.",
  },
  {
    id: "n3",
    icon: "local_offer",
    title: "Presale Rock Anthem Dibuka",
    time: "3 hari lalu",
    body: "Dapatkan akses tiket presale Rock Anthem Live Arena dengan potongan harga spesial kuota terbatas.",
  },
];

export default function NotificationScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState("Semua");
  const [read, setRead] = useState<Record<string, boolean>>({});

  return (
    <View className="flex-1 bg-surface">
      <SafeAreaView className="bg-white border-b border-slate-200">
        <View className="flex-row items-center gap-3 px-4 py-3">
          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.replace("/(tabs)"))}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            className="w-11 h-11 rounded-full bg-slate-100 items-center justify-center active:scale-95"
          >
            <Icon name="arrow_back" color="#0F172A" size={20} />
          </Pressable>
          <Text className="text-base font-bold text-slate-900">Pemberitahuan</Text>
        </View>
      </SafeAreaView>

      {/* Filter Chips */}
      <View className="py-2.5">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-5" contentContainerStyle={{ gap: 8 }}>
          {FILTERS.map((f) => {
            const active = filter === f;
            return (
              <Pressable
                key={f}
                onPress={() => setFilter(f)}
                className={`px-4 min-h-[40px] rounded-full items-center justify-center border active:scale-95 ${
                  active ? "bg-slate-900 border-slate-900" : "bg-white border-slate-200"
                }`}
              >
                <Text className={`text-xs font-semibold ${active ? "text-white" : "text-slate-700"}`}>
                  {f}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Notifications List */}
      <ScrollView className="flex-1 px-5 pt-2" contentContainerStyle={{ gap: 10, paddingBottom: 40 }}>
        {NOTIFS.map((n) => (
          <Pressable
            key={n.id}
            onPress={() => setRead((r) => ({ ...r, [n.id]: true }))}
            className={`p-4 rounded-2xl flex-row gap-3 border shadow-2xs ${
              read[n.id] ? "bg-white border-slate-200" : "bg-blue-50/30 border-blue-200"
            }`}
          >
            <View className="w-11 h-11 rounded-xl bg-slate-100 items-center justify-center">
              <Icon name={n.icon} color="#2563EB" size={20} />
            </View>
            <View className="flex-1">
              <View className="flex-row justify-between items-baseline mb-0.5">
                <Text className="font-bold text-slate-900 text-xs flex-1 pr-2">{n.title}</Text>
                <Text className="text-[10px] text-slate-400 font-medium">{n.time}</Text>
              </View>
              <Text className="text-slate-600 text-xs leading-5">{n.body}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
