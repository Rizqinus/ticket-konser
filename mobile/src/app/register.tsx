import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Link, useRouter } from "expo-router";
import Icon from "@/components/Icon";
import GigpassLogo from "@/components/GigpassLogo";
import { api } from "@/lib/api";

export default function RegisterScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });

  function set(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit() {
    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setError("Nama lengkap, email, dan kata sandi wajib diisi.");
      return;
    }
    if (form.password.length < 6) {
      setError("Kata sandi minimal berisi 6 karakter.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Konfirmasi kata sandi tidak cocok.");
      return;
    }
    if (!agree) {
      setError("Anda wajib menyetujui ketentuan pemesanan sebelum mendaftar.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await api.register(form.name.trim(), form.email.trim(), form.password);
      Alert.alert(
        "Pendaftaran Berhasil",
        "Akun Anda telah aktif. Silakan masuk menggunakan email dan kata sandi yang telah didaftarkan.",
        [{ text: "Masuk Sekarang", onPress: () => router.replace("/login") }]
      );
    } catch (err: any) {
      setError(err.message || "Gagal melakukan pendaftaran. Silakan periksa kembali data Anda.");
    } finally {
      setSubmitting(false);
    }
  }

  const isPasswordMatch =
    form.confirm.length > 0 && form.password === form.confirm;
  const isPasswordMismatch =
    form.confirm.length > 0 && form.password !== form.confirm;

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
              onPress={() => router.replace("/login")}
              accessibilityLabel="Kembali ke halaman masuk"
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
                Registrasi Penonton Konser
              </Text>
            </View>
            <Text className="text-2xl font-extrabold tracking-tight text-slate-900">
              Buat Akun Baru
            </Text>
            <Text className="text-xs text-slate-500 mt-1.5 leading-5">
              Daftar untuk membeli tiket konser resmi, memilih kategori tempat duduk, dan menyimpan e-tiket dengan aman.
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
          <View className="gap-3.5">
            {/* Nama Lengkap */}
            <View>
              <Text className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Nama Lengkap
              </Text>
              <View
                className={`flex-row items-center border rounded-xl px-3.5 h-12 bg-white shadow-xs transition-colors ${
                  focusedField === "name"
                    ? "border-blue-600 bg-blue-50/10"
                    : "border-slate-300"
                }`}
              >
                <Icon
                  name="person"
                  color={focusedField === "name" ? "#2563EB" : "#64748B"}
                  size={18}
                />
                <TextInput
                  className="flex-1 ml-2.5 text-slate-900 text-sm"
                  placeholder="Nama sesuai kartu identitas"
                  placeholderTextColor="#94A3B8"
                  value={form.name}
                  onChangeText={(v) => set("name", v)}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
            </View>

            {/* Alamat Email */}
            <View>
              <Text className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
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
                  value={form.email}
                  onChangeText={(v) => set("email", v)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Kata Sandi */}
            <View>
              <Text className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
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
                  placeholder="Minimal 6 karakter"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={!showPassword}
                  value={form.password}
                  onChangeText={(v) => set("password", v)}
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

            {/* Konfirmasi Kata Sandi */}
            <View>
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Ulangi Kata Sandi
                </Text>
                {isPasswordMatch && (
                  <View className="flex-row items-center gap-1">
                    <Icon name="check_circle" size={12} color="#10B981" />
                    <Text className="text-[11px] font-semibold text-emerald-600">Cocok</Text>
                  </View>
                )}
                {isPasswordMismatch && (
                  <Text className="text-[11px] font-medium text-amber-600">Belum cocok</Text>
                )}
              </View>
              <View
                className={`flex-row items-center border rounded-xl px-3.5 h-12 bg-white shadow-xs transition-colors ${
                  focusedField === "confirm"
                    ? "border-blue-600 bg-blue-50/10"
                    : isPasswordMatch
                    ? "border-emerald-400 bg-emerald-50/10"
                    : "border-slate-300"
                }`}
              >
                <Icon
                  name="verified_user"
                  color={
                    focusedField === "confirm"
                      ? "#2563EB"
                      : isPasswordMatch
                      ? "#10B981"
                      : "#64748B"
                  }
                  size={18}
                />
                <TextInput
                  className="flex-1 ml-2.5 text-slate-900 text-sm"
                  placeholder="Ketik ulang kata sandi"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={!showPassword}
                  value={form.confirm}
                  onChangeText={(v) => set("confirm", v)}
                  onFocus={() => setFocusedField("confirm")}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
            </View>

            {/* Syarat & Ketentuan Checkbox dengan Touch Target 44px */}
            <Pressable
              onPress={() => setAgree(!agree)}
              accessibilityLabel="Setujui syarat dan ketentuan pemesanan tiket konser"
              accessibilityRole="checkbox"
              accessibilityState={{ checked: agree }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              className="flex-row items-center gap-3 min-h-[44px] my-1"
            >
              <View
                className={`w-6 h-6 rounded-lg border items-center justify-center ${
                  agree ? "bg-blue-600 border-blue-600" : "border-slate-300 bg-white"
                }`}
              >
                {agree && <Icon name="check" size={16} color="#ffffff" />}
              </View>
              <Text className="flex-1 text-xs text-slate-600 leading-4">
                Saya menyetujui seluruh ketentuan pemesanan tiket konser dan kebijakan akun Gigpass.
              </Text>
            </Pressable>

            {/* Submit Button */}
            <Pressable
              onPress={handleSubmit}
              disabled={submitting}
              accessibilityLabel="Daftar akun penonton konser"
              accessibilityRole="button"
              className="w-full min-h-[50px] bg-blue-600 active:bg-blue-700 active:scale-[0.99] rounded-xl items-center justify-center flex-row gap-2 shadow-sm mt-1"
            >
              {submitting ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <>
                  <Text className="text-white font-bold text-sm">Daftar Akun Penonton</Text>
                  <Icon name="arrow_forward" color="#ffffff" size={18} />
                </>
              )}
            </Pressable>
          </View>

          {/* Footer Navigation */}
          <View className="mt-8 pb-4 items-center">
            <View className="flex-row items-center justify-center">
              <Text className="text-slate-500 text-xs">Sudah memiliki akun? </Text>
              <Link href="/login" asChild>
                <Pressable
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  className="min-h-[44px] justify-center px-1"
                >
                  <Text className="text-blue-600 font-bold text-xs">Masuk di Sini</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
