<template>
  <main class="container py-5">
    <PageHeader
      title="What Goes in Your Landfill Bin?"
      subtitle="The red-lid landfill bin is for household rubbish that cannot be recycled, reused, donated or processed through another household waste service."
      back-to="/learn/bin-collection"
    />

    <section class="card card-body p-3 shadow">
      <section class="card card-body p-3 shadow-sm">
        <h2>What can go in?</h2>
        <p>Bag or wrap all rubbish before placing it in your landfill bin.</p>
        <ul>
          <li>Soft plastic bags, film and wrapping</li>
          <li>Long-life milk and juice cartons, including UHT and Tetra Pak cartons</li>
          <li>Food boxes and wrappers that cannot be recycled</li>
          <li>Stickers from fruit and vegetables</li>
          <li>Wet wipes and baby wipes</li>
          <li>Wrapped nappies, pet waste, sanitary products and incontinence products</li>
          <li>Wrapped broken drinking glasses, mugs and ceramics</li>
          <li>Wrapped broken crockery, cutlery and Pyrex cookware</li>
          <li>Clothes, shoes and other textiles that cannot be reused or recycled elsewhere</li>
          <li>Cosmetic packaging that cannot be recycled through another service</li>
          <li>Wrapped dust from vacuum cleaners and lint from dryers</li>
          <li>Gloves, garden hoses and gardening tools</li>
          <li>Mirrors and window glass</li>
          <li>Polystyrene packaging and foam trays used for meat</li>
          <li>Disposable takeaway coffee cups, their lids and straws</li>
          <li>Toothbrushes and toothpaste tubes</li>
          <li>Toys without electronic parts</li>
        </ul>
      </section>

      <section class="card card-body p-3 shadow-sm">
        <h2>Do not put these items in your landfill bin</h2>
        <ul>
          <li>Mobile phones and batteries</li>
          <li>Electrical or electronic items with a battery, plug or power cord</li>
          <li>Solvents, chemicals and syringes</li>
          <li>Bottles containing gas</li>
          <li>Ash that is still hot and containers holding pressurised liquids</li>
          <li>Printer cartridges and light globes</li>
          <li>Construction waste, including timber, bricks and rocks</li>
          <li>Oil from vehicles</li>
        </ul>
        <p>These items need a separate disposal or recycling service.</p>
        <p>
          Check the Council's disposal guidance for each item before taking it to a collection
          point. Different services accept different materials.
        </p>
      </section>

      <section class="card card-body p-3 shadow-sm">
        <h2>What to recycle or reuse instead</h2>
        <p>
          Keep accepted paper, cardboard, hard plastic containers, glass bottles and jars, and metal
          cans in your yellow-lid recycling bin. Food scraps and suitable garden waste belong in
          your green-lid bin.
        </p>
        <p>
          Donate usable clothes, shoes and household items where possible. Some materials, including
          soft plastics, textiles and cosmetic packaging, may have separate recycling options. Check
          which items each service currently accepts.
        </p>
      </section>

      <section class="card card-body p-3 shadow-sm">
        <h2>What happens to your rubbish?</h2>
        <p>
          Rubbish collected from the red-lid bin goes to landfill. Machinery spreads and compacts
          the waste, and a layer of soil covers it at the end of the day.
        </p>
        <p>
          Buried waste can take a long time to break down. As it decomposes, it can release methane,
          a greenhouse gas that contributes to climate change.
        </p>
        <p>
          Reducing waste, reusing items and choosing the correct recycling or food and garden waste
          bin helps keep material out of landfill.
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
