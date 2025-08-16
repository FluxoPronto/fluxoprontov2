<template>
  <ModalBase :show="show" @close="close" :title="refund ? `Análise de Reembolso #${refund.transactionId}` : 'Carregando...'">
    <div v-if="refund" class="refund-details">
      <!-- Informações Gerais -->
      <div class="info-section">
        <h4 class="section-subtitle">Detalhes da Solicitação</h4>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">Usuário</span>
            <span class="value">{{ refund.user.name }}</span>
          </div>
          <div class="info-item">
            <span class="label">Valor</span>
            <span class="value amount">{{ refund.value }}</span>
          </div>
          <div class="info-item">
            <span class="label">Data</span>
            <span class="value">{{ refund.requestDate }}</span>
          </div>
          <div class="info-item">
            <span class="label">Status</span>
            <span class="status-badge" :class="`status-${refund.status.id}`">{{ refund.status.label }}</span>
          </div>
        </div>
      </div>

      <!-- Motivo e Evidências -->
      <div class="reason-section">
        <h4 class="section-subtitle">Motivo da Solicitação</h4>
        <p class="reason-text">"O fluxo de automação não está funcionando conforme descrito. Já tentei contato com o vendedor mas não obtive resposta. Segue em anexo um vídeo mostrando o erro."</p>
        <a href="#" class="evidence-link">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M15.5 2.75a.75.75 0 01.75.75v13a.75.75 0 01-1.5 0V3.5a.75.75 0 01.75-.75z" clip-rule="evenodd" /><path d="M8.25 4.5a.75.75 0 01.75.75v10a.75.75 0 01-1.5 0V5.25a.75.75 0 01.75-.75zM4.5 6.25a.75.75 0 01.75.75v6a.75.75 0 01-1.5 0V7a.75.75 0 01.75-.75zM12 2.75a.75.75 0 01.75.75v13a.75.75 0 01-1.5 0V3.5A.75.75 0 0112 2.75z" /></svg>
          Visualizar Evidência (video.mp4)
        </a>
      </div>

      <!-- Ações de Análise -->
      <div class="action-section">
        <h4 class="section-subtitle">Ações de Análise</h4>
        <div v-if="rejectionReasonVisible" class="rejection-form">
          <label for="rejection-reason">Motivo da Rejeição</label>
          <textarea 
            id="rejection-reason"
            v-model="rejectionReason"
            placeholder="Descreva o motivo para a rejeição do reembolso..."
          ></textarea>
        </div>
        <div class="button-group">
          <button type="button" class="btn btn-outline" @click="close">Cancelar</button>
          <button type="button" class="btn btn-danger" @click="handleRejection">
            {{ rejectionReasonVisible ? 'Confirmar Rejeição' : 'Rejeitar' }}
          </button>
          <button type="button" class="btn btn-success" @click="approve">Aprovar Reembolso</button>
        </div>
      </div>
    </div>
    <template #footer>
      <!-- Rodapé gerenciado na seção de ações -->
    </template>
  </ModalBase>
</template>

<script setup>
import { ref, watch } from 'vue';
import ModalBase from '@/components/ui/ModalBase.vue';

const props = defineProps({
  show: { type: Boolean, required: true },
  refund: { type: Object, default: () => null }
});

const emit = defineEmits(['close', 'approve', 'reject']);

const rejectionReasonVisible = ref(false);
const rejectionReason = ref('');

watch(() => props.show, (newVal) => {
  if (!newVal) {
    rejectionReasonVisible.value = false;
    rejectionReason.value = '';
  }
});

const close = () => emit('close');

const approve = () => {
  emit('approve', props.refund.id);
};

const handleRejection = () => {
  if (!rejectionReasonVisible.value) {
    rejectionReasonVisible.value = true;
    return;
  }
  if (rejectionReason.value.trim() === '') {
    alert('Por favor, insira um motivo para a rejeição.');
    return;
  }
  emit('reject', {
    refundId: props.refund.id,
    reason: rejectionReason.value
  });
};
</script>

<style scoped>
.refund-details {
  display: flex;
  flex-direction: column;
  gap: var(--space-7);
}
.section-subtitle {
  font-size: var(--font-size-3);
  font-weight: 600;
  color: var(--text-2);
  margin-bottom: var(--space-5);
  padding-bottom: var(--space-2);
  border-bottom: 1px solid var(--border);
}

/* Info Section */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--space-5);
}
.info-item { display: flex; flex-direction: column; }
.label { color: var(--text-3); font-size: var(--font-size-1); margin-bottom: var(--space-1); }
.value { color: var(--text-1); font-weight: 500; }
.value.amount { font-weight: 600; font-size: var(--font-size-4); color: var(--danger); }

/* Reason Section */
.reason-text {
  background-color: var(--surface-2);
  padding: var(--space-5);
  border-radius: var(--radius-md);
  line-height: 1.6;
  font-style: italic;
  color: var(--text-2);
  margin-bottom: var(--space-4);
}
.evidence-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  text-decoration: none;
  color: var(--brand-500);
  font-weight: 500;
  font-size: var(--font-size-2);
}
.evidence-link:hover { text-decoration: underline; }
.evidence-link svg { width: 20px; height: 20px; }

/* Action Section */
.action-section textarea {
  width: 100%;
  min-height: 80px;
  padding: var(--space-4);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-4);
  font-family: inherit;
  font-size: var(--font-size-2);
}
.button-group {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-4);
}
.btn {
  padding: 8px 16px;
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-outline { border-color: var(--border); }
.btn-danger { background-color: var(--danger); color: white; }
.btn-success { background-color: var(--success); color: white; }
</style>
