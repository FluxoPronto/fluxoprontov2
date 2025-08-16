<template>
  <button
    :class="[
      'btn',
      variantClass,
      sizeClass,
      { 'btn-block': block }
    ]"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <slot />
  </button>
  
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = withDefaults(defineProps<{
  variant?: 'primary' | 'accent' | 'dark' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  block?: boolean
  disabled?: boolean
}>(), {
  variant: 'primary',
  size: 'md',
  block: false,
  disabled: false,
})

const variantClass = computed(() => {
  return `btn-${props.variant}`
})

const sizeClass = computed(() => {
  return props.size === 'sm' ? 'btn-sm' : props.size === 'lg' ? 'btn-lg' : ''
})
</script>

<style scoped>
/* utiliza classes globais do main.css */
</style>


