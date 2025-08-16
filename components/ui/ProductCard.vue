<template>
  <NuxtLink :to="`/marketplace/${product.id}`" class="product-card-link">
    <article class="product-card card elevate animate-rise">
      <div class="media-wrap">
        <img class="thumb" :src="product.image" :alt="product.title" loading="lazy" @error="onImgError" />
        <div class="badges-wrap">
          <span v-if="product.badges?.includes('best_seller')" class="chip best">Mais vendido</span>
          <span v-if="product.badges?.includes('popular')" class="chip pop">Popular</span>
          <span v-if="product.curated" class="chip cur">Curadoria</span>
          <span v-if="product.sponsored" class="chip spon">Patrocinado</span>
        </div>
      </div>
      <div class="stack">
        <div class="cluster" style="justify-content: space-between; align-items: start">
          <h3 class="title">{{ product.title }}</h3>
          <strong>R$ {{ product.price.toFixed(2) }}</strong>
        </div>
        <p class="desc">{{ product.description }}</p>
        <div class="cluster stats">
          <div class="rating">
            <span v-for="i in 5" :key="i" class="star" :class="{ on: i <= Math.round(product.rating) }">★</span>
            <small class="field-hint">{{ product.rating.toFixed(1) }} ({{ product.reviews }})</small>
          </div>
          <div class="field-hint">{{ product.sales }} vendas</div>
          <div class="field-hint">por {{ sellerName }}</div>
        </div>
        <div class="cluster actions">
          <UiButton class="btn-gradient" size="sm">Ver produto</UiButton>
          <UiButton size="sm" variant="outline" @click.prevent.stop="onAdd">Adicionar ao carrinho</UiButton>
        </div>
      </div>
    </article>
  </NuxtLink>
</template>

<script setup lang="ts">
import UiButton from '@/components/ui/UiButton.vue'
import { computed } from 'vue'

interface Seller {
  name: string
  level?: string
  rating?: number
  verified?: boolean
}

interface Product {
  id: string
  title: string
  description: string
  price: number
  image: string
  category: string
  rating: number
  reviews: number
  sales: number
  curated?: boolean
  badges: string[]
  seller: string | Seller
  sponsored?: boolean
}

const props = defineProps<{ product: Product }>()
const emit = defineEmits<{ (e: 'add', product: Product): void }>()

const sellerName = computed(() => {
  const s = props.product?.seller as unknown
  if (!s) return '—'
  if (typeof s === 'string') return s
  try {
    const sellerObj = s as Seller
    return sellerObj?.name || '—'
  } catch {
    return '—'
  }
})

function onAdd() { emit('add', props.product) }

function onImgError(event: Event) {
  const el = event.target as HTMLImageElement
  if (!el) return
  el.onerror = null
  el.src = '/images/products/product-1.jpg'
}
</script>

<style scoped>
.product-card-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.product-card { 
  display: grid; 
  gap: 12px; 
  transition: transform .12s ease, box-shadow .2s ease; 
  height: 100%;
}
.product-card:hover { 
  transform: translateY(-3px); 
  box-shadow: var(--shadow-md); 
}
.media-wrap { position: relative; }
.thumb { width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; }
.badges-wrap { position: absolute; inset: 12px auto auto 12px; display: flex; gap: 8px; }
.chip { font-size: .75rem; padding: 6px 8px; border-radius: 999px; backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); color: #fff; border: 1px solid rgba(255,255,255,.25); box-shadow: var(--shadow-sm); }
.chip.best { background: color-mix(in srgb, var(--accent-500) 35%, black); }
.chip.pop { background: color-mix(in srgb, var(--brand-500) 35%, black); }
.chip.cur { background: color-mix(in srgb, var(--success) 35%, black); }
.chip.spon { background: color-mix(in srgb, var(--accent-600) 35%, black); }
.title { line-height: 1.25; }
.desc { color: var(--text-2); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.stats { justify-content: space-between; }
.rating { display: inline-flex; align-items: center; gap: 6px; }
.star { color: var(--gray-300); }
.star.on { color: #fbbf24; }
.actions { justify-content: space-between; margin-top: auto; }
</style>

