import { useSupabase } from '@/context/SupabaseContext';
import { Task } from '@/types/enums';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TouchableOpacity, Image, Text, View } from 'react-native';
import { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';

const ListItem = ({ item, drag, isActive }: RenderItemParams<Task>) => {
  const { getFileFromPath } = useSupabase();
  const router = useRouter();
  const [imagePath, setImagePath] = useState<string>('');
  if (item.image_url) {
    getFileFromPath!(item.image_url).then((path) => {
      if (path) {
        setImagePath(path);
      }
    });
  }

  const openLink = () => {
    router.push(`/board/card/${item.id}`);
  };

  return (
    <ScaleDecorator>
      <TouchableOpacity
        activeOpacity={1}
        onPress={openLink}
        onLongPress={drag}
        disabled={isActive}
        style={[
          styles.rowItem,
          {
            opacity: isActive ? 0.5 : 1,
          },
        ]}>
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

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ flex: 1 }}>{item.title}</Text>
              {item.assigned_to && (
                <Ionicons name="person-circle-outline" size={16} color={'#000'} />
              )}
            </View>
          </>
        )}
        {!item.image_url && (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ flex: 1 }}>{item.title}</Text>
            {item.assigned_to && <Ionicons name="person-circle-outline" size={16} color={'#000'} />}
          </View>
        )}
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
