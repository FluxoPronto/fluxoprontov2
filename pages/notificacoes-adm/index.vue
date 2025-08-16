<template>
  <div class="produtos-container">
    <div style="display: flex;align-items: baseline;width: 100%;justify-content: space-between;">
      <div>
        <h1 class="titulo">Notificações</h1>
        <p class="subtitulo">Confira as notificações recebidas!</p>
      </div>
      <!-- <button @click="openModal">Cadastrar Produto</button> -->
    </div>
    

    <div class="produtos-grid">
      <div
        class="produto-card"
        v-for="(premio, index) in produtosSorteio"
        :key="index"
      >
        <img
          :src="premio.fileName ? `https://api.visaonews.org/storage/v1/object/public/premios/${sub}/${premio.fileName}` : ''"
          alt="image-cliente"
        />
        <div class="produto-info">
          <p><strong>ID:</strong> {{ premio.id || index + 1 }}</p>
          <p><strong>Título:</strong> {{ premio.title }}</p>
          <p><strong>Valor:</strong> {{ premio.valor || 'Indefinido' }}</p>
        </div>
        <!-- <button class="btn-deletar" @click="deleteItem(premio)">Deletar</button> -->
      </div>
    </div>

    

    <!-- Modal -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h2>Cadastrar Prêmio</h2>
        <form @submit.prevent="addProduto">
          <label>Nome:</label>
          <input type="text" v-model="newProduto.title" required />

          <label>Valor do Produto:</label>
          <textarea v-model="newProduto.valor" placeholder="Ex: R$ 150,00" required></textarea>

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
const produtosSorteio = ref([]);

const produtosCatalogo = ref([]);
const showModal = ref(false);
const newProduto = ref({
  fileName: "",
  title: '',
  valor: ''
});
const imageFile = ref(null);
const imagePreviewUrl = ref(null); // ✅ Ponto 1: prévia da imagem
const sub = ref(null);

function getUser() {
  const user = useSupabaseUser();
  sub.value = user.value.user_metadata.sub;
  console.log("User data:", user.value.user_metadata.sub);
  return user.value;
}

onMounted(() => {
  getUser();
  // getPremios();
  fetchSorteioData();
});

// async function getPremios() {
//   const { data, error } = await supabase
//     .from("resgates_sorteio")
//     .select("*")
//     .eq("user_id", sub.value);
//   if (error) {
//     console.error("Error fetching premios:", error);
//   } else {
//     listPremios.value = data;
//   }
// }

async function deleteItem(catalogo) {
  // console.log("Deleting produto_catalogo...", catalogo.fileName);

  try {
    // Deleta o arquivo do bucket
    if (catalogo.fileName) {
      const { error: bucketError } = await supabase.storage
        .from("premios/" + sub.value + "/" + catalogo.fileName) // Substitua "catalogo" pelo nome do bucket
        .remove([catalogo.fileName]);

      if (bucketError) {
        console.error("Erro ao deletar arquivo do bucket:", bucketError.message);
        return;
      }

      console.log("Arquivo deletado do bucket com sucesso:", catalogo.fileName);
    }

    // Deleta o item do banco de dados
    const { error: dbError } = await supabase.from("produtos_sorteio").delete().eq("id", catalogo.id);

    useToastify("Produto deletado com sucesso!", {
      autoClose: 2000,
      theme: "light",
      type: "success",
      position: ToastifyOption.POSITION.TOP_RIGHT,
    });
    fetchSorteioData();
    if (dbError) {
      console.error("Erro ao deletar produto do banco de dados:", dbError.message);
      return;
    }

    console.log("Produto deletado com sucesso do banco de dados:", catalogo.id);

    // Remove o item da lista localmente
    produtosCatalogo.value = produtosCatalogo.value.filter(
      (item) => item.id !== catalogo.id
    );
  } catch (err) {
    console.error("Erro ao deletar item:", err.message);
  }
}

async function fetchSorteioData() {
  console.log('Fetching notificacoes_geral...');
  const { data, error } = await supabase.from('notificacoes_geral').select('*');
  if (error) {
    console.error('Error fetching sorteio data:', error);
  } else {
    console.log('Sorteio data:', data);
    produtosSorteio.value = data;
  }
}

function openModal() {
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  newProduto.value = {
    fileName: "",
    title: newProduto.value.title,
    valor: newProduto.value.valor
  };
  imageFile.value = null;

  if (imagePreviewUrl.value) {
    URL.revokeObjectURL(imagePreviewUrl.value);
    imagePreviewUrl.value = null;
  }
}

function handleFileUpload(event) {
  imageFile.value = event.target.files[0];

  if (imageFile.value) {
    imagePreviewUrl.value = URL.createObjectURL(imageFile.value);
  }
}

async function addProduto() {
  if (!imageFile.value) {
    alert("Por favor, selecione uma imagem.");
    return;
  }

  try {
    // Envia a imagem para o bucket do Supabase
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("premios/" + sub.value)
      .upload(uuidv4(), imageFile.value, {
        cacheControl: "3600",
        contentType: imageFile.value.type,
      });

    if (uploadError) {
      console.error("Erro ao enviar imagem:", uploadError.message);
      return;
    }
    console.log("Imagem enviada com sucesso:", uploadData);
    fetchSorteioData();
    newProduto.value.fileName = uploadData.path;
    const { data, error } = await supabase.from("produtos_sorteio").insert(newProduto.value);

    if (error) {
      console.error("Erro ao adicionar produto:", error.message);
    } else {
      console.log("Produto adicionado com sucesso:", data);
      fetchSorteioData();
      closeModal();
    }
  } catch (err) {
    console.error("Erro ao cadastrar produto:", err.message);
  }
};
</script>

<style scoped>
.produtos-container {
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

.produtos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.produto-card {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  flex-wrap: wrap;
}

.produto-card img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}

.produto-info p {
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
