import { useState } from "react";
import { View, Text, Pressable, ScrollView, Image, TextInput } from "react-native";
import { Link } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

const FILTERS = ["This Weekend", "Under $50", "Near Me"];

const TRENDING = [
  {
    id: "t1",
    title: "Summer Echoes Festival",
    venue: "Los Angeles, CA",
    badge: "SOLD OUT SOON",
    img: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=800&q=80",
    big: true,
  },
];

const ARTISTS = [
  {
    id: "a1",
    name: "Luna Ray",
    img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "a2",
    name: "Neon Pulse",
    img: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=300&q=80",
  },
];

const UPCOMING = [
  {
    id: "u1",
    title: "Blue Note Jazz Trio",
    date: "Oct 24 • 8:00 PM",
    venue: "The Jazz Cellar, NY",
    price: "$45.00",
    img: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "u2",
    title: "Symphonic Waves",
    date: "Oct 26 • 7:30 PM",
    venue: "Grand Hall, Chicago",
    price: "$89.00",
    img: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "u3",
    title: "Iron Forge Tour",
    date: "Nov 02 • 9:00 PM",
    venue: "Arena One, TX",
    price: "$65.00",
    img: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=300&q=80",
  },
];

export default function ExploreScreen() {
  const [activeFilter, setActiveFilter] = useState<string | null>("This Weekend");

  return (
    <View className="flex-1 bg-surface">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 pt-14 pb-4">
          <Text className="text-xl font-bold text-gray-900">Explore</Text>
          <Pressable className="w-10 h-10 rounded-full bg-surface-card border border-outline-variant items-center justify-center">
            <MaterialIcons name="notifications-none" size={22} color="#4D3298" />
          </Pressable>
        </View>

        {/* Search */}
        <View className="flex-row items-center mx-5 mb-4 gap-3">
          <View className="flex-1 flex-row items-center bg-white border border-outline-variant rounded-2xl px-4 h-12 gap-2">
            <MaterialIcons name="search" size={20} color="#9CA3AF" />
            <TextInput
              placeholder="Search artists, venues, or cities"
              placeholderTextColor="#9CA3AF"
              className="flex-1 text-sm text-gray-800"
            />
          </View>
          <Pressable className="w-11 h-11 bg-primary rounded-xl items-center justify-center">
            <MaterialIcons name="tune" size={20} color="#fff" />
          </Pressable>
        </View>

        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-5 mb-5" contentContainerStyle={{ gap: 8 }}>
          {FILTERS.map((f) => (
            <Pressable
              key={f}
              onPress={() => setActiveFilter(f === activeFilter ? null : f)}
              className={`flex-row items-center gap-1.5 px-4 py-2 rounded-full border ${
                activeFilter === f ? "bg-primary border-primary" : "bg-white border-outline-variant"
              }`}
            >
              <Text className={`text-xs font-semibold ${activeFilter === f ? "text-white" : "text-gray-700"}`}>
                {f}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Trending Now */}
        <View className="px-5 mb-5">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-xl font-bold text-gray-900">Trending Now</Text>
            <Pressable>
              <Text className="text-primary font-semibold text-sm">See All</Text>
            </Pressable>
          </View>

          <Link href="/concert" asChild>
            <Pressable className="w-full h-52 rounded-2xl overflow-hidden">
              <Image
                source={{ uri: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=800&q=80" }}
                className="w-full h-full absolute"
              />
              <View className="absolute inset-0 bg-black/35" />
              <View className="absolute top-3 left-3">
                <View className="bg-red-500 px-2.5 py-1 rounded-full">
                  <Text className="text-white text-[10px] font-bold">SOLD OUT SOON</Text>
                </View>
              </View>
              <View className="absolute bottom-4 left-4 right-4">
                <Text className="text-white text-xl font-bold">Summer Echoes Festival</Text>
                <View className="flex-row items-center gap-1 mt-1">
                  <MaterialIcons name="location-on" size={14} color="rgba(255,255,255,0.8)" />
                  <Text className="text-white/80 text-sm">Los Angeles, CA</Text>
                </View>
              </View>
            </Pressable>
          </Link>

          {/* Small Artists Grid */}
          <View className="flex-row gap-3 mt-3">
            {ARTISTS.map((artist) => (
              <View key={artist.id} className="flex-1 h-28 rounded-xl overflow-hidden relative">
                <Image source={{ uri: artist.img }} className="w-full h-full" />
                <View className="absolute inset-0 bg-black/30" />
                <View className="absolute bottom-2 left-2">
                  <Text className="text-white font-bold text-sm">{artist.name}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Upcoming Concerts */}
        <View className="px-5">
          <Text className="text-xl font-bold text-gray-900 mb-3">Upcoming Concerts</Text>
          <View className="gap-3">
            {UPCOMING.map((item) => (
              <Link key={item.id} href="/concert" asChild>
                <Pressable className="flex-row bg-white rounded-2xl overflow-hidden border border-outline-variant p-3 gap-3 items-center">
                  <Image source={{ uri: item.img }} className="w-20 h-20 rounded-xl" />
                  <View className="flex-1">
                    <View className="flex-row justify-between items-start">
                      <Text className="font-bold text-gray-900 text-sm flex-1 pr-2" numberOfLines={1}>
                        {item.title}
                      </Text>
                      <MaterialIcons name="favorite-border" size={18} color="#9CA3AF" />
                    </View>
                    <View className="flex-row items-center gap-1 mt-1">
                      <MaterialIcons name="schedule" size={12} color="#9CA3AF" />
                      <Text className="text-xs text-gray-500">{item.date}</Text>
                    </View>
                    <View className="flex-row items-center gap-1 mt-0.5">
                      <MaterialIcons name="location-on" size={12} color="#9CA3AF" />
                      <Text className="text-xs text-gray-500">{item.venue}</Text>
                    </View>
                    <View className="flex-row justify-between items-center mt-2">
                      <Text className="font-bold text-primary text-sm">{item.price}</Text>
                      <View className="bg-primary px-4 py-1.5 rounded-lg">
                        <Text className="text-white text-xs font-bold">Book</Text>
                      </View>
                    </View>
                  </View>
                </Pressable>
              </Link>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
