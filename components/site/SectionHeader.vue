<template>
  <ClientOnly>
    <header class="section-head" :class="{ center: isCentered }" v-reveal>
      <h2 class="title">{{ title }}</h2>
      <p v-if="subtitle" class="subtitle field-hint">{{ subtitle }}</p>
    </header>
  </ClientOnly>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ title: string; subtitle?: string; center?: boolean }>()
const isCentered = computed(() => Boolean(props.center))
</script>

<style scoped>
.section-head { margin-bottom: 16px; }
.section-head.center { text-align: center; }
.title { font-size: clamp(1.5rem, 2.6vw, 2rem); }
.subtitle { margin-top: 6px; }
</style>


