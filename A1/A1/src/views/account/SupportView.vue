<template>
  <main class="container-fluid p-3">
    <div class="row">
      <aside class="col-12 col-md-3 mb-3">
        <AccountSidebar />
      </aside>

      <section class="col-12 col-md-9">
        <h1 class="h2 mb-3">Support</h1>

        <form class="card p-3" novalidate @submit.prevent>
          <div class="mb-3">
            <label for="support-subject" class="form-label">Subject</label>
            <select id="support-subject" class="form-control">
              <option value="">Select a subject</option>
              <option value="account">Account problem</option>
              <option value="event">Event question</option>
              <option value="technical">Technical issue</option>
              <option value="feedback">Feedback</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div class="mb-3">
            <label for="support-message" class="form-label">Message</label>
            <textarea id="support-message" class="form-control" rows="5"></textarea>
          </div>

          <div class="mb-3">
            <label for="support-attachment" class="form-label">Attachment</label>
            <input id="support-attachment" type="file" class="form-control" />
          </div>

          <div>
            <button type="submit" class="btn btn-primary">Submit</button>
          </div>
        </form>
      </section>
    </div>
  </main>
</template>

<script setup>
import AccountSidebar from '@/components/AccountSidebar.vue'
</script>
