<template>
  <main>
    <section class="page-hero">
      <div class="container">
        <h1>Contact us</h1>
        <p>Get in touch about collaboration, support, or SmartLoop.</p>
      </div>
    </section>

    <form class="mx-auto my-5" style="max-width: 600px">
      <div class="mb-3">
        <label for="subject" class="form-label">Subject</label>
        <input id="subject" type="text" class="form-control" placeholder="Enter a subject" />
      </div>

      <div class="mb-3">
        <label for="message" class="form-label">Message</label>
        <textarea
          id="message"
          class="form-control"
          rows="4"
          placeholder="Write your message"
        ></textarea>
      </div>

      <button type="submit" class="btn btn-primary">Send</button>
    </form>
  </main>
</template>
