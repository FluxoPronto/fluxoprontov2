<template>
  <div class="file-upload-container">
    <div 
      class="file-upload-area"
      :class="{ 
        'drag-over': isDragOver, 
        'has-files': hasFiles,
        'error': hasError 
      }"
      @click="triggerFileInput"
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleDrop"
    >
      <input 
        ref="fileInput" 
        type="file" 
        :accept="acceptedTypes" 
        :multiple="multiple"
        @change="handleFileSelect" 
        hidden 
      />
      
      <!-- Upload State -->
      <div v-if="!hasFiles" class="upload-content">
        <span class="material-icons-outlined upload-icon">cloud_upload</span>
        <p class="upload-text">{{ placeholder }}</p>
        <small class="upload-info">
          {{ acceptedTypes }} • Máx {{ maxSize }}MB{{ multiple ? ' • Múltiplos arquivos' : '' }}
        </small>
      </div>

      <!-- Files Preview -->
      <div v-else class="files-preview">
        <div v-for="(file, index) in selectedFiles" :key="index" class="file-item">
          <div class="file-info">
            <span class="material-icons-outlined file-icon">{{ getFileIcon(file) }}</span>
            <div class="file-details">
              <span class="file-name">{{ file.name }}</span>
              <span class="file-size">{{ formatFileSize(file.size) }}</span>
            </div>
          </div>
          <button 
            @click.stop="removeFile(index)" 
            class="remove-file-btn"
            type="button"
          >
            <span class="material-icons-outlined">close</span>
          </button>
        </div>
        
        <button 
          v-if="multiple" 
          @click.stop="triggerFileInput" 
          class="add-more-btn"
          type="button"
        >
          <span class="material-icons-outlined">add</span>
          Adicionar mais arquivos
        </button>
      </div>

      <!-- Error State -->
      <div v-if="hasError" class="error-message">
        <span class="material-icons-outlined">error</span>
        <span>{{ errorMessage }}</span>
      </div>
    </div>

    <!-- Upload Progress -->
    <div v-if="isUploading" class="upload-progress">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: uploadProgress + '%' }"></div>
      </div>
      <span class="progress-text">{{ uploadProgress }}% enviado</span>
    </div>

    <!-- Validation Messages -->
    <div v-if="validationErrors.length > 0" class="validation-errors">
      <div v-for="error in validationErrors" :key="error" class="validation-error">
        <span class="material-icons-outlined">warning</span>
        <span>{{ error }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

// Props
const props = defineProps({
  acceptedTypes: {
    type: String,
    default: '.jpg,.jpeg,.png,.pdf'
  },
  maxSize: {
    type: Number,
    default: 5 // MB
  },
  placeholder: {
    type: String,
    default: 'Clique para fazer upload ou arraste arquivos aqui'
  },
  multiple: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: [File, Array],
    default: null
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'file-selected', 'file-removed', 'validation-error'])

// Reactive state
const fileInput = ref(null)
const selectedFiles = ref([])
const isDragOver = ref(false)
const isUploading = ref(false)
const uploadProgress = ref(0)
const validationErrors = ref([])
const errorMessage = ref('')

// Computed
const hasFiles = computed(() => selectedFiles.value.length > 0)
const hasError = computed(() => validationErrors.value.length > 0 || errorMessage.value)

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  if (!newValue) {
    selectedFiles.value = []
  } else if (Array.isArray(newValue)) {
    selectedFiles.value = newValue
  } else {
    selectedFiles.value = [newValue]
  }
}, { immediate: true })

// File handling methods
const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files)
  processFiles(files)
}

const handleDragOver = (event) => {
  isDragOver.value = true
}

const handleDragLeave = (event) => {
  isDragOver.value = false
}

const handleDrop = (event) => {
  isDragOver.value = false
  const files = Array.from(event.dataTransfer.files)
  processFiles(files)
}

const processFiles = (files) => {
  validationErrors.value = []
  errorMessage.value = ''

  const validFiles = []
  
  for (const file of files) {
    const validationResult = validateFile(file)
    if (validationResult.isValid) {
      validFiles.push(file)
    } else {
      validationErrors.value.push(`${file.name}: ${validationResult.error}`)
    }
  }

  if (validFiles.length > 0) {
    if (props.multiple) {
      selectedFiles.value = [...selectedFiles.value, ...validFiles]
    } else {
      selectedFiles.value = [validFiles[0]]
    }
    
    emitFiles()
  }

  if (validationErrors.value.length > 0) {
    emit('validation-error', validationErrors.value)
  }
}

const validateFile = (file) => {
  // Check file type
  if (props.acceptedTypes) {
    const acceptedExtensions = props.acceptedTypes.split(',').map(ext => ext.trim().toLowerCase())
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase()
    
    if (!acceptedExtensions.includes(fileExtension)) {
      return {
        isValid: false,
        error: `Tipo de arquivo não permitido. Aceitos: ${props.acceptedTypes}`
      }
    }
  }

  // Check file size
  const fileSizeMB = file.size / (1024 * 1024)
  if (fileSizeMB > props.maxSize) {
    return {
      isValid: false,
      error: `Arquivo muito grande. Máximo: ${props.maxSize}MB`
    }
  }

  return { isValid: true }
}

const removeFile = (index) => {
  selectedFiles.value.splice(index, 1)
  emitFiles()
  emit('file-removed', index)
}

const emitFiles = () => {
  const filesToEmit = props.multiple ? selectedFiles.value : selectedFiles.value[0] || null
  emit('update:modelValue', filesToEmit)
  emit('file-selected', filesToEmit)
}

// Utility methods
const getFileIcon = (file) => {
  const extension = file.name.split('.').pop().toLowerCase()
  
  switch (extension) {
    case 'pdf':
      return 'picture_as_pdf'
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return 'image'
    case 'doc':
    case 'docx':
      return 'description'
    case 'xls':
    case 'xlsx':
      return 'table_chart'
    default:
      return 'insert_drive_file'
  }
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Simulate upload progress (for demo)
const simulateUpload = () => {
  isUploading.value = true
  uploadProgress.value = 0
  
  const interval = setInterval(() => {
    uploadProgress.value += 10
    
    if (uploadProgress.value >= 100) {
      clearInterval(interval)
      isUploading.value = false
      uploadProgress.value = 0
    }
  }, 200)
}

// Public methods
defineExpose({
  triggerFileInput,
  removeAllFiles: () => {
    selectedFiles.value = []
    emitFiles()
  },
  simulateUpload
})
</script>

<style scoped>
.file-upload-container {
  width: 100%;
}

.file-upload-area {
  border: 2px dashed var(--border);
  border-radius: var(--radius-md);
  padding: 2rem 1rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: var(--surface-1);
  position: relative;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.file-upload-area:hover {
  border-color: var(--brand-300);
  background: var(--brand-25);
}

.file-upload-area.drag-over {
  border-color: var(--brand-500);
  background: var(--brand-50);
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
}

.file-upload-area.has-files {
  padding: 1.5rem;
  text-align: left;
  border-color: var(--success-300);
  background: var(--success-25);
}

.file-upload-area.error {
  border-color: var(--danger-300);
  background: var(--danger-25);
}

/* Upload Content */
.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.upload-icon {
  font-size: 3rem;
  color: var(--brand-500);
  margin-bottom: 0.5rem;
}

.upload-text {
  font-weight: 600;
  color: var(--text-1);
  margin: 0;
  font-size: 1.05rem;
}

.upload-info {
  color: var(--text-3);
  font-size: 0.875rem;
  margin: 0;
}

/* Files Preview */
.files-preview {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: var(--surface-2);
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  transition: all 0.2s ease;
}

.file-item:hover {
  border-color: var(--border-hover);
  box-shadow: var(--shadow-sm);
}

.file-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  min-width: 0;
}

.file-icon {
  color: var(--brand-500);
  font-size: 24px;
  flex-shrink: 0;
}

.file-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.file-name {
  font-weight: 600;
  color: var(--text-1);
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-size {
  color: var(--text-3);
  font-size: 0.8rem;
}

.remove-file-btn {
  background: var(--danger-100);
  color: var(--danger-600);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.remove-file-btn:hover {
  background: var(--danger-200);
  color: var(--danger-700);
}

.remove-file-btn .material-icons-outlined {
  font-size: 18px;
}

.add-more-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  background: transparent;
  border: 2px dashed var(--border);
  border-radius: var(--radius-md);
  color: var(--text-2);
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.add-more-btn:hover {
  border-color: var(--brand-300);
  color: var(--brand-600);
  background: var(--brand-25);
}

/* Upload Progress */
.upload-progress {
  margin-top: 1rem;
  padding: 1rem;
  background: var(--surface-2);
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: var(--surface-3);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--brand-500), var(--brand-600));
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  color: var(--text-2);
  font-size: 0.875rem;
  font-weight: 500;
}

/* Error States */
.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--danger-600);
  font-weight: 500;
  font-size: 0.95rem;
}

.error-message .material-icons-outlined {
  font-size: 20px;
}

.validation-errors {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.validation-error {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--danger-50);
  border: 1px solid var(--danger-200);
  border-radius: var(--radius-md);
  color: var(--danger-700);
  font-size: 0.875rem;
}

.validation-error .material-icons-outlined {
  font-size: 18px;
  color: var(--danger-500);
}

/* Responsividade */
@media (max-width: 768px) {
  .file-upload-area {
    padding: 1.5rem 1rem;
    min-height: 100px;
  }
  
  .upload-icon {
    font-size: 2.5rem;
  }
  
  .upload-text {
    font-size: 1rem;
  }
  
  .upload-info {
    font-size: 0.8rem;
  }
  
  .file-item {
    padding: 0.75rem;
  }
  
  .file-info {
    gap: 0.75rem;
  }
  
  .file-name {
    font-size: 0.9rem;
  }
  
  .add-more-btn {
    padding: 0.75rem;
    font-size: 0.9rem;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .file-upload-area {
    background: var(--surface-2);
  }
  
  .file-upload-area:hover {
    background: var(--surface-3);
  }
  
  .file-item {
    background: var(--surface-3);
  }
}
</style>
