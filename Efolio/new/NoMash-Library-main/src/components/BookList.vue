<template>
  <div>
    <h1>Books with ISBN > 1000</h1>
    <p>First 5 results, sorted by ISBN from lowest to highest.</p>
    <ul>
      <li v-for="book in books" :key="book.id">{{ book.name }} (ISBN: {{ book.isbn }})</li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore'
import db from '../firebase/init.js'

const books = ref([])

const fetchBooks = async () => {
  try {
    const booksQuery = query(
      collection(db, 'books'),
      where('isbn', '>', 1000),
      orderBy('isbn', 'asc'),
      limit(5)
    )
    const querySnapshot = await getDocs(booksQuery)

    books.value = []
    querySnapshot.forEach((doc) => {
      books.value.push({
        id: doc.id,
        name: doc.data().name,
        isbn: doc.data().isbn
      })
    })
  } catch (error) {
    console.error('Error fetching books:', error)
  }
}

onMounted(fetchBooks)
</script>
