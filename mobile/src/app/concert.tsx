import { useState } from "react";
import { View, Text, Pressable, ScrollView, Image, SafeAreaView } from "react-native";
import { Link, useRouter } from "expo-router";
import Icon from "@/components/Icon";

const LINEUP = [
  {
    name: "Elias Vance",
    role: "Lead Cello",
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "Sarah Koda",
    role: "Synthesizers",
    img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "Jaxen Reed",
    role: "Percussion",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  },
];

export default function ConcertDetailScreen() {
  const router = useRouter();
  const [fav, setFav] = useState(false);

  return (
    <View className="flex-1 bg-[#F9F8FD] relative">
      {/* Top Header Navigation Bar */}
      <SafeAreaView className="bg-white border-b border-gray-100 z-30">
        <View className="flex-row justify-between items-center px-4 h-14">
          <Pressable onPress={() => router.back()} className="w-10 h-10 items-center justify-center">
            <Icon name="arrow_back" color="#1F2937" size={22} />
          </Pressable>
          <Text className="text-base font-bold text-gray-900">Detail Concert</Text>
          <Pressable onPress={() => setFav((v) => !v)} className="w-10 h-10 items-center justify-center">
            <Icon name="favorite" color={fav ? "#EC4899" : "#6B7280"} size={22} />
          </Pressable>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* Banner Section */}
        <View className="relative h-80">
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1000&q=80",
            }}
            className="w-full h-full"
          />
          <View className="absolute inset-0 bg-black/40" />

          {/* Title Banner overlay */}
          <View className="absolute bottom-5 left-5 right-5">
            <View className="flex-row gap-2 mb-2">
              <View className="bg-[#4D3298] px-3 py-1 rounded-full">
                <Text className="text-white text-[10px] font-bold tracking-wider">LIVE TOUR</Text>
              </View>
              <View className="bg-gray-500/60 px-3 py-1 rounded-full">
                <Text className="text-white text-[10px] font-bold tracking-wider">SOLDOUT SOON</Text>
              </View>
            </View>
            <Text className="text-white text-2xl font-bold">Neon Dreams World Tour</Text>
            <Text className="text-white/90 text-sm font-medium mt-0.5">The Luminal Orchestra</Text>
          </View>
        </View>

        <View className="px-5 pt-5 gap-6">
          {/* Info Card Grid */}
          <View className="flex-row bg-[#EEF2FF] p-4 rounded-2xl gap-3 flex-wrap sm:flex-nowrap">
            <View className="flex-row items-center gap-3 flex-1 min-w-[140px]">
              <View className="w-11 h-11 rounded-xl bg-[#6B46C1] items-center justify-center">
                <Icon name="calendar_today" color="#fff" size={20} />
              </View>
              <View className="flex-1">
                <Text className="text-[11px] text-gray-500">Date & Time</Text>
                <Text className="font-bold text-gray-900 text-xs" numberOfLines={1}>Oct 24, 2024</Text>
                <Text className="text-[10px] text-gray-400" numberOfLines={1}>Starts at 8:00 PM</Text>
              </View>
            </View>
            <View className="flex-row items-center gap-3 flex-1 min-w-[140px]">
              <View className="w-11 h-11 rounded-xl bg-[#93C5FD] items-center justify-center">
                <Icon name="location_on" color="#1D4ED8" size={20} />
              </View>
              <View className="flex-1">
                <Text className="text-[11px] text-gray-500">Location</Text>
                <Text className="font-bold text-gray-900 text-xs" numberOfLines={1}>Apex Arena</Text>
                <Text className="text-[10px] text-gray-400" numberOfLines={1}>Los Angeles, CA</Text>
              </View>
            </View>
          </View>

          {/* About Section */}
          <View>
            <Text className="text-lg font-bold text-gray-900 mb-2">About the Event</Text>
            <Text className="text-gray-600 text-sm leading-6">
              Experience an immersive journey through light and sound as The Luminal Orchestra brings their &quot;Neon Dreams&quot; tour to the heart of Los Angeles. This unique performance blends classical arrangements with futuristic synth soundscapes, featuring a 50-piece orchestra and state-of-the-art holographic visuals.
            </Text>
            <Pressable className="flex-row items-center gap-1 mt-1">
              <Text className="text-[#55389E] font-semibold text-xs">Read More</Text>
              <Icon name="keyboard_arrow_down" size={16} color="#55389E" />
            </Pressable>
          </View>

          {/* Lineup Section */}
          <View>
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-lg font-bold text-gray-900">Lineup</Text>
              <Pressable>
                <Text className="text-[#55389E] font-bold text-xs">View All</Text>
              </Pressable>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-5 px-5 flex-row gap-4">
              {LINEUP.map((p) => (
                <View key={p.name} className="items-center w-24 mr-2">
                  <Image source={{ uri: p.img }} className="w-16 h-16 rounded-full mb-2 border-2 border-white shadow-sm" />
                  <Text className="text-xs font-bold text-gray-800 text-center" numberOfLines={1}>
                    {p.name}
                  </Text>
                  <Text className="text-[10px] text-gray-400 text-center mt-0.5" numberOfLines={1}>{p.role}</Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Venue Location Section */}
          <View>
            <Text className="text-lg font-bold text-gray-900 mb-3">Venue Location</Text>
            <View className="bg-white p-4 rounded-2xl border border-gray-200 gap-4 shadow-sm">
              <View className="flex-row items-center justify-between">
                <View className="flex-1 mr-2">
                  <Text className="font-bold text-gray-900 text-base" numberOfLines={1}>Apex Arena</Text>
                  <Text className="text-xs text-gray-500 mt-0.5" numberOfLines={1}>123 Event St, Los Angeles, CA</Text>
                </View>
                <View className="w-10 h-10 rounded-full bg-[#4D3298] items-center justify-center">
                  <Icon name="location_on" size={20} color="#fff" />
                </View>
              </View>
              <View className="flex-row pt-3 border-t border-gray-100">
                <View className="flex-row items-center gap-2.5 flex-1 min-w-[110px]">
                  <Icon name="groups" size={20} color="#4D3298" />
                  <View className="flex-1">
                    <Text className="text-[11px] text-gray-400">Capacity</Text>
                    <Text className="text-xs font-semibold text-gray-900" numberOfLines={1}>20,000 Seats</Text>
                  </View>
                </View>
                <View className="flex-row items-center gap-2.5 flex-1 min-w-[110px]">
                  <Icon name="local_parking" size={20} color="#4D3298" />
                  <View className="flex-1">
                    <Text className="text-[11px] text-gray-400">Parking</Text>
                    <Text className="text-xs font-semibold text-gray-900" numberOfLines={1}>Available</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Bar with SafeArea support */}
      <SafeAreaView className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg">
        <View className="px-6 py-3 flex-row justify-between items-center">
          <View>
            <Text className="text-[10px] text-gray-500 font-medium">Price starting from</Text>
            <View className="flex-row items-baseline gap-1">
              <Text className="text-2xl font-bold text-[#4D3298]">$89.00</Text>
              <Text className="text-xs text-gray-400">/ person</Text>
            </View>
          </View>
          <Link href="/pilih-tiket" asChild>
            <Pressable className="bg-[#4D3298] px-8 py-3.5 rounded-full active:opacity-90">
              <Text className="text-white font-bold text-sm">Book Now</Text>
            </Pressable>
          </Link>
        </View>
      </SafeAreaView>
    </View>
  );
}

