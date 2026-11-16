import { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, SafeAreaView, Alert } from "react-native";
import { useRouter } from "expo-router";
import Icon from "@/components/Icon";
import { getAuth } from "@/lib/api";

export default function EditProfileScreen() {
  const router = useRouter();
  const auth = getAuth();
  const user = auth.user;

  const [name, setName] = useState(user?.name || "Penikmat Musik");
  const [email, setEmail] = useState(user?.email || "user@email.com");
  const [phone, setPhone] = useState(user?.phone || "0812-3456-7890");

  function handleSave() {
    Alert.alert("Profil Disimpan", "Informasi profil Anda telah berhasil diperbarui.", [
      { text: "OK", onPress: () => (router.canGoBack() ? router.back() : router.replace("/(tabs)/profile")) },
    ]);
  }

  return (
    <View className="flex-1 bg-surface">
      <SafeAreaView className="bg-white border-b border-slate-200">
        <View className="flex-row items-center gap-3 px-4 py-3">
          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.replace("/(tabs)/profile"))}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            className="w-11 h-11 rounded-full bg-slate-100 items-center justify-center active:scale-95"
          >
            <Icon name="arrow_back" color="#0F172A" size={20} />
          </Pressable>
          <Text className="text-base font-bold text-slate-900">Ubah Profil</Text>
        </View>
      </SafeAreaView>

      <ScrollView className="flex-1 px-5 pt-4" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Avatar Section */}
        <View className="items-center my-6">
          <View className="w-24 h-24 rounded-3xl bg-slate-900 items-center justify-center border-4 border-slate-100 shadow-sm">
            <Text className="text-white text-3xl font-bold">
              {name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text className="text-xs text-slate-400 mt-2 font-medium">
            Inisial Otomatis dari Nama Akun
          </Text>
        </View>

        {/* Inputs */}
        <View className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm gap-4">
          <View>
            <Text className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Nama Lengkap
            </Text>
            <TextInput
              className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 h-12 text-sm text-slate-900"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View>
            <Text className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Alamat Email
            </Text>
            <TextInput
              className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 h-12 text-sm text-slate-900"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View>
            <Text className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Nomor WhatsApp
            </Text>
            <TextInput
              className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 h-12 text-sm text-slate-900"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          <Pressable
            onPress={handleSave}
            hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
            className="w-full min-h-[48px] bg-blue-600 active:bg-blue-700 active:scale-[0.98] rounded-xl items-center justify-center mt-2 shadow-sm"
          >
            <Text className="text-white font-bold text-xs">Simpan Perubahan</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
