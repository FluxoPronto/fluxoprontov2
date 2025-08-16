<template>
  <div class="catalog-container">
    <h1>Catálogo</h1>
    <p>Bem-vindo à sua lista de prêmios!</p>

    <div class="catalog-grid">
      <div
        class="premio-card"
        v-for="(catalogo, index) in produtosCatalogo"
        :key="index"
      >
        <img
          :src="catalogo.fileName ? `https://api.visaonews.org/storage/v1/object/public/catalogo/667d38d3-b1a8-44b2-b959-6ce45a580173/${catalogo.fileName}` : ''"
          alt="Imagem do Produto"
        />
        <div>
          <p><strong>ID:</strong> {{ index + 1 }}</p>
          <p><strong>Produto:</strong> {{ catalogo.name }}</p>
          <p><strong>Retirada:</strong> {{ catalogo.retirada_at || 'Indefinido' }}</p>
          <p><strong>Entregue por:</strong> {{ catalogo.data_resgate || 'Indefinido' }}</p>
        </div>
        <!-- <button @click="deleteItem(catalogo)">Deletar</button> -->
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
  layout: 'dashcliente'
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
  pontos: null,
  nome: "",
  descricao: "",
  atualiza_em: null,
});
const imageFile = ref(null);
const sub = ref(null);

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

// async function deleteItem(catalogo) {
//   console.log("Deleting produto_catalogo...", catalogo.fileName);

//   try {
//     // Deleta o arquivo do bucket
//     if (catalogo.fileName) {
//       const { error: bucketError } = await supabase.storage
//         .from("catalogo/" + sub.value + "/" + catalogo.fileName) // Substitua "catalogo" pelo nome do bucket
//         .remove([catalogo.fileName]);

//       if (bucketError) {
//         console.error("Erro ao deletar arquivo do bucket:", bucketError.message);
//         return;
//       }

//       console.log("Arquivo deletado do bucket com sucesso:", catalogo.fileName);
//     }

//     // Deleta o item do banco de dados
//     const { error: dbError } = await supabase
//       .from("catalogo_produtos")
//       .delete()
//       .eq("id", catalogo.id);

//     if (dbError) {
//       console.error("Erro ao deletar produto do banco de dados:", dbError.message);
//       return;
//     }

//     console.log("Produto deletado com sucesso do banco de dados:", catalogo.id);

//     // Remove o item da lista localmente
//     produtosCatalogo.value = produtosCatalogo.value.filter(
//       (item) => item.id !== catalogo.id
//     );
//   } catch (err) {
//     console.error("Erro ao deletar item:", err.message);
//   }
// }

async function fetchCatalogoData() {
  console.log('Fetching produtos_sorteio...');
  const { data, error } = await supabase.from('catalogo_produtos').select('*');
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
    pontos: null,
    nome: "",
    descricao: "",
    atualiza_em: null,
  };
  imageFile.value = null;
}

function handleFileUpload(event) {
  imageFile.value = event.target.files[0];
}

async function addProduto() {
  if (!imageFile.value) {
    alert("Por favor, selecione uma imagem.");
    return;
  }

  try {
    // Envia a imagem para o bucket do Supabase
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("catalogo/" + sub.value)
      .upload(uuidv4(), imageFile.value, {
        cacheControl: "3600",
        contentType: imageFile.value.type,
      });

    if (uploadError) {
      console.error("Erro ao enviar imagem:", uploadError.message);
      return;
    }

    console.log("Imagem enviada com sucesso:", uploadData);

    // Define o nome do arquivo no campo fileName
    newProduto.value.fileName = uploadData.path;
    newProduto.value.atualiza_em = new Date().toISOString();

    // Insere o produto no banco de dados
    const { data, error } = await supabase.from("catalogo_produtos").insert(newProduto.value);

    if (error) {
      console.error("Erro ao adicionar produto:", error.message);
    } else {
      console.log("Produto adicionado com sucesso:", data);
      listPremios.value.push(data[0]); // Adiciona o novo produto à lista
      fetchCatalogoData(); // Atualiza a lista de produtos
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

.catalog-container h1 {
  font-size: 1.8rem;
  margin-bottom: 5px;
  color: #30369d;
}

.catalog-container > p {
  margin-bottom: 30px;
  color: #555;
}

.catalog-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

@media (min-width: 768px) {
  .catalog-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 20px;
  }
}

.premio-card {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  flex-wrap: wrap;
}

.premio-card img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}

.premio-card p {
  margin: 0;
  font-size: 0.95rem;
  color: #333;
}

.premio-card button {
  margin-left: auto;
  background-color: #e30614;
  color: white;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 0.95rem;
  border: none;
  cursor: pointer;
}

.premio-card button:hover {
  background-color: #b70411;
}
</style>