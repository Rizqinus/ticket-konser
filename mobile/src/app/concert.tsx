import { useEffect, useState } from "react";
import { View, Text, Pressable, ScrollView, Image, SafeAreaView } from "react-native";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import Icon from "@/components/Icon";
import { ConcertAssets, getConcertImageSource } from "@/constants/images";
import { api } from "@/lib/api";

const DEFAULT_LINEUP = [
  {
    name: "Sheila on 7",
    role: "Grup Musik Utama",
    asset: ConcertAssets.indieGuitarist,
  },
  {
    name: "Dewa 19",
    role: "Bintang Tamu Spesial",
    asset: ConcertAssets.rockStage,
  },
  {
    name: "Maliq & D'Essentials",
    role: "Penampil Panggung",
    asset: ConcertAssets.jazzAcoustic,
  },
];

export default function ConcertDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const [fav, setFav] = useState(false);
  const [, setLoading] = useState(false);
  const [concert, setConcert] = useState<any>(null);

  useEffect(() => {
    if (!params.id) return;
    let isMounted = true;
    setLoading(true);
    api
      .getConcertById(params.id)
      .then((res) => {
        if (isMounted && res.data) {
          setConcert(res.data);
        }
      })
      .catch((err) => {
        console.log("Gagal memuat detail konser:", err?.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [params.id]);

  const title = concert?.title || "Pesta Semesta Musik 2026";
  const description =
    concert?.description ||
    "Saksikan pengalaman panggung live yang penuh energi dengan tata cahaya spektakuler dan tata suara berstandar internasional. Menghadirkan musisi papan atas dengan aransemen panggung spesial yang dirancang untuk memberikan pengalaman konser terbaik bagi seluruh penikmat musik.";
  const location = concert?.location || "Stadion Madya Senayan, Jakarta Pusat";
  const dateFormatted = concert?.concert_date
    ? new Date(concert.concert_date).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "24 Okt 2026";
  const timeFormatted = concert?.concert_time ? `${concert.concert_time} WIB` : "Pintu Buka: 19:00 WIB";

  // Artists / Lineup
  const artistsList =
    concert?.artists && concert.artists.length > 0
      ? concert.artists.map((a: any) => ({
          name: a.name,
          role: a.description || "Musisi Penampil",
          image: a.image || null,
          asset: null,
        }))
      : DEFAULT_LINEUP;

  // Min price calculation
  const tickets = concert?.tickets || [];
  const minPrice =
    tickets.length > 0
      ? Math.min(...tickets.map((t: any) => Number(t.price) || 0))
      : 250000;

  const formattedMinPrice = `Rp ${Number(minPrice).toLocaleString("id-ID")}`;

  return (
    <View className="flex-1 bg-surface relative">
      {/* Top Header Bar */}
      <SafeAreaView className="bg-white border-b border-slate-200 z-30">
        <View className="flex-row justify-between items-center px-4 h-14">
          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.replace("/(tabs)"))}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            className="w-11 h-11 items-center justify-center rounded-full bg-slate-100 active:scale-95"
          >
            <Icon name="arrow_back" color="#0F172A" size={20} />
          </Pressable>
          <Text className="text-base font-bold text-slate-900">Detail Konser</Text>
          <Pressable
            onPress={() => setFav((v) => !v)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            className="w-11 h-11 items-center justify-center rounded-full bg-slate-100 active:scale-95"
          >
            <Icon name="favorite" color={fav ? "#EF4444" : "#64748B"} size={20} />
          </Pressable>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={{ paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
        {/* Banner Section with Authentically Downloaded Image */}
        <View className="relative h-80 bg-slate-950">
          <Image
            source={getConcertImageSource(concert?.image)}
            className="w-full h-full opacity-85"
            resizeMode="cover"
          />
          <View className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

          {/* Title Banner Overlay */}
          <View className="absolute bottom-5 left-5 right-5">
            <View className="flex-row gap-2 mb-2">
              <View className="bg-blue-600 px-3 py-1 rounded-md">
                <Text className="text-white text-[10px] font-bold tracking-wider uppercase">KONSER RESMI</Text>
              </View>
              <View className="bg-amber-500 px-3 py-1 rounded-md">
                <Text className="text-slate-950 text-[10px] font-bold tracking-wider uppercase">TIKET TERSEDIA</Text>
              </View>
            </View>
            <Text className="text-white text-2xl font-bold tracking-tight">{title}</Text>
            <Text className="text-slate-300 text-sm font-medium mt-1">Live Stage Performance Tour</Text>
          </View>
        </View>

        <View className="px-5 pt-5 gap-6">
          {/* Info Card Grid */}
          <View className="flex-row bg-white p-4 rounded-2xl border border-slate-200 gap-3 flex-wrap sm:flex-nowrap shadow-sm">
            <View className="flex-row items-center gap-3 flex-1 min-w-[140px]">
              <View className="w-11 h-11 rounded-xl bg-slate-100 items-center justify-center">
                <Icon name="calendar_today" color="#0F172A" size={20} />
              </View>
              <View className="flex-1">
                <Text className="text-[11px] text-slate-500 font-medium">Jadwal Acara</Text>
                <Text className="font-bold text-slate-900 text-xs" numberOfLines={1}>{dateFormatted}</Text>
                <Text className="text-[10px] text-slate-500" numberOfLines={1}>{timeFormatted}</Text>
              </View>
            </View>
            <View className="flex-row items-center gap-3 flex-1 min-w-[140px]">
              <View className="w-11 h-11 rounded-xl bg-blue-50 items-center justify-center">
                <Icon name="location_on" color="#2563EB" size={20} />
              </View>
              <View className="flex-1">
                <Text className="text-[11px] text-slate-500 font-medium">Lokasi Venue</Text>
                <Text className="font-bold text-slate-900 text-xs" numberOfLines={1}>{location}</Text>
                <Text className="text-[10px] text-slate-500" numberOfLines={1}>Panggung Utama</Text>
              </View>
            </View>
          </View>

          {/* About Section */}
          <View>
            <Text className="text-base font-bold text-slate-900 mb-2">Deskripsi Konser</Text>
            <Text className="text-slate-600 text-sm leading-6">{description}</Text>
          </View>

          {/* Lineup Section */}
          <View>
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-base font-bold text-slate-900">Lineup Artis &amp; Penampil</Text>
              <Text className="text-xs text-slate-500 font-medium">{artistsList.length} Penampil</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-5 px-5 flex-row gap-4">
              {artistsList.map((p: any, idx: number) => (
                <View key={`${p.name}-${idx}`} className="items-center w-24 mr-2">
                  <View className="w-16 h-16 rounded-full mb-2 border-2 border-slate-200 overflow-hidden bg-slate-900 items-center justify-center shadow-sm">
                    {p.asset ? (
                      <Image source={p.asset} className="w-full h-full" resizeMode="cover" />
                    ) : p.image ? (
                      <Image source={getConcertImageSource(p.image)} className="w-full h-full" resizeMode="cover" />
                    ) : (
                      <Text className="text-white font-bold text-sm">
                        {p.name.substring(0, 2).toUpperCase()}
                      </Text>
                    )}
                  </View>
                  <Text className="text-xs font-bold text-slate-900 text-center" numberOfLines={1}>
                    {p.name}
                  </Text>
                  <Text className="text-[10px] text-slate-500 text-center mt-0.5" numberOfLines={1}>
                    {p.role}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Venue Location Section */}
          <View>
            <Text className="text-base font-bold text-slate-900 mb-3">Informasi Venue</Text>
            <View className="bg-white p-4 rounded-2xl border border-slate-200 gap-4 shadow-sm">
              <View className="flex-row items-center justify-between">
                <View className="flex-1 mr-2">
                  <Text className="font-bold text-slate-900 text-base" numberOfLines={1}>{location}</Text>
                  <Text className="text-xs text-slate-500 mt-0.5" numberOfLines={1}>Akses transportasi umum dan kantong parkir tersedia</Text>
                </View>
                <View className="w-11 h-11 rounded-full bg-slate-900 items-center justify-center">
                  <Icon name="location_on" size={20} color="#ffffff" />
                </View>
              </View>
              <View className="flex-row pt-3 border-t border-slate-100">
                <View className="flex-row items-center gap-2.5 flex-1 min-w-[110px]">
                  <Icon name="groups" size={20} color="#2563EB" />
                  <View className="flex-1">
                    <Text className="text-[10px] text-slate-500 uppercase font-semibold">Kapasitas</Text>
                    <Text className="text-xs font-bold text-slate-900" numberOfLines={1}>Tribun &amp; Festival</Text>
                  </View>
                </View>
                <View className="flex-row items-center gap-2.5 flex-1 min-w-[110px]">
                  <Icon name="local_parking" size={20} color="#2563EB" />
                  <View className="flex-1">
                    <Text className="text-[10px] text-slate-500 uppercase font-semibold">Parkir</Text>
                    <Text className="text-xs font-bold text-slate-900" numberOfLines={1}>Tersedia Luas</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Booking Bar */}
      <SafeAreaView className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-md">
        <View className="px-6 py-3 flex-row justify-between items-center">
          <View>
            <Text className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Harga Tiket Mulai Dari</Text>
            <View className="flex-row items-baseline gap-1 mt-0.5">
              <Text className="text-xl font-bold text-slate-900">{formattedMinPrice}</Text>
              <Text className="text-xs text-slate-500">/ tiket</Text>
            </View>
          </View>
          <Link
            href={{
              pathname: "/pilih-tiket",
              params: params.id ? { id: params.id } : {},
            }}
            asChild
          >
            <Pressable
              hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
              className="bg-blue-600 hover:bg-blue-700 active:scale-95 px-6 min-h-[46px] items-center justify-center rounded-xl shadow-sm"
            >
              <Text className="text-white font-bold text-xs">Pesan Tiket</Text>
            </Pressable>
          </Link>
        </View>
      </SafeAreaView>
    </View>
  );
}
