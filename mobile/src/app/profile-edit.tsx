import { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, Image, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import Icon from "@/components/Icon";

export default function EditProfileScreen() {
  const router = useRouter();
  const [discoverable, setDiscoverable] = useState(true);
  const [name, setName] = useState("Alex Thompson");
  const [email, setEmail] = useState("alex.thompson@example.com");
  const [phone, setPhone] = useState("+1 (555) 0123-4567");

  return (
    <View className="flex-1 bg-surface">
      <SafeAreaView className="bg-surface border-b border-outline-variant/20">
        <View className="flex-row items-center gap-4 px-4 py-3">
          <Pressable onPress={() => router.back()} className="w-10 h-10 rounded-full bg-surface-container-high items-center justify-center">
            <Icon name="arrow_back" color="#4f378a" size={20} />
          </Pressable>
          <Text className="text-lg font-bold text-primary">Edit Profile</Text>
        </View>
      </SafeAreaView>

      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="items-center my-6">
          <View>
            <Image
              source={{
                uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBtuJDYw0oaHWO1ENwxi0mgAGV_M50LZuvtQbwiB73Hpt1iYKXO-BcMdgiTxAtXXLlQqLPewNCwUL-NMIg_JmFJcfr1fk0bzxFLjMWOI3rzmwZxOIrEvLOCsRQgIfEeu7Us_jVvTzPO5HUDn748yrbT-QfT7KGkHWXf8GVtKc9fR0nkDuqi4KPdTYxoxFV_LcdCOwQ-Yt85mOFLXRajAeTi09kJCXHvM8PMVnnDLghNah4avqZ05lzXwQ",
              }}
              className="w-28 h-28 rounded-full border-4 border-surface-container"
            />
            <Pressable className="absolute bottom-0 right-0 bg-primary w-9 h-9 rounded-full items-center justify-center border-2 border-surface">
              <Icon name="photo_camera" size={18} color="#fff" />
            </Pressable>
          </View>
          <Pressable className="mt-3">
            <Text className="text-primary font-semibold">Change Profile Picture</Text>
          </Pressable>
        </View>

        <View className="gap-4">
          {[
            { label: "Full Name", value: name, set: setName },
            { label: "Email", value: email, set: setEmail },
            { label: "Phone Number", value: phone, set: setPhone },
          ].map((f) => (
            <View key={f.label} className="bg-surface-container-low rounded-t-lg border-b border-outline px-4 py-2">
              <Text className="text-xs text-primary uppercase tracking-wide">{f.label}</Text>
              <TextInput className="text-on-surface text-base" value={f.value} onChangeText={f.set} />
            </View>
          ))}
        </View>

        <View className="mt-6 p-4 bg-surface-container-low rounded-xl flex-row items-center justify-between border border-outline-variant/30">
          <View className="flex-row items-center gap-3 flex-1 pr-2">
            <View className="w-10 h-10 rounded-lg bg-secondary-container items-center justify-center">
              <Icon name="notifications_active" color="#fff" />
            </View>
            <View className="flex-1">
              <Text className="font-medium text-on-surface">Show profile in discovery</Text>
              <Text className="text-xs text-on-surface-variant">
                Let others find you for concert meetups
              </Text>
            </View>
          </View>
          <Pressable
            onPress={() => setDiscoverable((v) => !v)}
            className={`w-11 h-6 rounded-full ${discoverable ? "bg-primary" : "bg-outline"}`}
          >
            <View
              className="w-5 h-5 rounded-full bg-white mt-0.5"
              style={{ marginLeft: discoverable ? 22 : 2 }}
            />
          </Pressable>
        </View>
      </ScrollView>

      <View className="p-4 border-t border-outline-variant">
        <Pressable
          onPress={() => router.back()}
          className="bg-primary h-14 rounded-full items-center justify-center flex-row gap-2"
        >
          <Icon name="save" color="#fff" size={18} />
          <Text className="text-white font-bold">Save Changes</Text>
        </Pressable>
      </View>
    </View>
  );
}
