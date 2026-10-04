<template>
  <main>
    <PageHero
      title="Understanding Packaging Labels"
      subtitle="Learn what common recycling symbols and packaging labels mean."
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
              <h2 class="h4 card-gradient-1 p-3 rounded-3 mb-3">Plastic identification codes</h2>
              <div class="card-gradient-7 rounded-3 p-3 p-md-4">
                <p>
                  A numbered triangle identifies the plastic type, not whether Monash accepts it in
                  the yellow-lid bin.
                </p>
              </div>
            </section>

            <section class="mb-4">
              <h2 class="h4 card-gradient-1 p-3 rounded-3 mb-3">The recycling triangle</h2>
              <div class="card-gradient-7 rounded-3 p-3 p-md-4">
                <p>
                  The recycling triangle, or Mobius loop, can indicate recyclability or recycled
                  content. It does not identify the correct local collection service.
                </p>
              </div>
            </section>

            <section class="mb-4">
              <h2 class="h4 card-gradient-1 p-3 rounded-3 mb-3">Australasian Recycling Label</h2>
              <div class="card-gradient-7 rounded-3 p-3 p-md-4">
                <p>
                  The Australasian Recycling Label gives separate instructions for each component,
                  such as a box, wrapper or lid. A solid recycling symbol indicates recycling;
                  conditional instructions must be followed, and a bin symbol indicates landfill.
                </p>
              </div>
            </section>

            <section class="mb-4">
              <h2 class="h4 card-gradient-1 p-3 rounded-3 mb-3">Old REDcycle labels</h2>
              <div class="card-gradient-7 rounded-3 p-3 p-md-4">
                <p>
                  An old REDcycle logo does not mean supermarket collection is still available.
                  Check current Monash soft-plastic drop-off options; soft plastics cannot go in the
                  yellow bin.
                </p>
              </div>
            </section>

            <section class="mb-4">
              <h2 class="h4 card-gradient-1 p-3 rounded-3 mb-3">Compostable packaging</h2>
              <div class="card-gradient-7 rounded-3 p-3 p-md-4">
                <p>
                  Commercially compostable and home-compostable labels describe different processing
                  conditions. A home-compostable item needs a home system; other compostable
                  packaging is not accepted in the green bin.
                </p>
              </div>
            </section>

            <section class="mb-4">
              <h2 class="h4 card-gradient-1 p-3 rounded-3 mb-3">Approved green-bin liners</h2>
              <div class="card-gradient-7 rounded-3 p-3 p-md-4">
                <p>
                  For green-bin liners, use only approved lime-green compostable bags with the
                  certified seedling logo. Clear compostable bags are not accepted.
                </p>
              </div>
            </section>

            <section class="mb-4">
              <h2 class="h4 card-gradient-1 p-3 rounded-3 mb-3">Overseas packaging labels</h2>
              <div class="card-gradient-7 rounded-3 p-3 p-md-4">
                <p>
                  Overseas labels such as OPRL, How2Recycle, OK Compost and BPI do not override
                  Monash rules. Ask resourcerecovery@monash.vic.gov.au when unsure.
                </p>
              </div>
            </section>

            <p class="small text-body-secondary mb-0">
              Information adapted from City of Monash waste and sustainability resources.
            </p>
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
