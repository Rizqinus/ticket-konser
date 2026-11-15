import { useEffect } from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import Icon from "@/components/Icon";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => router.replace("/(tabs)"), 1800);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <View className="flex-1 bg-slate-950 items-center justify-center px-6">
      {/* Brand Icon */}
      <View className="w-16 h-16 rounded-2xl bg-blue-600 items-center justify-center mb-5 shadow-lg shadow-blue-500/20 border border-blue-400/30">
        <Icon name="confirmation_number" color="#ffffff" size={32} />
      </View>

      <Text className="text-white text-3xl font-extrabold tracking-tight mb-2">
        Tiket Konser
      </Text>
      <Text className="text-slate-400 text-sm font-medium text-center max-w-[260px] leading-5">
        Pemesanan Tiket Konser & Panggung Musik Resmi
      </Text>

      {/* Subtle Progress Bar */}
      <View className="absolute bottom-16 w-full items-center px-6">
        <View className="w-36 h-1 bg-slate-800 rounded-full overflow-hidden mb-2.5">
          <View className="h-full w-2/3 bg-blue-500 rounded-full" />
        </View>
        <Text className="text-slate-500 text-[10px] tracking-widest uppercase font-semibold">
          Memuat Aplikasi
        </Text>
      </View>
    </View>
  );
}
