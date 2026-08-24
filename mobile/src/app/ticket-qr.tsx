import { View, Text, Pressable, ScrollView, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import Icon from "@/components/Icon";

export default function TicketQrScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-surface">
      <SafeAreaView className="bg-surface border-b border-outline-variant/20">
        <View className="flex-row items-center gap-4 px-4 py-3">
          <Pressable onPress={() => router.back()} className="w-10 h-10 rounded-full bg-surface-container-high items-center justify-center">
            <Icon name="arrow_back" color="#4f378a" size={20} />
          </Pressable>
          <Text className="text-lg font-bold text-primary">My Ticket</Text>
        </View>
      </SafeAreaView>

      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 24, alignItems: "center" }}>
        <View className="bg-white p-6 rounded-xl shadow-sm border border-outline-variant/20 items-center w-full max-w-[280px] mt-4">
          <View className="w-full aspect-square bg-neutral-100 rounded-lg mb-4 flex-row flex-wrap p-2">
            {Array.from({ length: 49 }).map((_, i) => {
              const row = Math.floor(i / 7);
              const col = i % 7;
              const isEye = (row < 3 && col < 3) || (row < 3 && col > 3) || (row > 3 && col < 3);
              const filled = isEye || col === 3 || (row + col) % 3 === 0;
              return (
                <View
                  key={i}
                  style={{ width: "14.28%", aspectRatio: 1, padding: 1 }}
                >
                  <View className={`flex-1 rounded-sm ${filled ? "bg-primary" : ""}`} />
                </View>
              );
            })}
          </View>
          <Text className="text-xs text-outline tracking-widest uppercase">ID: CHB-882-991</Text>
        </View>

        <View className="items-center mt-4 gap-1">
          <Text className="text-lg font-bold text-on-surface text-center">
            Midnight Echoes: World Tour
          </Text>
          <View className="flex-row items-center gap-2">
            <Icon name="calendar_today" size={16} color="#4f378a" />
            <Text className="font-semibold text-primary">Friday, Oct 24, 2024</Text>
          </View>
        </View>

        <View className="w-full flex-row flex-wrap gap-y-4 mt-6">
          <View className="w-1/2">
            <Text className="text-xs text-outline uppercase">Venue</Text>
            <Text className="font-semibold text-on-surface">Starlight Arena, LA</Text>
          </View>
          <View className="w-1/2 items-end">
            <Text className="text-xs text-outline uppercase">Category</Text>
            <Text className="font-semibold text-on-surface">Front Row VIP</Text>
          </View>
          <View className="w-1/2">
            <Text className="text-xs text-outline uppercase">Section</Text>
            <Text className="font-semibold text-on-surface">Floor B, Row 4</Text>
          </View>
          <View className="w-1/2 items-end">
            <Text className="text-xs text-outline uppercase">Seat</Text>
            <Text className="font-semibold text-on-surface">A-42</Text>
          </View>
        </View>

        <View className="w-full flex-row gap-3 mt-6">
          <Pressable className="flex-1 flex-row items-center justify-center gap-2 py-3 bg-secondary-container rounded-full">
            <Icon name="wallet" size={18} color="#fff" />
            <Text className="text-white font-semibold text-xs">Add to Wallet</Text>
          </Pressable>
          <Pressable className="flex-1 flex-row items-center justify-center gap-2 py-3 border border-outline rounded-full">
            <Icon name="share" size={18} color="#4f378a" />
            <Text className="text-primary font-semibold text-xs">Share</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
