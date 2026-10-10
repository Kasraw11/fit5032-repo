<template>
  <main class="container py-5">
    <PageHeader
      title="What Can Go in Your Bins?"
      subtitle="Choosing the correct bin helps reduce contamination and allows more materials to be recycled or processed correctly."
      back-to="/learn/bin-collection"
    />
    <section class="card card-body p-3 shadow-sm">
      <section class="card card-body shadow-sm">
        <h2>Recycling Bin – Yellow Lid</h2>
        <p>Common items include:</p>
        <ul>
          <li>Paper</li>
          <li>Cardboard</li>
          <li>Hard plastic bottles and containers</li>
          <li>Glass bottles and jars</li>
          <li>Aluminium cans</li>
          <li>Steel cans</li>
        </ul>
      </section>

      <section class="card card-body shadow-sm">
        <h2>Landfill Bin – Red Lid</h2>
        <p>
          Use this bin for household rubbish that cannot be recycled, reused, donated or placed in
          the food and garden waste bin.
        </p>
        <p>
          Examples include soft plastic wrapping, long-life drink cartons, wipes, nappies, sanitary
          products, wrapped broken ceramics and non-electronic toys. Check specialist recycling
          options for reusable textiles and packaging first.
        </p>
      </section>

      <section class="card card-body shadow-sm">
        <h2>Food &amp; Garden Waste Bin – Green Lid</h2>
        <p>Common items include:</p>
        <ul>
          <li>Food scraps</li>
          <li>Fruit and vegetable scraps</li>
          <li>Meat and bones</li>
          <li>Garden clippings</li>
          <li>Leaves</li>
          <li>Flowers</li>
          <li>Small branches</li>
        </ul>
      </section>

      <section class="card card-body shadow-sm">
        <h2>Prepare items for the correct bin</h2>
        <ul>
          <li>Keep recycling loose, empty containers and flatten cardboard.</li>
          <li>
            Bag or wrap landfill rubbish. Do not put batteries or electrical items in household
            bins.
          </li>
          <li>Remove food packaging before putting scraps in the green bin.</li>
          <li>Keep garden clippings loose and cut branches to fit the Council's size limits.</li>
          <li>Use only Council-approved compostable liners in the green bin.</li>
        </ul>
      </section>

      <section class="card card-body shadow-sm">
        <h2>Items needing another service</h2>
        <p>
          Batteries, electronics, chemicals and some bulky materials need dedicated collection or
          drop-off services. Check the accepted items and fees before visiting.
        </p>
        <p>
          The Monash Recycling and Waste Centre is at 380 Ferntree Gully Road, Notting Hill. It
          accepts materials such as cardboard, scrap metal, electronics, batteries and eligible
          polystyrene. Some materials have quantity limits or charges.
        </p>
        <p>
          Donate usable household items or check specialist recycling options before choosing
          landfill.
        </p>
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
