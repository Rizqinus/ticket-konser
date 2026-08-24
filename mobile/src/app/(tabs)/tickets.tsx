import { View, Text, Pressable, ScrollView, Image } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

const TICKETS = [
  {
    id: "t1",
    title: "Neon Dreams World Tour",
    artist: "The Luminal Orchestra",
    date: "Oct 24, 2024 • 8:00 PM",
    venue: "Apex Arena, Los Angeles",
    seat: "Section A • Row 5 • Seat 12",
    status: "upcoming",
    img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=300&q=80",
    qrColor: "#4D3298",
  },
  {
    id: "t2",
    title: "Blue Note Jazz Trio",
    artist: "The Jazz Cellar",
    date: "Sep 15, 2024 • 8:00 PM",
    venue: "The Jazz Cellar, NY",
    seat: "VIP Table • Seat 3",
    status: "past",
    img: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?auto=format&fit=crop&w=300&q=80",
    qrColor: "#9CA3AF",
  },
];

export default function TicketsScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-surface">
      <View className="px-5 pt-14 pb-4">
        <Text className="text-2xl font-bold text-gray-900">My Tickets</Text>
        <Text className="text-sm text-gray-500 mt-0.5">Your upcoming & past events</Text>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerStyle={{ gap: 16, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {TICKETS.map((ticket) => (
          <Pressable
            key={ticket.id}
            onPress={() => router.push("/ticket-qr")}
            className="bg-white rounded-3xl overflow-hidden border border-outline-variant shadow-sm"
          >
            {/* Top Image */}
            <View className="relative h-32">
              <Image source={{ uri: ticket.img }} className="w-full h-full" />
              <View className="absolute inset-0 bg-black/40" />
              <View className="absolute top-3 right-3">
                <View
                  className={`px-2.5 py-1 rounded-full ${
                    ticket.status === "upcoming" ? "bg-emerald-500" : "bg-gray-500"
                  }`}
                >
                  <Text className="text-white text-[10px] font-bold">
                    {ticket.status === "upcoming" ? "UPCOMING" : "PAST"}
                  </Text>
                </View>
              </View>
              <View className="absolute bottom-3 left-4">
                <Text className="text-white font-bold text-base">{ticket.title}</Text>
                <Text className="text-white/80 text-xs">{ticket.artist}</Text>
              </View>
            </View>

            {/* Dashed Separator */}
            <View className="flex-row items-center">
              <View className="w-5 h-5 rounded-full bg-surface -ml-2.5" />
              <View className="flex-1 border-t-2 border-dashed border-outline-variant" />
              <View className="w-5 h-5 rounded-full bg-surface -mr-2.5" />
            </View>

            {/* Info */}
            <View className="px-4 py-3 gap-2">
              <View className="flex-row gap-2 items-center">
                <MaterialIcons name="schedule" size={14} color="#4D3298" />
                <Text className="text-xs text-gray-700 font-medium">{ticket.date}</Text>
              </View>
              <View className="flex-row gap-2 items-center">
                <MaterialIcons name="location-on" size={14} color="#4D3298" />
                <Text className="text-xs text-gray-700 font-medium">{ticket.venue}</Text>
              </View>
              <View className="flex-row gap-2 items-center">
                <MaterialIcons name="event-seat" size={14} color="#4D3298" />
                <Text className="text-xs text-gray-700 font-medium">{ticket.seat}</Text>
              </View>

              <View className="flex-row justify-between items-center mt-2">
                <Pressable
                  onPress={() => router.push("/ticket-qr")}
                  className="flex-row items-center gap-1.5 bg-primary px-5 py-2.5 rounded-full"
                >
                  <MaterialIcons name="qr-code" size={16} color="#fff" />
                  <Text className="text-white text-xs font-bold">View QR Code</Text>
                </Pressable>
                <Pressable className="flex-row items-center gap-1.5 border border-outline-variant px-4 py-2.5 rounded-full">
                  <MaterialIcons name="download" size={16} color="#4D3298" />
                  <Text className="text-primary text-xs font-semibold">Download</Text>
                </Pressable>
              </View>
            </View>
          </Pressable>
        ))}

        {TICKETS.length === 0 && (
          <View className="items-center py-24">
            <MaterialIcons name="confirmation-number" size={64} color="#E7E0EC" />
            <Text className="text-lg font-bold text-gray-900 mt-4">No Tickets Yet</Text>
            <Text className="text-sm text-gray-500 text-center mt-2 px-8">
              Book a concert and your tickets will appear here.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
