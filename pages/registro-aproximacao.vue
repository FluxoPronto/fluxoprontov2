<template>
  <div class="auth-container">
    <div v-if="showPopup" class="popup-overlay" @click="closePopup">
      <div class="popup-content" @click.stop>
        <div class="popup-header">
          <h3>{{ popupTitle }}</h3>
          <button class="close-btn" @click="closePopup">&times;</button>
        </div>
        <div class="popup-body">
          <!-- <div class="popup-icon">
            <img src="https://emojitool.com/img/apple/ios-17.4/ios-17.4-179.png" width="50">
          </div> -->
          <p class="popup-message" v-html="popupMessage"></p>
          <div class="popup-actions">
            <button class="btn-popup-primary" @click="handlePopupAction">
              {{ popupButtonText }}
            </button>
            <button class="btn-popup-secondary" @click="closePopup">
              {{ popupButtonTextNone }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="auth-card">
      <div class="logo-container">
        <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-J2M4IIsPAPbrwxntzNvO8BZKVArlAU.png"
          alt="Drogaria Popular do Pará" class="logo" />
      </div>
      <form @submit.prevent="handleRegister" class="auth-form">
        <h2>Cadastro</h2>
        <div class="form-group">
          <label for="login-email">Seu nome completo</label>
          <input id="login-email" type="text" v-model="form.nome" placeholder="Seu nome" required />
        </div>
        <div class="form-group">
          <label for="register-contact">Seu contato whatsapp</label>
          <div style="display: flex; gap: 8px;">
            <!-- <select v-model="ddd" required style="width: 80px;">
              <option value="+55">+55</option>
            </select> -->
            <input
              id="register-contact"
              type="text"
              v-model="contactNumber"
              placeholder="(94) 99102-0304"
              maxlength="15"
              required
              v-maska="'(##) #####-####'"
              style="flex: 1;"
            />
          </div>
        </div>
        <div class="form-group">
          <label for="register-cpf">Seu registo CPF</label>
          <input id="register-cpf" type="text" v-model="cpf" placeholder="000.000.000-00" v-maska="'###.###.###-##'"
            maxlength="14" required :disabled="loading" />
        </div>
        <!-- <div class="form-group">
          <label for="login-password">Sua senha</label>
          <input id="login-password" type="password" v-model="form.password" placeholder="Sua senha" required />
        </div> -->
        <div class="form-group">
          <label for="star-rating">Avaliação</label>
          <div class="star-rating" style="display: flex; gap: 30px;margin-top: 20px;">
            <span
              v-for="star in 5"
              :key="star"
              @click="setRating(star)"
              @mouseover="hoverRating = star"
              @mouseleave="hoverRating = rating"
              style="cursor: pointer; font-size: 2rem; color: #FFD700;"
            >
              <svg
                v-if="star <= (hoverRating || rating)"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="#FFD700"
                stroke="#FFA500"
                stroke-width="2"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"/>
              </svg>
              <svg
                v-else
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FFD700"
                stroke-width="2"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"/>
              </svg>
            </span>
          </div>
          <input type="hidden" v-model="rating" />
        </div>
        <button type="submit" class="btn-primary">
          {{ loading ? "Cadastrando..." : "Cadastrar" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { vMaska } from "maska/vue";
import { ref, onMounted } from "vue";
import CryptoJS from "crypto-js";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "vue-router";

const supaStore = useSupabaseClient();
const SUPABASE_URL = supaStore.supabaseUrl;
const SUPABASE_KEY = supaStore.supabaseKey;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const secretKey = "C3tech203010@";
const loading = ref(false);
const router = useRouter();
const cpf = ref("");
const message = ref("");
const token = ref("");
const ddd = ref("+55");
const contactNumber = ref("");

// Estados do Popup
const showPopup = ref(false);
const popupTitle = ref("");
const popupMessage = ref("");
const popupButtonText = ref("");
const popupButtonTextNone = ref("");
const popupType = ref("");

const rating = ref(0);
const hoverRating = ref(0);

const setRating = (star) => {
  rating.value = star;
  hoverRating.value = star;
};

const getCurrentDateTimeBR = () => {
  const now = new Date();
  const dia = String(now.getDate()).padStart(2, '0');
  const mes = String(now.getMonth() + 1).padStart(2, '0');
  const ano = now.getFullYear();
  const hora = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  return `${dia}/${mes}/${ano} - ${hora}h${min}`;
};

const form_sorteio = ref({
  token: token,
  status: "pendente",
});

const form_update_sorteio = ref({
  token: token,
  status: "lido",
  user_data: {},
});

const form = ref({
  nome: "",
  email: "",
  cpf: "",
  password: "",
});

// Funções do Popup
const showWelcomePopup = () => {
  popupType.value = "welcome";
  popupTitle.value = "🎁 Ganhe um brinde!";
  popupMessage.value = `
    <span>Faça seu cadastro e avalie nossa drogaria <br> para ganhar um brinde exclusivo.</span><br><br>
    <span>Não perca essa oportunidade!</span><br>
  `;
  popupButtonText.value = "Entendi, vou me cadastrar!";
  popupButtonTextNone.value = "Fechar";
  showPopup.value = true;
};

const showSuccessPopup = () => {
  popupType.value = "success";
  popupTitle.value = `🎉 Parabéns ${form.value.nome}!`
  popupMessage.value = `
    <span>Seu cadastro foi realizado com sucesso.<br>
    Você acaba de ganhar um <b>Brinde Especial</b> da<br>  Drogaria Popular do Pará!<br>
    <span style="color: #e30613; font-weight: bold;">Realize um "PRINT" desta tela e apresente <br> no balcão para receber seu Brinde!</span><br><br>
    <span style="color: #003399; font-weight: bold;">Data resgate <b>${getCurrentDateTimeBR()}</b.</span><br><br>
    <span style="color: #b0b0b0; font-weight: bold;font-size: 12px">Esta tela não é válida para resgates futuros.  <small>Cod. 580708</small></span><br>
   
    </span>
  `;
  popupButtonText.value = "Ir para Login";
  popupButtonTextNone.value = "Fechar";
  showPopup.value = true;
};

const closePopup = () => {
  showPopup.value = false;
  if (popupType.value === "success") {
    router.push("/login-cliente");
  }
};

const handlePopupAction = () => {
  if (popupType.value === "success") {
    router.push("/login-cliente");
  }
  closePopup();
};

const encryptPassword = (cpf) => {
  return CryptoJS.AES.encrypt(cpf, secretKey).toString();
};

const decryptPassword = (encryptedPassword) => {
  const bytes = CryptoJS.AES.decrypt(encryptedPassword, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

const cleanCpf = (cpf) => cpf.replace(/\D/g, "");
const cleanContactNumber = (number) => number.replace(/\D/g, "");
const getFullContact = () => {
  return ddd.value + cleanContactNumber(contactNumber.value);
};



const handleRegister = async () => {
  try {
    loading.value = true;
    const cleanedCpf = cleanCpf(cpf.value);
    const { data, error } = await supabase.auth.signUp({
      email: cleanedCpf + '@seuemail.com',
      password: cleanedCpf,
      options: {
        data: {
          nome: form.value.nome,
          cpf: cleanedCpf,
          pontos: 0,
          role: "cliente",
          token: token.value,
          contato: getFullContact(),
          avaliacao: rating.value,
        },
      },
    });

    if (error) {
      loading.value = false;
      if (error.code === 'user_already_exists') {
        useToastify("Usuário já existe!", {
          autoClose: 2000,
          theme: "light",
          type: "error",
          position: ToastifyOption.POSITION.TOP_RIGHT,
        });
      }
      return;
    }

    if (data) {
      console.log("DATA:", data);
      const { data: insertOk, error: insertError } = await supabase
        .from('users_sorteio_qrcode')
        .insert([{
          user_id: data.user?.id,
          nome: form.value.nome,
          email_auth: cleanedCpf + '@seuemail.com',
          email_profile_client: '',
          cpf: cleanedCpf,
          password: cleanedCpf,
          pontos: 0,
          token: "",
          token_id: null,
          contato: getFullContact(),
          avaliacao: rating.value,
        }])
      
      // Mostrar popup de sucesso após cadastro
      setTimeout(() => {
        showSuccessPopup();
      }, 500);

      if (insertError) return console.error('Erro ao inserir dados na tabela users_sorteio_qrcode:', insertError);
      
      if (insertOk) {
        loading.value = false;
        useToastify("Usuário cadastrado com sucesso!", {
          autoClose: 2000,
          theme: "light",
          type: "success",
          position: ToastifyOption.POSITION.TOP_RIGHT,
        });
        
       
      }
    }
  } catch (error) {
    loading.value = false;
    form.value.password = "";
    form.value.email = "";
    form.value.nome = "";
    form.value.cpf = "";
    useToastify("Erro ao cadastrar usuário. Tente novamente.", {
      autoClose: 2000,
      theme: "light",
      type: "error",
      position: ToastifyOption.POSITION.TOP_RIGHT,
    });
  }
};

const changes = supabase
  .channel("ultima_compra")
  .on(
    "postgres_changes",
    {
      schema: "public",
      event: "UPDATE",
    },
    (payload) => {
      console.log("Change received PAYLOAD!", payload);
    }
  )
  .subscribe();

onMounted(async () => {
  // Mostrar popup de boas-vindas ao montar o componente
  setTimeout(() => {
    showWelcomePopup();
  }, 1000);

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("token")) {
    token.value = urlParams.get("token");
    console.log("Token:", token.value);
    if (token.value) {
      const { data, error } = await supabase
        .from("sorteio_qrcode")
        .insert([form_sorteio.value]);
      if (error) {
        console.error("Erro ao inserir dados no sorteio_qrcode:", error);
        return;
      } else {
        const { data, error } = await supabase
          .from("sorteio_qrcode")
          .select("*")
          .eq("token", token.value);
        console.log("Dados inseridos no sorteio_qrcode:", data.length);
      }
    }
  }
});
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
}

.auth-card {
  width: 100%;
  max-width: 450px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  padding: 30px;
}

.logo-container {
  display: flex;
  justify-content: center;
}

.logo {
  max-width: 200px;
  height: auto;
}

.auth-form h2 {
  text-align: center;
  color: #003399;
  margin-bottom: 24px;
  font-size: 24px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.form-group input:focus {
  border-color: #003399;
  outline: none;
}

.btn-primary {
  width: 100%;
  background-color: #e30613;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 10px;
}

.btn-primary:hover {
  background-color: #c00;
}

.toggle-text {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

.toggle-text a {
  color: #003399;
  text-decoration: none;
  font-weight: 500;
}

.toggle-text a:hover {
  text-decoration: underline;
}

/* Estilos do Popup */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.popup-content {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  animation: popupSlideIn 0.3s ease-out;
}

@keyframes popupSlideIn {
  from {
    opacity: 0;
    transform: translateY(-30px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 0 24px;
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;
}

.popup-header h3 {
  margin: 0;
  color: #003399;
  font-size: 24px;
  font-weight: 700;
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}

.close-btn:hover {
  background-color: #f5f5f5;
  color: #666;
}

.popup-body {
  padding: 0 24px 24px 24px;
  text-align: center;
}

.popup-icon {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
}

.popup-message {
  font-size: 16px;
  line-height: 1.6;
  color: #555;
  margin-bottom: 30px;
  text-align: center;
}

.popup-actions {
  display: flex;
  gap: 12px;
  flex-direction: column;
}

.btn-popup-primary {
  background: linear-gradient(135deg, #e30613, #ff1744);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 14px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(227, 6, 19, 0.3);
}

.btn-popup-primary:hover {
  background: linear-gradient(135deg, #c00, #e30613);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(227, 6, 19, 0.4);
}

.btn-popup-secondary {
  background: transparent;
  color: #666;
  border: 2px solid #ddd;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-popup-secondary:hover {
  border-color: #003399;
  color: #003399;
  background-color: #f8f9ff;
}

@media (max-width: 480px) {
  .popup-content {
    margin: 20px;
    width: calc(100% - 40px);
  }
  
  .popup-header {
    padding: 20px 20px 0 20px;
  }
  
  .popup-body {
    padding: 0 20px 20px 20px;
  }
  
  .popup-header h3 {
    font-size: 20px;
  }
  
  .popup-actions {
    flex-direction: column;
  }
}
</style>
