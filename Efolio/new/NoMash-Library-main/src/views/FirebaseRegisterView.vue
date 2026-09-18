<template>
  <div class="text-center">
    <h1>Create an account</h1>
    <p><input type="text" placeholder="Email" v-model="email" /></p>
    <p><input type="password" placeholder="Password" v-model="password" /></p>
    <p><button @click="register">save to Firebase</button></p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
const email = ref('')
const password = ref('')
const router = useRouter()
const auth = getAuth()
const register = () =>
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then(() => {
      console.log('Firebase user created')
      router.push('/FireLogin')
    })
    .catch((error) => {
      console.log(error)
    })
</script>
