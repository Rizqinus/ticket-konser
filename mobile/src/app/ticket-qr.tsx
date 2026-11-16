import { View, Text, Pressable, ScrollView, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import Icon from "@/components/Icon";

export default function TicketQrScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-surface">
      <SafeAreaView className="bg-white border-b border-slate-200">
        <View className="flex-row items-center gap-3 px-4 py-3">
          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.replace("/(tabs)/tickets"))}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            className="w-11 h-11 rounded-full bg-slate-100 items-center justify-center active:scale-95"
          >
            <Icon name="arrow_back" color="#0F172A" size={20} />
          </Pressable>
          <Text className="text-base font-bold text-slate-900">E-Tiket Masuk Konser</Text>
        </View>
      </SafeAreaView>

      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingVertical: 24, alignItems: "center" }}
        showsVerticalScrollIndicator={false}
      >
        {/* Ticket Container */}
        <View className="w-full max-w-[340px] bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Ticket Header */}
          <View className="bg-slate-950 p-6">
            <View className="flex-row justify-between items-center mb-2">
              <View className="bg-blue-600 px-2.5 py-0.5 rounded-full">
                <Text className="text-white text-[10px] font-bold uppercase tracking-wider">
                  TIKET RESMI
                </Text>
              </View>
              <Text className="text-slate-400 text-xs font-mono">GATE A</Text>
            </View>
            <Text className="text-xl font-bold text-white tracking-tight">
              Pesta Semesta Musik 2026
            </Text>
            <Text className="text-xs text-slate-300 mt-1">
              Jumat, 24 Oktober 2026 • 19:30 WIB
            </Text>
          </View>

          {/* Perforation Divider */}
          <View className="relative h-6 bg-white flex-row items-center justify-between">
            <View className="w-4 h-8 bg-surface rounded-r-full -ml-2 border-r border-slate-200" />
            <View className="flex-1 border-b border-dashed border-slate-300 mx-2" />
            <View className="w-4 h-8 bg-surface rounded-l-full -mr-2 border-l border-slate-200" />
          </View>

          {/* QR Code Section */}
          <View className="p-6 items-center">
            <View className="w-56 h-56 bg-slate-50 p-3 rounded-2xl border border-slate-200 items-center justify-center mb-3">
              <View className="w-full aspect-square flex-row flex-wrap">
                {Array.from({ length: 49 }).map((_, i) => {
                  const row = Math.floor(i / 7);
                  const col = i % 7;
                  const isEye =
                    (row < 3 && col < 3) ||
                    (row < 3 && col > 3) ||
                    (row > 3 && col < 3);
                  const filled = isEye || col === 3 || (row + col) % 3 === 0;
                  return (
                    <View
                      key={i}
                      style={{ width: "14.28%", aspectRatio: 1, padding: 1.5 }}
                    >
                      <View
                        className={`flex-1 rounded-[2px] ${
                          filled ? "bg-slate-900" : "bg-transparent"
                        }`}
                      />
                    </View>
                  );
                })}
              </View>
            </View>

            <Text className="text-xs font-mono font-bold text-slate-800 tracking-widest uppercase">
              KODE: TKT-882-991
            </Text>
            <Text className="text-[11px] text-slate-500 mt-1 text-center">
              Pindai kode QR ini di gerbang masuk venue konser
            </Text>
          </View>

          {/* Ticket Information Grid */}
          <View className="border-t border-slate-100 bg-slate-50/60 p-5">
            <View className="grid grid-cols-2 flex-row flex-wrap gap-y-3">
              <View className="w-1/2">
                <Text className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Lokasi / Venue
                </Text>
                <Text className="text-xs font-bold text-slate-800 mt-0.5">
                  Stadion Madya Senayan
                </Text>
              </View>
              <View className="w-1/2 items-end">
                <Text className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Kategori
                </Text>
                <Text className="text-xs font-bold text-blue-600 mt-0.5">
                  VIP Panggung Depan
                </Text>
              </View>
              <View className="w-1/2">
                <Text className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Sektor / Area
                </Text>
                <Text className="text-xs font-bold text-slate-800 mt-0.5">
                  Sektor B, Baris 4
                </Text>
              </View>
              <View className="w-1/2 items-end">
                <Text className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Nomor Kursi
                </Text>
                <Text className="text-xs font-bold text-slate-800 mt-0.5">
                  A-42
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="w-full max-w-[340px] flex-row gap-3 mt-6">
          <Pressable
            hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
            className="flex-1 min-h-[48px] flex-row items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-xl shadow-sm"
          >
            <Icon name="download" size={18} color="#ffffff" />
            <Text className="text-white font-semibold text-xs">Simpan Tiket</Text>
          </Pressable>
          <Pressable
            hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
            className="flex-1 min-h-[48px] flex-row items-center justify-center gap-2 bg-white border border-slate-200 active:scale-95 rounded-xl shadow-sm"
          >
            <Icon name="share" size={18} color="#0F172A" />
            <Text className="text-slate-900 font-semibold text-xs">Bagikan</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
