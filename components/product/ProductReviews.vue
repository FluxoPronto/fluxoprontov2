<template>
  <div class="reviews-wrapper">
    <h2 class="section-title">Avaliações dos Compradores</h2>
    
    <div class="reviews-summary-grid">
      <div class="summary-total">
        <div class="average-rating">{{ averageRating.toFixed(1) }}</div>
        <div class="stars-display">
          <span v-for="i in 5" :key="i" class="star" :class="{ on: i <= Math.round(averageRating) }">★</span>
        </div>
        <div class="total-reviews-count">Baseado em {{ reviews.length }} avaliações</div>
      </div>
      
      <div class="summary-distribution">
        <div v-for="i in 5" :key="i" class="distribution-row">
          <span class="star-label">{{ 6 - i }} estrelas</span>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: getStarDistribution(6 - i) + '%' }"></div>
          </div>
          <span class="percentage-label">{{ getStarDistribution(6 - i).toFixed(0) }}%</span>
        </div>
      </div>
    </div>

    <div class="reviews-list">
      <div v-for="review in reviews" :key="review.id" class="review-item">
        <div class="review-header">
          <div class="author-info">
            <img :src="review.author.avatar" :alt="review.author.name" class="author-avatar" />
            <span>{{ review.author.name }}</span>
          </div>
          <div class="review-rating">
            <span v-for="i in 5" :key="i" class="star" :class="{ on: i <= review.rating }">★</span>
          </div>
        </div>
        <p class="review-text">{{ review.text }}</p>
        <div class="review-footer">
          <span class="verified-purchase">
            <span class="material-icons">verified</span> Compra Verificada
          </span>
          <span class="review-date">{{ review.date }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  reviews: {
    type: Array,
    required: true,
    default: () => []
  }
});

const averageRating = computed(() => {
  if (props.reviews.length === 0) return 0;
  const total = props.reviews.reduce((sum, review) => sum + review.rating, 0);
  return total / props.reviews.length;
});

function getStarDistribution(starCount) {
  if (props.reviews.length === 0) return 0;
  const count = props.reviews.filter(r => r.rating === starCount).length;
  return (count / props.reviews.length) * 100;
}
</script>

<style scoped>
.reviews-wrapper {
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

.reviews-summary-grid {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 40px;
  align-items: center;
  margin-bottom: 40px;
  padding-bottom: 32px;
  border-bottom: 1px solid var(--border);
}
.summary-total {
  text-align: center;
}
.average-rating {
  font-size: 4rem;
  font-weight: 800;
  line-height: 1;
}
.stars-display { font-size: 1.5rem; color: #f59e0b; }
.total-reviews-count { font-size: 0.9rem; color: var(--text-3); margin-top: 8px; }

.summary-distribution {
  display: flex;
  flex-direction: column-reverse;
  gap: 8px;
}
.distribution-row {
  display: grid;
  grid-template-columns: 80px 1fr 50px;
  align-items: center;
  gap: 16px;
  font-size: 0.9rem;
}
.progress-bar {
  width: 100%;
  height: 8px;
  background-color: var(--surface-3);
  border-radius: 99px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background-color: #f59e0b;
  border-radius: 99px;
}
.percentage-label { text-align: right; color: var(--text-2); }

.reviews-list {
  display: grid;
  gap: 24px;
}
.review-item {
  background-color: var(--surface-2);
  padding: 20px;
  border-radius: var(--radius-lg);
}
.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.author-info { display: flex; align-items: center; gap: 12px; font-weight: 600; }
.author-avatar { width: 40px; height: 40px; border-radius: 50%; }
.review-rating { font-size: 1rem; color: #f59e0b; }

.review-text { margin: 0; line-height: 1.6; color: var(--text-2); }

.review-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  font-size: 0.85rem;
  color: var(--text-3);
}
.verified-purchase {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--success);
}
.verified-purchase .material-icons { font-size: 18px; }

@media (max-width: 767px) {
  .reviews-summary-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .summary-total {
    border-bottom: 1px solid var(--border);
    padding-bottom: 32px;
  }
}
</style>
