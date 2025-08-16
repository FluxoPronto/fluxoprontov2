<template>
  <ModalBase :show="show" @close="close" :title="ticket ? `Detalhes do Ticket #${ticket.id}` : 'Carregando...'">
    <div v-if="ticket" class="ticket-details">

      <!-- Informações do Ticket -->
      <div class="info-section">
        <h4 class="section-subtitle">Informações Gerais</h4>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">Assunto</span>
            <span class="value subject">{{ ticket.subject }}</span>
          </div>
          <div class="info-item">
            <span class="label">Usuário</span>
            <span class="value">{{ ticket.user }}</span>
          </div>
          <div class="info-item">
            <span class="label">Status</span>
            <span class="status-badge" :class="`status-${ticket.status.id}`">{{ ticket.status.label }}</span>
          </div>
        </div>
      </div>

      <!-- Histórico de Mensagens (Simulado) -->
      <div class="history-section">
        <h4 class="section-subtitle">Histórico da Conversa</h4>
        <div class="message-list">
          <div class="message user">
            <div class="message-bubble">
              <p>Olá, estou com um problema para acessar o conteúdo do fluxo "Automação de Vendas" que comprei. A página fica em branco.</p>
              <span class="timestamp">16/07/2024, 10:30</span>
            </div>
          </div>
          <div v-if="ticket.status.id === 'answered'" class="message admin">
            <div class="message-bubble">
              <p>Olá, {{ ticket.user }}. Verificamos o seu acesso e parece estar tudo normal. Poderia tentar limpar o cache do seu navegador e acessar novamente, por favor?</p>
              <span class="timestamp">16/07/2024, 11:15</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Ações do Admin -->
      <div class="action-section">
        <h4 class="section-subtitle">Responder e Gerenciar</h4>
        <textarea v-model="responseText" placeholder="Escreva sua resposta aqui..."></textarea>
        <div class="button-group">
          <button class="btn btn-primary" @click="handleAction('respond')">Enviar Resposta</button>
          <button class="btn btn-secondary" @click="handleAction('forward')">Encaminhar ao Vendedor</button>
          <button class="btn btn-success" @click="handleAction('resolve')">Marcar como Resolvido</button>
          <button class="btn btn-warning" @click="handleAction('escalate')">Escalar para Admin Supremo</button>
        </div>
      </div>
    </div>
    <template #footer>
      <button type="button" class="btn btn-outline" @click="close">Fechar</button>
    </template>
  </ModalBase>
</template>

<script setup>
import { ref } from 'vue';
import ModalBase from '@/components/ui/ModalBase.vue';

const props = defineProps({
  show: { type: Boolean, required: true },
  ticket: { type: Object, default: () => null }
});

const emit = defineEmits(['close', 'action']);

const responseText = ref('');

const close = () => {
  emit('close');
};

const handleAction = (actionType) => {
  emit('action', {
    action: actionType,
    ticketId: props.ticket.id,
    text: responseText.value
  });
  responseText.value = ''; // Limpa o campo de texto após a ação
};
</script>

<style scoped>
/* Estilos gerais */
.ticket-details {
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
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-5);
}
.info-item {
  display: flex;
  flex-direction: column;
}
.label {
  color: var(--text-3);
  font-size: var(--font-size-1);
  margin-bottom: var(--space-1);
}
.value {
  color: var(--text-1);
  font-weight: 500;
}
.value.subject {
  font-weight: 600;
  font-size: var(--font-size-3);
}

/* Histórico */
.message-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  max-height: 200px;
  overflow-y: auto;
  padding: var(--space-2);
}
.message {
  display: flex;
}
.message.user {
  justify-content: flex-start;
}
.message.admin {
  justify-content: flex-end;
}
.message-bubble {
  max-width: 80%;
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  line-height: 1.6;
}
.message.user .message-bubble {
  background-color: var(--surface-2);
  border-top-left-radius: var(--radius-sm);
}
.message.admin .message-bubble {
  background-color: var(--brand-50);
  color: var(--brand-800);
  border-top-right-radius: var(--radius-sm);
}
.timestamp {
  display: block;
  text-align: right;
  font-size: var(--font-size-0);
  margin-top: var(--space-2);
  color: var(--text-3);
}

/* Ações */
.action-section textarea {
  width: 100%;
  min-height: 100px;
  padding: var(--space-4);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-4);
  font-family: inherit;
  font-size: var(--font-size-2);
}
.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.btn {
  padding: 8px 16px;
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary { background-color: var(--brand-500); color: white; }
.btn-primary:hover { background-color: var(--brand-600); }
.btn-secondary { background-color: var(--surface-2); color: var(--text-2); border-color: var(--border); }
.btn-secondary:hover { background-color: var(--surface-3); }
.btn-success { background-color: var(--success); color: white; }
.btn-success:hover { background-color: #15803d; }
.btn-warning { background-color: var(--warning); color: var(--text-1); }
.btn-warning:hover { background-color: #d99f0b; }
.btn-outline { border-color: var(--border); }
</style>
