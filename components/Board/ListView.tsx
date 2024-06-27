import { Colors } from '@/constants/Colors';
import { CARDS_TABLE, useSupabase } from '@/context/SupabaseContext';
import { Task, TaskList } from '@/types/enums';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Button, Image } from 'react-native';
import DraggableFlatList, {
  DragEndParams,
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import * as Haptics from 'expo-haptics';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { DefaultTheme } from '@react-navigation/native';
import { client } from '@/utils/supabaseClient';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useAuth } from '@clerk/clerk-expo';

export interface ListViewProps {
  taskList: TaskList;
}

const ListView = ({ taskList }: ListViewProps) => {
  const {
    getListCards,
    addListCard,
    updateCard,
    deleteBoardList,
    updateBoardList,
    uploadFile,
    getFileFromPath,
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

    const subscription = client
      .channel(`card-changes-${taskList.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: CARDS_TABLE },
        handleRealtimeChanges
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleRealtimeChanges = (update: any) => {
    console.log('REALTIME UPDATE:', update);
    const record = update.new?.id ? update.new : update.old;
    const event = update.eventType;

    if (!record) return;

    if (event === 'INSERT') {
      setTasks((prev) => {
        console.log('🚀 ~ handleRealtimeChanges ~ prev:', prev);

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
          .sort((a, b) => a.position - b.position);
      });
    } else if (event === 'DELETE') {
      // const updatedTasks = tasks.filter((task) => task.id !== record.id);
      // setTasks(updatedTasks);
    } else {
      console.log('Unhandled event', event);
    }
  };

  const loadListTasks = async () => {
    const data = await getListCards!(taskList.id);
    setTasks(data);
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
    // setTasks([...tasks, data]);
  };

  const renderItem = useCallback(({ item, drag, isActive }: RenderItemParams<Task>) => {
    const [imagePath, setImagePath] = useState<string>('');
    if (item.image_url) {
      // console.log('🚀 ~ load item image:', item);
      getFileFromPath!(item.image_url).then((path) => {
        console.log('image path:', path);
        if (path) {
          setImagePath(path);
        }
      });
    }
    return (
      <ScaleDecorator>
        <TouchableOpacity
          activeOpacity={1}
          onLongPress={drag}
          disabled={isActive}
          style={[
            styles.rowItem,
            {
              opacity: isActive ? 0.5 : 1,
            },
          ]}>
          <>
            {item.image_url && (
              <>
                {imagePath && (
                  <Image
                    source={{ uri: imagePath }}
                    style={{
                      width: '100%',
                      height: 200,
                      borderRadius: 4,
                      backgroundColor: '#f3f3f3',
                    }}
                  />
                )}

                <Text>{item.title}</Text>
              </>
            )}
            {!item.image_url && <Text>{item.title}</Text>}
          </>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  }, []);

  const onTaskDropped = async (params: DragEndParams<Task>) => {
    const newData = params.data.map((item: any, index: number) => {
      return { ...item, position: index };
    });
    // setTasks(newData);
    newData.forEach(async (item: any) => {
      await updateCard!(item);
    });
  };

  const onDeleteList = async () => {
    await deleteBoardList!(taskList.id);
    bottomSheetModalRef.current?.close();
  };

  const onUpdateTaskList = async () => {
    const updated = await updateBoardList!(taskList, listName);
    console.log('🚀 ~ onUpdateTaskList ~ updated:', updated);
  };

  const onSelectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const img = result.assets[0];
      console.log('🚀 ~ onSelectImage ~ img:', img);
      const base64 = await FileSystem.readAsStringAsync(img.uri, { encoding: 'base64' });
      const fileName = `${new Date().getTime()}-${userId}.${img.type === 'image' ? 'png' : 'mp4'}`;
      const filePath = `${taskList.board_id}/${fileName}`;
      const contentType = img.type === 'image' ? 'image/png' : 'video/mp4';
      const storagePath = await uploadFile!(filePath, base64, contentType);

      if (storagePath) {
        const { data } = await addListCard!(
          taskList.id,
          taskList.board_id,
          fileName,
          tasks.length,
          storagePath
        );
        console.log('🚀 ~ after add card ~ data:', data);
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
      <View style={{ paddingTop: 20, paddingHorizontal: 30 }}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.listTitle}>{listName}</Text>
            <TouchableOpacity onPress={() => bottomSheetModalRef.current?.present()}>
              <MaterialCommunityIcons name="dots-horizontal" size={22} color={Colors.grey} />
            </TouchableOpacity>
          </View>
          <View>
            <DraggableFlatList
              data={tasks}
              renderItem={renderItem}
              keyExtractor={(item) => `${item.id}`}
              onDragEnd={onTaskDropped}
              onDragBegin={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              onPlaceholderIndexChange={() =>
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
              }
              containerStyle={{ paddingBottom: 4 }}
              contentContainerStyle={{ gap: 4 }}
            />
            {isAdding && (
              <TextInput autoFocus style={styles.input} value={newTask} onChangeText={setNewTask} />
            )}
          </View>
          {!isAdding && (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 8 }}>
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center' }}
                onPress={() => setIsAdding(true)}>
                <Ionicons name="add" size={14} />
                <Text style={{ fontSize: 12 }}>Add card</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onSelectImage}>
                <Ionicons name="image-outline" size={18} />
              </TouchableOpacity>
            </View>
          )}

          {isAdding && (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 8 }}>
              <TouchableOpacity onPress={() => setIsAdding(false)}>
                <Text style={{ color: Colors.primary, fontSize: 14 }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={onAddCard}>
                <Text style={{ color: Colors.primary, fontSize: 14, fontWeight: 'bold' }}>Add</Text>
              </TouchableOpacity>
            </View>
          )}
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
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    alignItems: 'center',
  },
  input: {
    padding: 8,
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
  rowItem: {
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 4,
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
