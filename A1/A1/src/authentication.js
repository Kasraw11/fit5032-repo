import { ref } from 'vue'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase/init'

export const currentUser = ref(null)
export const authenticated = ref(false)
export const isAdmin = ref(false)
export const authIsReady = ref(false)

let resolveAuthReady
const authReadyPromise = new Promise((resolve) => {
  resolveAuthReady = resolve
})

export const checkAdminRole = async (user) => {
  isAdmin.value = false
  if (!user) return false

  try {
    const userDocument = await getDoc(doc(db, 'users', user.uid))
    if (currentUser.value?.uid !== user.uid) return false

    isAdmin.value = userDocument.exists() && userDocument.data().role === 'admin'
    return isAdmin.value
  } catch (error) {
    console.error('Unable to check admin access:', error)
    return false
  }
}

export const initializeFirebaseAuth = () => {
  const auth = getAuth()

  onAuthStateChanged(auth, async (user) => {
    currentUser.value = user
    authenticated.value = !!user
    await checkAdminRole(user)

    if (!authIsReady.value) {
      authIsReady.value = true
      resolveAuthReady()
    }
  })
}

export const waitForAuthReady = async () => {
  if (!authIsReady.value) {
    await authReadyPromise
  }
}

export const logout = async () => {
  const auth = getAuth()
  await signOut(auth)
}
