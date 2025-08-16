<template>
  <section class="card" :class="{ elevate }">
    <header v-if="$slots.header || title" class="card-header">
      <h3 v-if="title" class="card-title">{{ title }}</h3>
      <div v-else><slot name="header" /></div>
      <div class="card-actions"><slot name="actions" /></div>
    </header>
    <div class="card-body">
      <slot />
    </div>
    <footer v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </footer>
  </section>
</template>

<script setup lang="ts">
// sem imports adicionais
const props = withDefaults(defineProps<{
  title?: string
  elevate?: boolean
}>(), {
  title: '',
  elevate: false,
})
</script>

<style scoped>
.card-body { display: grid; gap: 12px; }
.card-footer { margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border); }
.card-actions { margin-left: auto; display: inline-flex; gap: 8px; }
</style>


