import { Colors } from '@/constants/Colors';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image } from 'react-native';

const Layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTitleStyle: {
          color: 'white',
        },
      }}>
      <Tabs.Screen
        name="boards"
        options={{
          headerShown: false,
          title: 'Boards',
          tabBarIcon: ({ size, color, focused }) => (
            <Image
              style={{ width: size, height: size }}
              source={
                focused
                  ? require('@/assets/images/logo-icon-blue.png')
                  : require('@/assets/images/logo-icon-neutral.png')
              }
            />
          ),
        }}
      />
      <Tabs.Screen
        name="my-cards"
        options={{
          title: 'My Cards',
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons
              name="view-dashboard-variant-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ size, color }) => <Ionicons name="search" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="notifications-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ size, color }) => (
            <FontAwesome name="user-circle" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};
export default Layout;
