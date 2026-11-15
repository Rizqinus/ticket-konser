import { useState } from "react";
import { View, Text, Pressable, ScrollView, Image, TextInput } from "react-native";
import { Link } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { ConcertAssets } from "@/constants/images";

const FILTERS = ["Akhir Pekan Ini", "Tiket Terjangkau", "Dekat Saya"];

const TRENDING = {
  id: "t1",
  title: "Pesta Semesta Musik 2026",
  venue: "Stadion Madya Senayan, Jakarta",
  badge: "TIKET TERBATAS",
  asset: ConcertAssets.festivalCrowd,
};

const ARTISTS = [
  {
    id: "a1",
    name: "Sheila on 7",
    genre: "Pop Rock Nostalgia",
    asset: ConcertAssets.indieGuitarist,
  },
  {
    id: "a2",
    name: "Diskoria Live Set",
    genre: "Electronic & Disco",
    asset: ConcertAssets.electronicStage,
  },
];

const UPCOMING = [
  {
    id: "u1",
    title: "Malam Akustik Senopati",
    date: "24 Okt • 20:00 WIB",
    venue: "Teater Tertutup Dago, Bandung",
    price: "Rp 250.000",
    asset: ConcertAssets.jazzAcoustic,
  },
  {
    id: "u2",
    title: "Simfoni Harmoni Nusantara",
    date: "26 Okt • 19:30 WIB",
    venue: "Balai Sarbini, Jakarta Pusat",
    price: "Rp 450.000",
    asset: ConcertAssets.stadiumConcert,
  },
  {
    id: "u3",
    title: "Rock Anthem Live Arena",
    date: "02 Nov • 21:00 WIB",
    venue: "Jatim Expo, Surabaya",
    price: "Rp 350.000",
    asset: ConcertAssets.rockStage,
  },
];

export default function ExploreScreen() {
  const [activeFilter, setActiveFilter] = useState<string | null>("Akhir Pekan Ini");

  return (
    <View className="flex-1 bg-surface">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 pt-14 pb-4">
          <View>
            <Text className="text-2xl font-bold tracking-tight text-slate-900">Jelajah Konser</Text>
            <Text className="text-xs text-slate-500 mt-0.5">Temukan pertunjukan panggung musik di kotamu</Text>
          </View>
          <Pressable
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            className="w-11 h-11 rounded-full bg-white border border-slate-200 items-center justify-center active:scale-95 shadow-sm"
          >
            <MaterialIcons name="tune" size={20} color="#0F172A" />
          </Pressable>
        </View>

        {/* Search */}
        <View className="flex-row items-center mx-5 mb-4 gap-2.5">
          <View className="flex-1 flex-row items-center bg-white border border-slate-200 rounded-2xl px-4 h-12 gap-2.5 shadow-sm">
            <MaterialIcons name="search" size={20} color="#64748B" />
            <TextInput
              placeholder="Cari musisi, venue, atau kota..."
              placeholderTextColor="#94A3B8"
              className="flex-1 text-sm text-slate-900"
            />
          </View>
        </View>

        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-5 mb-6" contentContainerStyle={{ gap: 8 }}>
          {FILTERS.map((f) => (
            <Pressable
              key={f}
              onPress={() => setActiveFilter(f === activeFilter ? null : f)}
              className={`flex-row items-center gap-1.5 px-4 min-h-[44px] rounded-full border active:scale-95 ${
                activeFilter === f ? "bg-slate-900 border-slate-900" : "bg-white border-slate-200"
              }`}
            >
              <Text className={`text-xs font-semibold ${activeFilter === f ? "text-white" : "text-slate-700"}`}>
                {f}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Trending Section */}
        <View className="px-5 mb-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-base font-bold text-slate-900">Sedang Populer</Text>
            <Pressable hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text className="text-blue-600 font-semibold text-xs">Lihat Semua</Text>
            </Pressable>
          </View>

          <Link href="/concert" asChild>
            <Pressable className="w-full h-52 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 active:scale-98 shadow-sm">
              <Image
                source={TRENDING.asset}
                className="w-full h-full absolute opacity-75"
                resizeMode="cover"
              />
              <View className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              <View className="absolute top-3 left-3">
                <View className="bg-amber-500 px-2.5 py-1 rounded-md">
                  <Text className="text-slate-950 text-[10px] font-bold tracking-wider uppercase">
                    {TRENDING.badge}
                  </Text>
                </View>
              </View>
              <View className="absolute bottom-4 left-4 right-4">
                <Text className="text-white text-lg font-bold tracking-tight">{TRENDING.title}</Text>
                <View className="flex-row items-center gap-1.5 mt-1">
                  <MaterialIcons name="location-on" size={14} color="#94A3B8" />
                  <Text className="text-slate-300 text-xs">{TRENDING.venue}</Text>
                </View>
              </View>
            </Pressable>
          </Link>

          {/* Artist cards */}
          <View className="flex-row gap-3 mt-3">
            {ARTISTS.map((artist) => (
              <View key={artist.id} className="flex-1 h-28 rounded-2xl overflow-hidden relative bg-slate-950 border border-slate-800">
                <Image source={artist.asset} className="w-full h-full opacity-70" resizeMode="cover" />
                <View className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                <View className="absolute bottom-2.5 left-3 right-2">
                  <Text className="text-white font-bold text-xs" numberOfLines={1}>{artist.name}</Text>
                  <Text className="text-slate-400 text-[10px]">{artist.genre}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Upcoming Concerts */}
        <View className="px-5">
          <Text className="text-base font-bold text-slate-900 mb-3">Jadwal Mendatang</Text>
          <View className="gap-3">
            {UPCOMING.map((item) => (
              <Link key={item.id} href="/concert" asChild>
                <Pressable className="flex-row bg-white rounded-2xl overflow-hidden border border-slate-200 p-3.5 gap-3 items-center active:scale-98 shadow-sm">
                  <Image source={item.asset} className="w-20 h-20 rounded-xl bg-slate-100" resizeMode="cover" />
                  <View className="flex-1">
                    <View className="flex-row justify-between items-start">
                      <Text className="font-bold text-slate-900 text-sm flex-1 pr-2" numberOfLines={1}>
                        {item.title}
                      </Text>
                      <MaterialIcons name="bookmark-border" size={18} color="#94A3B8" />
                    </View>
                    <View className="flex-row items-center gap-1.5 mt-1">
                      <MaterialIcons name="schedule" size={12} color="#64748B" />
                      <Text className="text-xs text-slate-600">{item.date}</Text>
                    </View>
                    <View className="flex-row items-center gap-1.5 mt-0.5">
                      <MaterialIcons name="location-on" size={12} color="#64748B" />
                      <Text className="text-xs text-slate-600" numberOfLines={1}>{item.venue}</Text>
                    </View>
                    <View className="flex-row justify-between items-center mt-2 pt-2 border-t border-slate-100">
                      <Text className="font-bold text-blue-600 text-xs">{item.price}</Text>
                      <View className="bg-slate-900 px-3.5 py-1.5 rounded-lg">
                        <Text className="text-white text-xs font-semibold">Pesan</Text>
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
