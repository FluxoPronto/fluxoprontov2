<template>
  <div class="product-media-gallery">
    <div class="main-media-container">
      <img v-if="activeMedia.type === 'image'" :src="activeMedia.src" :alt="altText" class="main-media-asset" />
      <video v-else-if="activeMedia.type === 'video'" :src="activeMedia.src" class="main-media-asset" autoplay muted loop playsinline></video>
    </div>
    <div class="thumbnail-strip">
      <button 
        v-for="(media, index) in mediaItems" 
        :key="media.src" 
        class="thumbnail-btn"
        :class="{ 'active': activeMedia.src === media.src }"
        @click="setActiveMedia(media)">
        <img :src="media.thumbnail" :alt="`Thumbnail ${index + 1}`" />
        <span v-if="media.type === 'video'" class="play-icon material-icons">play_circle</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  mediaItems: {
    type: Array,
    required: true,
    default: () => []
  },
  altText: {
    type: String,
    default: 'Product media'
  }
});

const activeMedia = ref(props.mediaItems.length > 0 ? props.mediaItems[0] : { src: '', thumbnail: '', type: 'image' });

function setActiveMedia(media) {
  activeMedia.value = media;
}
</script>

<style scoped>
.product-media-gallery {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.main-media-container {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  border-radius: var(--radius-xl);
  overflow: hidden;
  background-color: var(--surface-2);
  box-shadow: var(--shadow-lg);
}

.main-media-asset {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.main-media-container:hover .main-media-asset {
  transform: scale(1.03);
}

.thumbnail-strip {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.thumbnail-btn {
  position: relative;
  width: 80px;
  height: 50px;
  padding: 0;
  border: 2px solid transparent;
  border-radius: var(--radius-md);
  overflow: hidden;
  cursor: pointer;
  background-color: var(--surface-2);
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.thumbnail-btn:hover {
  transform: translateY(-2px);
  border-color: var(--brand-500);
}

.thumbnail-btn.active {
  border-color: var(--brand-500);
  box-shadow: 0 0 12px -2px var(--brand-300);
}

.thumbnail-btn img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.play-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 28px;
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  pointer-events: none;
}
</style>
