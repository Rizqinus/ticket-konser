import { View, Text, Pressable, ScrollView, Image } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

const MENU_ITEMS = [
  { icon: "edit", label: "Edit Profile", route: "/profile-edit" },
  { icon: "favorite-border", label: "Favorite Concerts", route: "/favorit" },
  { icon: "notifications-none", label: "Notifications", route: "/notifikasi" },
  { icon: "settings", label: "Settings", route: "/settings" },
  { icon: "help-outline", label: "Help & Support", route: null },
  { icon: "logout", label: "Sign Out", route: "/login", danger: true },
];

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-surface">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-5 pt-14 pb-4 flex-row justify-between items-center">
          <Text className="text-2xl font-bold text-gray-900">Profile</Text>
          <Pressable onPress={() => router.push("/settings")} className="w-10 h-10 rounded-full border border-outline-variant bg-white items-center justify-center">
            <MaterialIcons name="settings" size={20} color="#4D3298" />
          </Pressable>
        </View>

        {/* User Card */}
        <View className="mx-5 bg-white rounded-3xl p-5 border border-outline-variant items-center mb-5">
          <View className="relative mb-3">
            <Image
              source={{ uri: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80" }}
              className="w-24 h-24 rounded-full border-4 border-primary"
            />
            <Pressable
              onPress={() => router.push("/profile-edit")}
              className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full items-center justify-center border-2 border-white"
            >
              <MaterialIcons name="edit" size={14} color="#fff" />
            </Pressable>
          </View>
          <Text className="text-xl font-bold text-gray-900">Alex Rivera</Text>
          <Text className="text-sm text-gray-500 mt-0.5">alex.rivera@email.com</Text>

          {/* Stats */}
          <View className="flex-row w-full mt-5 gap-3">
            {[
              { label: "Concerts", value: "12" },
              { label: "Favorites", value: "8" },
              { label: "Reviews", value: "5" },
            ].map((stat) => (
              <View key={stat.label} className="flex-1 items-center bg-surface-container-low rounded-2xl py-3">
                <Text className="text-xl font-bold text-primary">{stat.value}</Text>
                <Text className="text-xs text-gray-500 mt-0.5">{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Menu Items */}
        <View className="mx-5 bg-white rounded-3xl overflow-hidden border border-outline-variant">
          {MENU_ITEMS.map((item, index) => (
            <Pressable
              key={item.label}
              onPress={() => item.route && router.push(item.route as any)}
              className={`flex-row items-center px-5 py-4 ${
                index < MENU_ITEMS.length - 1 ? "border-b border-outline-variant" : ""
              }`}
            >
              <View className={`w-9 h-9 rounded-xl items-center justify-center mr-4 ${
                item.danger ? "bg-red-50" : "bg-primary-light"
              }`}>
                <MaterialIcons
                  name={item.icon as any}
                  size={20}
                  color={item.danger ? "#EF4444" : "#4D3298"}
                />
              </View>
              <Text className={`flex-1 text-sm font-semibold ${item.danger ? "text-red-500" : "text-gray-800"}`}>
                {item.label}
              </Text>
              {!item.danger && (
                <MaterialIcons name="chevron-right" size={20} color="#9CA3AF" />
              )}
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
