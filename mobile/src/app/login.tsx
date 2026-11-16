import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Link, useRouter } from "expo-router";
import Icon from "@/components/Icon";
import GigpassLogo from "@/components/GigpassLogo";
import { api } from "@/lib/api";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState<"email" | "password" | null>(null);

  async function handleSubmit() {
    if (!email.trim() || !password) {
      setError("Email dan kata sandi wajib diisi.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await api.login(email.trim(), password);
      router.replace("/(tabs)" as any);
    } catch (err: any) {
      setError(err.message || "Gagal masuk. Periksa kembali email dan kata sandi Anda.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingVertical: 16 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Top Bar Navigation */}
          <View className="flex-row justify-between items-center mb-6 pt-2">
            <View className="flex-row items-center gap-2.5">
              <GigpassLogo size={36} />
              <View>
                <Text className="text-base font-extrabold text-slate-900 tracking-tight">
                  Gigpass
                </Text>
                <Text className="text-[10px] font-medium text-slate-500">
                  Tiket & Konser Musik
                </Text>
              </View>
            </View>

            <Pressable
              onPress={() => {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.replace("/(tabs)");
                }
              }}
              accessibilityLabel="Tutup dan kembali ke beranda"
              accessibilityRole="button"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              className="w-11 h-11 rounded-full bg-white border border-slate-200 items-center justify-center active:scale-95 shadow-xs"
            >
              <Icon name="close" color="#0F172A" size={20} />
            </Pressable>
          </View>

          {/* Heading */}
          <View className="mb-6">
            <View className="inline-flex self-start flex-row items-center gap-1.5 bg-blue-50 border border-blue-200/80 px-3 py-1 rounded-full mb-3">
              <View className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              <Text className="text-blue-700 text-[11px] font-bold uppercase tracking-wider">
                Akses Penonton Konser
              </Text>
            </View>
            <Text className="text-2xl font-extrabold tracking-tight text-slate-900">
              Masuk ke Akun
            </Text>
            <Text className="text-xs text-slate-500 mt-1.5 leading-5">
              Kelola e-tiket konser Anda, pantau riwayat pesanan, dan dapatkan jadwal panggung musik terkini.
            </Text>
          </View>

          {/* Error Banner */}
          {error ? (
            <View className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex-row items-center gap-2.5">
              <Icon name="error" color="#DC2626" size={18} />
              <Text className="text-red-700 text-xs font-medium flex-1">{error}</Text>
            </View>
          ) : null}

          {/* Form Fields */}
          <View className="gap-4">
            {/* Email Field */}
            <View>
              <Text className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Alamat Email
              </Text>
              <View
                className={`flex-row items-center border rounded-xl px-3.5 h-12 bg-white shadow-xs transition-colors ${
                  focusedField === "email"
                    ? "border-blue-600 bg-blue-50/10"
                    : "border-slate-300"
                }`}
              >
                <Icon
                  name="mail"
                  color={focusedField === "email" ? "#2563EB" : "#64748B"}
                  size={18}
                />
                <TextInput
                  className="flex-1 ml-2.5 text-slate-900 text-sm"
                  placeholder="nama@email.com"
                  placeholderTextColor="#94A3B8"
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Password Field */}
            <View>
              <Text className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Kata Sandi
              </Text>
              <View
                className={`flex-row items-center border rounded-xl pl-3.5 pr-1 h-12 bg-white shadow-xs transition-colors ${
                  focusedField === "password"
                    ? "border-blue-600 bg-blue-50/10"
                    : "border-slate-300"
                }`}
              >
                <Icon
                  name="lock"
                  color={focusedField === "password" ? "#2563EB" : "#64748B"}
                  size={18}
                />
                <TextInput
                  className="flex-1 ml-2.5 text-slate-900 text-sm"
                  placeholder="Masukkan kata sandi akun"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                />
                <Pressable
                  onPress={() => setShowPassword((v) => !v)}
                  accessibilityLabel={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                  accessibilityRole="button"
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  className="w-11 h-11 items-center justify-center rounded-lg active:bg-slate-100"
                >
                  <Icon
                    name={showPassword ? "visibility_off" : "visibility"}
                    color="#64748B"
                    size={20}
                  />
                </Pressable>
              </View>
            </View>

            {/* Tombol Masuk */}
            <Pressable
              onPress={handleSubmit}
              disabled={submitting}
              accessibilityLabel="Masuk ke akun penonton"
              accessibilityRole="button"
              className="w-full min-h-[50px] bg-blue-600 active:bg-blue-700 active:scale-[0.99] rounded-xl items-center justify-center flex-row gap-2 shadow-sm mt-3"
            >
              {submitting ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <>
                  <Text className="text-white font-bold text-sm">Masuk ke Akun Penonton</Text>
                  <Icon name="arrow_forward" color="#ffffff" size={18} />
                </>
              )}
            </Pressable>
          </View>

          {/* Footer Navigation */}
          <View className="mt-auto pt-8 pb-4 items-center">
            <View className="flex-row items-center justify-center">
              <Text className="text-slate-500 text-xs">Belum memiliki akun? </Text>
              <Link href="/register" asChild>
                <Pressable
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  className="min-h-[44px] justify-center px-1"
                >
                  <Text className="text-blue-600 font-bold text-xs">Daftar Akun Baru</Text>
                </Pressable>
              </Link>
            </View>

            <View className="flex-row items-center gap-1.5 mt-2">
              <Icon name="verified_user" color="#10B981" size={13} />
              <Text className="text-[11px] text-slate-400">
                Tiket konser resmi dengan verifikasi barcode QR unik
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
