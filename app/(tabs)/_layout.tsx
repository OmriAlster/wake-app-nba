import React from 'react';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useThemeColor } from '@/components/Themed';
// import useBackGroundHook from '../hooks/useBackgroundHook';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
// function TabBarIcon(props: {
//   name: React.ComponentProps<typeof FontAwesome6>['name'];
//   color: string;
// }) {
//   return <FontAwesome6 size={28} style={{ marginBottom: -3 }} {...props} />;
// }

export default function TabLayout() {
  const primary = useThemeColor({}, 'primary');
  // useBackGroundHook();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: primary,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome6 name="basketball" color={color} size={24} />
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'My Alarms',
          tabBarIcon: ({ color }) => <Ionicons name="alarm" color={color} size={28} />,
        }}
      />
    </Tabs>
  );
}
