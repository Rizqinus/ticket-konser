import { useEffect, useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { getAuth, logout } from "@/lib/api";

const MENU_ITEMS = [
  { icon: "person-outline", label: "Ubah Profil", route: "/profile-edit" },
  { icon: "favorite-border", label: "Konser Favorit", route: "/favorit" },
  { icon: "notifications-none", label: "Pemberitahuan", route: "/notifikasi" },
  { icon: "settings", label: "Pengaturan Akun", route: "/settings" },
  { icon: "logout", label: "Keluar dari Akun", route: "logout", danger: true },
];

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const auth = getAuth();
    setUser(auth.user);
  }, []);

  function handleMenuPress(item: (typeof MENU_ITEMS)[0]) {
    if (item.route === "logout") {
      logout();
      router.replace("/login");
      return;
    }
    if (item.route) {
      router.push(item.route as any);
    }
  }

  return (
    <View className="flex-1 bg-surface">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-5 pt-14 pb-4">
          <Text className="text-2xl font-bold tracking-tight text-slate-900">Akun Saya</Text>
        </View>

        {/* User Card */}
        <View className="mx-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm items-center mb-5">
          <View className="w-20 h-20 rounded-full bg-slate-900 items-center justify-center border-4 border-slate-100 mb-3">
            <Text className="text-white text-3xl font-bold">
              {(user?.name || "U").charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text className="text-lg font-bold text-slate-900">
            {user?.name || "Pengguna Tamu"}
          </Text>
          <Text className="text-xs text-slate-500 mt-0.5">
            {user?.email || "Belum masuk akun"}
          </Text>
          {!user && (
            <Pressable
              onPress={() => router.push("/login")}
              hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
              className="mt-3 bg-blue-600 px-5 min-h-[38px] items-center justify-center rounded-xl active:scale-95 shadow-sm"
            >
              <Text className="text-white font-semibold text-xs">Masuk ke Akun</Text>
            </Pressable>
          )}
        </View>

        {/* Menu Items */}
        <View className="mx-5 bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
          {MENU_ITEMS.map((item, index) => (
            <Pressable
              key={item.label}
              onPress={() => handleMenuPress(item)}
              hitSlop={{ top: 2, bottom: 2, left: 4, right: 4 }}
              className={`flex-row items-center px-5 min-h-[52px] py-3 active:bg-slate-50 ${
                index < MENU_ITEMS.length - 1 ? "border-b border-slate-100" : ""
              }`}
            >
              <View
                className={`w-9 h-9 rounded-xl items-center justify-center mr-3.5 ${
                  item.danger ? "bg-red-50" : "bg-slate-100"
                }`}
              >
                <MaterialIcons
                  name={item.icon as any}
                  size={19}
                  color={item.danger ? "#EF4444" : "#0F172A"}
                />
              </View>
              <Text
                className={`flex-1 text-xs font-semibold ${
                  item.danger ? "text-red-600" : "text-slate-800"
                }`}
              >
                {item.label}
              </Text>
              {!item.danger && (
                <MaterialIcons name="chevron-right" size={18} color="#94A3B8" />
              )}
            </Pressable>
          ))}
        </View>

        {/* Branding Footer */}
        <View className="items-center mt-6 mb-4">
          <Text className="text-xs font-bold text-slate-400 tracking-wider uppercase">Gigpass</Text>
          <Text className="text-[11px] text-slate-400 mt-0.5">Versi 1.0.0 (Akses Konser & Tiket)</Text>
        </View>
      </ScrollView>
    </View>
  );
}
