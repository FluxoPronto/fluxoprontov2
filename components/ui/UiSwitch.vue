<template>
  <label class="ui-switch">
    <input type="checkbox" :checked="modelValue" @change="$emit('update:modelValue', $event.target.checked)">
    <span class="slider"></span>
  </label>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
});
defineEmits(['update:modelValue']);
</script>

<style scoped>
.ui-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 28px;
}

.ui-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--surface-3);
  transition: .3s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .3s;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

input:checked + .slider {
  background: var(--gradient-brand);
}

input:focus + .slider {
  box-shadow: 0 0 0 3px var(--brand-100);
}

input:checked + .slider:before {
  transform: translateX(22px);
}
</style>


