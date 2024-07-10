import ListStart from '@/components/Board/ListStart';
import ListView from '@/components/Board/ListView';
import { Colors } from '@/constants/Colors';
import { useSupabase } from '@/context/SupabaseContext';
import { Board, TaskList, TaskListFake } from '@/types/enums';
import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { Pagination } from 'react-native-reanimated-carousel';
import { SafeAreaView } from 'react-native-safe-area-context';

export interface BoardAreaProps {
  board?: Board;
}

const BoardArea = ({ board }: BoardAreaProps) => {
  const { width, height } = useWindowDimensions();
  const { getBoardLists, addBoardList } = useSupabase();
  const [startListActive, setStartListActive] = useState(false);
  const scrollOffsetValue = useSharedValue<number>(0);
  const [data, setData] = useState<Array<TaskList | TaskListFake>>([{ id: undefined }]);
  const progress = useSharedValue<number>(0);
  const ref = useRef<ICarouselInstance>(null);

  useEffect(() => {
    loadBoardLists();
  }, []);

  const loadBoardLists = async () => {
    if (!board) return;
    const lists = await getBoardLists!(board.id);
    // Add our fake item to the end of the list
    setData([...lists, { id: undefined }]);
  };

  const onSaveNewList = async (title: any) => {
    setStartListActive(false);
    const { data: newItem } = await addBoardList!(board!.id, title);
    data.pop();
    // Add our fake item to the end of the list
    setData([...data, newItem, { id: undefined }]);
  };

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

  const onListDeleted = (id: string) => {
    setData(data.filter((item) => item.id !== id));
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
      <Carousel
        width={width}
        height={height}
        loop={false}
        ref={ref}
        onProgressChange={progress}
        defaultScrollOffsetValue={scrollOffsetValue}
        data={data}
        pagingEnabled={true}
        renderItem={({ index, item }: any) => (
          <>
            {item.id && (
              <ListView key={index} taskList={item} onDelete={() => onListDeleted(item.id)} />
            )}
            {item.id === undefined && (
              <View key={index} style={{ paddingTop: 20, paddingHorizontal: 30 }}>
                {!startListActive && (
                  <TouchableOpacity
                    onPress={() => setStartListActive(true)}
                    style={styles.listAddBtn}>
                    <Text style={{ color: Colors.fontLight, fontSize: 18 }}>Add list</Text>
                  </TouchableOpacity>
                )}

                {startListActive && (
                  <ListStart onCancel={() => setStartListActive(false)} onSave={onSaveNewList} />
                )}
              </View>
            )}
          </>
        )}
      />
      <Pagination.Basic
        progress={progress}
        data={data}
        dotStyle={{ backgroundColor: '#ffffff5c', borderRadius: 40 }}
        size={8}
        activeDotStyle={{ backgroundColor: '#fff' }}
        containerStyle={{ gap: 10, marginTop: 10 }}
        onPress={onPressPagination}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  listAddBtn: {
    backgroundColor: '#00000047',
    height: 44,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default BoardArea;
