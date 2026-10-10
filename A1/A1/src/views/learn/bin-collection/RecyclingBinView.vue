<template>
  <main class="container py-5">
    <PageHeader
      title="Recycling Bin – Yellow Lid"
      subtitle="The yellow-lid recycling bin is for common recyclable household containers, packaging and paper products."
      back-to="/learn/bin-collection"
    />

    <section class="card card-body p-3 shadow">
      <section class="card card-body p-3 shadow-sm">
        <h2>What can go in?</h2>
        <ul>
          <li>Paper</li>
          <li>Cardboard</li>
          <li>Hard plastic bottles</li>
          <li>Hard plastic containers</li>
          <li>Glass bottles</li>
          <li>Glass jars</li>
          <li>Aluminium cans</li>
          <li>Aluminium foil</li>
          <li>Steel cans</li>
        </ul>
      </section>

      <section class="card card-body p-3 shadow-sm">
        <h2>What cannot go in?</h2>
        <ul>
          <li>Plastic bags</li>
          <li>Soft plastics</li>
          <li>Food scraps</li>
          <li>Garden waste</li>
          <li>Batteries</li>
          <li>Electronic items</li>
          <li>Clothing</li>
          <li>Shoes</li>
          <li>Polystyrene</li>
          <li>Takeaway coffee cups</li>
        </ul>
      </section>

      <p>Place recyclable items loose in the bin rather than inside plastic bags.</p>
      <section class="card card-body p-3 shadow-sm">
        <h2>More accepted packaging examples</h2>
        <ul>
          <li>Plastic drink, detergent and shampoo bottles; yoghurt tubs and berry punnets</li>
          <li>Plastic biscuit trays, meat trays and takeaway containers</li>
          <li>Newspapers, magazines without plastic wrapping, books, envelopes and paper bags</li>
          <li>Cereal, tissue, pizza and egg boxes; uncoated paper plates</li>
          <li>Ordinary milk and juice cartons, but not long-life UHT cartons</li>
          <li>Aluminium trays and empty aerosol cans</li>
        </ul>
      </section>

      <section class="card card-body p-3 shadow-sm">
        <h2>Other items to keep out</h2>
        <ul>
          <li>Long-life cartons, receipts, waxed cardboard and medicine blister packs</li>
          <li>Shredded or very small paper, tissues and paper towel</li>
          <li>Crockery, cutlery, drinking glasses, window glass and ovenware</li>
          <li>Toothbrushes, toothpaste tubes, hangers, bread tags and toys</li>
          <li>Light globes, printer cartridges, nappies, wipes and pet waste</li>
          <li>Wood, coffee-cup lids and straws</li>
        </ul>
      </section>

      <section class="card card-body p-3 shadow-sm">
        <h2>Prepare your recycling</h2>
        <p>
          Empty bottles and jars; washing is not required. Leave their lids on, flatten boxes and
          scrunch foil into a ball. Paper must be at least postcard-sized.
        </p>
      </section>

      <section class="card card-body p-3 shadow-sm">
        <h2>What happens after collection?</h2>
        <p>
          VISY separates accepted materials into paper, plastic, glass and metal streams for new
          packaging. Incorrect items are removed and sent to landfill.
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
