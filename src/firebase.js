import {getAuth, signOut} from 'firebase/auth';
import {initializeApp} from 'firebase/app';
import {getAnalytics} from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'videowidget-c2d39.firebaseapp.com',
  projectId: 'videowidget-c2d39',
  storageBucket: 'videowidget-c2d39.appspot.com',
  messagingSenderId: '532098762249',
  appId: '1:532098762249:web:9e8a564787b53fad9e1ad8',
  measurementId: 'G-6906METQKR'
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);

export const logout = () => {
  signOut(auth);
};