import { useMemo, useState, useEffect } from "react";
import { View, Text, Pressable, ScrollView, SafeAreaView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Icon from "@/components/Icon";
import { api } from "@/lib/api";

type TicketType = "vip" | "festival" | "regular";

const CATEGORIES: {
  key: TicketType;
  name: string;
  desc: string;
  price: number;
  priceFormatted: string;
  soldOut?: boolean;
}[] = [
  {
    key: "vip",
    name: "VIP Panggung Depan",
    desc: "Akses baris terdepan, wristband eksklusif, & antrean khusus",
    price: 1500000,
    priceFormatted: "Rp 1.500.000",
  },
  {
    key: "festival",
    name: "Festival Standing",
    desc: "Area berdiri tepat di depan panggung utama",
    price: 800000,
    priceFormatted: "Rp 800.000",
  },
  {
    key: "regular",
    name: "Tribun Reguler",
    desc: "Nomor kursi tribun bernomor dengan sudut pandang panggung luas",
    price: 400000,
    priceFormatted: "Rp 400.000",
  },
];

export default function PilihTiketScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string; title?: string }>();
  const [concertTitle, setConcertTitle] = useState(params.title || "Pesta Semesta Musik 2026");
  const [ticketCategories, setTicketCategories] = useState<any[]>(CATEGORIES);
  const [counts, setCounts] = useState<Record<string, number>>({
    vip: 0,
    festival: 0,
    regular: 0,
  });

  useEffect(() => {
    if (!params.id) return;
    let isMounted = true;
    api
      .getConcertById(params.id)
      .then((res) => {
        if (!isMounted || !res.data) return;
        if (res.data.title) {
          setConcertTitle(res.data.title);
        }
        if (Array.isArray(res.data.tickets) && res.data.tickets.length > 0) {
          const mapped = res.data.tickets.map((t: any) => {
            const rawClass = (t.class || t.name || "regular").toLowerCase();
            const key: TicketType = rawClass.includes("vip")
              ? "vip"
              : rawClass.includes("fest")
              ? "festival"
              : "regular";
            return {
              id: t.id,
              key,
              name: t.name || (key === "vip" ? "VIP Panggung Depan" : key === "festival" ? "Festival Standing" : "Tribun Reguler"),
              desc:
                key === "vip"
                  ? "Akses baris terdepan, wristband eksklusif, & antrean khusus"
                  : key === "festival"
                  ? "Area berdiri tepat di depan panggung utama"
                  : "Nomor kursi tribun bernomor dengan sudut pandang panggung luas",
              price: Number(t.price) || 0,
              priceFormatted: `Rp ${Number(t.price).toLocaleString("id-ID")}`,
              stock: t.stock,
              soldOut: t.stock !== undefined && t.stock <= 0,
            };
          });

          // Deduplikasi berdasarkan key
          const unique = [];
          const seen = new Set();
          for (const item of mapped) {
            if (!seen.has(item.key)) {
              seen.add(item.key);
              unique.push(item);
            }
          }
          if (unique.length > 0) {
            setTicketCategories(unique);
          }
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, [params.id]);

  function increment(type: string) {
    setCounts((c) => ({ ...c, [type]: (c[type] || 0) < 4 ? (c[type] || 0) + 1 : (c[type] || 0) }));
  }
  function decrement(type: string) {
    setCounts((c) => ({ ...c, [type]: Math.max(0, (c[type] || 0) - 1) }));
  }

  const { total, qty } = useMemo(() => {
    let total = 0;
    let qty = 0;
    for (const cat of ticketCategories) {
      total += (counts[cat.key] || 0) * cat.price;
      qty += counts[cat.key] || 0;
    }
    return { total, qty };
  }, [counts, ticketCategories]);

  const formatIDR = (val: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);

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
          <View>
            <Text className="text-base font-bold text-slate-900">Pilih Kategori Tiket</Text>
            <Text className="text-xs text-slate-500">{concertTitle}</Text>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView className="flex-1 px-5 pt-4" contentContainerStyle={{ gap: 12, paddingBottom: 110 }}>
        {ticketCategories.map((cat) => (
          <View
            key={cat.key}
            className={`bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex-row justify-between items-center ${
              cat.soldOut ? "opacity-60" : ""
            }`}
          >
            <View className="flex-1 pr-3">
              <Text className="font-bold text-slate-900 text-sm">{cat.name}</Text>
              <Text className="text-xs text-slate-500 mt-0.5 leading-4">{cat.desc}</Text>
              <Text className="font-bold text-blue-600 text-sm mt-1.5">
                {cat.priceFormatted}
              </Text>
            </View>

            {/* Stepper with minimum 44px tap targets */}
            <View className="flex-row items-center bg-slate-100 rounded-full p-1 border border-slate-200">
              <Pressable
                disabled={cat.soldOut || (counts[cat.key] || 0) === 0}
                onPress={() => decrement(cat.key)}
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                className="w-11 h-11 rounded-full bg-white items-center justify-center active:scale-95 shadow-2xs disabled:opacity-30"
              >
                <Icon name="remove" color="#0F172A" size={18} />
              </Pressable>
              <Text className="font-bold text-sm w-7 text-center text-slate-900">
                {counts[cat.key] || 0}
              </Text>
              <Pressable
                disabled={cat.soldOut || (counts[cat.key] || 0) >= 4}
                onPress={() => increment(cat.key)}
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                className="w-11 h-11 rounded-full bg-slate-900 items-center justify-center active:scale-95 shadow-2xs disabled:opacity-30"
              >
                <Icon name="add" color="#ffffff" size={18} />
              </Pressable>
            </View>
          </View>
        ))}

        <Text className="text-xs text-slate-400 text-center px-4 mt-2">
          Maksimal 4 tiket per transaksi. Tiket resmi akan diterbitkan dengan kode QR unik.
        </Text>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <SafeAreaView className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-md">
        <View className="px-5 py-3 flex-row justify-between items-center">
          <View>
            <Text className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
              Total ({qty} Tiket)
            </Text>
            <Text className="text-xl font-bold text-slate-900 mt-0.5">
              {formatIDR(total)}
            </Text>
          </View>
          <Pressable
            disabled={qty === 0}
            onPress={() => {
              const selectedItems: { ticket_category_id: number; quantity: number }[] = [];
              if (counts.vip > 0) selectedItems.push({ ticket_category_id: 1, quantity: counts.vip });
              if (counts.festival > 0) selectedItems.push({ ticket_category_id: 2, quantity: counts.festival });
              if (counts.regular > 0) selectedItems.push({ ticket_category_id: 3, quantity: counts.regular });

              router.push({
                pathname: "/checkout",
                params: {
                  items: JSON.stringify(selectedItems),
                  total: String(total),
                  concert_title: "Coldplay World Tour",
                },
              } as any);
            }}
            hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
            className={`min-h-[46px] px-6 rounded-xl items-center justify-center flex-row gap-2 shadow-sm ${
              qty > 0 ? "bg-blue-600 active:scale-95" : "bg-slate-300"
            }`}
          >
            <Text className="text-white font-bold text-xs">Lanjut Pesan</Text>
            <Icon name="arrow_forward" color="#ffffff" size={16} />
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}
