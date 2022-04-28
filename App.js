/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import {PermissionsAndroid, Platform} from 'react-native';
import React, {useEffect} from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  TouchableOpacity,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {NativeModules} from 'react-native';

import {GoogleSignin} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import {
  LoginButton,
  AccessToken,
  GraphRequest,
  LoginManager,
} from 'react-native-fbsdk-next';
import {
  requestUserPermission,
  notificationListner,
} from './utillities/PushNotifications';
import notifee from '@notifee/react-native';

const App = () => {
  async function onDisplayNotification() {
    // Create a channel
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    // Display a notification
    await notifee.displayNotification({
      title: 'Hello Mehdi!',
      body: 'This is the first notifcation of Fantka!',
      android: {
        channelId,
        // optional, defaults to 'ic_launcher'.
      },
    });
  }
  const {RNTwitterSignIn} = NativeModules;
  useEffect(() => {
    requestUserPermission();
    notificationListner();
  }, []);
  async function onFacebookButtonPress() {
    // Attempt login with permissions
    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);
    console.log(result);
    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }

    // Once signed in, get the users AccesToken
    const data = await AccessToken.getCurrentAccessToken();
    console.log(data);
    if (!data) {
      throw 'Something went wrong obtaining access token';
    }

    // Create a Firebase credential with the AccessToken
    const facebookCredential = auth.FacebookAuthProvider.credential(
      data.accessToken,
    );

    // Sign-in the user with the credential
    return auth().signInWithCredential(facebookCredential);
  }
  const GSign = async () => {
    // Get the users ID token
    const {idToken} = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    const user = auth().signInWithCredential(googleCredential);
    user
      .then(user => {
        console.log(user);
      }) 
      .catch(error => {
        console.log(error);
      })
  };
  GoogleSignin.configure({
    webClientId:
      '272995458339-kqa466g1sugs6773ktac8isu4k0f0j3o.apps.googleusercontent.com',
  });
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  async function onTwitterButtonPress() {
    // Perform the login request
    const {authToken, authTokenSecret} = await RNTwitterSignIn.logIn();

    // Create a Twitter credential with the tokens
    const twitterCredential = auth.TwitterAuthProvider.credential(
      authToken,
      authTokenSecret,
    );

    // Sign-in the user with the credential
    return auth().signInWithCredential(twitterCredential);
  }
  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView>
        <View style={styles.sectionContainer}>
          <View style={styles.googleSign}>
            <Button title="google sign in" onPress={GSign} />
          </View>
          <View>
            <TouchableOpacity onPress={onFacebookButtonPress}>
              <Text>FACEBOOK LOGIN</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onDisplayNotification}>
              <Text>Notifeee</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'blue',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  googleSign: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'blue',
  },
});

export default App;
