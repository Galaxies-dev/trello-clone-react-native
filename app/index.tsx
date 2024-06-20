import { Colors } from '@/constants/Colors';
import { Text, View, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useActionSheet } from '@expo/react-native-action-sheet';

export default function Index() {
  const { top } = useSafeAreaInsets();
  const { showActionSheetWithOptions } = useActionSheet();

  const openLink = async () => {
    // TODO: Open in app browser
    Linking.openURL('https://galaxies.dev');
  };

  const openActionSheet = async () => {
    console.log('Opening action sheet');
    const options = ['View support docs', 'Contact us', 'Cancel'];
    // const destructiveButtonIndex = 0;
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        title: `Can't log in or sign up?`,
      },
      (selectedIndex: any) => {
        switch (selectedIndex) {
          case 1:
            // Support
            break;

          case cancelButtonIndex:
          // Canceled
        }
      }
    );
  };

  return (
    <View style={[styles.container, { paddingTop: top + 30 }]}>
      <Image source={require('@/assets/images/login.png')} style={styles.image} />
      <Text style={styles.introText}>Move teamwork forward - even on the go</Text>
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={[styles.btn, { backgroundColor: 'white' }]}>
          <Text style={[styles.btnText, { color: Colors.primary }]}>Log in</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn]}>
          <Text style={[styles.btnText, { color: '#fff' }]}>Sign Up</Text>
        </TouchableOpacity>

        <Text style={styles.description}>
          By signing up, you agree to the{' '}
          <Text style={styles.link} onPress={openLink}>
            User Notice
          </Text>{' '}
          and{' '}
          <Text style={styles.link} onPress={openLink}>
            Privacy Policy
          </Text>
          .
        </Text>

        <Text style={styles.link} onPress={openActionSheet}>
          Can't log in our sign up?
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    // justifyContent: 'center',
  },
  image: {
    // width: '100%',
    height: 450,
    paddingHorizontal: 40,
    resizeMode: 'contain',
  },
  introText: {
    fontWeight: '600',
    color: 'white',
    fontSize: 17,
    padding: 30,
  },
  bottomContainer: {
    width: '100%',
    paddingHorizontal: 40,
    gap: 10,
  },
  btn: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderColor: '#fff',
    borderWidth: 1,
  },
  btnText: {
    fontSize: 18,
  },
  description: {
    fontSize: 12,
    textAlign: 'center',
    color: '#fff',
    marginHorizontal: 60,
  },
  link: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    textDecorationLine: 'underline',
    // textDecorationStyle: 'solid',
  },
});
