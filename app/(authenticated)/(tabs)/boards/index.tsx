import DropdownPlus from '@/components/DropdownPlus';
import { Colors } from '@/constants/Colors';
import { useSupabase } from '@/context/SupabaseContext';
import { Board } from '@/types/enums';
import { Link, Stack, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

const Page = () => {
  const { getBoards } = useSupabase();
  const [boards, setBoards] = useState<Board[]>([]);

  useFocusEffect(
    useCallback(() => {
      console.log('Hello, I am focused!');
      loadBoards();
    }, [])
  );

  const loadBoards = async () => {
    const data = await getBoards!();
    setBoards(data);
  };

  const ListItem = ({ item }: { item: Board }) => (
    <Link
      href={`/(authenticated)/board/${item.id}?bg=${encodeURIComponent(item.background)}`}
      style={styles.listItem}
      key={`${item.id}`}
      asChild>
      <TouchableOpacity>
        <View style={[styles.colorBlock, { backgroundColor: item.background }]} />
        <Text style={{ fontSize: 16 }}>{item.title}</Text>
      </TouchableOpacity>
    </Link>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerRight: () => <DropdownPlus />,
        }}
      />
      <FlatList
        contentContainerStyle={styles.list}
        data={boards}
        keyExtractor={(item) => `${item.id}`}
        renderItem={ListItem}
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: StyleSheet.hairlineWidth,
              backgroundColor: Colors.light.grey,
              marginStart: 50,
            }}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    flex: 1,
  },
  list: {
    borderColor: Colors.light.grey,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    gap: 10,
  },
  colorBlock: {
    width: 30,
    height: 30,
    borderRadius: 4,
  },
});

export default Page;
