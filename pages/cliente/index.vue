<template>
  <div>
    <h1>Dashboard Cliente</h1>
    <p>Ultimos premios resgatados!</p>

    <!-- Carousel -->
    <div class="carousel">
      <div class="carousel-track" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
        <div class="carousel-item" v-for="(banner, index) in produtosCatalogo" :key="index">
          <img :src="banner.fileName ? `https://api.visaonews.org/storage/v1/object/public/banners/${'667d38d3-b1a8-44b2-b959-6ce45a580173'}/${banner.fileName}` : ''" alt="Imagem do Produto">
        </div>
      </div>
      <div v-if="produtosCatalogo.length > 1">
        <button class="carousel-btn prev" @click="prevSlide">‹</button>
        <button class="carousel-btn next" @click="nextSlide">›</button>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['auth'],
  layout: 'dashcliente'
});
import { ref, onMounted, onUnmounted } from 'vue';
import { createClient } from "@supabase/supabase-js";

const supaStore = useSupabaseClient();
const SUPABASE_URL = supaStore.supabaseUrl;
const SUPABASE_KEY = supaStore.supabaseKey;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const produtosCatalogo = ref([]);

async function fetchCatalogoData() {
  const { data, error } = await supabase.from('banners_produtos').select('*');
  if (error) {
    console.error('Error fetching sorteio data:', error);
  } else {
    console.log('catalogo data:', data);
    produtosCatalogo.value = data;
  }
}

const currentSlide = ref(0);

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % produtosCatalogo.value.length;
};

const prevSlide = () => {
  currentSlide.value =
    (currentSlide.value - 1 + produtosCatalogo.value.length) % produtosCatalogo.value.length;
};

let intervalId;

onMounted(() => {
  fetchCatalogoData();
  if (produtosCatalogo.value.length > 1) {
    console.log('No produtos found, skipping automatic slide change.');
    intervalId = setInterval(nextSlide, 10000); // 10 seconds
  }
  
});

onUnmounted(() => {
  clearInterval(intervalId);
});
</script>

<style scoped>
.carousel {
  position: relative;
  overflow: hidden;
  width: 100%;
  margin: auto;
}

.carousel-track {
  display: flex;
  transition: transform 0.5s ease-in-out;
}

.carousel-item {
  min-width: 100%;
  box-sizing: border-box;
}

.carousel-item img {
  width: 100%;
  display: block;
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  z-index: 10;
}

.carousel-btn.prev {
  left: 10px;
}

.carousel-btn.next {
  right: 10px;
}
</style>