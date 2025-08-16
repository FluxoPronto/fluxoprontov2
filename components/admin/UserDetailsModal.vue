<template>
  <ModalBase :show="show" @close="close" :title="user ? `Gerenciar Usuário: ${user.name}` : 'Carregando...'">
    <div v-if="localUser" class="user-details">

      <!-- Informações do Usuário -->
      <div class="info-section">
        <div class="user-header">
          <img :src="localUser.avatar" alt="Avatar" class="avatar-large" />
          <div class="user-info">
            <span class="user-name">{{ localUser.name }}</span>
            <span class="user-email">{{ localUser.email }}</span>
            <span class="join-date">Membro desde: {{ localUser.joinDate }}</span>
          </div>
        </div>
      </div>

      <!-- Formulário de Gerenciamento -->
      <div class="management-form">
        <h4 class="section-subtitle">Permissões e Status</h4>
        <div class="form-grid">
          <div class="form-group">
            <label for="user-role">Tipo de Perfil</label>
            <select id="user-role" v-model="localUser.role.id">
              <option value="buyer">Comprador</option>
              <option value="vendor">Vendedor</option>
              <option value="admin">Admin Normal</option>
            </select>
          </div>
          <div class="form-group">
            <label for="user-status">Status da Conta</label>
            <select id="user-status" v-model="localUser.status.id">
              <option value="active">Ativo</option>
              <option value="suspended">Suspenso</option>
              <option value="banned">Banido</option>
            </select>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="modal-actions">
        <button type="button" class="btn btn-outline" @click="close">Cancelar</button>
        <button type="button" class="btn btn-primary" @click="saveChanges">Salvar Alterações</button>
      </div>
    </template>
  </ModalBase>
</template>

<script setup>
import { ref, watch } from 'vue';
import ModalBase from '@/components/ui/ModalBase.vue';

const props = defineProps({
  show: { type: Boolean, required: true },
  user: { type: Object, default: () => null }
});

const emit = defineEmits(['close', 'save']);

const localUser = ref(null);

watch(() => props.user, (newUser) => {
  if (newUser) {
    // Clona o objeto do usuário para evitar mutação direta da prop
    localUser.value = JSON.parse(JSON.stringify(newUser));
  } else {
    localUser.value = null;
  }
}, { immediate: true });

const close = () => emit('close');

const saveChanges = () => {
  if (localUser.value) {
    emit('save', localUser.value);
  }
};
</script>

<style scoped>
.user-details {
  display: flex;
  flex-direction: column;
  gap: var(--space-7);
}

.section-subtitle {
  font-size: var(--font-size-3);
  font-weight: 600;
  color: var(--text-2);
  margin-bottom: var(--space-5);
}

/* Info Section */
.user-header {
  display: flex;
  align-items: center;
  gap: var(--space-6);
  background-color: var(--surface-2);
  padding: var(--space-6);
  border-radius: var(--radius-lg);
}
.avatar-large {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--surface-1);
  box-shadow: var(--shadow-sm);
}
.user-name {
  font-size: var(--font-size-5);
  font-weight: 700;
  color: var(--text-1);
}
.user-email {
  color: var(--text-3);
  font-size: var(--font-size-2);
}
.join-date {
  color: var(--text-3);
  font-size: var(--font-size-1);
  margin-top: var(--space-2);
}

/* Management Form */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-6);
}
.form-group {
  display: flex;
  flex-direction: column;
}
.form-group label {
  font-size: var(--font-size-2);
  font-weight: 500;
  color: var(--text-2);
  margin-bottom: var(--space-2);
}
.form-group select {
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  font-size: var(--font-size-2);
  color: var(--text-1);
  background-color: var(--surface-1);
  -webkit-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
}

/* Footer Actions */
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-4);
  width: 100%;
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
.btn-primary { background-color: var(--brand-500); color: white; }
</style>
