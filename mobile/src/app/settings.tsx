import { useState } from "react";
import { View, Text, Pressable, ScrollView, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import Icon from "@/components/Icon";

function Toggle({ value, onToggle }: { value: boolean; onToggle: () => void }) {
  return (
    <Pressable onPress={onToggle} className={`w-11 h-6 rounded-full ${value ? "bg-primary" : "bg-outline-variant"}`}>
      <View className="w-5 h-5 rounded-full bg-white mt-0.5" style={{ marginLeft: value ? 22 : 2 }} />
    </Pressable>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const [eventAlerts, setEventAlerts] = useState(true);
  const [marketing, setMarketing] = useState(false);

  return (
    <View className="flex-1 bg-surface">
      <SafeAreaView className="bg-surface border-b border-outline-variant/20">
        <View className="flex-row items-center gap-4 px-4 py-3">
          <Pressable onPress={() => router.back()} className="w-10 h-10 rounded-full bg-surface-container-high items-center justify-center">
            <Icon name="arrow_back" color="#4f378a" size={20} />
          </Pressable>
          <Text className="text-lg font-bold text-on-surface">Settings</Text>
        </View>
      </SafeAreaView>

      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="flex-row items-center gap-4 bg-surface-container-low p-4 rounded-xl my-4">
          <View className="w-14 h-14 rounded-full bg-primary items-center justify-center">
            <Icon name="person" color="#fff" size={28} />
          </View>
          <View>
            <Text className="font-semibold text-on-surface">Alex Rivera</Text>
            <Text className="text-xs text-on-surface-variant">Premium Member since 2023</Text>
          </View>
        </View>

        <Pressable className="flex-row items-center justify-between py-4 border-t border-outline-variant/30">
          <View className="flex-row items-center gap-3">
            <Icon name="security" color="#4f378a" />
            <View>
              <Text className="font-semibold text-on-surface">Account Security</Text>
              <Text className="text-xs text-on-surface-variant">Password, 2FA, Security Keys</Text>
            </View>
          </View>
          <Icon name="chevron_right" color="#7a7582" />
        </Pressable>

        <View className="py-4 border-t border-outline-variant/30">
          <Text className="text-primary font-semibold mb-3">Preferences</Text>
          <View className="flex-row items-center justify-between py-2">
            <View className="flex-row items-center gap-3">
              <Icon name="notifications_active" color="#494551" />
              <Text className="text-on-surface">Event Alerts</Text>
            </View>
            <Toggle value={eventAlerts} onToggle={() => setEventAlerts((v) => !v)} />
          </View>
          <View className="flex-row items-center justify-between py-2">
            <View className="flex-row items-center gap-3">
              <Icon name="mail" color="#494551" />
              <Text className="text-on-surface">Marketing Emails</Text>
            </View>
            <Toggle value={marketing} onToggle={() => setMarketing((v) => !v)} />
          </View>
        </View>

        <View className="py-4 border-t border-outline-variant/30">
          <Text className="text-primary font-semibold mb-3">Legal</Text>
          <Pressable className="flex-row items-center justify-between py-3">
            <View className="flex-row items-center gap-3">
              <Icon name="policy" color="#494551" />
              <Text className="text-on-surface">Privacy Policy</Text>
            </View>
            <Icon name="open_in_new" color="#7a7582" />
          </Pressable>
          <Pressable className="flex-row items-center justify-between py-3">
            <View className="flex-row items-center gap-3">
              <Icon name="gavel" color="#494551" />
              <Text className="text-on-surface">Terms of Service</Text>
            </View>
            <Icon name="open_in_new" color="#7a7582" />
          </Pressable>
        </View>

        <View className="py-4 border-t border-outline-variant/30">
          <Text className="text-primary font-semibold mb-3">About</Text>
          <View className="flex-row items-center justify-between py-3">
            <View className="flex-row items-center gap-3">
              <Icon name="info" color="#494551" />
              <Text className="text-on-surface">App Version</Text>
            </View>
            <View className="bg-surface-container-high px-3 py-1 rounded-full">
              <Text className="text-on-surface-variant text-xs">v2.4.0</Text>
            </View>
          </View>
        </View>

        <View className="pt-8 pb-6 border-t border-outline-variant/30">
          <Pressable className="border-2 border-error rounded-xl py-4 items-center flex-row justify-center gap-2">
            <Icon name="delete_forever" color="#ba1a1a" />
            <Text className="text-error font-bold">Delete Account</Text>
          </Pressable>
          <Text className="text-center text-on-surface-variant text-xs mt-3 px-6">
            This action is permanent and will remove all your booking history.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
