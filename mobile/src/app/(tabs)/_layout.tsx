import { Tabs } from "expo-router";
import { View, Text, ColorValue } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

function TabIcon({
  name,
  color,
  label,
  focused,
}: {
  name: any;
  color: ColorValue;
  label: string;
  focused: boolean;
}) {
  return (
    <View className="items-center justify-center pt-1.5">
      <MaterialIcons name={name} size={22} color={color as string} />
      <Text
        style={{
          color: color as string,
          fontSize: 10,
          fontWeight: focused ? "700" : "500",
          marginTop: 2,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 1,
          borderTopColor: "#E2E8F0",
          height: 64,
          paddingBottom: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -1 },
          shadowOpacity: 0.04,
          shadowRadius: 4,
          elevation: 4,
        },
        tabBarActiveTintColor: "#2563EB",
        tabBarInactiveTintColor: "#64748B",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="home" color={color} label="Beranda" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="search" color={color} label="Jelajah" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="tickets"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="confirmation-number" color={color} label="Tiket" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="person" color={color} label="Akun" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
