import { Colors } from '@/constants/Colors';
import { useSupabase } from '@/context/SupabaseContext';
import { Board } from '@/types/enums';
import { Ionicons } from '@expo/vector-icons';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

const Page = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { getBoardInfo, updateBoard, deleteBoard } = useSupabase();
  const router = useRouter();
  const [board, setBoard] = useState<Board>();

  useEffect(() => {
    if (!id) return;
    loadBoardInfo();
  }, [id]);

  const loadBoardInfo = async () => {
    if (!id) return;

    const data = await getBoardInfo!(id);
    setBoard(data);
  };

  const onDelete = async () => {
    await deleteBoard!(`${id}`);
    router.dismissAll();
  };

  const onUpdateBoard = async () => {
    console.log('update: ', board);
    const updated = await updateBoard!(board!);
    console.log('🚀 ~ onUpdateBoard ~ updated:', updated);
    setBoard(updated);
  };

  return (
    <View>
      <View style={styles.container}>
        <TextInput
          value={board?.title}
          onChangeText={(e) => setBoard({ ...board!, title: e })}
          style={{ fontSize: 16, color: Colors.fontDark }}
          returnKeyType="done"
          enterKeyHint="done"
          onEndEditing={onUpdateBoard}
        />
      </View>

      <View style={styles.container}>
        <View style={{ flexDirection: 'row', gap: 14 }}>
          <Ionicons name="person-outline" size={18} color={Colors.fontDark} />
          <Text style={{ fontWeight: 'bold', color: Colors.fontDark, fontSize: 16 }}>Members</Text>
        </View>
        <Link href={`/(authenticated)/board/invite?id=${id}`} asChild>
          <TouchableOpacity style={styles.fullBtn}>
            <Text style={{ fontSize: 16, color: Colors.fontLight }}>Invite...</Text>
          </TouchableOpacity>
        </Link>
      </View>

      <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
        <Text>Close Board</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 8,
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  deleteBtn: {
    backgroundColor: '#fff',
    padding: 8,
    marginHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  fullBtn: {
    backgroundColor: Colors.primary,
    padding: 8,
    marginLeft: 32,
    marginRight: 16,
    marginTop: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
});
export default Page;
