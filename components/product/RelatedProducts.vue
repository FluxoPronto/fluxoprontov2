<template>
  <div class="related-products-wrapper">
    <h2 class="section-title">Você Também Pode Gostar</h2>
    <div class="products-grid">
      <ProductCard 
        v-for="product in relatedProducts"
        :key="product.id"
        :product="product"
      />
    </div>
  </div>
</template>

<script setup>
import ProductCard from '@/components/ui/ProductCard.vue';

defineProps({
  relatedProducts: {
    type: Array,
    required: true,
    default: () => []
  }
});
</script>

<style scoped>
.related-products-wrapper {
  /* Opcional: pode ter seu próprio contêiner se precisar de um fundo diferente */
}

.section-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 32px;
  color: var(--text-1);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}
</style>
