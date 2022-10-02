import { initializeApp } from 'firebase/app';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { getApp } from 'firebase/app';
import { initialize as initializeRouter, update } from './extensions/router';

const firebaseConfig = {
  apiKey: "AIzaSyBlEJZ9VVVRVE47p8hULSnTtXyU3UmHZkI",
  authDomain: "fc-dev-test-3d736.firebaseapp.com",
  projectId: "fc-dev-test-3d736",
  storageBucket: "fc-dev-test-3d736.appspot.com",
  messagingSenderId: "550501821464",
  appId: "1:550501821464:web:8d45ebff8665e64c98a76d"
};

initializeApp(firebaseConfig);

if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  console.debug('Running in emulator mode');
  connectFirestoreEmulator(getFirestore(getApp()), 'localhost', 8080);
}

initializeRouter();

update(window.location.pathname);