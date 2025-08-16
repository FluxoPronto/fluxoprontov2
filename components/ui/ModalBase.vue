<template>
  <Transition name="modal-fade">
    <div v-if="show" class="modal-backdrop" @click="close">
      <div class="modal-container" @click.stop>
        <header class="modal-header">
          <slot name="header">
            <h3 class="modal-title">{{ title }}</h3>
          </slot>
          <button type="button" class="btn-close" @click="close" aria-label="Fechar modal">
            <span class="material-icons-outlined">close</span>
          </button>
        </header>

        <section class="modal-body">
          <slot>
            <p>Conteúdo padrão do modal.</p>
          </slot>
        </section>

        <footer class="modal-footer">
          <slot name="footer">
            <button type="button" class="btn btn-outline" @click="close">
              Fechar
            </button>
          </slot>
        </footer>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: 'Modal Padrão'
  }
});

const emit = defineEmits(['close']);

const close = () => {
  emit('close');
};

const handleEsc = (e) => {
  if (e.key === 'Escape' && props.show) {
    close();
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleEsc);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleEsc);
});
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(10, 25, 47, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background: var(--surface-1);
  color: var(--text-1);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  width: 90vw;
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header,
.modal-footer,
.modal-body {
  padding: var(--space-6) var(--space-7);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border);
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 700;
}

.btn-close {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-3);
  padding: 4px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  transition: background-color 0.2s, color 0.2s;
}
.btn-close:hover {
  background-color: var(--surface-2);
  color: var(--text-1);
}

.modal-body {
  overflow-y: auto;
  flex-grow: 1;
}

.modal-footer {
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-container,
.modal-fade-leave-active .modal-container {
  transition: transform 0.3s ease;
}
.modal-fade-enter-from .modal-container,
.modal-fade-leave-to .modal-container {
  transform: scale(0.95) translateY(20px);
}
</style>
