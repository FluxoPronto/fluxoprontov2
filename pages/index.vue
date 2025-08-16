<template>
  <div class="home-page">
    <!-- SEÇÃO HERO -->
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

function addToCart(p) { add({ id: p.id, title: p.title, price: p.price }) }
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
</style>
