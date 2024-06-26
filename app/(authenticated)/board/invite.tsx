import { useSupabase } from '@/context/SupabaseContext';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { DefaultTheme } from '@react-navigation/native';
import { User } from '@/types/enums';
import { useHeaderHeight } from '@react-navigation/elements';
import { Colors } from '@/constants/Colors';

const Page = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { findUsers, addUserToBoard } = useSupabase();
  const router = useRouter();
  const [search, setSearch] = useState('dan@gmail.com');
  const [userList, setUserList] = useState<User[]>([]);
  const headerHeight = useHeaderHeight();

  const onSearchUSer = async () => {
    const data = await findUsers!(search);
    setUserList(data);
  };

  const onAddUser = async (user: User) => {
    console.log('adding user', user);
    await addUserToBoard!(id!, user.id);
    await router.dismiss();
  };
  const listItem = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}
      onPress={() => onAddUser(item)}>
      <Image
        source={{ uri: item.avatar_url }}
        style={{ width: 40, height: 40, borderRadius: 40 }}
      />
      <View>
        <Text style={{ fontSize: 16, fontWeight: 'semibold' }}>{item.first_name}</Text>
        <Text style={{ color: Colors.grey }}>{item.email}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, padding: 8 }}>
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: DefaultTheme.colors.background,
          },
          headerSearchBarOptions: {
            inputType: 'email',
            autoCapitalize: 'none',
            autoFocus: true,
            placeholder: 'Invite by name, username or email',
            cancelButtonText: 'Done',
            onChangeText: (e) => setSearch(e.nativeEvent.text),
            onCancelButtonPress: onSearchUSer,
          },
        }}
      />
      <FlatList
        data={userList}
        keyExtractor={(item) => `${item.id}`}
        renderItem={listItem}
        style={{ marginTop: 60 + headerHeight }}
        contentContainerStyle={{ gap: 8 }}
      />
    </View>
  );
};
export default Page;
