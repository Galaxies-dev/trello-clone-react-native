import DropdownPlus from '@/components/DropdownPlus';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';
const Page = () => {
  return (
    <View>
      <Stack.Screen
        options={{
          headerRight: () => <DropdownPlus />,
        }}
      />
      <Text>Page</Text>
    </View>
  );
};
export default Page;
