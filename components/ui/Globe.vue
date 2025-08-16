<template>
  <div class="globe-container">
    <canvas
      ref="canvasRef"
      class="globe-canvas"
      @pointerdown="onPointerDown"
      @pointerup="onPointerUp"
      @pointerout="onPointerUp"
      @mousemove="onMouseMove"
      @touchstart.passive="onTouchStart"
      @touchmove.passive="onTouchMove"
      @touchend="onPointerUp"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import createGlobe from 'cobe';

const canvasRef = ref(null);
let globe = null;
let pointerInteracting = null;
let pointerInteractionMovement = 0;
let rotation = 0;

const onPointerDown = (e) => {
  pointerInteracting = e.clientX - pointerInteractionMovement;
  if (canvasRef.value) {
    canvasRef.value.style.cursor = 'grabbing';
  }
};

const onPointerUp = () => {
  pointerInteracting = null;
  if (canvasRef.value) {
    canvasRef.value.style.cursor = 'grab';
  }
};

const onMouseMove = (e) => {
  if (pointerInteracting !== null) {
    const delta = e.clientX - pointerInteracting;
    pointerInteractionMovement = delta;
    rotation = delta / 200;
  }
};

const onTouchStart = (e) => {
  if (e.touches[0]) {
    onPointerDown(e.touches[0]);
  }
};

const onTouchMove = (e) => {
  if (e.touches[0]) {
    onMouseMove(e.touches[0]);
  }
};

onMounted(() => {
  if (!canvasRef.value) return;

  let width = 0;
  const onResize = () => {
    if (canvasRef.value) {
      width = canvasRef.value.offsetWidth;
    }
  };
  window.addEventListener('resize', onResize);
  onResize();

  let phi = 0;

  globe = createGlobe(canvasRef.value, {
    devicePixelRatio: 2,
    width: width * 2,
    height: width * 2,
    phi: 0,
    theta: 0.3,
    dark: 1,
    diffuse: 1.2,
    mapSamples: 16000,
    mapBrightness: 6,
    baseColor: [0.3, 0.3, 0.3],
    markerColor: [0.1, 0.8, 1],
    glowColor: [0.3, 0.3, 0.3],
    markers: [
      { location: [14.5995, 120.9842], size: 0.03 },
      { location: [19.076, 72.8777], size: 0.1 },
      { location: [23.8103, 90.4125], size: 0.05 },
      { location: [30.0444, 31.2357], size: 0.07 },
      { location: [39.9042, 116.4074], size: 0.08 },
      { location: [-23.5505, -46.6333], size: 0.1 },
      { location: [19.4326, -99.1332], size: 0.1 },
      { location: [40.7128, -74.006], size: 0.1 },
      { location: [34.6937, 135.5022], size: 0.05 },
      { location: [41.0082, 28.9784], size: 0.06 },
    ],
    onRender: (state) => {
      if (pointerInteracting === null) {
        phi += 0.005;
      }
      state.phi = phi + rotation;
      state.width = width * 2;
      state.height = width * 2;
    }
  });

  setTimeout(() => {
    if (canvasRef.value) {
        canvasRef.value.style.opacity = '1';
    }
  }, 500);
});

onUnmounted(() => {
  if (globe) {
    globe.destroy();
  }
});
</script>

<style scoped>
.globe-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 100%;
  max-width: 600px;
  aspect-ratio: 1 / 1;
}

.globe-canvas {
  width: 100%;
  height: 100%;
  contain: layout paint size;
  opacity: 0;
  transition: opacity 1s ease;
  cursor: grab;
}
</style>
