<template>
  <div class="clientes-container">
    <div style="display: flex;align-items: baseline;width: 100%;justify-content: space-between;">
      <div>
        <h1 class="titulo">Clientes</h1>
        <!-- <p class="subtitulo">Bem-vindo à sua lista de clientes!</p> -->
        <p class="subtitulo">
            Módulo em melhoria de performance e segurança
        </p>
      </div>
      <!-- <button @click="openModalRegister">Cadastrar Clientes</button> -->
    </div>

    <!-- register modal -->
    <div v-if="showModalRegister" class="modal">
      <div class="modal-content">
        <h2>Cadastrar Cliente</h2>
        <form @submit.prevent="addClient">
          <label>Nome:</label>
          <input type="text" v-model="form.nome" required />

          <label>Seu e-mail:</label>
          <input type="text" v-model="form.email" required />

         <label>CPF</label>
         <input 
            id="register-cpf" 
            type="text" 
            v-model="cpf" 
            placeholder="000.000.000-00"
            v-maska="'###.###.###-##'"
            maxlength="14"
            required
          >

          <label>Sua senha</label>
          <input 
            id="login-password" 
            type="password" 
            v-model="form.password" 
            placeholder="Sua senha" 
            required
          >

          

          <div class="modal-buttons">
            <button type="submit">Criar</button>
            <button type="button" @click="closeModalRegister">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- AJUSTAR LOGICA DEPOIS DESTA DIV ABAIXO -->
    <div class="clientes-lista" v-if="false">
    <!-- <div class="clientes-lista" v-if="dataClients"> -->
      <div class="card-cliente" v-for="cliente in dataClients" :key="cliente.id">
        <p><strong>Nome:</strong> {{ cliente.nome }}</p>
        <!-- <p><strong>Email:</strong> {{ cliente.email }}</p> -->
        <p><strong>CPF:</strong> {{ cliente.cpf }}</p>
        <p><strong>Pontos:</strong> {{ cliente.pontos }}</p>
        <!-- <input class="input-pontos" type="number" v-model="cliente.pontos"
          @change="updatePontos(cliente.id, cliente.pontos)" placeholder="Editar pontos" /> -->
        <button @click="openModal(cliente.user_id)">Ver Últimas Compras</button>
      </div>
    </div>

    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h2>Últimas Compras</h2>
        <table>
          <thead>
            <tr>
              <th>Ponto Compra</th>
              <th>Resgate Realizado</th>
              <th>Liberado</th>
            </tr>
          </thead>
          <tbody>
            <!-- Exibe as compras existentes -->
            <tr v-for="compra in compras" :key="compra.id">
              <td>
                <input type="number" v-model.number="compra.pontos_compra" @change="updateCompra(compra)" />
              </td>
              <td>
                <input type="text" v-model="compra.resgate_realizado" @change="updateCompra(compra)" />
              </td>
              <td>
                <!-- {{ compra.liberado ? compra.liberado > 49 ? "Sim" : "Não" : "Não" }} -->
                <select v-model="compra.liberado" @change="updateCompra(compra)">
                  <option disabled :value="true">Sim</option>
                  <option disabled :value="false">Não</option>
                </select>
              </td>
              <td>
                <button @click="deleteCompra(compra.id)">Deletar</button>
              </td>
            </tr>

            <!-- Campos para adicionar uma nova compra -->
            <tr>
              <td>
                <input type="number" v-model.number="newCompra.pontos_compra" placeholder="Digite o ponto da compra" />
              </td>
              <td>
                <input type="text" v-model="newCompra.resgate_realizado" placeholder="Digite o resgate realizado" />
              </td>
              <td>
                <select v-model="newCompra.liberado">
                  <option disabled :value="true">Sim</option>
                  <option disabled :value="false">Não</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
        <div style="width: 100%;display: flex;justify-content: space-between;">
          <button @click="addCompra" style="background-color: #30369d;">Adicionar Compra</button>
          <button @click="closeModal">Fechar</button>
        </div>
        
      </div>
    </div>

    <p v-else-if="error" class="erro">
      Erro ao carregar clientes: {{ error.message }}
    </p>
    <!-- <p v-else>Carregando...</p> -->
  </div>
</template>

<script setup>
import { ref } from "vue";
import { createClient } from "@supabase/supabase-js";
import CryptoJS from 'crypto-js'
import { vMaska } from "maska/vue"
definePageMeta({
  middleware: ['auth'],
  layout: 'dashboard'
});
const supaStore = useSupabaseClient();
const SUPABASE_URL = supaStore.supabaseUrl;
const SUPABASE_KEY = supaStore.supabaseKey;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const secretKey = 'C3tech203010@'

const showModalRegister = ref(false);
const showModal = ref(false);
const compras = ref([]);
const selectedUserId = ref(null);
const cpf = ref('');

const dataClients = ref([]);

const encryptPassword = (password) => {
  return CryptoJS.AES.encrypt(password, secretKey).toString()
}

const decryptPassword = (encryptedPassword) => {
  const bytes = CryptoJS.AES.decrypt(encryptedPassword, secretKey)
  return bytes.toString(CryptoJS.enc.Utf8)
}

const newCompra = ref({
  pontos_compra: null,
  resgate_realizado: null,
  liberado: false,
});

const cleanCpf = (cpf) => cpf.replace(/\D/g, '');

const form = ref({
  nome: '',
  email: '',
  cpf: '',
  password: ''
});


const addClient = async () => {
  console.log("form ->", form.value);
  try {
    const cleanedCpf = cleanCpf(cpf.value)
    const encryptedPassword = encryptPassword(form.value.password);

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: form.value.email,
      password: form.value.password,
      options: {
        data: {
          nome: form.value.nome,
          cpf: cleanedCpf,
          pontos: 0,
          role: 'cliente',
          token: '',
        }
      }
    });


    const { data: dataStatus, error: errorStatus } = await supabase.from('users_sorteio_qrcode').insert([{
      user_id: authData.user?.id,
      nome: form.value.nome,
      email: form.value.email,
      cpf: cleanedCpf,
      password: encryptedPassword,
      pontos: 0,
      token: '',
      token_id: null
    }])

  } catch (error) {
  } finally {
    // loading.value = false
  }
}

function openModalRegister() {
  showModalRegister.value = true;
}

function closeModalRegister() {
  showModalRegister.value = false;
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

async function openModal(userId) {
  selectedUserId.value = userId;
  showModal.value = true;

  const { data: data_ultima_compra, error: error_ultima_compra } =
    await supabase.from("ultima_compra").select("*").eq("user_id", userId);

  if (error_ultima_compra) {
    console.error(
      "Erro ao buscar últimas compras:",
      error_ultima_compra.message
    );
  } else {
    compras.value = data_ultima_compra;
  }
}

function closeModal() {
  showModal.value = false;
  compras.value = [];
  newCompra.value = {
    pontos_compra: null,
    resgate_realizado: null,
    liberado: false,
  };
}

async function deleteCompra(id) {
  const { error } = await supabase
    .from("ultima_compra")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Erro ao deletar compra:", error.message);
  } else {
    console.log(`Compra com ID ${id} deletada com sucesso.`);
    // Remove o item da lista localmente
    compras.value = compras.value.filter((compra) => compra.id !== id);
  }
}

async function updateCompra(compra) {
  compra.liberado = compra.pontos_compra > 49; // Define o campo liberado como true ou false

  const { data, error } = await supabase
    .from("ultima_compra")
    .update({
      pontos_compra: compra.pontos_compra,
      resgate_realizado: compra.resgate_realizado,
      liberado: compra.liberado,
    })
    .eq("id", compra.id);

  if (error) {
    console.error("Erro ao atualizar compra:", error.message);
  } else {
    console.log("Compra atualizada com sucesso:", data);
  }
}

async function addCompra() {
  if (!newCompra.value.pontos_compra) {
    alert("Preencha todos os campos antes de adicionar uma compra.");
    return;
  }

  newCompra.value.liberado = newCompra.value.pontos_compra > 49; // Define o campo liberado com base no valor

  const { data, error } = await supabase
    .from("ultima_compra")
    .insert({
      user_id: selectedUserId.value,
      pontos_compra: newCompra.value.pontos_compra,
      resgate_realizado: newCompra.value.resgate_realizado,
      liberado: newCompra.value.liberado,
    });

  if (error) {
    console.error("Erro ao adicionar compra:", error.message);
  } else {
    console.log("Compra adicionada com sucesso:", data);

    // Adiciona a nova compra à lista e limpa os campos para a próxima
    compras.value.push(data[0]);
    newCompra.value = {
      pontos_compra: null,
      resgate_realizado: null,
      liberado: false,
    };
  }
}


async function getClients() {
  console.log("chamando clientes ativos")
  const { data, error } = await supabase.from("users_sorteio_qrcode").select("*");
  if (error) console.error("Error fetching premios:", error);

  if (data) return dataClients.value = data;
}

const updatePontos = async (id, pontos) => {
  try {
    const { data, error } = await supabase
      .from("users_sorteio_qrcode")
      .update({ pontos })
      .eq("id", id);

    useToastify("Pontos atualizados!", {
      autoClose: 2000,
      theme: "colored",
      type: "success",
      position: ToastifyOption.POSITION.TOP_RIGHT,
    });

    if (error) {
      throw new Error(`Erro ao atualizar pontos: ${error.message}`);
    }

    console.log(`Pontos atualizados para o usuário ${id}: ${pontos}`);

    const { data: user, error: erros } = await supabase.auth.updateUser({
      data: { pontos: pontos },
    });

    if (erros) {
      throw new Error(
        `Erro ao atualizar metadados do usuário: ${erros.message}`
      );
    }
  } catch (err) {
    console.error(err.message);
  }
};

onMounted(() => {
  getClients();
});

definePageMeta({
  middleware: ["auth"],
  layout: "dashboard",
});
</script>

<style scoped>
.clientes-container {
  padding: 30px 20px;
}

.clientes-container h1 {
  font-size: 1.8rem;
  margin-bottom: 5px;
  color: #30369d;
}

.clientes-container .subtitulo {
  margin-bottom: 30px;
  color: #555;
}

.clientes-lista {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

@media (min-width: 900px) {
  .clientes-lista {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 20px;
  }
}

.card-cliente {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-cliente p {
  margin: 0;
  font-size: 0.95rem;
  color: #333;
}

.input-pontos {
  padding: 10px 14px;
  border: 1px solid #e30614;
  border-radius: 8px;
  font-size: 0.95rem;
  width: 100%;
  margin-top: 10px;
}

.input-pontos:focus {
  outline: none;
  border-color: #b50411;
  box-shadow: 0 0 6px rgba(227, 6, 20, 0.4);
}

.card-cliente button {
  margin-top: 10px;
  align-self: flex-start;
  background-color: #e30614;
  color: white;
  padding: 10px 14px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;
}

.card-cliente button:hover {
  background-color: #b70411;
}

.erro {
  color: red;
  margin-top: 20px;
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
  max-width: 600px;
  width: 100%;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th,
td {
  border: 1px solid #ddd;
  padding: 10px;
  font-size: 0.95rem;
  text-align: center;
}

th {
  background-color: #f4f4f4;
  font-weight: 600;
  color: #30369d;
}

.modal-content input,
.modal-content select {
  padding: 10px 14px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 0.95rem;
  width: 100%;
}

.modal-content button {
  margin-top: 20px;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  background-color: #e30614;
  color: white;
  transition: background-color 0.2s ease-in-out;
}

.modal-content button:hover {
  background-color: #b50411;
}
</style>
