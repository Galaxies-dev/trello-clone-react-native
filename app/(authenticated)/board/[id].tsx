import { Colors } from '@/constants/Colors';
import { useSupabase } from '@/context/SupabaseContext';
import { Board } from '@/types/enums';
import { Link, Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const Page = () => {
  const { id, bg } = useLocalSearchParams<{ id: string; bg?: string }>();
  const { getBoardInfo } = useSupabase();
  const [board, setBoard] = useState<Partial<Board>>({
    background: bg || '#fff',
  });
  const { top } = useSafeAreaInsets();
  const router = useRouter();

  useEffect(() => {
    if (!id) return;
    loadBoardInfo();
  }, [id]);

  const loadBoardInfo = async () => {
    if (!id) return;

    const data = await getBoardInfo!(id);
    console.log('🚀 ~ loadBoardInfo ~ data:', data);
    setBoard(data);
  };

  const CustomHeader = () => (
    <BlurView intensity={80} tint="extraLight" style={{ paddingTop: top }}>
      <View style={[styles.headerContainer]}>
        <TouchableOpacity
          onPress={() => {
            router.dismiss();
          }}>
          <Ionicons name="close" size={24} color={Colors.light.fontLight} />
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text style={{ color: Colors.light.fontLight, fontSize: 16 }}>{board?.title}</Text>
          <Text style={{ color: Colors.light.fontLight, fontSize: 12 }}>Workspace of Simon</Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 16 }}>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="filter-circle-outline" size={26} color={Colors.light.fontLight} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="notifications-outline" size={26} color={Colors.light.fontLight} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <MaterialCommunityIcons
              name="dots-horizontal"
              size={26}
              color={Colors.light.fontLight}
            />
          </TouchableOpacity>
        </View>
      </View>
    </BlurView>
  );

  return (
    <View style={{ flex: 1, backgroundColor: board?.background }}>
      <Stack.Screen
        options={{
          title: board.title,
          headerTransparent: true,
          header: () => <CustomHeader />,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    // justifyContent: 'center',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '',
    paddingHorizontal: 14,
    height: 50,
  },
});
export default Page;
