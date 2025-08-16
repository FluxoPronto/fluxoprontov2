<template>
  <div class="container">
    <div class="content-wrapper">
      <div class="modal-header" style="margin-bottom: 1rem;border-radius: 10px;">
        <h2 class="modal-title">Todas as Seleções - {{ allSelections.length }}</h2>
      </div>

      <div class="buttons-container">
        <div style="display: flex;align-items: center;justify-content: space-between;width: 100%;gap: 20px;">
          <!-- Normais Button -->
          <button @click="addNormais" class="main-button normais-button">
            <div class="button-content">
              <img src="https://cdn-icons-png.flaticon.com/512/1448/1448911.png" width="100" />
              <div v-if="normaisCount > 0" class="counter-badge green">{{ normaisCount }}</div>
            </div>
          </button>

          <!-- Anormais Button -->
          <button @click="toggleAnormais" class="main-button anormais-button">
            <div class="button-content">
              <img src="https://cdn-icons-png.flaticon.com/512/1579/1579432.png" width="100" />
              <div v-if="anormaisGroupCount > 0" class="counter-badge red">{{ anormaisGroupCount }}</div>
            </div>
          </button>

          <!-- Mobilidade Button -->
          <button @click="toggleMobilidade" class="main-button mobilidade-button">
            <div class="button-content">
              <img src="https://cdn-icons-png.flaticon.com/512/2942/2942813.png" width="100" />
              <div v-if="mobilidadeGroupCount > 0" class="counter-badge blue">{{ mobilidadeGroupCount }}</div>
            </div>
          </button>
        </div>

        <!-- Anormais Options -->
        <div v-if="showAnormaisOptions" class="anormais-section">
          <pre style="text-align: center;margin: 0 0 1rem 0;font-size: medium;">Anomalias</pre>
          <div v-if="tempAnormaisSelection.length > 0" class="temp-selection-info">
            <span class="temp-info-text">{{ tempAnormaisSelection.length }} anormalidade(s) selecionada(s)</span>
          </div>
          <div class="options-grid">
            <button v-for="option in anormaisOptions" :key="option.id" @click="toggleTempAnormal(option)"
              :class="['option-button', { 'selected': tempAnormaisSelection.includes(option.id) }]">
              <div class="option-content">
                <span>{{ option.label }}</span>
                <div v-if="tempAnormaisSelection.includes(option.id)" class="option-check">
                  <svg class="option-check-svg" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"></path>
                  </svg>
                </div>
              </div>
            </button>
          </div>
          <div class="anormais-actions">
            <button @click="confirmAnormaisSelection" :disabled="tempAnormaisSelection.length === 0"
              class="action-button confirm">
              Adicionar ({{ tempAnormaisSelection.length }})
            </button>
          </div>
        </div>

        <!-- Mobilidade Options -->
        <div v-if="showMobilidadeOptions" class="mobilidade-section">
          <pre style="text-align: center;margin: 0 0 1rem 0;font-size: medium;">Mobilidade</pre>
          <div v-if="tempMobilidadeSelection.length > 0" class="temp-selection-info">
            <span class="temp-info-text">{{ tempMobilidadeSelection.length }} mobilidade(s) selecionada(s)</span>
          </div>
          <div class="options-grid">
            <button v-for="option in mobilidadeOptions" :key="option.id" @click="toggleTempMobilidade(option)"
              :class="['option-button', { 'selected': tempMobilidadeSelection.includes(option.id) }]">
              <div class="option-content">
                <span>{{ option.label }}</span>
                <div v-if="tempMobilidadeSelection.includes(option.id)" class="option-check">
                  <svg class="option-check-svg" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"></path>
                  </svg>
                </div>
              </div>
            </button>
          </div>
          <div class="anormais-actions">
            <button @click="confirmMobilidadeSelection" :disabled="tempMobilidadeSelection.length === 0"
              class="action-button confirm">
              Adicionar ({{ tempMobilidadeSelection.length }})
            </button>
          </div>
        </div>
      </div>

      <!-- Finalize Button -->
      <button @click="finalize" :disabled="allSelections.length === 0" class="finalize-button">
        Finalizar ({{ allSelections.length }})
      </button>

      <!-- <button 
        v-if="allSelections.length > 0" 
        @click="openSelectionsModal" 
        class="finalize-button"
        style="margin-top: 1rem;background-color: #e53e3e !important;"
      >
        <svg class="view-all-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
        </svg>
        Ver Todas
      </button> -->

      <!-- Selections Modal -->
      <transition enter-active-class="modal-enter-active" enter-from-class="modal-enter-from"
        enter-to-class="modal-enter-to" leave-active-class="modal-leave-active" leave-from-class="modal-leave-from"
        leave-to-class="modal-leave-to">
        <div v-if="showSelectionsModal" class="modal-overlay">
          <transition enter-active-class="modal-content-enter-active" enter-from-class="modal-content-enter-from"
            enter-to-class="modal-content-enter-to" leave-active-class="modal-content-leave-active"
            leave-from-class="modal-content-leave-from" leave-to-class="modal-content-leave-to">
            <div class="modal-content selections-modal">
              <!-- Modal Header -->
              <div class="modal-header">
                <h2 class="modal-title">Todas as Seleções</h2>
                <div class="modal-subtitle">{{ allSelections.length }} itens selecionados</div>
              </div>

              <!-- Modal Body -->
              <div class="modal-body selections-modal-body">
                <div v-if="allSelections.length === 0" class="empty-state">
                  Nenhuma seleção foi feita
                </div>
                <div v-else class="selections-full-list">
                  <div v-for="(selection, index) in allSelections" :key="index" class="selection-full-item">
                    <div class="selection-full-header">
                      <div class="selection-full-number">{{ index + 1 }}</div>
                      <div :class="['selection-full-dot', selection.type]"></div>
                      <button @click="removeSelection(index)" class="remove-selection-button">
                        <svg class="remove-selection-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </button>
                    </div>
                    <div class="selection-full-content">
                      <span v-if="selection.type === 'normal'" class="selection-full-label">{{ selection.label }}</span>
                      <div v-else-if="selection.type === 'anormal'" class="selection-anormal-group">
                        <span class="selection-full-label">Anormalidades:</span>
                        <div class="selection-anormal-list">
                          <span v-for="(item, itemIndex) in selection.items" :key="itemIndex"
                            class="selection-anormal-item">
                            • {{ item }}
                          </span>
                        </div>
                      </div>
                      <div v-else-if="selection.type === 'mobilidade'" class="selection-mobilidade-group">
                        <span class="selection-full-label">Mobilidade:</span>
                        <div class="selection-mobilidade-list">
                          <span v-for="(item, itemIndex) in selection.items" :key="itemIndex"
                            class="selection-mobilidade-item">
                            • {{ item }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Modal Footer -->
              <div class="modal-footer">
                <button @click="clearAllSelections" class="modal-button secondary">
                  Limpar Todas
                </button>
                <button @click="closeSelectionsModal" class="modal-button primary">
                  Fechar
                </button>
              </div>
            </div>
          </transition>
        </div>
      </transition>

      <!-- Results Modal -->
      <transition enter-active-class="modal-enter-active" enter-from-class="modal-enter-from"
        enter-to-class="modal-enter-to" leave-active-class="modal-leave-active" leave-from-class="modal-leave-from"
        leave-to-class="modal-leave-to">
        <div v-if="showResults" class="modal-overlay">
          <transition enter-active-class="modal-content-enter-active" enter-from-class="modal-content-enter-from"
            enter-to-class="modal-content-enter-to" leave-active-class="modal-content-leave-active"
            leave-from-class="modal-content-leave-from" leave-to-class="modal-content-leave-to">
            <div class="modal-content">
              <!-- Modal Header -->
              <div class="modal-header">
                <h2 class="modal-title">Resumo das Seleções</h2>
                <div class="modal-subtitle">{{ finalResults.length }} itens selecionados</div>
              </div>

              <!-- Modal Body -->
              <div class="modal-body">
                <div v-if="finalResults.length === 0" class="empty-state">
                  Nenhuma opção foi selecionada
                </div>
                <div v-else class="results-list">
                  <div v-for="(result, index) in finalResults" :key="index" class="result-item">
                    <div class="result-number">{{ index + 1 }}</div>
                    <div :class="['result-dot', result.type]"></div>
                    <div class="result-content">
                      <span v-if="result.type === 'normal'" class="result-label">{{ result.label }}</span>
                      <div v-else-if="result.type === 'anormal'" class="result-anormal-group">
                        <span class="result-label">Anormalidades:</span>
                        <div class="result-anormal-list">
                          <span v-for="(item, itemIndex) in result.items" :key="itemIndex" class="result-anormal-item">
                            • {{ item }}
                          </span>
                        </div>
                      </div>
                      <div v-else-if="result.type === 'mobilidade'" class="result-mobilidade-group">
                        <span class="result-label">Mobilidade:</span>
                        <div class="result-mobilidade-list">
                          <span v-for="(item, itemIndex) in result.items" :key="itemIndex"
                            class="result-mobilidade-item">
                            • {{ item }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Modal Footer -->
              <div class="modal-footer">
                <button @click="resetSelections" class="modal-button secondary">
                  Reiniciar
                </button>
                <button @click="closeResults" class="modal-button primary">
                  Fechar
                </button>
              </div>
            </div>
          </transition>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface AnormalOption {
  id: string
  label: string
}

interface MobilidadeOption {
  id: string
  label: string
}

interface Selection {
  label: string
  type: 'normal' | 'anormal' | 'mobilidade'
  timestamp: number
  items?: string[] // Para agrupar anormalidades e mobilidade
}

// Reactive state
const allSelections = ref<Selection[]>([]);
const tempAnormaisSelection = ref<string[]>([]); // Seleção temporária de anormais
const tempMobilidadeSelection = ref<string[]>([]); // Seleção temporária de mobilidade
const showAnormaisOptions = ref(false);
const showMobilidadeOptions = ref(false);
const showResults = ref(false);
const finalResults = ref<Selection[]>([]);
const showSelectionsModal = ref(false);

// Anormais options
const anormaisOptions: AnormalOption[] = [
  { id: 'cabeca', label: 'Cabeça' },
  { id: 'peca-intermediaria', label: 'Peça intermediária' },
  { id: 'cauda', label: 'Cauda' },
  { id: 'residuo-citoplasmatico', label: 'Resíduo Citoplasmático' }
];

// Mobilidade options
const mobilidadeOptions: MobilidadeOption[] = [
  { id: 'progressiva-rapida', label: 'Progressiva Rápida' },
  { id: 'progressiva-lenta', label: 'Progressiva Lenta' },
  { id: 'nao-progressiva', label: 'Não Progressiva' },
  { id: 'imovel', label: 'Imóvel' }
];

// Computed properties
const normaisCount = computed(() =>
  allSelections.value.filter(s => s.type === 'normal').length
);

const anormaisGroupCount = computed(() =>
  allSelections.value.filter(s => s.type === 'anormal').length
);

const mobilidadeGroupCount = computed(() =>
  allSelections.value.filter(s => s.type === 'mobilidade').length
);

// Methods
const addNormais = () => {
  allSelections.value.push({
    label: 'Normais',
    type: 'normal',
    timestamp: Date.now()
  });
  tempAnormaisSelection.value = [];
  tempMobilidadeSelection.value = [];
  showAnormaisOptions.value = false;
  showMobilidadeOptions.value = false;
};

const toggleAnormais = () => {
  showAnormaisOptions.value = !showAnormaisOptions.value;
  showMobilidadeOptions.value = false; // Fecha mobilidade se abrir anormais
  if (!showAnormaisOptions.value) {
    tempAnormaisSelection.value = [];
  }
};

const toggleMobilidade = () => {
  showMobilidadeOptions.value = !showMobilidadeOptions.value;
  showAnormaisOptions.value = false; // Fecha anormais se abrir mobilidade
  if (!showMobilidadeOptions.value) {
    tempMobilidadeSelection.value = [];
  }
};

const toggleTempAnormal = (option: AnormalOption) => {
  const index = tempAnormaisSelection.value.indexOf(option.id);
  if (index > -1) {
    tempAnormaisSelection.value.splice(index, 1);
  } else {
    tempAnormaisSelection.value.push(option.id);
  }
};

const toggleTempMobilidade = (option: MobilidadeOption) => {
  const index = tempMobilidadeSelection.value.indexOf(option.id);
  if (index > -1) {
    tempMobilidadeSelection.value.splice(index, 1);
  } else {
    tempMobilidadeSelection.value.push(option.id);
  }
};

const confirmAnormaisSelection = () => {
  if (tempAnormaisSelection.value.length > 0) {
    // Converte IDs para labels
    const selectedLabels = tempAnormaisSelection.value.map(id => {
      const option = anormaisOptions.find(opt => opt.id === id);
      return option ? option.label : '';
    }).filter(label => label !== '');

    // Adiciona como um grupo à lista principal
    allSelections.value.push({
      label: 'Anormalidades',
      type: 'anormal',
      timestamp: Date.now(),
      items: selectedLabels
    });

    // Limpa e fecha
    tempAnormaisSelection.value = [];
    showAnormaisOptions.value = false;
  }
};

const confirmMobilidadeSelection = () => {
  if (tempMobilidadeSelection.value.length > 0) {
    // Converte IDs para labels
    const selectedLabels = tempMobilidadeSelection.value.map(id => {
      const option = mobilidadeOptions.find(opt => opt.id === id);
      return option ? option.label : '';
    }).filter(label => label !== '');

    // Adiciona como um grupo à lista principal
    allSelections.value.push({
      label: 'Mobilidade',
      type: 'mobilidade',
      timestamp: Date.now(),
      items: selectedLabels
    });

    // Limpa e fecha
    tempMobilidadeSelection.value = [];
    showMobilidadeOptions.value = false;
  }
};

const removeSelection = (index: number) => {
  allSelections.value.splice(index, 1);
};

const openSelectionsModal = () => {
  showSelectionsModal.value = true;
};

const closeSelectionsModal = () => {
  showSelectionsModal.value = false;
};

const clearAllSelections = () => {
  allSelections.value = [];
  tempAnormaisSelection.value = [];
  tempMobilidadeSelection.value = [];
  showAnormaisOptions.value = false;
  showMobilidadeOptions.value = false;
  showSelectionsModal.value = false;
};

const finalize = () => {
  finalResults.value = [...allSelections.value];
  showResults.value = true;
};

const closeResults = () => {
  showResults.value = false;
};

const resetSelections = () => {
  allSelections.value = [];
  tempAnormaisSelection.value = [];
  tempMobilidadeSelection.value = [];
  showAnormaisOptions.value = false;
  showMobilidadeOptions.value = false;
  finalResults.value = [];
  showResults.value = false;
};
</script>

<style scoped>
/* Reset and Base Styles */
* {
  box-sizing: border-box;
}

/* Container and Layout */
.container {
  min-height: 100vh;
  background-color: #f9fafb;
  padding: 1rem;
}

.content-wrapper {
  width: 100%;
  margin: 0 auto;
}

.title { 
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.subtitle {
  color: #6b7280;
  margin: 0;
}

/* Buttons Container */
.buttons-container {
  margin-bottom: 1.5rem;
}

/* Main Buttons */
.main-button {
  width: 100%;
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1.125rem;
  border: 2px solid #e5e7eb;
  background-color: white;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 1rem;
}

.main-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.main-button:active {
  transform: translateY(0);
}

/* Normais Button */
.normais-button:hover {
  border-color: #86efac;
  background-color: #f0fdf4;
}

/* Anormais Button */
.anormais-button:hover {
  border-color: #fca5a5;
  background-color: #fef2f2;
}

/* Mobilidade Button */
.mobilidade-button:hover {
  border-color: #93c5fd;
  background-color: #eff6ff;
}

/* Button Content */
.button-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.button-content-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.button-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Counter Badge */
.counter-badge {
  border-radius: 9999px;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  font-weight: 700;
  color: white;
}

.counter-badge.green {
  background-color: #10b981;
}

.counter-badge.red {
  background-color: #ef4444;
}

.counter-badge.blue {
  background-color: #3b82f6;
}

/* Arrow Icon */
.arrow-icon {
  width: 1.25rem;
  height: 1.25rem;
  transition: transform 0.2s ease;
}

.arrow-icon.rotated {
  transform: rotate(180deg);
}

/* Anormais Section */
.anormais-section {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
}

/* Mobilidade Section */
.mobilidade-section {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 0.5rem;
}

/* Temporary Selection Info */
.temp-selection-info {
  text-align: center;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background-color: #fee2e2;
  border-radius: 0.375rem;
}

.mobilidade-section .temp-selection-info {
  background-color: #dbeafe;
}

.temp-info-text {
  font-size: 0.875rem;
  color: #dc2626;
  font-weight: 500;
}

.mobilidade-section .temp-info-text {
  color: #2563eb;
}

/* Options Grid */
.options-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

/* Option Button */
.option-button {
  padding: 2rem;
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  border: 1px solid #e5e7eb;
  background-color: white;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
}

.option-button:hover {
  border-color: #fca5a5;
  background-color: #fef2f2;
  transform: translateY(-1px);
}

.mobilidade-section .option-button:hover {
  border-color: #93c5fd;
  background-color: #eff6ff;
}

.option-button.selected {
  background-color: #ef4444;
  color: white;
  border-color: #ef4444;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.mobilidade-section .option-button.selected {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

.option-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.option-check {
  width: 1rem;
  height: 1rem;
  background-color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.option-check-svg {
  width: 0.5rem;
  height: 0.5rem;
  color: #ef4444;
}

.mobilidade-section .option-check-svg {
  color: #3b82f6;
}

/* Action Buttons */
.anormais-actions {
  display: flex;
  gap: 0.75rem;
}

.action-button {
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-button.cancel {
  background-color: #6b7280;
  color: white;
}

.action-button.cancel:hover {
  background-color: #4b5563;
}

.action-button.confirm {
  background-color: #3b82f6;
  color: white;
}

.action-button.confirm:hover {
  background-color: #2563eb;
}

.action-button:disabled {
  background-color: #d1d5db;
  color: #6b7280;
  cursor: not-allowed;
}

/* Summary Actions */
.view-all-button {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.view-all-button:hover {
  background-color: #2563eb;
}

.view-all-icon {
  width: 0.875rem;
  height: 0.875rem;
}

/* Finalize Button */
.finalize-button {
  width: 100%;
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1.125rem;
  border: none;
  background-color: #3b82f6;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.finalize-button:hover {
  background-color: #2563eb;
  transform: translateY(-1px);
}

.finalize-button:disabled {
  background-color: #d1d5db;
  color: #6b7280;
  cursor: not-allowed;
  box-shadow: none;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 50;
}

/* Selections Modal Specific Styles */
.selections-modal {
  max-width: 28rem;
  max-height: 36rem;
}

.selections-modal-body {
  max-height: 24rem;
  padding: 0;
}

.selections-full-list {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.selection-full-item {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 0.75rem;
}

.selection-full-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.selection-full-number {
  background-color: #3b82f6;
  color: white;
  border-radius: 50%;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  flex-shrink: 0;
}

.selection-full-dot {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  flex-shrink: 0;
}

.selection-full-dot.normal {
  background-color: #10b981;
}

.selection-full-dot.anormal {
  background-color: #ef4444;
}

.selection-full-dot.mobilidade {
  background-color: #3b82f6;
}

.remove-selection-button {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: all 0.2s ease;
  margin-left: auto;
}

.remove-selection-button:hover {
  color: #ef4444;
  background-color: #fee2e2;
}

.remove-selection-icon {
  width: 1rem;
  height: 1rem;
}

.selection-full-content {
  padding-left: 2.25rem;
}

.selection-full-label {
  font-weight: 500;
  color: #1f2937;
  font-size: 0.875rem;
}

.selection-anormal-group,
.selection-mobilidade-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.selection-anormal-list,
.selection-mobilidade-list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.selection-anormal-item,
.selection-mobilidade-item {
  font-size: 0.75rem;
  font-weight: 500;
  padding-left: 0.5rem;
}

.selection-anormal-item {
  color: #dc2626;
}

.selection-mobilidade-item {
  color: #2563eb;
}

.modal-content {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  max-width: 24rem;
  width: 100%;
  max-height: 32rem;
  overflow: hidden;
}

.modal-header {
  background-color: #3b82f6;
  color: white;
  padding: 1rem;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
}

.modal-subtitle {
  font-size: 0.875rem;
  opacity: 0.9;
}

.modal-body {
  padding: 1rem;
  max-height: 20rem;
  overflow-y: auto;
}

.empty-state {
  text-align: center;
  color: #6b7280;
  padding: 2rem 0;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.result-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
}

.result-number {
  background-color: #e5e7eb;
  color: #374151;
  border-radius: 50%;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  flex-shrink: 0;
}

.result-dot {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  margin-top: 0.125rem;
  flex-shrink: 0;
}

.result-dot.normal {
  background-color: #10b981;
}

.result-dot.anormal {
  background-color: #ef4444;
}

.result-dot.mobilidade {
  background-color: #3b82f6;
}

.result-content {
  flex: 1;
}

.result-label {
  font-weight: 500;
  color: #1f2937;
  font-size: 0.875rem;
}

.result-anormal-group,
.result-mobilidade-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.result-anormal-list,
.result-mobilidade-list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.result-anormal-item {
  font-size: 0.75rem;
  color: #dc2626;
  font-weight: 500;
}

.result-mobilidade-item {
  font-size: 0.75rem;
  color: #2563eb;
  font-weight: 500;
}

.modal-footer {
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  gap: 0.75rem;
}

.modal-button {
  flex: 1;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.modal-button.secondary {
  background-color: #6b7280;
  color: white;
}

.modal-button.secondary:hover {
  background-color: #4b5563;
}

.modal-button.primary {
  background-color: #3b82f6;
  color: white;
}

.modal-button.primary:hover {
  background-color: #2563eb;
}

/* Animations */
.fade-slide-enter-active {
  transition: all 0.3s ease-out;
}

.fade-slide-leave-active {
  transition: all 0.2s ease-in;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-0.5rem);
}

.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-to,
.modal-leave-from {
  opacity: 1;
}

.modal-content-enter-active {
  transition: all 0.3s ease-out;
}

.modal-content-leave-active {
  transition: all 0.2s ease-in;
}

.modal-content-enter-from,
.modal-content-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.modal-content-enter-to,
.modal-content-leave-from {
  opacity: 1;
  transform: scale(1);
}

/* Responsive Design */
@media (max-width: 480px) {
  .container {
    padding: 0.5rem;
  }

  .title {
    font-size: 1.25rem;
  }

  .main-button {
    font-size: 1rem;
    padding: 0.875rem 1.25rem;
  }

  .options-grid {
    gap: 0.5rem;
  }

  .option-button {
    padding: 0.625rem 0.75rem;
    font-size: 0.8125rem;
  }
}

@media (max-width: 360px) {
  .options-grid {
    grid-template-columns: 1fr;
  }
}
</style>