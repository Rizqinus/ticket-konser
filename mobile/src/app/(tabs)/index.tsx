import { useState } from "react";
import { View, Text, Pressable, ScrollView, Image, TextInput } from "react-native";
import { Link, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

const CATEGORIES = [
  { id: "pop", label: "Pop", icon: "star" },
  { id: "rock", label: "Rock", icon: "bolt" },
  { id: "jazz", label: "Jazz", icon: "piano" },
  { id: "edm", label: "EDM", icon: "graphic-eq" },
];

const FEATURED = [
  {
    id: "f1",
    title: "Neon Nights: Global Tour",
    venue: "Starlight Stadium",
    date: "July 15",
    badge: "TRENDING",
    img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "f2",
    title: "Summer Echoes",
    venue: "Open Field, LA",
    date: "Aug 20",
    badge: "NEW",
    img: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=800&q=80",
  },
];

const NEARBY = [
  {
    id: "n1",
    title: "Pulse Electronic Fest",
    date: "Oct 24 • 08:00 PM",
    venue: "Downtown Arena",
    price: "$45.00",
    img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "n2",
    title: "Sonic Boom: Indie Night",
    date: "Nov 12 • 07:30 PM",
    venue: "The Underground",
    price: "$29.50",
    img: "https://images.unsplash.com/photo-1501386761578-eee8f3fd7b3b?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "n3",
    title: "Acoustic Sessions:...",
    date: "Dec 05 • 06:00 PM",
    venue: "Grand Hall Opera",
    price: "$75.00",
    img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=300&q=80",
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("pop");
  const [featuredIndex, setFeaturedIndex] = useState(0);

  return (
    <View className="flex-1 bg-surface">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 pt-14 pb-4">
          <View className="flex-row items-center gap-3">
            <Image
              source={{ uri: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80" }}
              className="w-11 h-11 rounded-full border-2 border-primary"
            />
            <View>
              <Text className="text-xs text-gray-500 font-medium">Welcome back,</Text>
              <Text className="text-base font-bold text-primary">Alex Rivera</Text>
            </View>
          </View>
          <Pressable className="w-10 h-10 rounded-full bg-surface-card border border-outline-variant items-center justify-center">
            <MaterialIcons name="notifications-none" size={22} color="#4D3298" />
          </Pressable>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center mx-5 mb-5 gap-3">
          <View className="flex-1 flex-row items-center bg-white border border-outline-variant rounded-2xl px-4 h-12 gap-2">
            <MaterialIcons name="search" size={20} color="#9CA3AF" />
            <TextInput
              placeholder="Search for artists, venues, or events"
              placeholderTextColor="#9CA3AF"
              className="flex-1 text-sm text-gray-800"
            />
          </View>
          <Pressable className="w-11 h-11 bg-primary rounded-xl items-center justify-center">
            <MaterialIcons name="tune" size={20} color="#fff" />
          </Pressable>
        </View>

        {/* Categories */}
        <View className="mb-5">
          <Text className="text-xl font-bold text-gray-900 px-5 mb-3">Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-5" contentContainerStyle={{ gap: 10 }}>
            {CATEGORIES.map((cat) => (
              <Pressable
                key={cat.id}
                onPress={() => setActiveCategory(cat.id)}
                className={`flex-row items-center gap-2 px-5 py-2.5 rounded-full border ${
                  activeCategory === cat.id
                    ? "bg-primary border-primary"
                    : "bg-white border-outline-variant"
                }`}
              >
                <MaterialIcons
                  name={cat.icon as any}
                  size={16}
                  color={activeCategory === cat.id ? "#fff" : "#555"}
                />
                <Text
                  className={`text-sm font-semibold ${activeCategory === cat.id ? "text-white" : "text-gray-700"}`}
                >
                  {cat.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Featured Now */}
        <View className="mb-5">
          <Text className="text-xl font-bold text-gray-900 px-5 mb-3">Featured Now</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            className="px-5"
            contentContainerStyle={{ gap: 12 }}
            onMomentumScrollEnd={(e) => {
              const idx = Math.round(e.nativeEvent.contentOffset.x / 280);
              setFeaturedIndex(idx);
            }}
          >
            {FEATURED.map((item) => (
              <Link key={item.id} href="/concert" asChild>
                <Pressable className="w-72 h-44 rounded-2xl overflow-hidden">
                  <Image source={{ uri: item.img }} className="w-full h-full absolute" />
                  <View className="absolute inset-0 bg-black/40" />
                  <View className="absolute top-3 left-3">
                    <View className="bg-red-500 px-2.5 py-1 rounded-full">
                      <Text className="text-white text-[10px] font-bold">{item.badge}</Text>
                    </View>
                  </View>
                  <View className="absolute bottom-4 left-4 right-4">
                    <Text className="text-white text-lg font-bold">{item.title}</Text>
                    <Text className="text-white/80 text-xs mt-0.5">
                      {item.venue} • {item.date}
                    </Text>
                  </View>
                </Pressable>
              </Link>
            ))}
          </ScrollView>
        </View>

        {/* Near You */}
        <View className="px-5">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-xl font-bold text-gray-900">Near You</Text>
            <Pressable>
              <Text className="text-primary font-semibold text-sm">See All</Text>
            </Pressable>
          </View>

          <View className="gap-3">
            {NEARBY.map((item) => (
              <Link key={item.id} href="/concert" asChild>
                <Pressable className="flex-row bg-white rounded-2xl overflow-hidden border border-outline-variant p-3 gap-3 items-center">
                  <Image source={{ uri: item.img }} className="w-20 h-20 rounded-xl" />
                  <View className="flex-1">
                    <Text className="font-bold text-gray-900 text-sm" numberOfLines={1}>
                      {item.title}
                    </Text>
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
