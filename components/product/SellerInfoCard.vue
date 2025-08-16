<template>
  <div class="seller-card">
    <div class="seller-header">
      <img :src="seller.avatar" :alt="seller.name" class="seller-avatar" />
      <div class="seller-info">
        <a href="#" class="seller-name">{{ seller.name }}</a>
        <div class="seller-rating">
          <span class="star-icon material-icons">star</span>
          <strong>{{ seller.rating.toFixed(1) }}</strong>
          <span class="reviews-count">({{ seller.reviewsCount }} avaliações)</span>
        </div>
      </div>
    </div>

    <div class="seller-stats">
      <div class="stat-item">
        <span class="stat-value">{{ seller.salesCount }}</span>
        <span class="stat-label">Vendas</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{ seller.positiveReviews }}%</span>
        <span class="stat-label">Positivas</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{ seller.memberSince }}</span>
        <span class="stat-label">Membro desde</span>
      </div>
    </div>

    <div class="verification-section">
      <span class="verification-title">Verificações do Vendedor</span>
      <div class="badges-list">
        <span v-for="badge in seller.verifications" :key="badge.type" class="badge-item" :title="badge.label">
          <span class="material-icons">{{ badge.icon }}</span>
        </span>
      </div>
    </div>
    
    <a href="#" class="btn btn-outline btn-block">Ver Perfil do Vendedor</a>
  </div>
</template>

<script setup>
defineProps({
  seller: {
    type: Object,
    required: true,
    default: () => ({})
  }
});
</script>

<style scoped>
.seller-card {
  background: var(--surface-1);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.seller-header {
  display: flex;
  align-items: center;
  gap: 16px;
}
.seller-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--surface-3);
}
.seller-info .seller-name {
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--text-1);
  text-decoration: none;
}
.seller-info .seller-name:hover {
  text-decoration: underline;
}
.seller-rating {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.9rem;
  color: var(--text-2);
}
.seller-rating .star-icon {
  color: #f59e0b;
  font-size: 18px;
}

.seller-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  text-align: center;
  padding: 16px 0;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}
.stat-item .stat-value {
  display: block;
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-1);
}
.stat-item .stat-label {
  font-size: 0.8rem;
  color: var(--text-3);
  text-transform: uppercase;
}

.verification-section {
  text-align: center;
}
.verification-title {
  font-size: 0.85rem;
  color: var(--text-3);
  margin-bottom: 12px;
  display: block;
  font-weight: 500;
}
.badges-list {
  display: flex;
  justify-content: center;
  gap: 16px;
}
.badge-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--surface-2);
  color: var(--success);
  border: 1px solid var(--border);
}

@media (max-width: 480px) {
  .seller-stats {
    grid-template-columns: 1fr;
    gap: 20px;
    text-align: left;
  }

  .stat-item {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .stat-item .stat-value {
    font-size: 1.1rem;
    order: 2;
  }

  .stat-item .stat-label {
    order: 1;
  }
}
</style>
