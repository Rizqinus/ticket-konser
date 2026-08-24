import { useState } from "react";
import { View, Text, Pressable, ScrollView, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import Icon from "@/components/Icon";

const FILTERS = ["All", "Updates", "Promos", "Tickets"];

const NOTIFS = [
  {
    id: "n1",
    icon: "confirmation_number",
    title: "Ticket Confirmed!",
    time: "2m ago",
    body: "Your booking for Neon Horizon Tour is confirmed.",
  },
  {
    id: "n2",
    icon: "sell",
    title: "Special Offer",
    time: "1h ago",
    body: "Get 20% off on all jazz festival tickets this weekend! Code: JAZZ20",
  },
  {
    id: "n3",
    icon: "event",
    title: "Event Tomorrow",
    time: "1d ago",
    body: "Reminder: Echoes in the Dark starts at 8 PM tomorrow.",
  },
];

export default function NotificationScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState("All");
  const [read, setRead] = useState<Record<string, boolean>>({});

  return (
    <View className="flex-1 bg-surface">
      <SafeAreaView className="bg-surface border-b border-outline-variant/20">
        <View className="flex-row items-center gap-4 px-4 py-3">
          <Pressable onPress={() => router.back()} className="w-10 h-10 rounded-full bg-surface-container-high items-center justify-center">
            <Icon name="arrow_back" color="#4f378a" size={20} />
          </Pressable>
          <Text className="text-lg font-bold text-primary">Notifications</Text>
        </View>
      </SafeAreaView>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4 py-3" contentContainerStyle={{ gap: 8 }}>
        {FILTERS.map((f) => {
          const active = filter === f;
          return (
            <Pressable
              key={f}
              onPress={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full ${active ? "bg-primary" : "bg-surface-container border border-outline-variant"}`}
            >
              <Text className={active ? "text-white font-medium" : "text-on-surface-variant font-medium"}>
                {f}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView className="flex-1 px-4" contentContainerStyle={{ gap: 10, paddingBottom: 24 }}>
        {NOTIFS.map((n) => (
          <Pressable
            key={n.id}
            onPress={() => setRead((r) => ({ ...r, [n.id]: true }))}
            className={`p-4 rounded-xl flex-row gap-3 ${
              read[n.id] ? "bg-surface border border-outline-variant/30" : "bg-surface-container-low border border-primary-container/20"
            }`}
          >
            <View className="w-11 h-11 rounded-full bg-primary-fixed items-center justify-center">
              <Icon name={n.icon} color="#4f378a" size={20} />
            </View>
            <View className="flex-1">
              <View className="flex-row justify-between">
                <Text className="font-semibold text-on-surface">{n.title}</Text>
                <Text className={`text-xs font-bold ${read[n.id] ? "text-outline" : "text-primary"}`}>
                  {n.time}
                </Text>
              </View>
              <Text className="text-on-surface-variant text-sm mt-1">{n.body}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
