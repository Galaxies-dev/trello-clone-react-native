import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
const Page = () => {
  const [boardName, setBoardName] = useState('');

  const onCreateBoard = async () => {};

  return (
    <View style={{ marginVertical: 10 }}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity onPress={onCreateBoard} disabled={boardName === ''}>
              <Text style={boardName === '' ? styles.btnTextDisabled : styles.btnText}>Create</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <TextInput
        style={styles.input}
        value={boardName}
        onChangeText={setBoardName}
        placeholder="New Board"
        autoFocus
      />

      <TouchableOpacity style={styles.btnItem}>
        <Text style={styles.btnItemText}>Background</Text>
        <Ionicons name="chevron-forward" size={22} color={Colors.light.grey} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  btnTextDisabled: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.light.grey,
  },
  btnText: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.light.primary,
  },
  input: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.light.grey,
    backgroundColor: 'white',
    padding: 12,
    paddingHorizontal: 24,
    fontSize: 16,
    marginBottom: 32,
  },
  btnItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'white',
  },
  btnItemText: {
    fontSize: 16,
    flex: 1,
  },
});
export default Page;
