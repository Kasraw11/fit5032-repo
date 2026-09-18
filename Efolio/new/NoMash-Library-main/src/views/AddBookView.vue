<template>
  <div class="text-center">
    <h1>Add Book</h1>
    <form class="mb-4" @submit.prevent="addBook">
      <div class="mb-3">
        <label for="isbn" class="form-label">ISBN:</label>
        <input type="text" v-model="isbn" id="isbn" required />
      </div>
      <div class="mb-3">
        <label for="name" class="form-label">Name:</label>
        <input type="text" v-model="name" id="name" required />
      </div>
      <button type="submit">Add Book</button>
    </form>
    <BookList />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import db from '../firebase/init.js'
import { collection, addDoc } from 'firebase/firestore'
import BookList from '../components/BookList.vue'

const isbn = ref('')
const name = ref('')

const addBook = async () => {
  try {
    const isbnNumber = Number(isbn.value)
    if (isNaN(isbnNumber)) {
      alert('Please enter a valid ISBN number.')
      return
    }

    await addDoc(collection(db, 'books'), {
      isbn: isbnNumber,
      name: name.value
    })

    isbn.value = ''
    name.value = ''
    alert('Book added successfully!')
  } catch (error) {
    console.error('Error adding book: ', error)
  }
}
</script>
