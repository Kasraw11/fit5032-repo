import { computed, ref, shallowRef } from 'vue'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'

const adminUid = '7jwjVSqzX9M71Ggp1tpi1xVE0PF3'

export const currentUser = shallowRef(null)

export const getUserRole = (user) => {
  if (!user) return null
  return user.uid === adminUid ? 'admin' : 'user'
}

export const role = computed(() => getUserRole(currentUser.value))

export const initializeFirebaseAuth = () => {
  onAuthStateChanged(getAuth(), (user) => {
    currentUser.value = user
    isAuthenticated.value = user !== null
  })
}

export const isAuthenticated = ref(false)

export const login = (username, password) => {
  if (username === 'admin' && password === 'Admin123') {
    isAuthenticated.value = true
    return true
  } else {
    return false
  }
}

export const logout = () => {
  const auth = getAuth()
  return signOut(auth).then(() => {
    console.log('Current user after logout:', auth.currentUser)
    currentUser.value = null
    isAuthenticated.value = false
  })
}
