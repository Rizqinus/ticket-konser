import { useState } from "react";
import { View, Text, Pressable, ScrollView, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import Icon from "@/components/Icon";
import { getAuth } from "@/lib/api";

function Toggle({ value, onToggle }: { value: boolean; onToggle: () => void }) {
  return (
    <Pressable
      onPress={onToggle}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      className={`w-12 h-7 rounded-full p-0.5 justify-center ${value ? "bg-blue-600" : "bg-slate-300"}`}
    >
      <View
        className="w-6 h-6 rounded-full bg-white shadow-sm"
        style={{ transform: [{ translateX: value ? 20 : 0 }] }}
      />
    </Pressable>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const auth = getAuth();
  const user = auth.user;
  const [eventAlerts, setEventAlerts] = useState(true);
  const [ticketUpdates, setTicketUpdates] = useState(true);

  return (
    <View className="flex-1 bg-surface">
      <SafeAreaView className="bg-white border-b border-slate-200">
        <View className="flex-row items-center gap-3 px-4 py-3">
          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.replace("/(tabs)/profile"))}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            className="w-11 h-11 rounded-full bg-slate-100 items-center justify-center active:scale-95"
          >
            <Icon name="arrow_back" color="#0F172A" size={20} />
          </Pressable>
          <Text className="text-base font-bold text-slate-900">Pengaturan Akun</Text>
        </View>
      </SafeAreaView>

      <ScrollView className="flex-1 px-5 pt-4" contentContainerStyle={{ gap: 16, paddingBottom: 40 }}>
        {/* User Badge */}
        <View className="flex-row items-center gap-3.5 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <View className="w-12 h-12 rounded-xl bg-slate-900 items-center justify-center">
            <Text className="text-white font-bold text-lg">
              {(user?.name || "U").charAt(0).toUpperCase()}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="font-bold text-slate-900 text-sm">{user?.name || "Akun Pengguna"}</Text>
            <Text className="text-xs text-slate-500">{user?.email || "Belum masuk akun"}</Text>
          </View>
        </View>

        {/* Section: Notifikasi */}
        <View className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Preferensi Notifikasi
          </Text>
          <View className="flex-row items-center justify-between py-2.5">
            <View className="flex-1 pr-3">
              <Text className="text-xs font-bold text-slate-900">Pengingat Jadwal Konser</Text>
              <Text className="text-[11px] text-slate-500">Kirim notifikasi 1 hari sebelum konser dimulai</Text>
            </View>
            <Toggle value={eventAlerts} onToggle={() => setEventAlerts((v) => !v)} />
          </View>
          <View className="h-[1px] bg-slate-100 my-1" />
          <View className="flex-row items-center justify-between py-2.5">
            <View className="flex-1 pr-3">
              <Text className="text-xs font-bold text-slate-900">Pembaruan Status Tiket</Text>
              <Text className="text-[11px] text-slate-500">Konfirmasi pembayaran dan penerbitan e-tiket</Text>
            </View>
            <Toggle value={ticketUpdates} onToggle={() => setTicketUpdates((v) => !v)} />
          </View>
        </View>

        {/* Section: Bantuan & Kebijakan */}
        <View className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider px-4 pt-4 pb-2">
            Bantuan &amp; Ketentuan
          </Text>
          <Pressable className="flex-row items-center justify-between px-4 py-3.5 border-t border-slate-100 active:bg-slate-50">
            <View className="flex-row items-center gap-3">
              <Icon name="description" color="#64748B" size={18} />
              <Text className="text-xs font-semibold text-slate-800">Syarat &amp; Ketentuan Pemesanan</Text>
            </View>
            <Icon name="chevron_right" color="#94A3B8" size={18} />
          </Pressable>
          <Pressable className="flex-row items-center justify-between px-4 py-3.5 border-t border-slate-100 active:bg-slate-50">
            <View className="flex-row items-center gap-3">
              <Icon name="privacy_tip" color="#64748B" size={18} />
              <Text className="text-xs font-semibold text-slate-800">Kebijakan Privasi Pengguna</Text>
            </View>
            <Icon name="chevron_right" color="#94A3B8" size={18} />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
