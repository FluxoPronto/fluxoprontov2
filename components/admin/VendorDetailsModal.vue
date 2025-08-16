<template>
  <ModalBase :show="show" @close="close" :title="vendor ? `Detalhes de ${vendor.name}` : 'Carregando...'">
    <div v-if="vendor" class="vendor-details">
      <!-- Seção de Informações Cadastrais -->
      <div class="info-section">
        <h4 class="section-subtitle">Informações Cadastrais</h4>
        <ul class="info-list">
          <li><strong>Nome Completo:</strong> <span>{{ vendor.name }}</span></li>
          <li><strong>E-mail:</strong> <span>{{ vendor.email }}</span></li>
          <li><strong>Data de Cadastro:</strong> <span>{{ vendor.joinDate }}</span></li>
          <li><strong>Status Primefy:</strong> 
            <span class="status-badge" :class="`status-${vendor.status.id}`">
              {{ vendor.status.label }}
            </span>
          </li>
        </ul>
      </div>

      <!-- Seção de Reprovação (se aplicável) -->
      <div v-if="vendor.status.id === 'rejected'" class="rejection-section">
        <h4 class="section-subtitle">Motivo da Reprovação (Primefy)</h4>
        <p class="rejection-reason">
          "A documentação enviada não atende aos critérios de verificação. Consulte a plataforma Primefy para mais detalhes."
        </p>
      </div>
    </div>
    <template #footer>
      <div class="modal-actions">
        <button type="button" class="btn btn-outline" @click="close">Fechar</button>
      </div>
    </template>
  </ModalBase>
</template>

<script setup>
import ModalBase from '@/components/ui/ModalBase.vue';

const props = defineProps({
  show: { type: Boolean, required: true },
  vendor: { type: Object, default: () => null }
});

const emit = defineEmits(['close']);

const close = () => emit('close');
</script>

<style scoped>
/* Estilos existentes do modal podem ser mantidos, mas a seção de documentos e seus estilos específicos não são mais necessários */

.vendor-details {
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

/* Informações */
.info-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}
.info-list li {
  display: flex;
  flex-direction: column;
  background-color: var(--surface-2);
  padding: var(--space-4);
  border-radius: var(--radius-md);
}
.info-list strong {
  color: var(--text-3);
  font-size: var(--font-size-1);
  margin-bottom: var(--space-1);
}
.info-list span {
  color: var(--text-1);
  font-weight: 500;
}

/* Motivo Reprovação */
.rejection-section {
  background-color: rgba(225, 29, 72, 0.05);
  border-left: 4px solid var(--danger);
  padding: var(--space-5);
  border-radius: var(--radius-md);
}
.rejection-reason {
  color: var(--danger);
  line-height: 1.6;
}

/* Ações do Footer */
.modal-actions {
  display: flex;
  justify-content: flex-end;
  width: 100%;
}
</style>
