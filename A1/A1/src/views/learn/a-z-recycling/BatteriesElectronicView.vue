<template>
  <main class="container py-5">
    <PageHeader
      title="Batteries & Electronic Items"
      subtitle="Learn how batteries, mobile phones and other electronic items should be recycled safely."
      back-to="/learn/a-z-recycling"
    />

    <section class="card card-body p-3 shadow">
      <section class="card card-body p-3 shadow-sm">
        <h2>Keep batteries out of household bins</h2>
        <p>
          Keep batteries and electronics out of every household bin. They can start fires in
          collection trucks and sorting facilities and contaminate the environment.
        </p>
      </section>

      <section class="card card-body p-3 shadow-sm">
        <h2>Prepare undamaged household batteries</h2>
        <p>
          For undamaged household batteries, cover both terminals with clear sticky tape. Store them
          in a glass jar somewhere cool and dry, away from children and pets, and drop them off
          within one month.
        </p>
      </section>

      <section class="card card-body p-3 shadow-sm">
        <h2>Leaking or damaged batteries</h2>
        <p>
          Wear gloves when handling leaking batteries and place them in a ziplock bag. Swollen or
          badly damaged batteries need a fireproof container that is not airtight; ask the Waste
          Centre for safe disposal advice.
        </p>
      </section>

      <section class="card card-body p-3 shadow-sm">
        <h2>Where to take batteries</h2>
        <p>
          Council battery collection points include the Monash Recycling and Waste Centre, Monash
          Civic Centre, Oakleigh Service Centre and Clayton Library. Some supermarkets and Bunnings
          stores also collect household batteries.
        </p>
        <ul>
          <li>Monash Recycling and Waste Centre: 380 Ferntree Gully Road, Notting Hill</li>
          <li>Monash Civic Centre: 293 Springvale Road, Glen Waverley</li>
          <li>Oakleigh Service Centre: 3 Atherton Road, Oakleigh</li>
          <li>Clayton Library: 9-15 Cooke Street, Clayton</li>
        </ul>
        <p>Check with the collection point before taking large, leaking or damaged batteries.</p>
      </section>

      <section class="card card-body p-3 shadow-sm">
        <h2>Recycle electronics and reduce waste</h2>
        <p>
          Check acceptance and possible fees before taking electronics to the Waste Centre. Repair,
          maintain or buy refurbished devices where practical.
        </p>
      </section>

      <section class="card card-body p-3 shadow-sm">
        <h2>Frequently asked questions</h2>
        <div class="accordion" id="battery-faq">
          <div class="accordion-item">
            <h3 class="accordion-header" id="battery-faq-ewaste-heading">
              <button
                class="accordion-button card-gradient-1 collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#battery-faq-ewaste"
                aria-expanded="false"
                aria-controls="battery-faq-ewaste"
              >
                What counts as electronic waste?
              </button>
            </h3>
            <div
              id="battery-faq-ewaste"
              class="accordion-collapse collapse"
              aria-labelledby="battery-faq-ewaste-heading"
              data-bs-parent="#battery-faq"
            >
              <div class="accordion-body card-gradient-7">
                <p>Anything powered by a battery, plug or cord, including:</p>
                <ul>
                  <li>Computers, tablets, monitors and accessories</li>
                  <li>Phones, chargers and household batteries</li>
                  <li>Televisions, DVD players, remotes and gaming devices</li>
                  <li>Microwaves, kettles, toasters and coffee machines</li>
                  <li>Lamps, torches, fans and heaters</li>
                  <li>Hair dryers, cameras, vacuums and irons</li>
                  <li>Power boards, power tools and solar equipment</li>
                  <li>E-bikes and e-scooters</li>
                </ul>
                <p>Check disposal arrangements for your particular item.</p>
              </div>
            </div>
          </div>

          <div class="accordion-item">
            <h3 class="accordion-header" id="battery-faq-hazards-heading">
              <button
                class="accordion-button card-gradient-1 collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#battery-faq-hazards"
                aria-expanded="false"
                aria-controls="battery-faq-hazards"
              >
                Why are batteries hazardous?
              </button>
            </h3>
            <div
              id="battery-faq-hazards"
              class="accordion-collapse collapse"
              aria-labelledby="battery-faq-hazards-heading"
              data-bs-parent="#battery-faq"
            >
              <div class="accordion-body card-gradient-7">
                <p>
                  Contact with metal can short-circuit batteries and start fires. Battery chemicals
                  can also pollute soil and groundwater. Batteries inside devices carry these risks
                  too.
                </p>
                <p>
                  No batteries or electronics belong in your red, yellow or green household bins.
                </p>
              </div>
            </div>
          </div>

          <div class="accordion-item">
            <h3 class="accordion-header" id="battery-faq-recovery-heading">
              <button
                class="accordion-button card-gradient-1 collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#battery-faq-recovery"
                aria-expanded="false"
                aria-controls="battery-faq-recovery"
              >
                What happens when batteries are recycled?
              </button>
            </h3>
            <div
              id="battery-faq-recovery"
              class="accordion-collapse collapse"
              aria-labelledby="battery-faq-recovery-heading"
              data-bs-parent="#battery-faq"
            >
              <div class="accordion-body card-gradient-7">
                <p>
                  Recycling recovers useful materials, including lithium, cobalt and manganese, for
                  new products. This reduces demand for newly extracted resources.
                </p>
              </div>
            </div>
          </div>

          <div class="accordion-item">
            <h3 class="accordion-header" id="battery-faq-reduce-heading">
              <button
                class="accordion-button card-gradient-1 collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#battery-faq-reduce"
                aria-expanded="false"
                aria-controls="battery-faq-reduce"
              >
                How can I reduce electronic waste?
              </button>
            </h3>
            <div
              id="battery-faq-reduce"
              class="accordion-collapse collapse"
              aria-labelledby="battery-faq-reduce-heading"
              data-bs-parent="#battery-faq"
            >
              <div class="accordion-body card-gradient-7">
                <ul>
                  <li>Buy only what you need; wait three days before an optional purchase.</li>
                  <li>Consider second-hand or refurbished devices.</li>
                  <li>Protect and maintain devices to extend their life.</li>
                  <li>Ask a repair shop or repair cafe about broken equipment.</li>
                  <li>Use an appropriate recycling service when reuse is no longer possible.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  </main>
</template>

<script setup>
import PageHeader from '@/components/Header.vue'
</script>

<style scoped>
main {
  max-width: 900px;
  line-height: 1.5;
}

section {
  margin-top: 2rem;
}

h2 {
  font-size: 1.5rem;
}

li {
  margin-bottom: 1rem;
}
</style>
