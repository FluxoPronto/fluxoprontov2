<template>
  <label class="field">
    <span v-if="label" class="field-label">{{ label }}</span>
    <input
      class="input"
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      v-bind="$attrs"
    />
    <small v-if="hint && !error" class="field-hint">{{ hint }}</small>
    <small v-if="error" class="field-error">{{ error }}</small>
  </label>
</template>

<script setup lang="ts">
defineEmits(['update:modelValue'])
withDefaults(defineProps<{
  modelValue?: string
  label?: string
  type?: string
  placeholder?: string
  hint?: string
  error?: string
}>(), {
  modelValue: '',
  label: '',
  type: 'text',
  placeholder: '',
  hint: '',
  error: '',
})
</script>

<style scoped>
/* classes herdadas do main.css */
</style>


