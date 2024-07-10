import { Colors } from '@/constants/Colors';
import { useSupabase } from '@/context/SupabaseContext';
import { Task, TaskList } from '@/types/enums';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Button, Image } from 'react-native';
import DraggableFlatList, { DragEndParams } from 'react-native-draggable-flatlist';
import * as Haptics from 'expo-haptics';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { DefaultTheme } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useAuth } from '@clerk/clerk-expo';
import ListItem from '@/components/Board/ListItem';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

export interface ListViewProps {
  taskList: TaskList;
  onDelete: () => void;
}

const ListView = ({ taskList, onDelete }: ListViewProps) => {
  const {
    getListCards,
    addListCard,
    updateCard,
    deleteBoardList,
    updateBoardList,
    getRealtimeCardSubscription,
    uploadFile,
  } = useSupabase();
  const [isAdding, setIsAdding] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [tasks, setTasks] = useState<any[]>([]);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['40%'], []);

  const [listName, setListName] = useState(taskList.title);
  const { userId } = useAuth();

  useEffect(() => {
    loadListTasks();

    const subscription = getRealtimeCardSubscription!(taskList.id, handleRealtimeChanges);

    return () => {
      subscription.unsubscribe();
    };
  }, [taskList.id]);

  const handleRealtimeChanges = (update: RealtimePostgresChangesPayload<any>) => {
    console.log('REALTIME UPDATE:', update);
    const record = update.new?.id ? update.new : update.old;
    const event = update.eventType;

    if (!record) return;

    if (event === 'INSERT') {
      setTasks((prev) => {
        return [...prev, record];
      });
    } else if (event === 'UPDATE') {
      setTasks((prev) => {
        return prev
          .map((task) => {
            if (task.id === record.id) {
              return record;
            }
            return task;
          })
          .filter((task) => !task.done)
          .sort((a, b) => a.position - b.position);
      });
    } else if (event === 'DELETE') {
      setTasks((prev) => {
        return prev.filter((task) => task.id !== record.id);
      });
    } else {
      console.log('Unhandled event', event);
    }
  };

  const loadListTasks = async () => {
    const data = await getListCards!(taskList.id);
    setTasks(data);
  };

  const onDeleteList = async () => {
    await deleteBoardList!(taskList.id);
    bottomSheetModalRef.current?.close();
    onDelete;
  };

  const onUpdateTaskList = async () => {
    const updated = await updateBoardList!(taskList, listName);
  };

  const onAddCard = async () => {
    const { data, error } = await addListCard!(
      taskList.id,
      taskList.board_id,
      newTask,
      tasks.length
    );
    if (!error) {
      setIsAdding(false);
      setNewTask('');
    }
    // Unnecessary when using realtime updates
    // setTasks([...tasks, data]);
  };

  const onTaskDropped = async (params: DragEndParams<Task>) => {
    const newData = params.data.map((item: any, index: number) => {
      return { ...item, position: index };
    });

    setTasks(newData);
    newData.forEach(async (item: any) => {
      await updateCard!(item);
    });
  };

  const onSelectImage = async () => {
    // await ImagePicker.requestCameraPermissionsAsync();
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const img = result.assets[0];
      const base64 = await FileSystem.readAsStringAsync(img.uri, { encoding: 'base64' });
      const fileName = `${new Date().getTime()}-${userId}.${img.type === 'image' ? 'png' : 'mp4'}`;
      const filePath = `${taskList.board_id}/${fileName}`;
      const contentType = img.type === 'image' ? 'image/png' : 'video/mp4';
      const storagePath = await uploadFile!(filePath, base64, contentType);

      if (storagePath) {
        await addListCard!(taskList.id, taskList.board_id, fileName, tasks.length, storagePath);
      }
    }
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        opacity={0.2}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
        onPress={() => bottomSheetModalRef.current?.close()}
      />
    ),
    []
  );

  return (
    <BottomSheetModalProvider>
      <View
        style={{
          paddingTop: 20,
          paddingHorizontal: 30,
          maxHeight: '88%',
        }}>
        <View style={[styles.card]}>
          <View style={styles.header}>
            <Text style={styles.listTitle}>{listName}</Text>
            <TouchableOpacity onPress={() => bottomSheetModalRef.current?.present()}>
              <MaterialCommunityIcons name="dots-horizontal" size={22} color={Colors.grey} />
            </TouchableOpacity>
          </View>

          <DraggableFlatList
            data={tasks}
            renderItem={ListItem}
            keyExtractor={(item) => `${item.id}`}
            onDragEnd={onTaskDropped}
            onDragBegin={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            onPlaceholderIndexChange={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            activationDistance={10}
            containerStyle={{
              paddingBottom: 4,
              maxHeight: '80%',
            }}
            contentContainerStyle={{ gap: 4 }}
          />
          {isAdding && (
            <TextInput autoFocus style={styles.input} value={newTask} onChangeText={setNewTask} />
          )}

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 8,
              marginVertical: 8,
            }}>
            {!isAdding && (
              <>
                <TouchableOpacity
                  style={{ flexDirection: 'row', alignItems: 'center' }}
                  onPress={() => setIsAdding(true)}>
                  <Ionicons name="add" size={14} />
                  <Text style={{ fontSize: 12 }}>Add card</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onSelectImage}>
                  <Ionicons name="image-outline" size={18} />
                </TouchableOpacity>
              </>
            )}
            {isAdding && (
              <>
                <TouchableOpacity onPress={() => setIsAdding(false)}>
                  <Text style={{ color: Colors.primary, fontSize: 14 }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onAddCard}>
                  <Text style={{ color: Colors.primary, fontSize: 14, fontWeight: 'bold' }}>
                    Add
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        handleStyle={{ backgroundColor: DefaultTheme.colors.background, borderRadius: 12 }}
        backdropComponent={renderBackdrop}
        enableOverDrag={false}
        enablePanDownToClose>
        <View style={styles.container}>
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
            <Button title="Cancel" onPress={() => bottomSheetModalRef.current?.close()} />
          </View>
          <View style={{ backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 8 }}>
            <Text style={{ color: Colors.grey, fontSize: 12, marginBottom: 5 }}>List name</Text>
            <TextInput
              style={{ fontSize: 16, color: Colors.fontDark }}
              returnKeyType="done"
              enterKeyHint="done"
              onEndEditing={onUpdateTaskList}
              onChangeText={(e) => setListName(e)}
              value={listName}
            />
          </View>

          <TouchableOpacity onPress={onDeleteList} style={styles.deleteBtn}>
            <Text>Close List</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F3EFFC',
    borderRadius: 4,
    padding: 6,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    alignItems: 'center',
  },
  input: {
    padding: 8,
    marginBottom: 12,
    backgroundColor: '#fff',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.2,
    borderRadius: 4,
  },
  listTitle: {
    paddingVertical: 8,
    fontWeight: '500',
  },
  deleteBtn: {
    backgroundColor: '#fff',
    padding: 8,
    marginHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  container: {
    backgroundColor: DefaultTheme.colors.background,
    flex: 1,
    gap: 16,
  },
});

export default ListView;
