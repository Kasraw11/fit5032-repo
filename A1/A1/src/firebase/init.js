// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDdQ5UYVQ0D_g6VmceQ2HgamNPlkTHLEeY',
  authDomain: 'fit5032-a1-80f06.firebaseapp.com',
  projectId: 'fit5032-a1-80f06',
  storageBucket: 'fit5032-a1-80f06.firebasestorage.app',
  messagingSenderId: '982205093729',
  appId: '1:982205093729:web:039ed96f1febb8fa9cd720',
}

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig)

export const auth = getAuth(firebaseApp)
export default firebaseApp
