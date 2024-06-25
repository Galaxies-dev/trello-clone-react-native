import ListStart from '@/components/Board/ListStart';
import ListView from '@/components/Board/ListView';
import { Colors } from '@/constants/Colors';
import { useSupabase } from '@/context/SupabaseContext';
import { Board, TaskList, TaskListFake } from '@/types/enums';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import {
  NestableScrollContainer,
  NestableDraggableFlatList,
} from 'react-native-draggable-flatlist';
import { useSharedValue } from 'react-native-reanimated';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { Pagination } from 'react-native-reanimated-carousel';
import { SafeAreaView } from 'react-native-safe-area-context';

// const NUM_ITEMS = 10;
// function getColor(i: number) {
//   const multiplier = 255 / (NUM_ITEMS - 1);
//   const colorVal = i * multiplier;
//   return `rgb(${colorVal}, ${Math.abs(128 - colorVal)}, ${255 - colorVal})`;
// }

type Item = {
  key: string;
  label: string;
  height: number;
  width: number;
  backgroundColor: string;
};

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
    console.log('🚀 ~ loadBoardLists ~ board:', board);

    if (!board) return;

    const lists = await getBoardLists!(board.id);
    console.log('🚀 ~ loadBoardLists ~ lists:', lists);
    setData([...lists, { id: undefined }]);
  };

  const onTaskDropped = async (data: any) => {
    console.log('Task dropped: data');
  };

  const onSaveNewList = async (title: any) => {
    console.log('onSaveNewList', title);
    setStartListActive(false);
    const { data: newItem } = await addBoardList!(board!.id, title);
    console.log('🚀 ~ onSaveNewList ~ data:', data);
    data.pop();
    setData([...data, newItem, { id: undefined }]);
  };

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      /**
       * Calculate the difference between the current index and the target index
       * to ensure that the carousel scrolls to the nearest index
       */
      count: index - progress.value,
      animated: true,
    });
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
        style={{ width: '100%' }}
        data={data}
        pagingEnabled={true}
        onSnapToItem={(index) => console.log('current index:', index)}
        renderItem={({ index, item }: any) => (
          <>
            {(item as TaskList) && item.id && <ListView key={index} taskList={item as TaskList} />}
            {item.id === undefined && (
              <View key={index} style={{ paddingTop: 20, paddingHorizontal: 30 }}>
                {!startListActive && (
                  <TouchableOpacity
                    onPress={() => setStartListActive(true)}
                    style={[styles.listAddBtn]}>
                    <Text style={{ color: Colors.fontLight, fontSize: 18 }}>Add list</Text>
                  </TouchableOpacity>
                )}

                {startListActive && (
                  <ListStart
                    items={[]}
                    title={'FOO'}
                    onCancel={() => setStartListActive(false)}
                    onSave={onSaveNewList}
                  />
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
  listHeader: {
    fontSize: 20,
  },
  rowItem: {
    height: 100,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  listAddBtn: {
    backgroundColor: '#00000047',
    height: 44,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default BoardArea;
