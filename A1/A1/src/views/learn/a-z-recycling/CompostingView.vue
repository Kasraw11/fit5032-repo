<template>
  <main>
    <PageHero
      title="Composting at Home"
      subtitle="Learn how composting food scraps and garden waste can help reduce landfill."
      :image="public_hero"
    />

    <section class="container py-5">
      <div class="row justify-content-center">
        <div class="col-12 col-lg-9 col-xl-8">
          <RouterLink class="btn btn-outline-primary mb-4" to="/learn/a-z-recycling">
            Back to A-Z Guide
          </RouterLink>
          <article>
            <div class="card-gradient-7 rounded-3 p-3 p-md-4 mb-4">
              <p>
                Composting food scraps and garden material keeps useful organic waste out of
                landfill and produces material that can improve your garden soil. In landfill,
                decomposing food can release methane, a greenhouse gas.
              </p>
            </div>

            <section class="mb-4">
              <h2 class="h4 card-gradient-1 p-3 rounded-3 mb-3">Choose a composting method</h2>
              <div class="card card-gradient-7 p-3 p-md-4">
                <h4>Compost bins</h4>
                <p>
                  A good option for households with a garden. Mix food scraps with garden material
                  such as dry leaves and grass clippings. Use the finished compost in garden beds or
                  as mulch.
                </p>
                <h4>Worm farms</h4>
                <p>
                  Suitable for smaller outdoor spaces. Worms turn suitable scraps into castings for
                  soil. Dilute the liquid from the system before using it on plants.
                </p>
                <h4>Bokashi systems</h4>
                <p class="mb-0">
                  Useful for small households and apartments. The system ferments scraps, but they
                  still need to be buried or added to a composting system to finish breaking down.
                </p>
              </div>
            </section>

            <section class="mb-4">
              <h2 class="h4 card-gradient-1 p-3 rounded-3 mb-3">Check what your system accepts</h2>
              <div class="card-gradient-7 rounded-3 p-3 p-md-4">
                <p>
                  Different systems accept different foods. Follow the instructions for your system
                  and consult Sustainability Victoria's composting guidance.
                </p>
                <p>
                  Suitable scraps your home system cannot process can go in your green-lid food and
                  garden waste bin. If you lack space, ask whether a neighbour can accept your
                  scraps.
                </p>
              </div>
            </section>

            <section class="mb-4">
              <h2 class="h4 card-gradient-1 p-3 rounded-3 mb-3">More information</h2>
              <div class="card-gradient-7 rounded-3 p-3 p-md-4">
                <p>Contact Sustainable Monash: mail@monash.vic.gov.au or 03 9518 3555.</p>
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
