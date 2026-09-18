import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyCBv04TVVWjp4eQcxTyNqDuYcz9zKFUJnI',
  authDomain: 'fit-5032-w6.firebaseapp.com',
  projectId: 'fit-5032-w6',
  storageBucket: 'fit-5032-w6.firebasestorage.app',
  messagingSenderId: '903263033630',
  appId: '1:903263033630:web:79e57083b0349e6174910f'
}

initializeApp(firebaseConfig)
const db = getFirestore()
export default db
