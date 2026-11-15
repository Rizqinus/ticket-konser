import React from "react";
import { View, Text } from "react-native";

interface GigpassLogoProps {
  size?: number;
}

export default function GigpassLogo({ size = 36 }: GigpassLogoProps) {
  const innerPad = Math.round(size * 0.22);
  const fontSize = Math.round(size * 0.52);

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.28),
      }}
      className="bg-blue-600 items-center justify-center shadow-sm relative overflow-hidden"
    >
      {/* Ticket Pass Border Inset */}
      <View
        style={{
          width: size - 6,
          height: size - 6,
          borderRadius: Math.round(size * 0.22),
          borderWidth: 1,
          borderColor: "rgba(255, 255, 255, 0.2)",
        }}
        className="items-center justify-center"
      >
        {/* Bold Stylized Monogram G */}
        <Text
          style={{
            fontSize: fontSize,
            lineHeight: fontSize + 2,
            fontWeight: "900",
            color: "#ffffff",
            fontFamily: "Inter",
          }}
        >
          G
        </Text>

        {/* Golden Stage VIP Accent Dot */}
        <View
          style={{
            position: "absolute",
            right: 3,
            bottom: 3,
            width: Math.max(4, Math.round(size * 0.12)),
            height: Math.max(4, Math.round(size * 0.12)),
            borderRadius: 999,
            backgroundColor: "#FBBF24",
          }}
        />
      </View>
    </View>
  );
}
