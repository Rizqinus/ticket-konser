import { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator, ImageBackground } from "react-native";
import { Link, useRouter } from "expo-router";
import Icon from "@/components/Icon";

export default function RegisterScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });

  function set(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit() {
    setSubmitting(true);
    setTimeout(() => router.replace("/login"), 1200);
  }

  return (
    <View className="flex-1 bg-[#F9F8FD]">
      <ImageBackground
        source={{ uri: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80" }}
        className="h-64 justify-end pb-6 px-6"
      >
        <View className="absolute inset-0 bg-purple-900/60" />
        <View className="relative z-10">
          <Text className="text-2xl font-bold text-white mb-1">Create Account</Text>
          <Text className="text-white/80 text-xs leading-5">
            Join TixFest to unlock exclusive concert access and manage your bookings effortlessly.
          </Text>
        </View>
      </ImageBackground>

      <ScrollView className="flex-1 -mt-4 px-5" contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View className="bg-white rounded-3xl p-5 shadow-lg border border-gray-100 gap-3.5">
          {/* Full Name */}
          <View className="bg-[#E7ECFD] rounded-xl px-4 py-2">
            <Text className="text-[10px] font-bold text-[#55389E] uppercase tracking-wider mb-0.5">FULL NAME</Text>
            <View className="flex-row items-center gap-2.5">
              <Icon name="person" size={18} color="#9CA3AF" />
              <TextInput
                className="flex-1 text-gray-800 text-sm p-0"
                placeholder="Enter your full name"
                placeholderTextColor="#A0AEC0"
                value={form.name}
                onChangeText={(v) => set("name", v)}
              />
            </View>
          </View>

          {/* Email Address */}
          <View className="bg-[#E7ECFD] rounded-xl px-4 py-2">
            <Text className="text-[10px] font-bold text-[#55389E] uppercase tracking-wider mb-0.5">EMAIL ADDRESS</Text>
            <View className="flex-row items-center gap-2.5">
              <Icon name="mail" size={18} color="#9CA3AF" />
              <TextInput
                className="flex-1 text-gray-800 text-sm p-0"
                placeholder="email@example.com"
                placeholderTextColor="#A0AEC0"
                value={form.email}
                onChangeText={(v) => set("email", v)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Password */}
          <View className="bg-[#E7ECFD] rounded-xl px-4 py-2">
            <Text className="text-[10px] font-bold text-[#55389E] uppercase tracking-wider mb-0.5">PASSWORD</Text>
            <View className="flex-row items-center gap-2.5">
              <Icon name="lock" size={18} color="#9CA3AF" />
              <TextInput
                className="flex-1 text-gray-800 text-sm p-0"
                placeholder="••••••••"
                placeholderTextColor="#A0AEC0"
                secureTextEntry={!showPassword}
                value={form.password}
                onChangeText={(v) => set("password", v)}
              />
              <Pressable onPress={() => setShowPassword((v) => !v)}>
                <Icon name={showPassword ? "visibility_off" : "visibility"} size={18} color="#9CA3AF" />
              </Pressable>
            </View>
          </View>

          {/* Confirm Password */}
          <View className="bg-[#E7ECFD] rounded-xl px-4 py-2">
            <Text className="text-[10px] font-bold text-[#55389E] uppercase tracking-wider mb-0.5">CONFIRM PASSWORD</Text>
            <View className="flex-row items-center gap-2.5">
              <Icon name="verified_user" size={18} color="#9CA3AF" />
              <TextInput
                className="flex-1 text-gray-800 text-sm p-0"
                placeholder="••••••••"
                placeholderTextColor="#A0AEC0"
                secureTextEntry
                value={form.confirm}
                onChangeText={(v) => set("confirm", v)}
              />
            </View>
          </View>

          {/* Terms & Checkbox */}
          <Pressable onPress={() => setAgree(!agree)} className="flex-row items-start gap-2.5 my-1">
            <View className={`w-4 h-4 rounded border mt-0.5 items-center justify-center ${agree ? 'bg-[#4D3298] border-[#4D3298]' : 'border-gray-400 bg-white'}`}>
              {agree && <Icon name="check" size={12} color="#fff" />}
            </View>
            <Text className="flex-1 text-xs text-gray-600 leading-4">
              I agree to the <Text className="text-[#55389E] font-medium">Terms and Conditions</Text> and <Text className="text-[#55389E] font-medium">Privacy Policy</Text>
            </Text>
          </Pressable>

          {/* Register Button */}
          <Pressable
            onPress={handleSubmit}
            disabled={submitting}
            className="mt-1 bg-[#4D3298] h-13 rounded-full items-center justify-center flex-row gap-2 active:opacity-90 py-3.5"
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text className="text-white font-semibold text-base">Register</Text>
                <Icon name="arrow_forward" size={18} color="#fff" />
              </>
            )}
          </Pressable>

          {/* Divider */}
          <View className="flex-row items-center my-3">
            <View className="flex-1 h-[1px] bg-gray-200" />
            <Text className="mx-3 text-[10px] font-medium text-gray-400 tracking-wider">OR REGISTER WITH</Text>
            <View className="flex-1 h-[1px] bg-gray-200" />
          </View>

          {/* Social Logins */}
          <View className="flex-row gap-3">
            <Pressable className="flex-1 h-11 rounded-full border border-gray-200 bg-white items-center justify-center flex-row gap-2">
              <Icon name="account_circle" size={18} color="#555" />
              <Text className="font-semibold text-gray-800 text-xs">Google</Text>
            </Pressable>
            <Pressable className="flex-1 h-11 rounded-full border border-gray-200 bg-white items-center justify-center flex-row gap-2">
              <Icon name="apple" size={18} color="#000" />
              <Text className="font-semibold text-gray-800 text-xs">Apple</Text>
            </Pressable>
          </View>
        </View>

        {/* Footer Link */}
        <View className="mt-6 items-center">
          <Text className="text-gray-500 text-xs">
            Already have an account?{" "}
            <Link href="/login" className="text-[#55389E] font-bold">
              Login
            </Link>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

