import { useState } from "react";
import { View, Text, Pressable, ScrollView, Image, SafeAreaView } from "react-native";
import { Link, useRouter } from "expo-router";
import Icon from "@/components/Icon";
import { ConcertAssets } from "@/constants/images";

const INITIAL = [
  {
    id: "f1",
    title: "Pesta Semesta Musik 2026",
    venue: "Stadion Madya Senayan, Jakarta",
    price: "Rp 450.000",
    img: ConcertAssets.festivalCrowd,
  },
  {
    id: "f2",
    title: "Malam Akustik Senopati",
    venue: "Teater Tertutup Dago, Bandung",
    price: "Rp 250.000",
    img: ConcertAssets.jazzAcoustic,
  },
];

export default function FavoriteConcertScreen() {
  const router = useRouter();
  const [favorites, setFavorites] = useState(INITIAL);

  return (
    <View className="flex-1 bg-surface">
      <SafeAreaView className="bg-white border-b border-slate-200">
        <View className="flex-row items-center gap-3 px-4 py-3">
          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.replace("/(tabs)"))}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            className="w-11 h-11 rounded-full bg-slate-100 items-center justify-center active:scale-95"
          >
            <Icon name="arrow_back" color="#0F172A" size={20} />
          </Pressable>
          <Text className="text-base font-bold text-slate-900">Konser Favorit</Text>
        </View>
      </SafeAreaView>

      <ScrollView className="flex-1 px-5 pt-4" contentContainerStyle={{ gap: 14, paddingBottom: 40 }}>
        {favorites.length === 0 ? (
          <View className="items-center py-24 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <View className="w-16 h-16 rounded-2xl bg-slate-100 items-center justify-center mb-3">
              <Icon name="favorite_border" size={32} color="#94A3B8" />
            </View>
            <Text className="text-base font-bold text-slate-900 mt-2">Belum Ada Favorit</Text>
            <Text className="text-xs text-slate-500 text-center mt-1 px-4 mb-5">
              Jelajahi konser musik pilihan dan simpan ke daftar favorit untuk memantau tiketnya.
            </Text>
            <Link href={"/(tabs)/explore" as any} asChild>
              <Pressable className="bg-slate-900 px-6 min-h-[44px] items-center justify-center rounded-xl active:scale-95 shadow-sm">
                <Text className="text-white font-semibold text-xs">Jelajah Konser</Text>
              </Pressable>
            </Link>
          </View>
        ) : (
          favorites.map((fav) => (
            <View key={fav.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
              <View className="relative h-44 bg-slate-950">
                <Image source={fav.img} className="w-full h-full opacity-80" resizeMode="cover" />
                <View className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <Pressable
                  onPress={() => setFavorites((list) => list.filter((f) => f.id !== fav.id))}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  className="absolute top-3 right-3 w-11 h-11 rounded-full bg-white/90 items-center justify-center active:scale-95 shadow-sm"
                >
                  <Icon name="favorite" color="#EF4444" size={20} />
                </Pressable>
              </View>

              <View className="p-4">
                <Text className="text-base font-bold text-slate-900 mb-1">{fav.title}</Text>
                <View className="flex-row items-center gap-1.5 mb-3">
                  <Icon name="location_on" size={14} color="#64748B" />
                  <Text className="text-xs text-slate-600">{fav.venue}</Text>
                </View>
                <View className="flex-row justify-between items-center pt-2.5 border-t border-slate-100">
                  <Text className="font-bold text-blue-600 text-sm">{fav.price}</Text>
                  <Link href="/concert" asChild>
                    <Pressable
                      hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
                      className="bg-slate-900 active:scale-95 px-4 min-h-[40px] items-center justify-center rounded-lg shadow-sm"
                    >
                      <Text className="text-white font-semibold text-xs">Beli Tiket</Text>
                    </Pressable>
                  </Link>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
