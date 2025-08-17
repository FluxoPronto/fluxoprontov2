// Simula entitlement (itens comprados) no front usando localStorage
// Armazena uma lista de IDs de produtos comprados

const STORAGE_KEY = 'fp_entitlement_v1'

function load() {
  if (process.client) {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch (_) {}
  }
  return []
}

let purchased = load()

export function useEntitlement() {
  function has(productId) {
    return purchased.includes(productId)
  }
  function add(productId) {
    if (!purchased.includes(productId)) {
      purchased.push(productId)
      if (process.client) localStorage.setItem(STORAGE_KEY, JSON.stringify(purchased))
    }
  }
  function addMany(ids = []) {
    let changed = false
    ids.forEach((id) => {
      if (!purchased.includes(id)) { purchased.push(id); changed = true }
    })
    if (changed && process.client) localStorage.setItem(STORAGE_KEY, JSON.stringify(purchased))
  }
  function list() { return [...purchased] }
  function clearAll() { purchased = []; if (process.client) localStorage.setItem(STORAGE_KEY, JSON.stringify(purchased)) }
  return { has, add, addMany, list, clearAll }
}


