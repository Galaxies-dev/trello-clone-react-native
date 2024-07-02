import { useSupabase } from '@/context/SupabaseContext';
import { Board, Task } from '@/types/enums';
import { Ionicons } from '@expo/vector-icons';
import { User } from '@supabase/supabase-js';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const Page = () => {
  const { id, board_id } = useLocalSearchParams<{ id: string; board_id?: string }>();

  const { getCardInfo, getBoardMember, getFileFromPath, updateCard } = useSupabase();
  const router = useRouter();
  const [card, setCard] = useState<Task>();
  const [member, setMember] = useState<User[]>();

  const [imagePath, setImagePath] = useState<string>('');
  if (card?.image_url) {
    getFileFromPath!(card.image_url).then((path) => {
      if (path) {
        setImagePath(path);
      }
    });
  }

  useEffect(() => {
    if (!board_id) return;
    loadInfo();
  }, [board_id]);

  const loadInfo = async () => {
    if (!board_id || !id) return;

    console.log('LOAD CARD');

    const data = await getCardInfo!(id);
    console.log('🚀 ~ loadInfo ~ cardData:', data);
    setCard(data);

    const member = await getBoardMember!(board_id);
    console.log('🚀 ~ loadInfo ~ member:', member);
    setMember(member);
  };

  const saveAndClose = () => {
    console.log('saveAndClose: ', card);

    updateCard!(card!);
    router.back();
  };

  const onArchiveCard = () => {
    console.log('onArchiveCard');
    updateCard!({ ...card!, done: true });
    router.back();
  };

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerLeft: () => (
            <TouchableOpacity onPress={saveAndClose}>
              <Ionicons name="close" size={24} color={Colors.grey} />
            </TouchableOpacity>
          ),
        }}
      />
      {card && (
        <>
          {!card.image_url && (
            <TextInput
              style={styles.input}
              value={card.title}
              multiline
              onChangeText={(text: string) => setCard({ ...card, title: text })}></TextInput>
          )}

          <TextInput
            style={styles.input}
            value={card.description || ''}
            multiline
            placeholder="Add a description"
            onChangeText={(text: string) => setCard({ ...card, description: text })}></TextInput>

          {imagePath && (
            <>
              {card.image_url && (
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
            </>
          )}
          <TouchableOpacity onPress={onArchiveCard} style={styles.btn}>
            <Text style={styles.btnText}>Archive</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 4,
    marginVertical: 8,
  },
  btn: {
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderColor: '#fff',
    borderWidth: 1,
  },
  btnText: {
    fontSize: 18,
  },
});
export default Page;
