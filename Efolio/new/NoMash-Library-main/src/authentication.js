import { ref } from 'vue'

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
  isAuthenticated.value = false
}
