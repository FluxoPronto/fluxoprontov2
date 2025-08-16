<template>
  <div class="description-wrapper">
    <h2 class="section-title">Sobre este Fluxo</h2>
    
    <div class="description-content">
      <div class="content-block">
        <h3>O Problema que Resolve</h3>
        <p>{{ description.problem }}</p>
      </div>

      <div class="content-block">
        <h3>O que o Fluxo Faz</h3>
        <p>{{ description.solution }}</p>
      </div>

      <div class="content-block">
        <h3>Benefícios Chave</h3>
        <ul class="benefits-list">
          <li v-for="benefit in description.benefits" :key="benefit">
            <span class="material-icons">check_circle</span>
            {{ benefit }}
          </li>
        </ul>
      </div>

      <div class="content-block">
        <h3>Requisitos Técnicos</h3>
        <div class="pill-list">
          <span v-for="req in description.requirements" :key="req">{{ req }}</span>
        </div>
      </div>
    </div>

    <div class="locked-content-teaser">
      <h3 class="teaser-title">Desbloqueie o potencial completo</h3>
      <div class="teaser-items">
        <div class="teaser-item">
          <span class="material-icons">description</span>
          <span>Documentação.pdf</span>
        </div>
        <div class="teaser-item">
          <span class="material-icons">smart_display</span>
          <span>Vídeo-Guia.mp4</span>
        </div>
        <div class="teaser-item">
          <span class="material-icons">data_object</span>
          <span>Workflow.json</span>
        </div>
      </div>
      <p class="teaser-caption">Acesso liberado após a compra.</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  description: {
    type: Object,
    required: true,
    default: () => ({})
  }
});
</script>

<style scoped>
.description-wrapper {
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

.description-content {
  display: grid;
  gap: 32px;
  line-height: 1.7;
  color: var(--text-2);
}

.content-block h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-1);
  margin-bottom: 12px;
}

.benefits-list {
  list-style: none;
  padding: 0;
  display: grid;
  gap: 12px;
}
.benefits-list li {
  display: flex;
  align-items: center;
  gap: 12px;
}
.benefits-list .material-icons {
  color: var(--success);
}

.pill-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.pill-list span {
  padding: 8px 16px;
  border: 1px solid var(--border);
  border-radius: 99px;
  background: var(--surface-2);
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-2);
}

.locked-content-teaser {
  margin-top: 40px;
  padding-top: 32px;
  border-top: 1px solid var(--border);
  text-align: center;
  background-color: var(--surface-2);
  padding: 24px;
  border-radius: var(--radius-lg);
}

.teaser-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-1);
  margin-bottom: 24px;
}
.teaser-items {
  display: flex;
  justify-content: center;
  gap: 24px;
  filter: blur(4px);
  opacity: 0.7;
  pointer-events: none;
  user-select: none;
}
.teaser-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: var(--text-2);
}
.teaser-item .material-icons {
  font-size: 48px;
}
.teaser-caption {
  margin-top: 20px;
  font-weight: 500;
  color: var(--brand-300);
}
</style>
