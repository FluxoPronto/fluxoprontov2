// Gerencia a jornada: selecionou produto → login → checkout
// Armazena o produto selecionado antes do login e decide para onde enviar após autenticar

const REDIRECT_KEY = 'fp_redirect_after_login'

export function useAuthRedirect() {
  function setRedirectToCheckout(productId) {
    if (process.client) localStorage.setItem(REDIRECT_KEY, JSON.stringify({ type: 'checkout', productId }))
  }
  function readRedirect() {
    if (!process.client) return null
    try { return JSON.parse(localStorage.getItem(REDIRECT_KEY) || 'null') } catch { return null }
  }
  function clearRedirect() { if (process.client) localStorage.removeItem(REDIRECT_KEY) }

  function handlePostLoginRedirect() {
    const r = readRedirect()
    if (!r) return
    clearRedirect()
    if (r.type === 'checkout') return navigateTo('/checkout')
  }

  return { setRedirectToCheckout, handlePostLoginRedirect }
}


