import { Tabs } from "expo-router";
import { View, Text, ColorValue } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

function TabIcon({ name, color, label, focused }: { name: any; color: ColorValue; label: string; focused: boolean }) {
  return (
    <View className="items-center justify-center pt-1">
      <MaterialIcons name={name} size={24} color={color as string} />
      <Text style={{ color: color as string, fontSize: 10, fontWeight: focused ? "700" : "500", marginTop: 2 }}>
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
          backgroundColor: "#fff",
          borderTopWidth: 0.5,
          borderTopColor: "#E7E0EC",
          height: 64,
          paddingBottom: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 10,
        },
        tabBarActiveTintColor: "#4D3298",
        tabBarInactiveTintColor: "#9CA3AF",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="home" color={color} label="Home" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="search" color={color} label="Explore" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="tickets"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="confirmation-number" color={color} label="My Tickets" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="person" color={color} label="Profile" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
