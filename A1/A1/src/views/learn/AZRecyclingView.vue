<template>
  <main>
    <PageHero
      title="A-Z Guide to Recycling"
      subtitle="Learn how to recycle and dispose of common household items correctly."
      :image="public_hero"
    />

    <section class="container py-5">
      <RouterLink class="btn btn-outline-primary mb-4" to="/learn">Back to Learn</RouterLink>
      <p>
        Use this guide to learn more about recycling, household waste and special recycling
        services.
      </p>

      <div
        v-for="resource in recyclingResources"
        :key="resource.title"
        class="card card-gradient-1 shadow-sm mb-3"
      >
        <div class="card-body card-gradient-1 rounded-3 p-4">
          <h2 class="h4 p-3">{{ resource.title }}</h2>
          <p>{{ resource.description }}</p>
          <RouterLink class="btn btn-primary" :to="resource.path">
            {{ resource.button }}
          </RouterLink>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import PageHero from '@/components/PageHero.vue'
import public_hero from '@/assets/images/public_hero.png'

const recyclingResources = [
  {
    title: 'How do I recycle different items?',
    description:
      'Search common items and find out whether they can be reused, repaired, recycled or disposed of correctly.',
    button: 'Explore Items',
    path: '/recycle-reuse',
  },
  {
    title: 'Batteries & Electronic Items',
    description:
      'Learn how batteries, mobile phones and other electronic items should be recycled safely.',
    button: 'Learn More',
    path: '/learn/a-z-recycling/batteries-electronics',
  },
  {
    title: 'Understanding Packaging Labels',
    description: 'Learn what common recycling symbols and packaging labels mean.',
    button: 'Learn More',
    path: '/learn/a-z-recycling/packaging-labels',
  },
  {
    title: 'What Goes in Your Recycling Bin',
    description: 'Learn what can and cannot be placed in your yellow-lid recycling bin.',
    button: 'Learn More',
    path: '/learn/bin-collection/recycling-bin',
  },
  {
    title: 'Composting at Home',
    description: 'Learn how composting food scraps and garden waste can help reduce landfill.',
    button: 'Learn More',
    path: '/learn/composting',
  },
  {
    title: 'Recycling & Waste Centres',
    description: 'Find nearby locations for items that require special recycling or disposal.',
    button: 'View Map',
    path: '/locations',
  },
]
</script>
