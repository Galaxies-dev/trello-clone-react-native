import { Colors } from '@/constants/Colors';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useActionSheet } from '@expo/react-native-action-sheet';
import * as WebBrowser from 'expo-web-browser';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

enum ModalType {
  Login = 'login',
  SignUp = 'signup',
}

const LOGIN_OPTIONS = [
  {
    text: 'Continue with Google',
    icon: require('@/assets/images/login/google.png'),
  },
  {
    text: 'Continue with Microsoft',
    icon: require('@/assets/images/login/microsoft.png'),
  },
  {
    text: 'Continue with Apple',
    icon: require('@/assets/images/login/apple.png'),
  },
  {
    text: 'Continue with Slack',
    icon: require('@/assets/images/login/slack.png'),
  },
];

export default function Index() {
  const { top } = useSafeAreaInsets();
  const { showActionSheetWithOptions } = useActionSheet();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ['33%'], []);
  const [authType, setAuthType] = useState<ModalType | null>(null);

  const openLink = async () => {
    WebBrowser.openBrowserAsync('https://galaxies.dev');
  };

  const openActionSheet = async () => {
    const options = ['View support docs', 'Contact us', 'Cancel'];
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

  const showModal = async (type: ModalType) => {
    setAuthType(type);
    bottomSheetModalRef.current?.present();
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        opacity={0.2}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
        onPress={() => bottomSheetModalRef.current?.close()}
      />
    ),
    []
  );

  return (
    <BottomSheetModalProvider>
      <View style={[styles.container, { paddingTop: top + 30 }]}>
        <Image source={require('@/assets/images/login/trello.png')} style={styles.image} />
        <Text style={styles.introText}>Move teamwork forward - even on the go</Text>
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: 'white' }]}
            onPress={() => showModal(ModalType.Login)}>
            <Text style={[styles.btnText, { color: Colors.primary }]}>Log in</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn]} onPress={() => showModal(ModalType.SignUp)}>
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
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        handleComponent={null}
        backdropComponent={renderBackdrop}
        enableOverDrag={false}
        enablePanDownToClose>
        <BottomSheetView style={[styles.modalContainer]}>
          <TouchableOpacity style={styles.modalBtn}>
            <Ionicons name="mail-outline" size={20} />
            <Text style={styles.btnText}>
              {authType === ModalType.Login ? 'Log in' : 'Sign up'} with Email
            </Text>
          </TouchableOpacity>
          {LOGIN_OPTIONS.map((option, index) => (
            <TouchableOpacity key={index} style={styles.modalBtn}>
              <Image source={option.icon} style={styles.btnIcon} />
              <Text style={styles.btnText}>{option.text}</Text>
            </TouchableOpacity>
          ))}
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
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
    padding: 10,
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
  },
  modalContainer: {
    flex: 1,
    alignItems: 'flex-start',
    padding: 20,
    gap: 20,
  },
  modalBtn: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
    borderColor: '#fff',
    borderWidth: 1,
  },
  btnIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
});
