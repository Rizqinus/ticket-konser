import { useMemo, useState } from "react";
import { View, Text, Pressable, ScrollView, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import Icon from "@/components/Icon";

type TicketType = "vip" | "platinum" | "regular" | "economy";

const CATEGORIES: {
  key: TicketType;
  name: string;
  desc: string;
  price: number;
  soldOut?: boolean;
}[] = [
  { key: "vip", name: "VIP Front Row", desc: "Premium seating + backstage access", price: 450 },
  { key: "platinum", name: "Platinum Arena", desc: "Center stage proximity", price: 280 },
  { key: "regular", name: "Regular Standing", desc: "General admission standing", price: 120 },
  { key: "economy", name: "Economy Tier", desc: "Rear wing seating", price: 65, soldOut: true },
];

export default function PilihTiketScreen() {
  const router = useRouter();
  const [counts, setCounts] = useState<Record<TicketType, number>>({
    vip: 0,
    platinum: 0,
    regular: 0,
    economy: 0,
  });

  function increment(type: TicketType) {
    if (type === "economy") return;
    setCounts((c) => (c[type] < 4 ? { ...c, [type]: c[type] + 1 } : c));
  }
  function decrement(type: TicketType) {
    setCounts((c) => (c[type] > 0 ? { ...c, [type]: c[type] - 1 } : c));
  }

  const { total, qty } = useMemo(() => {
    let total = 0;
    let qty = 0;
    for (const cat of CATEGORIES) {
      total += counts[cat.key] * cat.price;
      qty += counts[cat.key];
    }
    return { total, qty };
  }, [counts]);

  return (
    <View className="flex-1 bg-surface">
      <SafeAreaView className="bg-surface border-b border-outline-variant/20">
        <View className="flex-row items-center gap-4 px-4 py-3">
          <Pressable onPress={() => router.back()} className="w-10 h-10 rounded-full bg-surface-container-high items-center justify-center">
            <Icon name="arrow_back" color="#4f378a" size={20} />
          </Pressable>
          <View>
            <Text className="text-lg font-bold text-primary">Select Tickets</Text>
            <Text className="text-xs text-outline">Neon Horizons Tour</Text>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView className="flex-1 px-4 pt-2" contentContainerStyle={{ gap: 12, paddingBottom: 24 }}>
        {CATEGORIES.map((cat) => (
          <View
            key={cat.key}
            className={`bg-surface-container-low p-4 rounded-xl border border-outline-variant flex-row justify-between items-center ${
              cat.soldOut ? "opacity-60" : ""
            }`}
          >
            <View className="flex-1 pr-2">
              <Text className="font-semibold text-on-surface">{cat.name}</Text>
              <Text className="text-xs text-on-surface-variant">{cat.desc}</Text>
              <Text className={`font-bold mt-1 ${cat.soldOut ? "line-through text-on-surface-variant" : "text-on-surface"}`}>
                ${cat.price.toFixed(2)}
              </Text>
            </View>
            <View className="flex-row items-center gap-2 bg-surface-container-highest rounded-full p-1">
              <Pressable
                disabled={cat.soldOut}
                onPress={() => decrement(cat.key)}
                className="w-8 h-8 rounded-full items-center justify-center"
              >
                <Icon name="remove" color="#4f378a" size={18} />
              </Pressable>
              <Text className="font-bold w-5 text-center">{counts[cat.key]}</Text>
              <Pressable
                disabled={cat.soldOut}
                onPress={() => increment(cat.key)}
                className="w-8 h-8 rounded-full bg-primary items-center justify-center"
              >
                <Icon name="add" color="#fff" size={18} />
              </Pressable>
            </View>
          </View>
        ))}
        <Text className="text-xs text-outline text-center px-4 mt-2">
          Max 4 tickets per category. All sales are final.
        </Text>
      </ScrollView>

      <View className="bg-surface border-t border-outline-variant p-4 gap-3">
        <View className="flex-row justify-between items-end">
          <View>
            <Text className="text-xs text-on-surface-variant">Total Payment</Text>
            <Text className="text-xl font-bold text-primary">${total.toFixed(2)}</Text>
          </View>
          <Text className="text-xs text-on-surface-variant">
            {qty} Ticket{qty !== 1 ? "s" : ""} Selected
          </Text>
        </View>
        <Pressable
          disabled={qty === 0}
          onPress={() => router.push("/checkout")}
          className={`h-14 rounded-xl items-center justify-center flex-row gap-2 ${
            qty === 0 ? "bg-outline-variant" : "bg-primary"
          }`}
        >
          <Text className={`font-bold ${qty === 0 ? "text-on-surface-variant" : "text-white"}`}>
            Proceed to Checkout
          </Text>
          {qty > 0 && <Icon name="chevron_right" color="#fff" size={18} />}
        </Pressable>
      </View>
    </View>
  );
}
