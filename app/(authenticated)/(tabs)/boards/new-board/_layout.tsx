import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { DefaultTheme } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';

const Layout = () => {
  const router = useRouter();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Board',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: DefaultTheme.colors.background,
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="close" size={26} color={Colors.primary} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="color-select"
        options={{
          title: 'Booard Background',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: DefaultTheme.colors.background,
          },
        }}
      />
    </Stack>
  );
};
export default Layout;
