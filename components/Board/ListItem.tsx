import { useSupabase } from '@/context/SupabaseContext';
import { Task } from '@/types/enums';
import { useState } from 'react';
import { StyleSheet, TouchableOpacity, Image, Text } from 'react-native';
import { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';

const ListItem = ({ item, drag, isActive }: RenderItemParams<Task>) => {
  const { getFileFromPath } = useSupabase();
  const [imagePath, setImagePath] = useState<string>('');
  if (item.image_url) {
    getFileFromPath!(item.image_url).then((path) => {
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
};

const styles = StyleSheet.create({
  rowItem: {
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 4,
  },
});

export default ListItem;
