import { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import Icon from "@/components/Icon";

export default function CheckoutScreen() {
  const router = useRouter();
  const [paying, setPaying] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  function set(key: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [key]: v }));
  }

  function handlePay() {
    setPaying(true);
    setTimeout(() => router.push("/pembayaran"), 1000);
  }

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView className="bg-surface border-b border-outline-variant/20">
        <View className="flex-row items-center gap-4 px-4 py-3">
          <Pressable onPress={() => router.back()} className="w-10 h-10 rounded-full bg-surface-container-high items-center justify-center">
            <Icon name="arrow_back" color="#4f378a" size={20} />
          </Pressable>
          <Text className="text-lg font-bold text-primary">Checkout</Text>
        </View>
      </SafeAreaView>

      <ScrollView className="flex-1 px-4" contentContainerStyle={{ gap: 20, paddingBottom: 24 }}>
        <View className="flex-row items-center gap-3 bg-surface-container-low p-4 rounded-xl">
          <Icon name="verified_user" color="#2E7D32" />
          <View>
            <Text className="font-semibold text-on-surface">Secure Checkout</Text>
            <Text className="text-xs text-on-surface-variant">
              Your transaction is encrypted and protected.
            </Text>
          </View>
        </View>

        <View>
          <Text className="text-xs font-bold text-on-surface-variant uppercase mb-2">
            Contact Information
          </Text>
          <View className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant gap-3">
            <View className="flex-row items-center gap-3 border-b border-outline pb-2">
              <Icon name="person" color="#7a7582" size={18} />
              <TextInput
                className="flex-1 text-on-surface"
                placeholder="Full Name"
                value={form.name}
                onChangeText={(v) => set("name", v)}
              />
            </View>
            <View className="flex-row items-center gap-3 border-b border-outline pb-2">
              <Icon name="mail" color="#7a7582" size={18} />
              <TextInput
                className="flex-1 text-on-surface"
                placeholder="Email Address"
                keyboardType="email-address"
                autoCapitalize="none"
                value={form.email}
                onChangeText={(v) => set("email", v)}
              />
            </View>
            <View className="flex-row items-center gap-3 border-b border-outline pb-2">
              <Icon name="call" color="#7a7582" size={18} />
              <TextInput
                className="flex-1 text-on-surface"
                placeholder="Phone Number"
                keyboardType="phone-pad"
                value={form.phone}
                onChangeText={(v) => set("phone", v)}
              />
            </View>
          </View>
        </View>

        <View>
          <Text className="text-xs font-bold text-on-surface-variant uppercase mb-2">
            Payment Summary
          </Text>
          <View className="bg-surface-container-high p-5 rounded-2xl gap-2">
            <View className="flex-row justify-between">
              <Text className="text-on-surface-variant">Subtotal (2 tickets)</Text>
              <Text className="text-on-surface-variant">$250.00</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-on-surface-variant">Service Fees</Text>
              <Text className="text-on-surface-variant">$24.50</Text>
            </View>
            <View className="h-[1px] bg-outline-variant my-1" />
            <View className="flex-row justify-between">
              <Text className="font-bold text-on-surface">Total Amount</Text>
              <Text className="font-bold text-primary text-lg">$279.50</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="bg-surface border-t border-outline-variant p-4">
        <Pressable
          onPress={handlePay}
          disabled={paying}
          className="bg-primary h-14 rounded-full items-center justify-center flex-row gap-2"
        >
          {paying ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text className="text-white font-bold">Confirm &amp; Pay</Text>
              <Icon name="arrow_forward" color="#fff" size={18} />
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
}
