import { Stack } from 'expo-router';
const Layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Boards',
        }}
      />
    </Stack>
  );
};
export default Layout;
