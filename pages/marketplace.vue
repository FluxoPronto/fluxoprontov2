<template>
  <div class="marketplace-page">
    <NuxtPage v-if="$route.params.id" />
    <div v-else class="container section">
      <header class="marketplace-header">
        <div class="header-content">
          <h1>Marketplace de Workflows</h1>
          <p class="lead">Encontre a automação perfeita para sua necessidade. Workflows com curadoria, prontos para produção.</p>
        </div>
      </header>
      
      <div class="marketplace-grid">
        <aside class="filters-sidebar">
          <div class="filters-content" data-filters-version="2">
            <div class="filters-header">
              <h3>Filtros</h3>
              <button @click="clearFilters" class="btn-text">Limpar tudo</button>
            </div>
            
            <div class="form-stack">
              <div class="field">
                <label for="search" class="field-label-alt">Busca por Palavra-Chave</label>
                <div class="search-bar-sidebar">
                  <span class="material-icons">search</span>
                  <input id="search" class="input" v-model="filters.q" placeholder="Buscar..." />
                </div>
              </div>

              <details class="filter-group" open>
                <summary>Preço</summary>
                <div class="price-filter">
                   <div class="price-inputs">
                    <span>R$ {{ filters.price.min }}</span>
                    <span>R$ {{ filters.price.max }}</span>
                  </div>
                  <input type="range" min="0" :max="maxPrice" :step="10" v-model="filters.price.max" class="price-range">
                </div>
              </details>

              <details class="filter-group" open>
                <summary>Categorias</summary>
                <div class="checkbox-group">
                  <div class="checkbox-item" v-for="cat in allCategories" :key="cat">
                    <input type="checkbox" :id="`cat-${cat}`" :value="cat" v-model="filters.categories">
                    <label :for="`cat-${cat}`">{{ cat }}</label>
                  </div>
                </div>
              </details>

              <details class="filter-group">
                <summary>Ferramentas Integradas</summary>
                <div class="checkbox-group">
                  <div class="checkbox-item" v-for="tool in allTools" :key="tool">
                    <input type="checkbox" :id="`tool-${tool}`" :value="tool" v-model="filters.tools">
                    <label :for="`tool-${tool}`">{{ tool }}</label>
                  </div>
                </div>
              </details>

              <details class="filter-group">
                <summary>Complexidade</summary>
                 <div class="radio-group">
                    <div class="radio-item" v-for="level in ['Básico', 'Intermediário', 'Avançado']" :key="level">
                      <input type="radio" :id="`comp-${level}`" name="complexity" :value="level" v-model="filters.complexity">
                      <label :for="`comp-${level}`">{{ level }}</label>
                    </div>
                </div>
              </details>

              <details class="filter-group">
                <summary>Recursos Inclusos</summary>
                <div class="checkbox-group">
                   <div class="checkbox-item" v-for="res in ['documentacao', 'video', 'suporte']" :key="res">
                    <input type="checkbox" :id="`res-${res}`" :value="res" v-model="filters.resources">
                    <label :for="`res-${res}`">{{ res.charAt(0).toUpperCase() + res.slice(1) }}</label>
                  </div>
                </div>
              </details>

              <details class="filter-group">
                <summary>Vendedor</summary>
                <div class="form-stack">
                  <label class="field-label-alt">Nível</label>
                  <div class="checkbox-group">
                    <div class="checkbox-item" v-for="level in ['Top Vendedor', 'Vendedor Verificado']" :key="level">
                      <input type="checkbox" :id="`seller-${level}`" :value="level" v-model="filters.sellerLevels">
                      <label :for="`seller-${level}`">{{ level }}</label>
                    </div>
                  </div>
                  <label class="field-label-alt" style="margin-top: 12px;">Avaliação Mínima</label>
                  <select class="select" v-model.number="filters.minSellerRating">
                    <option value="0">Todas</option>
                    <option value="4">4.0+</option>
                    <option value="4.5">4.5+</option>
                    <option value="4.8">4.8+</option>
                  </select>
                </div>
              </details>

            </div>
          </div>
        </aside>

        <main class="products-main">
           <div class="toolbar">
            <span class="results-count">{{ filteredProducts.length }} resultados</span>
            <div class="sort-control">
              <label for="order" class="field-label-alt">Ordenar por:</label>
              <select id="order" class="select" v-model="sortBy">
                <option value="best_sellers">Mais Relevantes</option>
                <option value="top_rated">Melhor Avaliados</option>
                <option value="price_asc">Preço: Menor para Maior</option>
                <option value="price_desc">Preço: Maior para Menor</option>
              </select>
            </div>
          </div>

          <div class="products-grid" v-if="filteredProducts.length > 0">
            <ProductCard 
              v-for="(p, index) in filteredProducts" 
              :key="p.id" 
              :product="p" 
              @add="addToCart"
              :style="{ 'transition-delay': `${index * 50}ms` }"
            />
          </div>
          <div v-else class="empty-state">
            <span class="material-icons">search_off</span>
            <h3>Nenhum workflow encontrado</h3>
            <p>Tente ajustar seus filtros ou limpar a busca para ver mais resultados.</p>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import ProductCard from '@/components/ui/ProductCard.vue'
import { useCart } from '@/composables/useCart'
import { useProducts } from '@/composables/useProducts'
import { reactive, computed } from 'vue'

const { add } = useCart()
const { products } = useProducts()

const allCategories = computed(() => [...new Set(products.value.map(p => p.category))])
const allTools = computed(() => [...new Set(products.value.flatMap(p => p.tools))])
const maxPrice = computed(() => Math.max(...products.value.map(p => p.price)))

const initialFilters = () => ({
  q: '',
  categories: [],
  tools: [],
  price: { min: 0, max: maxPrice.value },
  complexity: '',
  resources: [],
  sellerLevels: [],
  minSellerRating: 0,
})

const filters = reactive(initialFilters())
const sortBy = ref('best_sellers')

const filteredProducts = computed(() => {
  let list = [...products.value]

  // Filter by Search Query
  if (filters.q) {
    const searchTerm = filters.q.toLowerCase()
    list = list.filter(p => p.title.toLowerCase().includes(searchTerm))
  }

  // Filter by Price
  list = list.filter(p => p.price >= filters.price.min && p.price <= filters.price.max)

  // Filter by Category
  if (filters.categories.length) {
    list = list.filter(p => filters.categories.includes(p.category))
  }

  // Filter by Tools
  if (filters.tools.length) {
    list = list.filter(p => filters.tools.every(tool => p.tools.includes(tool)))
  }

  // Filter by Complexity
  if (filters.complexity) {
    list = list.filter(p => p.complexity === filters.complexity)
  }

  // Filter by Resources
  if (filters.resources.length) {
    list = list.filter(p => filters.resources.every(res => p.resources.includes(res)))
  }

  // Filter by Seller Level
  if (filters.sellerLevels.length) {
    list = list.filter(p => filters.sellerLevels.includes(p.seller.level))
  }

  // Filter by Seller Rating
  if (filters.minSellerRating > 0) {
    list = list.filter(p => p.seller.rating >= filters.minSellerRating)
  }

  // Sorting
  switch (sortBy.value) {
    case 'price_asc': return list.sort((a,b) => a.price - b.price)
    case 'price_desc': return list.sort((a,b) => b.price - a.price)
    case 'top_rated': return list.sort((a,b) => b.rating - a.rating)
    case 'best_sellers':
    default: return list.sort((a,b) => b.sales - a.sales)
  }
})

function clearFilters() {
  Object.assign(filters, initialFilters())
  filters.price.max = maxPrice.value
}

function addToCart(p) { add({ id: p.id, title: p.title, price: p.price }) }
</script>

<style scoped>
/* Estilos existentes */
.marketplace-page {
  background: var(--surface-2);
}

.section {
  padding-bottom: 80px;
}

.marketplace-header {
  padding: 48px 0;
  text-align: center;
  margin-bottom: 32px;
}

.marketplace-header h1 {
  font-size: clamp(2.2rem, 5vw, 3rem);
  font-weight: 800;
}
.marketplace-header .lead {
  font-size: 1.15rem;
  color: var(--text-2);
  max-width: 600px;
  margin: 12px auto 0;
}
.search-bar-sidebar {
  position: relative;
}
.search-bar-sidebar .input {
  padding-left: 36px;
  border-radius: var(--radius-md);
  height: 44px;
}
.search-bar-sidebar .material-icons {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-3);
  pointer-events: none;
  font-size: 20px;
}
.marketplace-grid {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 32px;
  align-items: flex-start;
}
.filters-sidebar {
  position: sticky;
  top: 100px;
}
.filters-content {
  background: var(--surface-1);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 20px;
}
.filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--border);
}
.filters-header h3 {
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0;
}
.btn-text {
  background: none;
  border: none;
  color: var(--brand-500);
  cursor: pointer;
  font-weight: 600;
}
.field-label-alt {
  display: block;
  margin-bottom: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-2);
}
.filter-group {
  border-top: 1px solid var(--border);
  padding: 16px 0;
}
.filter-group summary {
  font-weight: 600;
  cursor: pointer;
  list-style: none; /* Remove default marker */
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.filter-group summary::-webkit-details-marker {
  display: none;
}
.filter-group summary::after {
  content: '+';
  font-size: 1.2rem;
  transition: transform 0.2s;
}
.filter-group[open] summary::after {
  transform: rotate(45deg);
}
.filter-group > div {
  margin-top: 16px;
}
.price-filter .price-inputs {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: var(--text-2);
  margin-bottom: 8px;
}
.price-range {
  width: 100%;
}

.checkbox-group, .radio-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.checkbox-item, .radio-item {
  display: flex;
  align-items: center;
  gap: 8px;
}
.checkbox-item label, .radio-item label {
  cursor: pointer;
  font-size: 0.95rem;
}
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.results-count {
  font-size: 0.95rem;
  color: var(--text-2);
}
.sort-control {
  display: flex;
  align-items: center;
  gap: 8px;
}
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}
.empty-state {
  background: var(--surface-1);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 64px;
  text-align: center;
  display: grid;
  place-items: center;
  gap: 16px;
}
.empty-state .material-icons {
  font-size: 48px;
  color: var(--text-3);
}
.empty-state h3 {
  font-size: 1.5rem;
  font-weight: 700;
}
.empty-state p {
  max-width: 320px;
  color: var(--text-2);
}
.pagination {
  text-align: center;
  margin-top: 48px;
}
@media (max-width: 992px) {
  .marketplace-grid {
    grid-template-columns: 1fr;
  }
  .filters-sidebar {
    position: static;
    top: auto;
    margin-bottom: 32px;
  }
}
</style>
