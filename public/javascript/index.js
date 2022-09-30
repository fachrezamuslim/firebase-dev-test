import { initializeApp } from 'firebase/app';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { getApp } from 'firebase/app';
import { initialize as initializeRouter, update } from './extensions/router';

const firebaseConfig = {
  apiKey: 'AIzaSyCRRXg4SiH3L4Lg_CR70_qVzFWKty9S9WU',
  authDomain: 'fir-dev-test-c0a05.firebaseapp.com',
  projectId: 'fir-dev-test-c0a05',
  storageBucket: 'fir-dev-test-c0a05.appspot.com',
  messagingSenderId: '619744347704',
  appId: '1:619744347704:web:a53631e267b324d96548cd',
  measurementId: 'G-HDQ3WX4GN6'
};

initializeApp(firebaseConfig);

if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  console.debug('Running in emulator mode');
  connectFirestoreEmulator(getFirestore(getApp()), 'localhost', 8080);
}

initializeRouter();

update(window.location.pathname);