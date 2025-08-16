<template>
  <div class="q-and-a-wrapper">
    <h2 class="section-title">Perguntas sobre este Produto</h2>
    
    <div class="q-and-a-content">
      <div class="ask-question-box">
        <UiInput 
          v-model="newQuestion"
          placeholder="Tire sua dúvida aqui... (não inclua dados de contato)"
          class="question-input"
        />
        <UiButton :disabled="!newQuestion.trim()">Enviar Pergunta</UiButton>
      </div>

      <div class="search-box">
        <UiInput 
          v-model="searchTerm"
          placeholder="Buscar em perguntas existentes..."
          class="search-input"
        />
      </div>

      <div class="questions-list">
        <div v-for="item in filteredQa" :key="item.id" class="qa-item">
          <div class="question">
            <span class="q-icon material-icons">help_outline</span>
            <p>{{ item.question }}</p>
          </div>
          <div class="answer">
            <span class="a-icon material-icons">chat_bubble_outline</span>
            <p>{{ item.answer }}</p>
            <span class="answer-byline">- Resposta do vendedor</span>
          </div>
        </div>
        <p v-if="!filteredQa.length" class="no-results">Nenhuma pergunta encontrada. Seja o primeiro a perguntar!</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import UiInput from '@/components/ui/UiInput.vue';
import UiButton from '@/components/ui/UiButton.vue';

const props = defineProps({
  qaList: {
    type: Array,
    required: true,
    default: () => []
  }
});

const newQuestion = ref('');
const searchTerm = ref('');

const filteredQa = computed(() => {
  if (!searchTerm.value.trim()) {
    return props.qaList;
  }
  return props.qaList.filter(item => 
    item.question.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});
</script>

<style scoped>
.q-and-a-wrapper {
  background-color: var(--surface-1);
  padding: 40px;
  border-radius: var(--radius-xl);
  border: 1px solid var(--border);
}
.section-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 32px;
  color: var(--text-1);
}
.ask-question-box {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}
.search-box {
  margin-bottom: 32px;
}
.questions-list {
  display: grid;
  gap: 24px;
}
.qa-item {
  display: grid;
  gap: 16px;
  padding: 20px;
  background-color: var(--surface-2);
  border-radius: var(--radius-lg);
  border-left: 4px solid var(--brand-500);
}
.question, .answer {
  display: flex;
  gap: 12px;
}
.question p, .answer p {
  margin: 0;
  line-height: 1.6;
  color: var(--text-2);
}
.question .q-icon {
  color: var(--brand-400);
  margin-top: 2px;
}
.answer {
  padding-left: 36px;
  position: relative;
}
.answer .a-icon {
  position: absolute;
  left: 0;
  top: 4px;
  color: var(--text-3);
}
.answer .answer-byline {
  display: block;
  width: 100%;
  text-align: right;
  font-size: 0.85rem;
  color: var(--text-3);
  font-style: italic;
  margin-top: 8px;
}
.no-results {
  text-align: center;
  color: var(--text-3);
  padding: 24px;
}
</style>
