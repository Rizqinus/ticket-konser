import { useState } from "react";
import { View, Text, TextInput, Pressable, ActivityIndicator, SafeAreaView } from "react-native";
import { Link, useRouter } from "expo-router";
import Icon from "@/components/Icon";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit() {
    setSubmitting(true);
    setTimeout(() => router.replace("/(tabs)" as any), 900);
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F9F8FD]">
      <View className="flex-1 px-6 justify-between py-6">
        {/* Top Header */}
        <View className="flex-row justify-between items-center pt-4">
          <Text className="text-xl font-bold text-[#4B3294]">TixFest</Text>
          <Pressable onPress={() => router.back()} className="p-1">
            <Icon name="close" color="#333" size={20} />
          </Pressable>
        </View>

        {/* Main Content */}
        <View className="w-full">
          <View className="items-center mb-8">
            <Text className="text-2xl font-bold text-[#0B1536] mb-2">
              Welcome Back
            </Text>
            <Text className="text-gray-500 text-sm text-center">
              Access your tickets and discover new experiences.
            </Text>
          </View>

          <View className="gap-4">
            {/* Email Field */}
            <View className="flex-row items-center border border-gray-300 rounded-xl px-4 h-14 bg-white">
              <Icon name="mail" color="#9CA3AF" size={20} />
              <TextInput
                className="flex-1 ml-3 text-gray-900 text-base"
                placeholder="Email Address"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password Field */}
            <View>
              <View className="flex-row items-center border border-gray-300 rounded-xl px-4 h-14 bg-white">
                <Icon name="lock" color="#9CA3AF" size={20} />
                <TextInput
                  className="flex-1 ml-3 text-gray-900 text-base"
                  placeholder="Password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <Pressable onPress={() => setShowPassword((v) => !v)}>
                  <Icon name={showPassword ? "visibility_off" : "visibility"} color="#9CA3AF" size={20} />
                </Pressable>
              </View>
              <Pressable className="self-end mt-2">
                <Text className="text-[#55389E] font-semibold text-xs">Forgot Password?</Text>
              </Pressable>
            </View>

            {/* Login Button */}
            <Pressable
              onPress={handleSubmit}
              disabled={submitting}
              className="w-full h-14 bg-[#4D3298] rounded-full items-center justify-center flex-row gap-2 active:opacity-90 mt-2"
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text className="text-white font-semibold text-base">Login</Text>
                  <Icon name="arrow_forward" color="#fff" size={18} />
                </>
              )}
            </Pressable>
          </View>

          {/* Divider */}
          <View className="flex-row items-center my-6">
            <View className="flex-1 h-[1px] bg-gray-200" />
            <Text className="mx-3 text-[10px] font-medium text-gray-400 tracking-wider">
              OR CONTINUE WITH
            </Text>
            <View className="flex-1 h-[1px] bg-gray-200" />
          </View>

          {/* Social Logins */}
          <View className="flex-row gap-3">
            <Pressable className="flex-1 h-12 rounded-full border border-gray-200 bg-white items-center justify-center flex-row gap-2">
              <Icon name="account_circle" size={18} color="#555" />
              <Text className="font-semibold text-gray-800 text-sm">Google</Text>
            </Pressable>
            <Pressable className="flex-1 h-12 rounded-full border border-gray-200 bg-white items-center justify-center flex-row gap-2">
              <Icon name="apple" size={18} color="#000" />
              <Text className="font-semibold text-gray-800 text-sm">Apple</Text>
            </Pressable>
          </View>
        </View>

        {/* Footer */}
        <View className="items-center pb-4">
          <Text className="text-gray-500 text-xs">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-[#55389E] font-bold">
              Sign Up
            </Link>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

