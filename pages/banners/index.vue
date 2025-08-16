<template>
  <div class="catalog-container">
    <div style="display: flex; align-items: baseline; width: 100%; justify-content: space-between; margin-bottom: 30px;">
      <div>
        <h1 class="titulo">Banners</h1>
        <p class="subtitulo">Cadastre seus banners!</p>
      </div>
      <button @click="openModal">Cadastrar Banner</button>
    </div>

    <div class="catalog-grid">
      <div
        class="catalog-card"
        v-for="(catalogo, index) in produtosCatalogo"
        :key="index"
      >
        <img
          :src="catalogo.fileName ? `https://api.visaonews.org/storage/v1/object/public/banners/${sub}/${catalogo.fileName}` : ''"
          alt="Imagem do Banner"
        />
        <div class="catalog-info">
          <p><strong>ID:</strong> {{ index + 1 }}</p>
          <p><strong>Nome:</strong> {{ catalogo.nome }}</p>
          <p><strong>Descrição:</strong> {{ catalogo.descricao }}</p>
        </div>
        <button class="btn-deletar" @click="deleteItem(catalogo)">Deletar</button>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h2>Cadastrar Banner</h2>
        <form @submit.prevent="addProduto">
          <label>Nome:</label>
          <input type="text" v-model="newProduto.nome" required />

          <label>Descrição:</label>
          <textarea v-model="newProduto.descricao" required></textarea>

          <label>Imagem:</label>
          <input type="file" @change="handleFileUpload" required />

          <img
            v-if="imagePreviewUrl"
            :src="imagePreviewUrl"
            alt="Prévia"
            class="preview"
          />

          <div class="modal-buttons">
            <button type="submit">Salvar</button>
            <button type="button" @click="closeModal">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

definePageMeta({
  middleware: ['auth'],
  layout: 'dashboard'
});

const supaStore = useSupabaseClient();
const SUPABASE_URL = supaStore.supabaseUrl;
const SUPABASE_KEY = supaStore.supabaseKey;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const produtosCatalogo = ref([]);
const listPremios = ref([]);
const showModal = ref(false);
const newProduto = ref({
  fileName: "",
  nome: "",
  descricao: "",
});
const imageFile = ref(null);
const sub = ref(null);

const imagePreviewUrl = ref(null);

function getUser() {
  const user = useSupabaseUser();
  sub.value = user.value.user_metadata.sub;
  console.log("User data:", user.value.user_metadata.sub);
  return user.value;
}

onMounted(() => {
  getUser();
  getPremios();
  fetchCatalogoData();
});

async function getPremios() {
  const { data, error } = await supabase
    .from("resgates_sorteio")
    .select("*")
    .eq("user_id", sub.value);
  if (error) {
    console.error("Error fetching premios:", error);
  } else {
    listPremios.value = data;
  }
}

async function deleteItem(catalogo) {
  console.log("Deleting produto_catalogo...", catalogo.fileName);

  try {
    if (catalogo.fileName) {
      const { error: bucketError } = await supabase.storage
        .from("catalogo/" + sub.value + "/" + catalogo.fileName) 
        .remove([catalogo.fileName]);

      if (bucketError) {
        console.error("Erro ao deletar arquivo do bucket:", bucketError.message);
        return;
      }

      console.log("Arquivo deletado do bucket com sucesso:", catalogo.fileName);
    }

    const { error: dbError } = await supabase
      .from("banners_produtos")
      .delete()
      .eq("id", catalogo.id);

    if (dbError) {
      console.error("Erro ao deletar produto do banco de dados:", dbError.message);
      return;
    }

    console.log("Produto deletado com sucesso do banco de dados:", catalogo.id);


    produtosCatalogo.value = produtosCatalogo.value.filter(
      (item) => item.id !== catalogo.id
    );
  } catch (err) {
    console.error("Erro ao deletar item:", err.message);
  }
}

async function fetchCatalogoData() {
  console.log('Fetching produtos_sorteio...');
  const { data, error } = await supabase.from('banners_produtos').select('*');
  if (error) {
    console.error('Error fetching sorteio data:', error);
  } else {
    console.log('catalogo data:', data);
    produtosCatalogo.value = data;
  }
}

function openModal() {
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  newProduto.value = {
    fileName: "",
    nome: "",
    descricao: "",
  };
  imageFile.value = null;
  imagePreviewUrl.value = null; // limpa a imagem ao fechar
}

function handleFileUpload(event) {
  const file = event.target.files[0];
  imageFile.value = file;

  if (file) {
    imagePreviewUrl.value = URL.createObjectURL(file);
  }
}

async function addProduto() {
  if (!imageFile.value) {
    alert("Por favor, selecione uma imagem.");
    return;
  }

  try {
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("banners/" + sub.value)
      .upload(uuidv4(), imageFile.value, {
        cacheControl: "3600",
        contentType: imageFile.value.type,
      });

    if (uploadError) {
      console.error("Erro ao enviar imagem:", uploadError.message);
      return;
    }

    console.log("Imagem enviada com sucesso:", uploadData);

    newProduto.value.fileName = uploadData.path;

    const { data, error } = await supabase.from("banners_produtos").insert(newProduto.value);

    if (error) {
      console.error("Erro ao adicionar produto:", error.message);
    } else {
      console.log("Produto adicionado com sucesso:", data);
      listPremios.value.push(data[0]);
      fetchCatalogoData();
      closeModal();
    }
  } catch (err) {
    console.error("Erro ao cadastrar produto:", err.message);
  }
}
</script>

<style scoped>
.catalog-container {
  padding: 30px 20px;
}

.titulo {
  font-size: 1.8rem;
  margin-bottom: 5px;
  color: #30369d;
}

.subtitulo {
  margin-bottom: 30px;
  color: #555;
}

.catalog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.catalog-card {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: flex-start;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  flex-wrap: wrap;
}

.catalog-card img {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 8px;
}

.catalog-info p {
  margin: 0;
  font-size: 0.95rem;
  color: #333;
}

.btn-deletar {
  margin-left: auto;
  background-color: #e30614;
  color: white;
  padding: 10px 14px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;
}

.btn-deletar:hover {
  background-color: #b70411;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.modal-content {
  background: white;
  padding: 25px 30px;
  border-radius: 12px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

input,
textarea {
  padding: 10px 14px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 0.95rem;
  width: 100%;
}

textarea {
  resize: vertical;
  min-height: 80px;
}

button {
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  transition: background-color 0.2s ease-in-out;
}

button[type="submit"] {
  background-color: #4caf50;
  color: white;
}

button[type="submit"]:hover {
  background-color: #3c9741;
}

button[type="button"] {
  background-color: #f44336;
  color: white;
}

button[type="button"]:hover {
  background-color: #d6362c;
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.preview {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  margin-top: 10px;
}
</style>