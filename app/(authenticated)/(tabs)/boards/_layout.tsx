import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { DefaultTheme } from '@react-navigation/native';

const Layout = () => {
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerStyle: {
            backgroundColor: Colors.light.primary,
          },
          headerTitle: () => (
            <Image
              style={{ width: 120, height: 50, resizeMode: 'contain' }}
              source={require('@/assets/images/trello-logo-gradient-white.png')}
            />
          ),
        }}
      />
      <Stack.Screen
        name="new-board"
        options={{
          title: 'Board',
          presentation: 'modal',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: DefaultTheme.colors.background,
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="close" size={26} color={Colors.light.primary} />
            </TouchableOpacity>
          ),
        }}
      />

      <Stack.Screen
        name="templates"
        options={{
          title: 'Start with a template',
          presentation: 'fullScreenModal',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                backgroundColor: '#E3DFE9',
                borderRadius: 16,
                padding: 6,
              }}>
              <Ionicons name="close" size={18} color={'#716E75'} />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
};
export default Layout;
