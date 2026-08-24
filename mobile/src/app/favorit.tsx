import { useState } from "react";
import { View, Text, Pressable, ScrollView, Image, SafeAreaView } from "react-native";
import { Link, useRouter } from "expo-router";
import Icon from "@/components/Icon";

const INITIAL = [
  {
    id: "f1",
    title: "Neon Pulse Live",
    venue: "Grand Arena, Metro City",
    price: "$89.00",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD84-EeqF7RhAp5JrLZEvTFcZFoPsjgN8xwrAieWf3IqCozmCzRaPCECefXvJ_FWpdEK_grlZclka_nUljOQAAMNB7O1nc1AlkJlZ5YaF-8AafHRSxTWyYgdBUvYVaz6mCT-1-1dvYCIr1YJ4joHaEgfk9_FIekr00bgpIRplgKlerSCrrv7lfvQ2yNukX-JLU33swp6TsL_QMcywfypziK5EWjOXkKmrFwWCtyjMnsefhXdDTxp75scA",
  },
  {
    id: "f2",
    title: "Acoustic Shadows",
    venue: "The Velvet Room",
    price: "$45.00",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDNdk9joJ3M7rGKDmUp7EI9tLoYkoDsBpyythjWLCAWIZv9QZWBUcHqwIwmR9d4HcL0ZF3qGaeKMQEBkuuRpQzwVlEdU6ls9yfuE2Ac_BimxtS0OBCpH6nHHe9bWxv5MlT90Vc5fLgk6cfYBeqUDGAkSx75sFHBX1Zyqr9N66rTJRyJiQ0xEvTt1jpggwl1xmDxnGDRMCSBZrIxTrH_oeQP7pclqcEYAJTej1lK2_NPV_tquo9UH1VQ4Q",
  },
];

export default function FavoriteConcertScreen() {
  const router = useRouter();
  const [favorites, setFavorites] = useState(INITIAL);

  return (
    <View className="flex-1 bg-surface">
      <SafeAreaView className="bg-surface border-b border-outline-variant/20">
        <View className="flex-row items-center gap-4 px-4 py-3">
          <Pressable onPress={() => router.back()} className="w-10 h-10 rounded-full bg-surface-container-high items-center justify-center">
            <Icon name="arrow_back" color="#4f378a" size={20} />
          </Pressable>
          <Text className="text-lg font-bold text-primary">Favorite Concerts</Text>
        </View>
      </SafeAreaView>

      <ScrollView className="flex-1 px-4 pt-2" contentContainerStyle={{ gap: 12, paddingBottom: 24 }}>
        {favorites.length === 0 ? (
          <View className="items-center py-20">
            <Icon name="favorite" size={80} color="#cbc4d2" />
            <Text className="text-lg font-bold text-on-surface mt-4">No favorites yet</Text>
            <Text className="text-on-surface-variant text-center mt-2 px-8">
              Start exploring concerts and tap the heart icon to save them here.
            </Text>
            <Link href={"/(tabs)/explore" as any} asChild>
              <Pressable className="mt-6 bg-primary px-8 py-3 rounded-full">
                <Text className="text-white font-bold">Explore Events</Text>
              </Pressable>
            </Link>
          </View>
        ) : (
          favorites.map((fav) => (
            <View key={fav.id} className="bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant">
              <View className="relative">
                <Image source={{ uri: fav.img }} className="w-full h-40" />
                <Pressable
                  onPress={() => setFavorites((list) => list.filter((f) => f.id !== fav.id))}
                  className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/80 items-center justify-center"
                >
                  <Icon name="favorite" color="#E91E63" />
                </Pressable>
              </View>
              <View className="p-4">
                <Text className="text-lg font-bold text-on-surface mb-1">{fav.title}</Text>
                <View className="flex-row items-center gap-1 mb-3">
                  <Icon name="location_on" size={16} color="#494551" />
                  <Text className="text-on-surface-variant text-sm">{fav.venue}</Text>
                </View>
                <View className="flex-row justify-between items-center">
                  <Text className="font-bold text-primary">{fav.price}</Text>
                  <Link href="/concert" asChild>
                    <Pressable className="bg-primary px-5 py-2 rounded-lg">
                      <Text className="text-white font-semibold text-sm">Buy Tickets</Text>
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
