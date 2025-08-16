<template>
  <ModalBase :show="show" @close="close" title="Análise e Curadoria de Fluxo">
    <div v-if="flow" class="curation-modal-content">
      
      <!-- Cabeçalho com Título e Status -->
      <header class="modal-header">
        <div>
          <h3 class="flow-title">{{ flow.name }}</h3>
          <p class="flow-vendor">Enviado por: <strong>{{ flow.vendorName }}</strong></p>
        </div>
        <div :class="['status-pill', `status-${flow.status.id}`]">
          {{ flow.status.label }}
        </div>
      </header>

      <!-- Layout Principal -->
      <div class="main-layout">
        <!-- Coluna de Informações -->
        <div class="info-column">
          <UiCard class="info-card">
            <h4 class="card-title">Detalhes do Produto</h4>
            <ul class="info-list">
              <li>
                <span class="label">Categoria</span>
                <span class="value">{{ flow.category }}</span>
              </li>
              <li>
                <span class="label">Preço de Venda</span>
                <span class="value price">{{ flow.price }}</span>
              </li>
              <li>
                <span class="label">ID do Fluxo</span>
                <span class="value">#{{ flow.id }}</span>
              </li>
            </ul>
          </UiCard>
        </div>

        <!-- Coluna de Análise de Conteúdo -->
        <div class="content-column">
          <UiCard class="content-card">
            <h4 class="card-title">Materiais para Análise</h4>
            <div class="materials-grid">
              <a v-for="doc in documents" :key="doc.name" :href="doc.url" target="_blank" class="material-card">
                <div class="material-icon" v-html="doc.icon"></div>
                <span class="material-name">{{ doc.name }}</span>
                <span class="material-action">
                  Visualizar
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"><path d="M6.22 8.72a.75.75 0 001.06 1.06l3.25-3.25a.75.75 0 00-1.06-1.06L7 8.19 6.22 8.72z" /><path d="M2.5 3.5A1.5 1.5 0 014 2h8a1.5 1.5 0 011.5 1.5v9a1.5 1.5 0 01-1.5 1.5H7.879a.75.75 0 01-.53-.22L4.22 9.157a.75.75 0 010-1.06l3.129-3.129A.75.75 0 018.414 5H12.5a.25.25 0 00.25-.25V3.5a.25.25 0 00-.25-.25H4a.25.25 0 00-.25.25v2.5c0 .138.112.25.25.25h3.328a.75.75 0 01.53.22L11.5 9.684v2.576a.25.25 0 00.25.25h1.5a.25.25 0 00.25-.25v-2.5a.25.25 0 00-.25-.25H8.864a.75.75 0 01-.53-.22L5.205 6.079A.75.75 0 015.735 5H4a.25.25 0 00-.25.25v2.5c0 .138.112.25.25.25h.285a.75.75 0 01.53.22l2.215 2.215a.75.75 0 010 1.06l-2.215 2.215a.75.75 0 01-.53.22H4.25a.25.25 0 00-.25.25v.516c0 .138.112.25.25.25h.536a.75.75 0 01.53.22l2.121 2.121a.75.75 0 001.06 0l2.121-2.121a.75.75 0 01.53-.22H12.5a.25.25 0 00.25-.25v-2.5a.25.25 0 00-.25-.25h-1.5a.25.25 0 00-.25.25v2.576L8.828 9.684a.75.75 0 01-1.06 0L4.646 6.566A.75.75 0 015.177 5H8.5a.25.25 0 00.25-.25V3.5A.25.25 0 008.5 3.25H4a1.25 1.25 0 00-1.25 1.25v9a1.25 1.25 0 001.25 1.25h8a1.25 1.25 0 001.25-1.25v-9a1.25 1.25 0 00-1.25-1.25H2.5z" /></svg>
                </span>
              </a>
            </div>
          </UiCard>
        </div>
      </div>

      <!-- Ações de Curadoria -->
      <div class="curation-actions">
        <transition name="fade">
          <div v-if="rejectionReasonVisible" class="rejection-form">
            <label for="rejection-reason">Motivo da Rejeição</label>
            <textarea
              id="rejection-reason"
              v-model="rejectionReason"
              placeholder="Descreva claramente o motivo para a rejeição do fluxo..."
            ></textarea>
          </div>
        </transition>
        <div class="action-buttons">
          <button type="button" class="btn btn-outline" @click="close">Cancelar</button>
          <button
            type="button"
            class="btn btn-danger"
            @click="handleRejection"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" /></svg>
            {{ rejectionReasonVisible ? 'Confirmar Rejeição' : 'Rejeitar' }}
          </button>
          <button type="button" class="btn btn-success" @click="handleApproval">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" /></svg>
            Aprovar
          </button>
        </div>
      </div>
    </div>
    <template #footer>
      <!-- O rodapé é controlado pela seção de ações de curadoria -->
    </template>
  </ModalBase>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import ModalBase from '@/components/ui/ModalBase.vue';
import UiCard from '@/components/ui/UiCard.vue';

const props = defineProps({
  show: { type: Boolean, required: true },
  flow: { type: Object, default: () => null }
});

const emit = defineEmits(['close', 'approve', 'reject']);

const rejectionReasonVisible = ref(false);
const rejectionReason = ref('');

const documents = computed(() => [
  { name: 'Arquivo JSON', url: '#', icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>` },
  { name: 'Vídeo Explicativo', url: '#', icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>` },
  { name: 'Imagens', url: '#', icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>` },
  { name: 'Documentação', url: '#', icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>` }
]);


const close = () => {
  emit('close');
};

const handleApproval = () => {
  emit('approve', props.flow.id);
  close();
};

const handleRejection = () => {
  if (!rejectionReasonVisible.value) {
    rejectionReasonVisible.value = true;
    return;
  }
  if (rejectionReason.value.trim()) {
    emit('reject', { flowId: props.flow.id, reason: rejectionReason.value });
    close();
  } else {
    // Adicionar um feedback visual para o usuário
    alert('Por favor, forneça um motivo para a rejeição.');
  }
};

// Resetar o estado do formulário de rejeição quando o modal for fechado ou reaberto
watch(() => props.show, (newVal) => {
  if (!newVal) {
    setTimeout(() => {
      rejectionReasonVisible.value = false;
      rejectionReason.value = '';
    }, 300); // Aguarda a animação de fechamento do modal
  }
});
</script>

<style scoped>
.curation-modal-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--border);
}

.flow-title {
  font-size: var(--font-size-5);
  font-weight: 600;
  color: var(--text-1);
  margin: 0;
}

.flow-vendor {
  font-size: var(--font-size-2);
  color: var(--text-3);
  margin-top: var(--space-1);
}

.status-pill {
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-full);
  font-weight: 500;
  font-size: var(--font-size-2);
  white-space: nowrap;
}
.status-pill.status-approved { background-color: var(--success-bg); color: var(--success-text); }
.status-pill.status-pending { background-color: var(--info-bg); color: var(--info-text); }
.status-pill.status-rejected { background-color: var(--danger-bg); color: var(--danger-text); }

.main-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-6);
}

.card-title {
  font-size: var(--font-size-3);
  font-weight: 600;
  color: var(--text-1);
  margin-bottom: var(--space-4);
}

.info-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
.info-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.info-list .label {
  color: var(--text-3);
  font-size: var(--font-size-2);
}
.info-list .value {
  color: var(--text-1);
  font-weight: 500;
  font-size: var(--font-size-2);
}
.info-list .price {
  font-size: var(--font-size-4);
  font-weight: 600;
  color: var(--success-text);
}

.materials-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}

.material-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-5);
  background-color: var(--surface-2);
  border-radius: var(--radius-lg);
  text-decoration: none;
  transition: all 0.2s ease;
}
.material-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  background-color: var(--surface-3);
}

.material-icon {
  width: 32px;
  height: 32px;
  color: var(--brand-500);
}
.material-icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.material-name {
  font-size: var(--font-size-2);
  font-weight: 500;
  color: var(--text-1);
}

.material-action {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--font-size-1);
  color: var(--text-3);
}
.material-action svg {
  width: 12px;
  height: 12px;
}

.curation-actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.rejection-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.rejection-form label {
  font-weight: 500;
  color: var(--text-2);
}
.rejection-form textarea {
  width: 100%;
  min-height: 80px;
  padding: var(--space-3);
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  background-color: var(--surface-1);
  resize: vertical;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  padding-top: var(--space-4);
  border-top: 1px solid var(--border);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-outline {
  background-color: transparent;
  border-color: var(--border);
  color: var(--text-2);
}
.btn-outline:hover {
  background-color: var(--surface-2);
  color: var(--text-1);
}
.btn-danger {
  background-color: var(--danger-bg);
  color: var(--danger-text);
}
.btn-danger:hover {
  background-color: var(--danger-hover-bg);
}
.btn-success {
  background-color: var(--success-bg);
  color: var(--success-text);
}
.btn-success:hover {
  background-color: var(--success-hover-bg);
}
.btn svg {
  width: 16px;
  height: 16px;
}

/* Responsividade */
@media (max-width: 768px) {
  .main-layout {
    grid-template-columns: 1fr;
  }
  .modal-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-3);
  }
  .action-buttons {
    flex-direction: column;
  }
  .btn {
    width: 100%;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
