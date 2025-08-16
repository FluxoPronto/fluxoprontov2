<template>
  <div class="testimonials-wrapper">
    <div class="image-stack-container">
      <div class="image-stack">
        <Transition name="stack-one" mode="out-in">
          <div :key="founders[activeFounder].name" class="stack-item">
            <img :src="founders[activeFounder].image" :alt="founders[activeFounder].name" draggable="false" />
          </div>
        </Transition>
      </div>
    </div>
    <div class="testimonial-content">
      <Transition name="fade-up" mode="out-in">
        <div :key="activeFounder">
          <p class="quote">"{{ founders[activeFounder].quote }}"</p>
          <h3 class="name">{{ founders[activeFounder].name }}</h3>
          <p class="role">{{ founders[activeFounder].role }}</p>
        </div>
      </Transition>
      <div class="navigation-buttons">
        <button @click="handlePrev" class="nav-button" aria-label="Anterior">
          <span class="material-icons">arrow_back</span>
        </button>
        <button @click="handleNext" class="nav-button" aria-label="Próximo">
          <span class="material-icons">arrow_forward</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const tiagoImg = new URL('@/assets/images/tiago-brito.png', import.meta.url).href
const israelImg = new URL('@/assets/images/israel-martins.png', import.meta.url).href
const leonardoImg = new URL('@/assets/images/leonardo-castro.png', import.meta.url).href

const founders = ref([
  {
    quote: "Minha paixão é descomplicar o complexo. A FluxoPronto prova que automação de ponta pode ser acessível — libertando o potencial de cada indivíduo e empresa.",
    name: 'Tiago Brito',
    role: 'Cofundador & Diretor de Inovação em Automação',
    image: tiagoImg,
  },
  {
    quote: "O verdadeiro sucesso nasce da colaboração. Estamos construindo um ecossistema vibrante onde cada membro prospera com insights e oportunidades únicas.",
    name: 'Israel Martins',
    role: 'Cofundador & Estrategista de Expansão',
    image: israelImg,
  },
  {
    quote: "Cada linha de código é um compromisso com a excelência. Garantimos automações robustas e confiáveis que entregam resultados reais e duradouros.",
    name: 'Leonardo Castro',
    role: 'Cofundador & Mestre da Excelência Técnica',
    image: leonardoImg,
  },
]);

const activeFounder = ref(0);

const handleNext = () => {
  activeFounder.value = (activeFounder.value + 1) % founders.value.length;
};

const handlePrev = () => {
  activeFounder.value = (activeFounder.value - 1 + founders.value.length) % founders.value.length;
};

const isActive = (index) => index === activeFounder.value;
</script>

<style scoped>
.testimonials-wrapper {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-8);
  align-items: center;
  margin-top: var(--space-8);
}

@media (min-width: 768px) {
  .testimonials-wrapper {
    grid-template-columns: 1fr 1fr;
  }
}

.image-stack-container {
  position: relative;
  min-height: 400px;
  display: grid;
  place-items: center;
  perspective: 1000px;
}

.image-stack {
  position: relative;
  width: 300px;
  height: 300px;
}

.stack-item {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  will-change: transform, opacity;
}

.stack-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Animações (200–300ms) para um item por vez */
.stack-one-enter-active, .stack-one-leave-active { transition: transform 0.25s ease, opacity 0.25s ease; }
.stack-one-enter-from { opacity: 0; transform: scale(0.96) translateY(10px); }
.stack-one-leave-to { opacity: 0; transform: scale(1.02) translateY(-8px); }


.testimonial-content {
  text-align: left;
}

.quote {
  font-size: var(--font-size-4);
  font-weight: 500;
  line-height: 1.6;
  margin-bottom: var(--space-5);
  min-height: 140px; /* Evita pulos de layout */
}

.name {
  font-size: var(--font-size-3);
  font-weight: 700;
  color: var(--text-1);
}

.role {
  color: var(--text-3);
  font-size: var(--font-size-2);
}

.navigation-buttons {
  display: flex;
  gap: var(--space-4);
  margin-top: var(--space-6);
}

.nav-button {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: var(--surface-2);
  border: 1px solid var(--border);
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
}

.nav-button:hover {
  background-color: var(--surface-3);
  transform: scale(1.05);
  box-shadow: var(--shadow-sm);
}

.nav-button .material-icons {
  color: var(--text-2);
}

/* Animação do texto */
.fade-up-enter-active, .fade-up-leave-active { transition: opacity 0.25s ease, transform 0.25s ease; }

.fade-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

@media (prefers-reduced-motion: reduce) {
  .stack-one-enter-active, .stack-one-leave-active,
  .fade-up-enter-active, .fade-up-leave-active,
  .nav-button { transition: none; }
}
</style>
