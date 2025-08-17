<script setup>
import { vMaska } from "maska/vue"
import CryptoJS from 'crypto-js'
import { ref } from 'vue'
import { createClient } from "@supabase/supabase-js";


const supaStore = useSupabaseClient();
const SUPABASE_URL = supaStore.supabaseUrl;
const SUPABASE_KEY = supaStore.supabaseKey;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const loading = ref(false);
const cpf = ref('');
const secretKey = 'C3tech203010@'


const decryptPassword = (encryptedPassword) => {
  const bytes = CryptoJS.AES.decrypt(encryptedPassword, secretKey)
  return bytes.toString(CryptoJS.enc.Utf8)
}

const cleanCpf = (cpf) => cpf.replace(/\D/g, '');

// Estado para controlar qual formulário está ativo
const isLoginForm = ref(true);
// const entrarNow = ref(true);

// Estados para os campos do formulário
const loginForm = ref({
  email: '',
  password: ''
})

// Função para alternar entre os formulários
const toggleForm = () => {
  isLoginForm.value = !isLoginForm.value
}

// Funções para submeter os formulários
// const handleLogin = async () => {
//   loading.value = true;
//   try {
//     const { data, error } = await supabase.auth.signInWithPassword({
//       email: loginForm.value.email,
//       password: loginForm.value.password,
//     });
//     if (error) throw error;
//     navigateTo('/dashboard');
//     console.log('Login successful:', data);
//   } catch (error) {
//     console.error('Login error:', error);
//   } finally {
//     loading.value = false;
//   }
// }

async function handleLogin() {
  if (!email.value || !password.value) return;
  loading.value = true;
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  });
  loading.value = false;
  if (error) throw error;
  navigateTo('/dashboard');
  if (!error) {
    console.log("Login bem-sucedido:");
  } else {
    console.log("Erro no login:", error.message);
  }
}

</script>


<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-form-wrapper">
        <div class="auth-header">
          <h1>Bem-vindo de volta!</h1>
          <p class="field-hint">Faça login para acessar seus workflows e continuar de onde parou.</p>
        </div>

        <form class="form-stack" @submit.prevent="handleLogin">
          <div class="field">
            <label for="email" class="field-label">Email</label>
            <input id="email" v-model="email" type="email" class="input" placeholder="seu.email@exemplo.com" required />
          </div>

          <div class="field">
            <label for="password" class="field-label">Senha</label>
            <input id="password" v-model="password" type="password" class="input" placeholder="Sua senha" required />
          </div>

          <button type="submit" class="btn btn-gradient btn-lg btn-block" :disabled="loading">
            <span v-if="!loading">Entrar</span>
            <span v-else>Entrando...</span>
          </button>
        </form>

        <div class="auth-links">
          <NuxtLink to="/auth/cadastro" class="hover-underline">Não tem uma conta? <strong>Cadastre-se</strong></NuxtLink>
          <NuxtLink to="/auth/recuperar-senha" class="hover-underline field-hint">Esqueceu sua senha?</NuxtLink>
        </div>
      </div>

      <div class="auth-panel">
        <div class="auth-panel-content">
          <img src="/icons/brand-icon.svg" alt="Ícone FluxoPronto" class="auth-panel-icon"/>
          <h2>Acelere sua Operação com Automações Prontas</h2>
          <p>Encontre, compre e implante fluxos de trabalho n8n em minutos, não em semanas.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  display: grid;
  place-items: center;
  min-height: 100vh;
  background-color: var(--surface-2);
  padding: 24px;
}

.auth-container {
  display: grid;
  grid-template-columns: 1fr;
  width: 100%;
  max-width: 1100px;
  background: var(--surface-1);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}

.auth-form-wrapper {
  padding: clamp(32px, 8vw, 64px);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.auth-header {
  margin-bottom: 32px;
  text-align: center;
}

.auth-header h1 {
  font-size: clamp(1.8rem, 5vw, 2.25rem);
  font-weight: 800;
}

.auth-header .field-hint {
  margin-top: 8px;
  font-size: 1.05rem;
  max-width: 380px;
  margin-left: auto;
  margin-right: auto;
}

.form-stack {
  display: grid;
  gap: 20px;
}

.auth-links {
  margin-top: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  font-size: 0.9rem;
}

.auth-links a {
  color: var(--text-2);
  text-decoration: none;
}
.auth-links a:hover {
  color: var(--text-1);
}
.auth-links strong {
  color: var(--brand-500);
  font-weight: 600;
}

/* Painel Lateral */
.auth-panel {
  display: none; /* Oculto em telas menores */
  background: var(--gradient-brand);
  color: #fff;
  padding: 64px;
}

.auth-panel-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 16px;
  text-align: left;
}

.auth-panel-icon {
  width: 56px;
  height: 56px;
  margin-bottom: 8px;
}

.auth-panel h2 {
  color: #fff;
  font-size: 1.75rem;
  font-weight: 700;
}

.auth-panel p {
  color: var(--brand-200);
  line-height: 1.6;
  font-size: 1rem;
}


/* --- RESPONSIVIDADE --- */
@media (min-width: 992px) {
  .auth-container {
    grid-template-columns: 1.1fr 1fr;
  }
  .auth-panel {
    display: flex;
    align-items: center;
  }
  .auth-header {
    text-align: left;
  }
  .auth-header .field-hint {
    margin-left: 0;
    margin-right: 0;
  }
}
</style>
