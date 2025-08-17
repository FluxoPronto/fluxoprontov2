import { ref, computed, watch } from 'vue'

const CART_STORAGE_KEY = 'fp_cart_v1'

function loadFromStorage() {
  if (process.client) {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch (_) { /* ignore */ }
  }
  return []
}

const items = ref(loadFromStorage())

watch(items, (val) => {
  if (process.client) localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(val))
}, { deep: true })

export function useCart() {
  const totalQuantity = computed(() => items.value.reduce((acc, p) => acc + (p.quantity || 1), 0))
  const subtotal = computed(() => items.value.reduce((acc, p) => acc + p.price * (p.quantity || 1), 0))

  function add(product) {
    const index = items.value.findIndex(p => p.id === product.id)
    if (index >= 0) {
      items.value[index].quantity = (items.value[index].quantity || 1) + 1
    } else {
      items.value.push({ ...product, quantity: 1 })
    }
  }

  function remove(id) {
    items.value = items.value.filter(p => p.id !== id)
  }

  function clear() { items.value = [] }

  function updateQuantity(id, quantity) {
    const item = items.value.find(p => p.id === id)
    if (!item) return
    item.quantity = Math.max(1, Number(quantity) || 1)
  }

  return { items, add, remove, clear, updateQuantity, totalQuantity, subtotal }
}


