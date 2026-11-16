import React from "react";
import { MaterialIcons } from "@expo/vector-icons";

interface IconProps {
  name: keyof typeof MaterialIcons.glyphMap | string;
  size?: number;
  color?: string;
  className?: string;
  style?: any;
}

export default function Icon({
  name,
  size = 24,
  color = "#1C1B1F",
  className,
  style,
}: IconProps) {
  // Convert snake_case icon names to kebab-case expected by Expo MaterialIcons
  const formattedName = typeof name === "string" ? name.replace(/_/g, "-") : name;

  return (
    <MaterialIcons
      name={formattedName as any}
      size={size}
      color={color}
      style={style}
    />
  );
}
