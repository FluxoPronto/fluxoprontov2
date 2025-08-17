<template>
  <div class="home-page">
    <!-- SEÇÃO HERO -->
     <header class="app-header" :class="{ 'is-scrolled': isScrolled }">
      <div class="container navbar">
        <NuxtLink class="brand" to="/">
          <img src="~/assets/images/logofp-transparente.png" alt="FluxoPronto Logo" class="logo-image" />
        </NuxtLink>
        
        <!-- Navegação Desktop -->
        <nav class="nav-desktop">
          <NuxtLink to="/marketplace" class="nav-link" :class="{ active: isActive('/marketplace') }">Marketplace</NuxtLink>
          <NuxtLink to="/como-funciona" class="nav-link" :class="{ active: isActive('/como-funciona') }">Como funciona</NuxtLink>
          <div class="dropdown" @mouseenter="isDropdownOpen = true" @mouseleave="isDropdownOpen = false">
            <button class="nav-link" :class="{ active: isPlatformRouteActive }">
              <span>Plataforma</span>
              <span class="material-icons">expand_more</span>
            </button>
            <Transition name="dropdown-fade">
              <div v-if="isDropdownOpen" class="dropdown-menu">
                <NuxtLink to="/sobre" class="dropdown-item">Sobre Nós</NuxtLink>
                <NuxtLink to="/diferenciais" class="dropdown-item">Diferenciais</NuxtLink>
                <NuxtLink to="/vender" class="dropdown-item">Vender na Plataforma</NuxtLink>
                <NuxtLink to="/faq" class="dropdown-item">FAQ</NuxtLink>
              </div>
            </Transition>
          </div>
        </nav>

        <!-- Ações (Direita) -->
        <div class="actions-right">
          <!-- Ações Desktop -->
          <div class="actions-desktop">
            <NuxtLink class="btn btn-ghost cart-button" to="/carrinho" aria-label="Carrinho">
              <span class="material-icons">shopping_cart</span>
              <span v-if="totalQuantity" class="badge-count">{{ totalQuantity }}</span>
            </NuxtLink>
            <NuxtLink class="btn btn-outline" to="/login">Entrar</NuxtLink>
            <NuxtLink class="btn btn-gradient" to="/cadastro">Criar conta</NuxtLink>
          </div>
          <!-- Ações Mobile -->
          <div class="actions-mobile">
             <NuxtLink class="btn btn-ghost cart-button" to="/carrinho" aria-label="Carrinho">
              <span class="material-icons">shopping_cart</span>
              <span v-if="totalQuantity" class="badge-count">{{ totalQuantity }}</span>
            </NuxtLink>
            <button class="mobile-menu-toggle" @click="isMobileMenuOpen = !isMobileMenuOpen" aria-label="Abrir menu">
              <span class="material-icons">{{ isMobileMenuOpen ? 'close' : 'menu' }}</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Menu Mobile -->
    <Transition name="slide-fade">
      <nav v-if="isMobileMenuOpen" class="nav-mobile">
        <NuxtLink to="/marketplace" @click="closeMobileMenu">Marketplace</NuxtLink>
        <NuxtLink to="/como-funciona" @click="closeMobileMenu">Como funciona</NuxtLink>
        <details class="mobile-dropdown">
            <summary>Plataforma <span class="material-icons">expand_more</span></summary>
            <NuxtLink to="/sobre" @click="closeMobileMenu">Sobre Nós</NuxtLink>
            <NuxtLink to="/diferenciais" @click="closeMobileMenu">Diferenciais</NuxtLink>
            <NuxtLink to="/vender" @click="closeMobileMenu">Vender na Plataforma</NuxtLink>
            <NuxtLink to="/faq" @click="closeMobileMenu">FAQ</NuxtLink>
        </details>
        <div class="mobile-actions">
          <NuxtLink class="btn btn-outline btn-block" to="/auth/login" @click="closeMobileMenu">Entrar</NuxtLink>
          <NuxtLink class="btn btn-gradient btn-block" to="/auth/cadastro" @click="closeMobileMenu">Criar conta</NuxtLink>
        </div>
      </nav>
    </Transition>


    <section class="section-container hero-section">
      <div class="hero-content">
        <ClientOnly>
      <div class="hero-text">
            <span class="eyebrow">Acelere sua operação</span>
        <h1>O Marketplace Definitivo para Workflows n8n</h1>
            <p class="lead">Templates profissionais para conectar ferramentas, acelerar a operação e multiplicar resultados. Compre um fluxo, ganhe um atalho.</p>
        <div class="hero-buttons">
          <NuxtLink class="btn btn-gradient btn-lg" to="/marketplace">Explorar fluxos</NuxtLink>
              <NuxtLink class="btn btn-outline btn-lg hover-underline" to="/como-funciona">Como funciona?</NuxtLink>
        </div>
        <div class="cluster badges">
              <span class="badge"><span class="material-icons">verified</span> Curadoria e Qualidade</span>
              <span class="badge"><span class="material-icons">bolt</span> Pronto para Produção</span>
              <span class="badge"><span class="material-icons">support_agent</span> Suporte Premium</span>
        </div>
      </div>
        </ClientOnly>
        <ClientOnly>
      <div class="hero-image-container">
            <img class="float-soft" src="~/assets/images/mockup-telas.png" alt="Plataforma FluxoPronto em múltiplos dispositivos"/>
          </div>
        </ClientOnly>
      </div>
    </section>

    <!-- SEÇÃO DESTAQUES -->
    <section class="section-container featured-section">
      <ClientOnly>
      <header class="section-head">
        <h2>Fluxos em Destaque</h2>
          <p class="field-hint">As automações mais populares que estão transformando negócios.</p>
      </header>
      </ClientOnly>
      <ClientOnly>
        <!-- <div class="grid-3 products-grid" v-if="featuredLimited.length > 0">
          <ProductCard
              v-for="(p, index) in featuredLimited"
            :key="p.id"
            :product="p"
            @add="addToCart"
              :style="{ 'transition-delay': `${index * 100}ms` }"
          />
        </div> -->
      </ClientOnly>
      <ClientOnly>
        <div class="stack" style="margin-top: 32px;">
          <NuxtLink class="btn btn-outline btn-lg hover-underline" to="/marketplace">Ver todos os fluxos</NuxtLink>
        </div>
      </ClientOnly>
    </section>

    <!-- SEÇÃO "COMO FUNCIONA" -->
    <section class="section-container how-it-works-section">
      <ClientOnly>
        <header class="section-head">
          <h2>Tudo Pronto em 3 Passos</h2>
          <p class="field-hint">Comece a automatizar em questão de minutos.</p>
        </header>
      </ClientOnly>
      <ClientOnly>
        <div class="steps-container">
          <div class="step-card">
            <div class="step-icon-wrapper"><span class="material-icons">explore</span></div>
            <h3>1. Explore</h3>
            <p>Navegue em nosso marketplace e encontre o fluxo perfeito para sua necessidade.</p>
          </div>
          <div class="step-connector"></div>
          <div class="step-card">
            <div class="step-icon-wrapper"><span class="material-icons">download</span></div>
            <h3>2. Adquira</h3>
            <p>Compre com segurança e receba o template do workflow instantaneamente.</p>
          </div>
          <div class="step-connector"></div>
          <div class="step-card">
            <div class="step-icon-wrapper"><span class="material-icons">rocket_launch</span></div>
            <h3>3. Implante</h3>
            <p>Importe para o seu n8n, adicione suas credenciais e ative a automação.</p>
          </div>
      </div>
      </ClientOnly>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <ClientOnly>
          <div>
            <h2 class="cta-title">Pronto para acelerar sua automação?</h2>
            <p class="cta-lead">Explore agora os templates disponíveis e dê o próximo passo.</p>
            <div class="hero-buttons cta-buttons-bottom">
                <NuxtLink to="/marketplace" class="btn btn-dark btn-lg">Começar agora</NuxtLink>
                <NuxtLink to="/vender" class="btn btn-outline btn-lg">Seja Vendedor</NuxtLink>
            </div>
          </div>
        </ClientOnly>
      </div>
    </section>
  </div>
</template>

<script setup>
import ProductCard from '@/components/ui/ProductCard.vue'
// import { useCart } from '@/composables/useCart'
// import { useProducts } from '@/composables/useProducts'

// const { add } = useCart()
// const { featured } = useProducts()
// const featuredLimited = computed(() => featured.value.slice(0, 3))

// function addToCart(p) { add({ id: p.id, title: p.title, price: p.price }) }

// import { useCart } from '@/composables/useCart'
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
// import SiteFooter from '@/components/site/SiteFooter.vue'

const route = useRoute()
// const { totalQuantity } = useCart()

const isMobileMenuOpen = ref(false)
const isScrolled = ref(false)
const isDropdownOpen = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})

const isActive = (path) => {
  if (path === '/') return route.path === path
  return route.path.startsWith(path)
}

const isPlatformRouteActive = computed(() => {
    const platformRoutes = ['/sobre', '/diferenciais', '/faq', '/vender'];
    return platformRoutes.some(path => route.path.startsWith(path));
});

const closeMobileMenu = () => {
    isMobileMenuOpen.value = false;
}


</script>

<style scoped>
/* Reset e Configurações Globais da Página */
.home-page {
  background: var(--bg);
  color: var(--text-1);
  overflow-x: hidden;
}
.section-container {
  max-width: var(--container);
  margin: 0 auto;
  padding: 100px 24px;
}
.section-head {
  text-align: center;
  margin-bottom: 48px;
}
.section-head h2 {
  font-size: clamp(2rem, 5vw, 2.5rem);
  font-weight: 800;
  margin-bottom: 8px;
}
.section-head .field-hint {
  font-size: 1.1rem;
  color: var(--text-2);
  max-width: 580px;
  margin: 0 auto;
}

/* Hero Section */
.hero-section {
  padding-top: 120px;
  padding-bottom: 120px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.hero-content {
  display: grid;
  align-items: center;
  gap: 48px;
  grid-template-columns: 1fr; /* Default to single column */
}
.hero-text .eyebrow {
  display: inline-block;
  font-size: 0.9rem;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 99px;
  background-color: var(--brand-100);
  color: var(--brand-600);
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.hero-text h1 {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 800;
  line-height: 1.1;
  max-width: 800px;
  margin: 0 auto;
}
.hero-text .lead {
  font-size: 1.2rem;
  color: var(--text-2);
  margin: 24px auto 32px;
  max-width: 680px;
}
.hero-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}
.hero-image-container {
  margin-top: 48px;
  position: relative;
}
.hero-image-container img {
  width: 100%;
  max-width: 800px;
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
}
.badges {
  margin-top: 32px;
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}
.badge {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: var(--text-2);
}
.badge .material-icons {
  font-size: 20px;
  color: var(--brand-500);
}

/* Featured Section */
.featured-section {
  background-color: var(--surface-1);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}
.products-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

/* How It Works Section */
.how-it-works-section {
  text-align: center;
}
.steps-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 24px;
  flex-wrap: wrap;
}
.step-card {
  background: var(--surface-1);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 32px;
  max-width: 320px;
  flex-grow: 1;
  box-shadow: var(--shadow-sm);
}
.step-icon-wrapper {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--gradient-accent);
  color: white;
  display: grid;
  place-items: center;
  margin: 0 auto 16px;
}
.step-icon-wrapper .material-icons {
  font-size: 32px;
}
.step-card h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 8px;
}
.step-card p {
  color: var(--text-2);
  line-height: 1.6;
}
.step-connector {
  flex-grow: 1;
  height: 2px;
  background: var(--border);
  min-width: 50px;
  margin-top: 32px;
  display: none; /* Hidden by default, shown on larger screens */
}

/* CTA Section */
.cta-section {
  background: var(--gradient-accent);
  padding-block: clamp(56px, 8vw, 96px);
  color: white;
  margin-top: clamp(56px, 8vw, 112px);
}
.cta-section .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
}
.cta-title {
  font-size: clamp(1.75rem, 5vw, 2.5rem);
  font-weight: 800; /* Adicionado para consistência */
  line-height: 1.2; /* Adicionado para melhor legibilidade */
  color: white;
  max-width: 600px;
  margin: 0 auto 16px;
}
.cta-lead {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.85); /* Aumentado contraste */
  max-width: 500px;
  margin: 0 auto 32px;
}
.btn-dark {
  --_bg: var(--gray-900);
  --_fg: white;
}
.btn-dark:hover {
  background: black;
}

/* Centraliza de forma explícita a dupla de CTAs do rodapé da home */
.cta-buttons-bottom {
  justify-content: center;
  gap: 16px;
}


/* --- RESPONSIVIDADE --- */
@media (min-width: 768px) {
  .hero-content {
    text-align: left;
    grid-template-columns: 1fr 0.8fr; /* Two columns on larger screens */
    gap: 64px;
  }
  .hero-text h1, .hero-text .lead, .hero-text .eyebrow {
    margin-left: 0;
    margin-right: 0;
  }
  .hero-buttons, .badges {
    justify-content: flex-start;
  }
  /* Garante centralização dos CTAs finais da home em telas largas */
  .cta-buttons-bottom {
    justify-content: center !important;
  }
  .hero-image-container {
    margin-top: 0;
  }
  .steps-container {
    flex-wrap: nowrap;
  }
  .step-connector {
    display: block; /* Show connectors on larger screens */
  }
}

@media (max-width: 992px) {
  .products-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 767px) {
  .section-container {
    padding: 80px 16px;
  }
  .hero-section {
    padding-top: 80px;
    padding-bottom: 80px;
  }
  .products-grid {
    grid-template-columns: 1fr;
  }
  .step-connector {
    display: none;
  }
}


/* Estrutura e Header */
.app-header {
  position: sticky;
  top: 0;
  z-index: 50;
  width: 100%;
  transition: background-color 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  border-bottom: 1px solid transparent;
  background: transparent;
}
.app-header.is-scrolled {
  background: var(--surface-1-alpha-95);
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
  border-bottom-color: var(--border);
}
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
}
.brand .logo-image {
  height: 32px;
  width: auto;
  transition: transform 0.2s ease;
}
.brand:hover .logo-image {
  transform: scale(1.05);
}

/* Navegação Desktop */
.nav-desktop {
  display: flex;
  align-items: center;
  gap: 12px;
}
.nav-link {
  display: flex;
  align-items: center;
  gap: 4px;
  position: relative;
  padding: 8px 16px;
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text-2);
  transition: color 0.2s ease;
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
}
.nav-link:hover {
  color: var(--text-1);
}
.nav-link.active {
  color: var(--brand-500);
  font-weight: 600;
}
.nav-link .material-icons {
    font-size: 20px;
    transition: transform 0.2s ease;
}

/* Dropdown */
.dropdown {
    position: relative;
}
.dropdown .nav-link:hover .material-icons {
    transform: rotate(180deg);
}
.dropdown-menu {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-top: 12px;
    background: var(--surface-1);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
    padding: 8px;
    min-width: 200px;
    z-index: 10;
    display: grid;
    gap: 4px;
}
.dropdown-item {
    display: block;
    padding: 10px 16px;
    border-radius: var(--radius-sm);
    text-decoration: none;
    color: var(--text-2);
    font-weight: 500;
    transition: all 0.2s ease;
}
.dropdown-item:hover {
    background: var(--surface-2);
    color: var(--text-1);
}

.actions-desktop {
  display: flex;
  align-items: center;
  gap: 16px;
}
.cart-button {
  position: relative;
  padding: 8px;
  color: var(--text-2);
}
.cart-button:hover {
  color: var(--text-1);
  background-color: var(--surface-2);
}
.badge-count {
  position: absolute;
  top: -4px;
  right: -6px;
  background: var(--brand-500);
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  border: 2px solid var(--surface-1);
}
.actions-right {
  display: flex;
  align-items: center;
  gap: 16px;
}
.actions-mobile {
  display: none; /* Escondido por padrão */
  align-items: center;
  gap: 8px;
}

/* Menu Mobile */
.mobile-menu-toggle {
  display: none;
  background: none;
  border: none;
  color: var(--text-1);
  cursor: pointer;
  z-index: 1001;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}
.mobile-menu-toggle:hover {
  background-color: var(--surface-2);
}
.nav-mobile {
  display: none;
  position: fixed;
  top: 72px; /* Abaixo do header */
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--surface-1);
  padding: 32px;
  flex-direction: column;
  gap: 12px;
  z-index: 1000;
  overflow-y: auto;
}
.nav-mobile a {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-2);
  text-decoration: none;
  padding: 12px 16px;
  transition: color 0.2s ease;
  border-radius: var(--radius-md);
}
.nav-mobile a:hover,
.nav-mobile a.active {
  color: var(--brand-500);
  background-color: var(--surface-2);
}
.mobile-dropdown {
    padding: 12px 16px;
}
.mobile-dropdown summary {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--text-2);
    cursor: pointer;
    list-style: none;
}
.mobile-dropdown summary::-webkit-details-marker {
    display: none;
}
.mobile-dropdown[open] > summary {
    color: var(--brand-500);
}
.mobile-dropdown[open] > summary .material-icons {
    transform: rotate(180deg);
}
.mobile-dropdown a {
    padding-left: 32px;
    font-size: 1rem;
    padding-top: 16px;
    padding-bottom: 8px;
}

.mobile-actions {
  margin-top: auto;
  padding-top: 32px;
  border-top: 1px solid var(--border);
  display: grid;
  gap: 16px;
}

/* Transições */
.dropdown-fade-enter-active, .dropdown-fade-leave-active {
    transition: opacity .2s ease, transform .2s ease;
}
.dropdown-fade-enter-from, .dropdown-fade-leave-to {
    opacity: 0;
    transform: translateY(10px) translateX(-50%);
}
.slide-fade-enter-active, .slide-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.slide-fade-enter-from, .slide-fade-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

/* Responsividade */
@media (max-width: 992px) {
  .nav-desktop, .actions-desktop {
    display: none;
  }
  .actions-mobile, .mobile-menu-toggle, .nav-mobile {
    display: flex;
  }
}
</style>
