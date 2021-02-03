import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
  apiKey: 'AIzaSyA-LNV15WbesMcaVz-8QlQcSAxsophNK7Q',
  authDomain: 'mealpree.firebaseapp.com',
  projectId: 'mealpree',
  storageBucket: 'mealpree.appspot.com',
  messagingSenderId: '932491367974',
  appId: '1:932491367974:web:c0f04e97edadbd694b78e7',
  measurementId: 'G-5ZCSDY5TKB',
};

firebase.initializeApp(config);

export default firebase;
