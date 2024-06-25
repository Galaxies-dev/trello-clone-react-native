import { Colors } from '@/constants/Colors';
import { useSupabase } from '@/context/SupabaseContext';
import { Task, TaskList } from '@/types/enums';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import DraggableFlatList, {
  DragEndParams,
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';

export interface ListViewProps {
  taskList: TaskList;
}

const ListView = ({ taskList }: ListViewProps) => {
  const { getListCards, addListCard, updateCard } = useSupabase();
  const [isAdding, setIsAdding] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    loadListTasks();
  }, []);

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
    setTasks([...tasks, data]);
  };

  const renderItem = useCallback(({ item, drag, isActive }: RenderItemParams<Task>) => {
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
          <Text>{item.title}</Text>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  }, []);

  const onTaskDropped = async (params: DragEndParams<Task>) => {
    const newData = params.data.map((item: any, index: number) => {
      return { ...item, position: index };
    });
    setTasks(newData);
    newData.forEach(async (item: any) => {
      await updateCard!(item);
    });
  };

  const onPressMore = () => {};

  return (
    <View style={{ paddingTop: 20, paddingHorizontal: 30 }}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.listTitle}>{taskList.title}</Text>
          <TouchableOpacity onPress={onPressMore}>
            <MaterialCommunityIcons name="dots-horizontal" size={22} color={Colors.grey} />
          </TouchableOpacity>
        </View>
        <View>
          <DraggableFlatList
            data={tasks}
            renderItem={renderItem}
            keyExtractor={(item) => `${item.id}`}
            onDragEnd={onTaskDropped}
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
});

export default ListView;
