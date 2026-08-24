import { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, Modal, ActivityIndicator, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import Icon from "@/components/Icon";

export default function PembayaranScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<"gopay" | "manual">("gopay");
  const [manualOpen, setManualOpen] = useState(false);
  const [paying, setPaying] = useState(false);
  const [success, setSuccess] = useState(false);

  function handlePay() {
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      setSuccess(true);
    }, 1500);
  }

  const isManual = selected === "manual";

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView className="bg-surface border-b border-outline-variant/20">
        <View className="flex-row items-center justify-between px-4 py-3">
          <View className="flex-row items-center gap-4">
            <Pressable onPress={() => router.back()} className="w-10 h-10 rounded-full bg-surface-container-high items-center justify-center">
              <Icon name="arrow_back" color="#4f378a" size={20} />
            </Pressable>
            <Text className="text-lg font-bold text-primary">Payment Method</Text>
          </View>
          <Icon name="info" color="#494551" />
        </View>
      </SafeAreaView>

      <ScrollView className="flex-1 px-4" contentContainerStyle={{ gap: 16, paddingBottom: 24 }}>
        <View className="bg-surface-container-low rounded-xl p-5">
          <Text className="text-xs text-on-surface-variant">Booking Total</Text>
          <Text className="text-2xl font-bold text-on-background mt-1">$458.50</Text>
        </View>

        <Pressable
          onPress={() => setSelected("gopay")}
          className={`flex-row items-center justify-between p-4 rounded-xl ${
            selected === "gopay" ? "bg-primary-fixed border-2 border-primary" : "bg-surface border border-outline-variant"
          }`}
        >
          <View className="flex-row items-center gap-3">
            <View className="w-12 h-8 bg-blue-600 rounded items-center justify-center">
              <Text className="text-white text-[10px] font-bold">GoPay</Text>
            </View>
            <View>
              <Text className="font-semibold text-on-surface">GoPay (0812 •••• 99)</Text>
              <Text className="text-xs text-primary font-semibold">Balance: $520.00</Text>
            </View>
          </View>
          <View className={`w-5 h-5 rounded-full border-2 items-center justify-center ${selected === "gopay" ? "border-primary bg-primary" : "border-outline-variant"}`} />
        </Pressable>

        <View className="bg-surface-container rounded-xl overflow-hidden border border-outline-variant">
          <Pressable
            onPress={() => {
              setManualOpen((v) => !v);
              setSelected("manual");
            }}
            className="flex-row items-center justify-between p-4"
          >
            <View className="flex-row items-center gap-3">
              <Icon name="receipt_long" color="#494551" />
              <View>
                <Text className="font-semibold text-on-surface">Transfer Bank Manual</Text>
                <Text className="text-xs text-outline">Perlu verifikasi admin, 1x24 jam</Text>
              </View>
            </View>
            <Icon name={manualOpen ? "expand_less" : "expand_more"} color="#7a7582" />
          </Pressable>

          {manualOpen && (
            <View className="px-4 pb-4 gap-3">
              <View>
                <Text className="text-xs text-outline mb-1">Bank Pengirim</Text>
                <TextInput
                  className="bg-surface-variant rounded-lg p-3 text-on-surface"
                  placeholder="mis. BCA, Mandiri, BNI"
                />
              </View>
              <View>
                <Text className="text-xs text-outline mb-1">Nama Pengirim</Text>
                <TextInput className="bg-surface-variant rounded-lg p-3 text-on-surface" placeholder="Nama lengkap" />
              </View>
              <Pressable className="border-2 border-dashed border-outline-variant rounded-lg p-6 items-center gap-2">
                <Icon name="upload" color="#7a7582" />
                <Text className="text-xs text-outline text-center">
                  Ketuk untuk unggah screenshot bukti transfer
                </Text>
              </Pressable>
              <Text className="text-xs text-outline">
                Status pesanan akan menunggu verifikasi admin setelah bukti diunggah.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View className="bg-surface-container-lowest border-t border-outline-variant p-4 gap-3">
        <View className="flex-row justify-between items-center">
          <Text className="text-on-surface-variant">Total Amount Due</Text>
          <Text className="font-bold text-primary text-lg">$458.50</Text>
        </View>
        <Pressable
          onPress={handlePay}
          disabled={paying}
          className="bg-primary h-14 rounded-full items-center justify-center flex-row gap-2"
        >
          {paying ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Icon name="lock" color="#fff" size={18} />
              <Text className="text-white font-bold">
                {isManual ? "Submit Bukti Transfer" : "Pay Now"}
              </Text>
            </>
          )}
        </Pressable>
      </View>

      <Modal visible={success} transparent animationType="fade">
        <View className="flex-1 bg-black/50 items-center justify-center p-6">
          <View className="bg-surface rounded-2xl p-6 w-full max-w-sm items-center">
            <View className="w-20 h-20 bg-success/20 rounded-full items-center justify-center mb-4">
              <Icon name="check_circle" size={40} color="#2E7D32" />
            </View>
            <Text className="text-xl font-bold text-on-background text-center">
              {isManual ? "Bukti Terkirim!" : "Payment Success!"}
            </Text>
            <Text className="text-on-surface-variant text-center mt-2 mb-6">
              {isManual
                ? "Pesananmu menunggu verifikasi admin."
                : "Your tickets are being processed."}
            </Text>
            <Pressable
              onPress={() => router.replace("/(tabs)/tickets" as any)}
              className="bg-primary w-full py-3 rounded-full items-center"
            >
              <Text className="text-white font-bold">View My Tickets</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
