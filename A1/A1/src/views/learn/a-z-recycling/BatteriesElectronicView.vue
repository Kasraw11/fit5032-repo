<template>
  <main>
    <PageHero
      title="Batteries & Electronic Items"
      subtitle="Learn how batteries, mobile phones and other electronic items should be recycled safely."
      :image="public_hero"
    />

    <section class="container py-5">
      <div class="row justify-content-center">
        <div class="col-12 col-lg-9 col-xl-8">
          <RouterLink class="btn btn-outline-primary mb-4" to="/learn/a-z-recycling">
            Back to A-Z Guide
          </RouterLink>

          <article>
            <section class="mb-4">
              <h2 class="h4 card-gradient-1 p-3 rounded-3 mb-3">
                Keep batteries out of household bins
              </h2>
              <div class="card-gradient-7 rounded-3 p-3 p-md-4">
                <p>
                  Keep batteries and electronics out of every household bin. They can start fires in
                  collection trucks and sorting facilities and contaminate the environment.
                </p>
              </div>
            </section>

            <section class="mb-4">
              <h2 class="h4 card-gradient-1 p-3 rounded-3 mb-4">
                Prepare undamaged household batteries
              </h2>
              <div class="card-gradient-7 rounded-3 p-3 p-md-4">
                <p>
                  For undamaged household batteries, cover both terminals with clear sticky tape.
                  Store them in a glass jar somewhere cool and dry, away from children and pets, and
                  drop them off within one month.
                </p>
              </div>
            </section>

            <section class="mb-4">
              <h2 class="h4 card-gradient-1 p-3 rounded-3 mb-3">Leaking or damaged batteries</h2>
              <div class="card-gradient-7 rounded-3 p-3 p-md-4">
                <p>
                  Wear gloves when handling leaking batteries and place them in a ziplock bag.
                  Swollen or badly damaged batteries need a fireproof container that is not
                  airtight; ask the Waste Centre for safe disposal advice.
                </p>
              </div>
            </section>

            <section class="mb-4">
              <h2 class="h4 card-gradient-1 p-3 rounded-3 mb-3">Where to take batteries</h2>
              <div class="card-gradient-7 rounded-3 p-3 p-md-4">
                <p>
                  Council battery collection points include the Monash Recycling and Waste Centre,
                  Monash Civic Centre, Oakleigh Service Centre and Clayton Library. Some
                  supermarkets and Bunnings stores also collect household batteries.
                </p>
                <ul>
                  <li>Monash Recycling and Waste Centre: 380 Ferntree Gully Road, Notting Hill</li>
                  <li>Monash Civic Centre: 293 Springvale Road, Glen Waverley</li>
                  <li>Oakleigh Service Centre: 3 Atherton Road, Oakleigh</li>
                  <li>Clayton Library: 9-15 Cooke Street, Clayton</li>
                </ul>
                <p>
                  Check with the collection point before taking large, leaking or damaged batteries.
                </p>
              </div>
            </section>

            <section class="mb-4">
              <h2 class="h4 card-gradient-1 p-3 rounded-3 mb-3">
                Recycle electronics and reduce waste
              </h2>
              <div class="card-gradient-7 rounded-3 p-3 p-md-4">
                <p>
                  Check acceptance and possible fees before taking electronics to the Waste Centre.
                  Repair, maintain or buy refurbished devices where practical.
                </p>
              </div>
            </section>

            <section class="mb-4">
              <h2 class="h4 card-gradient-1 p-3 rounded-3 mb-3">Frequently asked questions</h2>
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
                        Contact with metal can short-circuit batteries and start fires. Battery
                        chemicals can also pollute soil and groundwater. Batteries inside devices
                        carry these risks too.
                      </p>
                      <p>
                        No batteries or electronics belong in your red, yellow or green household
                        bins.
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
                        Recycling recovers useful materials, including lithium, cobalt and
                        manganese, for new products. This reduces demand for newly extracted
                        resources.
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
                        <li>
                          Buy only what you need; wait three days before an optional purchase.
                        </li>
                        <li>Consider second-hand or refurbished devices.</li>
                        <li>Protect and maintain devices to extend their life.</li>
                        <li>Ask a repair shop or repair cafe about broken equipment.</li>
                        <li>
                          Use an appropriate recycling service when reuse is no longer possible.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </article>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import PageHero from '@/components/PageHero.vue'
import public_hero from '@/assets/images/public_hero.png'
</script>
