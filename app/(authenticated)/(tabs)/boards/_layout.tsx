import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { Image, TouchableOpacity } from 'react-native';

const Layout = () => {
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerStyle: {
            backgroundColor: Colors.primary,
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
          headerShown: false,
          presentation: 'modal',
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
