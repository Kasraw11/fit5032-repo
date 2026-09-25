import { ref } from 'vue'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'

export const currentUser = ref(null)
export const authenticated = ref(false)
export const authIsReady = ref(false)

let resolveAuthReady
const authReadyPromise = new Promise((resolve) => {
  resolveAuthReady = resolve
})

export const initializeFirebaseAuth = () => {
  const auth = getAuth()

  onAuthStateChanged(auth, (user) => {
    currentUser.value = user
    authenticated.value = !!user

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
