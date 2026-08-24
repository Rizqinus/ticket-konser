import { useEffect } from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => router.replace("/login"), 2000);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <View className="flex-1 bg-primary items-center justify-center px-6">
      <LinearGradient
        colors={["#6750a4", "#4f378a"]}
        className="absolute inset-0"
      />
      <Text className="text-white text-5xl font-bold tracking-tight mb-4">
        ConcertHub
      </Text>
      <Text className="text-primary-fixed-dim text-lg font-medium text-center max-w-[280px]">
        Your Gateway to Live Music
      </Text>

      <View className="absolute bottom-24 w-full items-center px-6">
        <View className="w-full max-w-[200px] h-1 bg-white/20 rounded-full overflow-hidden mb-3">
          <View className="h-full w-2/3 bg-white rounded-full" />
        </View>
        <Text className="text-white/60 text-xs tracking-widest uppercase">
          Loading Experience
        </Text>
      </View>
    </View>
  );
}
