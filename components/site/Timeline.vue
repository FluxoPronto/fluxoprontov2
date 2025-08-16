<template>
  <div class="timeline-wrapper" ref="containerRef">
    <div class="timeline-line-track"></div>
    <div class="timeline-line-progress" :style="{ height: progressHeight }"></div>
    
    <div class="timeline-content">
      <div 
        v-for="(item, index) in items" 
        :key="index" 
        class="timeline-item"
        ref="itemRefs"
      >
        <div class="timeline-milestone">
          <div class="milestone-icon-wrapper">
            <span class="material-icons">{{ item.icon || 'check_circle' }}</span>
          </div>
        </div>
        <div class="timeline-item-content">
          <div class="item-content-card">
            <h3 class="item-title">{{ item.title }}</h3>
            <!-- Renderização Híbrida: Slot ou Prop -->
            <div v-if="$slots[`item-${index}`]">
              <slot :name="`item-${index}`"></slot>
            </div>
            <p v-else-if="item.description" class="item-description">{{ item.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, useSlots } from 'vue';

const props = defineProps({
  items: {
    type: Array,
    required: true,
    default: () => []
  }
});

const slots = useSlots();
const containerRef = ref(null);
const itemRefs = ref([]);
const progressHeight = ref('0px');
let observer = null;

const updateProgressLine = () => {
  requestAnimationFrame(() => {
    if (!containerRef.value) return;
    
    const lastVisibleItem = [...itemRefs.value].reverse().find(item => item.classList.contains('is-visible'));
    
    if (lastVisibleItem) {
      const containerTop = containerRef.value.getBoundingClientRect().top + window.scrollY;
      const milestoneCenter = lastVisibleItem.querySelector('.timeline-milestone').getBoundingClientRect().top + window.scrollY + 24;
      const height = milestoneCenter - containerTop;
      progressHeight.value = `${Math.max(0, height)}px`;
    }
  });
};

const observerCallback = (entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
    }
  });
  updateProgressLine();
};

onMounted(() => {
  if (typeof IntersectionObserver === 'undefined') return;

  observer = new IntersectionObserver(observerCallback, {
    root: null,
    threshold: 0.5,
  });

  itemRefs.value.forEach(item => {
    if (item) observer.observe(item);
  });
  
  window.addEventListener('scroll', updateProgressLine);
  window.addEventListener('resize', updateProgressLine);
});

onUnmounted(() => {
  if (observer) {
    itemRefs.value.forEach(item => {
      if (item) observer.unobserve(item);
    });
  }
  window.removeEventListener('scroll', updateProgressLine);
  window.removeEventListener('resize', updateProgressLine);
});
</script>

<style scoped>
/* Estilos permanecem os mesmos, apenas a lógica do template e script foram ajustadas */
.timeline-wrapper {
  position: relative;
  max-width: 700px;
  margin: var(--space-8) auto;
  padding: 0 var(--space-4);
}

.timeline-line-track, .timeline-line-progress {
  position: absolute;
  left: 24px;
  top: 0;
  bottom: 0;
  width: 3px;
  transform: translateX(-50%);
}

.timeline-line-track {
  background-color: var(--surface-2);
  height: 100%;
}

.timeline-line-progress {
  background: var(--gradient-brand);
  height: 0;
  transition: height 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}

.timeline-content {
  display: grid;
  gap: var(--space-7);
}

.timeline-item {
  display: grid;
  grid-template-columns: 48px 1fr;
  gap: var(--space-5);
  align-items: flex-start; /* Alinhado ao topo para conteúdo de altura variável */
  opacity: 0;
  transform: translateX(20px);
  transition: opacity 0.25s ease-out, transform 0.25s ease-out;
}

.timeline-item.is-visible {
  opacity: 1;
  transform: translateX(0);
}

.milestone-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: var(--surface-1);
  border: 2px solid var(--border);
  z-index: 1;
  transition: transform 0.2s ease, border-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 0 0 4px var(--surface-1);
}

.is-visible .milestone-icon-wrapper {
  border-color: var(--brand-500);
  color: var(--brand-500);
  box-shadow: 0 0 0 4px var(--surface-1), 0 6px 18px rgba(0,0,0,0.06);
}

.milestone-icon-wrapper .material-icons {
  font-size: 24px;
  transition: transform 0.2s ease;
}
.is-visible .milestone-icon-wrapper .material-icons {
  transform: scale(1.1);
}

.item-content-card {
  background: var(--surface-2);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  border: 1px solid transparent;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.is-visible .item-content-card {
  border-color: var(--border);
  box-shadow: var(--shadow-sm);
}

.item-title {
  font-size: var(--font-size-3);
  font-weight: 700;
  margin-bottom: var(--space-4); /* Mais espaço para o conteúdo abaixo */
}

.item-description {
  color: var(--text-2);
  line-height: 1.6;
}

@media (max-width: 768px) {
  .timeline-line-track, .timeline-line-progress {
    left: 24px;
  }
  .timeline-item {
    grid-template-columns: 48px 1fr;
    gap: var(--space-4);
  }
}

@media (hover: hover) {
  .timeline-item:hover .item-content-card { transform: translateY(-2px); box-shadow: var(--shadow-md); }
  .timeline-item:hover .milestone-icon-wrapper { transform: scale(1.04); }
}

@media (prefers-reduced-motion: reduce) {
  .timeline-item, .milestone-icon-wrapper, .item-content-card { transition: none !important; }
}
</style>
