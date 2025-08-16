<template>
  <section class="hero-section" :class="{ center: center }">
    <div class="hero-inner">
      <div class="hero-content">
        <span v-if="eyebrow" class="eyebrow">{{ eyebrow }}</span>
        <h1 class="title">{{ title }}</h1>
        <p v-if="subtitle" class="lead">{{ subtitle }}</p>
        <div v-if="$slots.cta" class="cta-group">
          <slot name="cta" />
        </div>
      </div>
      <div v-if="$slots.media" class="hero-media">
        <slot name="media" />
      </div>
      <div class="hero-bg-grid">
        <SquaresBackground class="bg-grid" :direction="'diagonal'" :speed="0.5" :squareSize="40" borderColor="#333" hoverFillColor="#222" :animated="animated" />
      </div>
    </div>
  </section>
  
</template>

<script setup>
import SquaresBackground from '@/components/ui/SquaresBackground.vue'

const props = defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  eyebrow: { type: String, default: '' },
  center: { type: Boolean, default: true },
  animated: { type: Boolean, default: true },
})
</script>

<style scoped>
.hero-section {
  position: relative;
  overflow: hidden;
  background-color: var(--surface-1);
}
.hero-inner {
  max-width: var(--container);
  margin: 0 auto;
  padding: clamp(96px, 10vw, 140px) 24px;
  position: relative;
}
.hero-content {
  position: relative;
  z-index: 2;
  max-width: 860px;
  margin: 0 auto;
  text-align: center;
}
.eyebrow {
  display: inline-block;
  font-size: 0.9rem;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 999px;
  background-color: var(--brand-100);
  color: var(--brand-700);
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.title {
  font-size: clamp(2.5rem, 5vw, 3.75rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.02em;
}
.lead {
  font-size: 1.2rem;
  color: var(--text-2);
  max-width: 720px;
  margin: 16px auto 0;
}
.cta-group {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 24px;
  flex-wrap: wrap;
}
.hero-media {
  position: relative;
  z-index: 2;
  margin-top: 40px;
}
.hero-bg-grid {
  position: absolute;
  inset: 0;
  z-index: 1;
  opacity: 0.6;
  mix-blend-mode: lighten;
}
.bg-grid { width: 100%; height: 100%; display: block; }

@media (min-width: 900px) {
  .hero-inner { display: grid; grid-template-columns: 1fr; gap: 32px; }
}

[data-theme="dark"] .eyebrow { background-color: rgba(129,140,248,0.12); color: var(--brand-300); }
</style>


