<template>
  <div class="purchase-card">
    <div class="price-section">
      <span class="price-label">Preço</span>
      <span class="price-value">R$ {{ price.toFixed(2) }}</span>
      <span v-if="promoPrice" class="price-original">R$ {{ promoPrice.toFixed(2) }}</span>
    </div>

    <div v-if="stock" class="stock-info">
      <span class="stock-icon material-icons">inventory_2</span>
      Disponíveis: <strong>{{ stock }} unidades</strong>
    </div>

    <div class="actions-group">
      <UiButton @click="handleBuyNow" class="btn-gradient btn-lg btn-block">Comprar Agora</UiButton>
      <UiButton @click="handleAddToCart" class="btn-outline btn-lg btn-block">Adicionar ao Carrinho</UiButton>
    </div>
    
    <div class="delivery-info">
      <span class="delivery-icon material-icons">bolt</span>
      Acesso Imediato após a compra
    </div>

    <ul class="guarantees-list">
      <li><span class="material-icons">verified</span> Compra Segura</li>
      <li><span class="material-icons">security</span> Garantia de Reembolso</li>
      <li><span class="material-icons">support_agent</span> Suporte do Vendedor</li>
    </ul>
  </div>
</template>

<script setup>
// import { useCart } from '@/composables/useCart';
import { useRouter } from 'vue-router';
import UiButton from '@/components/ui/UiButton.vue';

const props = defineProps({
  price: { type: Number, required: true, default: 0 },
  promoPrice: { type: Number, default: null },
  stock: { type: Number, default: null },
  productData: { type: Object, required: true }
});

// const cart = useCart();
const router = useRouter();

// Supondo que você tenha um sistema de notificações/toast
// Se não tiver, podemos implementar um simples ou usar uma lib
function showToast(message) {
  alert(message); // Placeholder
}

function handleAddToCart() {
  cart.add(props.productData);
  showToast(`${props.productData.title} foi adicionado ao carrinho!`);
}

function handleBuyNow() {
  cart.add(props.productData);
  router.push('/checkout');
}
</script>

<style scoped>
.purchase-card {
  background: var(--surface-1);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  padding: 32px;
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.price-section {
  display: grid;
  gap: 4px;
}
.price-label {
  font-size: 0.9rem;
  color: var(--text-3);
  font-weight: 500;
}
.price-value {
  font-size: 2.75rem;
  font-weight: 800;
  color: var(--text-1);
  line-height: 1;
}
.price-original {
  font-size: 1rem;
  color: var(--text-3);
  text-decoration: line-through;
}

.stock-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
  color: var(--brand-400);
  background-color: color-mix(in srgb, var(--brand-500) 10%, transparent);
  padding: 8px 12px;
  border-radius: var(--radius-md);
}

.actions-group {
  display: grid;
  gap: 12px;
}

.delivery-info {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--success);
  padding-top: 16px;
  border-top: 1px solid var(--border);
}

.guarantees-list {
  list-style: none;
  padding: 16px 0 0;
  margin: 0;
  display: grid;
  gap: 12px;
  font-size: 0.9rem;
  color: var(--text-2);
  border-top: 1px solid var(--border);
}
.guarantees-list li {
  display: flex;
  align-items: center;
  gap: 10px;
}
.guarantees-list .material-icons {
  font-size: 20px;
  color: var(--text-3);
}
</style>
