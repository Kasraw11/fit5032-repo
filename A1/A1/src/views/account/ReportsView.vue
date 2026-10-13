<template>
  <div class="container-fluid p-3">
    <PageHero
      title="Recycling Reports & Export"
      subtitle="View, search and export recycling items."
      :image="public_hero"
    />
    <div class="row mt-4">
      <aside class="col-12 col-md-3 mb-3">
        <AccountSidebar />
      </aside>
      <div class="col-12 col-md-9">
        <ReportsContent :items-only="true" :show-hero="false" />
      </div>
    </div>
  </div>
</template>

<script setup>
import PageHero from '@/components/PageHero.vue'
import public_hero from '@/assets/images/public_hero.png'
import AccountSidebar from '@/components/AccountSidebar.vue'
import ReportsContent from '@/views/admin/AdminReportsView.vue'
</script>
