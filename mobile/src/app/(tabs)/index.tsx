import { useEffect, useState } from "react";
import { View, Text, Pressable, ScrollView, Image, TextInput, ActivityIndicator } from "react-native";
import { Link, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { api, getAuth } from "@/lib/api";
import { getConcertImageSource } from "@/constants/images";

const CATEGORIES = [
  { id: "all", label: "Semua", icon: "music-note" },
  { id: "pop", label: "Pop", icon: "star" },
  { id: "rock", label: "Rock", icon: "bolt" },
  { id: "jazz", label: "Jazz", icon: "piano" },
  { id: "edm", label: "EDM", icon: "graphic-eq" },
];

const FALLBACK_CONCERTS = [
  {
    id: "c1",
    title: "Pesta Semesta Musik 2026",
    location: "Stadion Madya Senayan, Jakarta",
    concert_date: "2026-10-24",
    concert_time: "19:00",
    image: "/concerts/festival-crowd.jpg",
    status: "upcoming",
  },
  {
    id: "c2",
    title: "Malam Akustik Senopati",
    location: "Teater Tertutup Dago, Bandung",
    concert_date: "2026-10-31",
    concert_time: "19:30",
    image: "/concerts/jazz-acoustic.jpg",
    status: "upcoming",
  },
  {
    id: "c3",
    title: "Rock Anthem Live Arena",
    location: "Jatim Expo, Surabaya",
    concert_date: "2026-11-08",
    concert_time: "20:00",
    image: "/concerts/rock-stage.jpg",
    status: "upcoming",
  },
  {
    id: "c4",
    title: "Simfoni Harmoni Nusantara",
    location: "Balai Sarbini, Jakarta Pusat",
    concert_date: "2026-11-15",
    concert_time: "19:30",
    image: "/concerts/stadium-concert.jpg",
    status: "upcoming",
  },
  {
    id: "c5",
    title: "Electronic Pulse Festival",
    location: "Carnaval Circuit Ancol, Jakarta",
    concert_date: "2026-11-22",
    concert_time: "21:00",
    image: "/concerts/electronic-stage.jpg",
    status: "upcoming",
  },
  {
    id: "c6",
    title: "Indie Sunset Stage Tour",
    location: "Taman Budaya, Yogyakarta",
    concert_date: "2026-12-05",
    concert_time: "18:30",
    image: "/concerts/indie-guitarist.jpg",
    status: "upcoming",
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [concerts, setConcerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const auth = getAuth();
    setUser(auth.user);

    async function loadConcerts() {
      setLoading(true);
      try {
        const res = await api.getConcerts(search, "upcoming");
        setConcerts(res.data || []);
      } catch (err) {
        console.warn("Gagal memuat konser:", err);
      } finally {
        setLoading(false);
      }
    }

    loadConcerts();
  }, [search]);

  const displayConcerts =
    concerts.length > 0 ? concerts : search ? [] : FALLBACK_CONCERTS;
  const featured = displayConcerts.slice(0, 3);
  const nearby = displayConcerts.slice(0, 6);

  return (
    <View className="flex-1 bg-surface">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* Header Bar */}
        <View className="flex-row items-center justify-between px-5 pt-14 pb-4">
          <View className="flex-row items-center gap-3">
            <View className="w-11 h-11 rounded-full bg-secondary items-center justify-center border-2 border-slate-300">
              <Text className="text-white font-bold text-base">
                {(user?.name || "U").charAt(0).toUpperCase()}
              </Text>
            </View>
            <View>
              <Text className="text-xs text-slate-500 font-medium">Selamat datang,</Text>
              <Text className="text-base font-bold text-slate-900">
                {user?.name || "Penikmat Musik"}
              </Text>
            </View>
          </View>
          <Link href="/notifikasi" asChild>
            <Pressable
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              className="w-11 h-11 rounded-full bg-white border border-slate-200 items-center justify-center active:scale-95"
            >
              <MaterialIcons name="notifications-none" size={22} color="#0F172A" />
            </Pressable>
          </Link>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center mx-5 mb-5 gap-3">
          <View className="flex-1 flex-row items-center bg-white border border-slate-200 rounded-2xl px-4 h-12 gap-2.5 shadow-sm">
            <MaterialIcons name="search" size={20} color="#64748B" />
            <TextInput
              placeholder="Cari konser, panggung, atau musisi..."
              placeholderTextColor="#94A3B8"
              className="flex-1 text-sm text-slate-900"
              value={search}
              onChangeText={setSearch}
            />
            {search ? (
              <Pressable
                onPress={() => setSearch("")}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                className="w-7 h-7 items-center justify-center"
              >
                <MaterialIcons name="close" size={18} color="#64748B" />
              </Pressable>
            ) : null}
          </View>
        </View>

        {/* Genre / Categories */}
        <View className="mb-6">
          <Text className="text-base font-bold text-slate-900 px-5 mb-3">
            Kategori Musik
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="px-5"
            contentContainerStyle={{ gap: 8 }}
          >
            {CATEGORIES.map((cat) => (
              <Pressable
                key={cat.id}
                onPress={() => setActiveCategory(cat.id)}
                className={`flex-row items-center gap-2 px-4 min-h-[44px] rounded-full border active:scale-95 ${
                  activeCategory === cat.id
                    ? "bg-slate-900 border-slate-900"
                    : "bg-white border-slate-200"
                }`}
              >
                <MaterialIcons
                  name={cat.icon as any}
                  size={16}
                  color={activeCategory === cat.id ? "#ffffff" : "#475569"}
                />
                <Text
                  className={`text-xs font-semibold ${
                    activeCategory === cat.id ? "text-white" : "text-slate-700"
                  }`}
                >
                  {cat.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Featured Concerts */}
        <View className="mb-6">
          <Text className="text-base font-bold text-slate-900 px-5 mb-3">
            Konser Pilihan
          </Text>
          {loading ? (
            <View className="py-12 items-center justify-center">
              <ActivityIndicator color="#2563EB" />
              <Text className="text-xs text-slate-400 mt-2">Memuat jadwal panggung...</Text>
            </View>
          ) : featured.length === 0 ? (
            <View className="mx-5 p-6 bg-white rounded-2xl border border-slate-200 items-center">
              <MaterialIcons name="event-busy" size={32} color="#94A3B8" />
              <Text className="text-sm font-semibold text-slate-800 mt-2">Belum ada konser aktif</Text>
              <Text className="text-xs text-slate-500 text-center mt-1">
                Jadwal konser terbaru akan ditampilkan di sini setelah dirilis.
              </Text>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="px-5"
              contentContainerStyle={{ gap: 12 }}
            >
              {featured.map((item) => (
                <Link
                  key={item.id}
                  href={{ pathname: "/concert", params: { id: item.id } }}
                  asChild
                >
                  <Pressable className="w-72 h-48 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 active:scale-98">
                    <Image
                      source={getConcertImageSource(item.image)}
                      className="w-full h-full absolute opacity-75"
                      resizeMode="cover"
                    />
                    <View className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                    <View className="absolute top-3 left-3">
                      <View className="bg-blue-600 px-2.5 py-1 rounded-md">
                        <Text className="text-white text-[10px] font-bold uppercase tracking-wider">
                          {item.status || "AKAN DATANG"}
                        </Text>
                      </View>
                    </View>
                    <View className="absolute bottom-4 left-4 right-4">
                      <Text className="text-white text-base font-bold" numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Text className="text-slate-300 text-xs mt-1" numberOfLines={1}>
                        {item.location} {item.concert_date ? `• ${new Date(item.concert_date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}` : ""}
                      </Text>
                    </View>
                  </Pressable>
                </Link>
              ))}
            </ScrollView>
          )}
        </View>

        {/* All Concerts List */}
        <View className="px-5">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-base font-bold text-slate-900">Jadwal Konser Lainnya</Text>
          </View>

          <View className="gap-3">
            {nearby.map((item) => (
              <Link
                key={item.id}
                href={{ pathname: "/concert", params: { id: item.id } }}
                asChild
              >
                <Pressable className="flex-row bg-white rounded-2xl overflow-hidden border border-slate-200 p-3.5 gap-3.5 items-center active:scale-98 shadow-sm">
                  <Image
                    source={getConcertImageSource(item.image)}
                    className="w-20 h-20 rounded-xl bg-slate-100"
                    resizeMode="cover"
                  />
                  <View className="flex-1">
                    <Text className="font-bold text-slate-900 text-sm" numberOfLines={1}>
                      {item.title}
                    </Text>
                    <View className="flex-row items-center gap-1.5 mt-1">
                      <MaterialIcons name="schedule" size={13} color="#64748B" />
                      <Text className="text-xs text-slate-600">
                        {item.concert_time || "19:00"} WIB
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-1.5 mt-0.5">
                      <MaterialIcons name="location-on" size={13} color="#64748B" />
                      <Text className="text-xs text-slate-600" numberOfLines={1}>
                        {item.location}
                      </Text>
                    </View>
                    <View className="flex-row justify-between items-center mt-2.5 pt-2 border-t border-slate-100">
                      <Text className="text-xs font-medium text-slate-500">
                        {item.concert_date ? new Date(item.concert_date).toLocaleDateString("id-ID", { day: "numeric", month: "short" }) : ""}
                      </Text>
                      <View className="bg-blue-600 px-3.5 py-1.5 rounded-lg">
                        <Text className="text-white text-xs font-semibold">Pilih Tiket</Text>
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
