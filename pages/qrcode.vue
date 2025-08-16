<template>
  <div class="container">
    <div class="main-content">
      <div class="main-text">
        <div v-if="!tokenFound" style="display: grid; gap: 20px">
          <img
            src="../assets/images/titulo-ganhadores.png"
            alt="ganhadores"
            width="200"
            style="margin: 0 auto"
          />
          <img src="../assets/images/ganhador1.png" alt="QR Code" width="280" />
        </div>
      </div>
      <img
        src="../assets/images/menina.png"
        alt="imagem"
        width="350"
        class="menina"
      />
      <img
        src="../assets/images/popularcard.png"
        alt="imagem"
        width="300"
        class="popularcard"
      />
    </div>

    <div class="footer">
      <img
        v-if="!tokenFound"
        :src="qrCodeUrl"
        alt="QR Code"
        width="150"
        class="qr-code"
      />
      <div>
        <div v-if="tokenFound">
          <img
            src="https://cdn.pixabay.com/animation/2022/07/29/03/42/03-42-05-37_512.gif"
            width="250"
          />
          <div class="escanear-qrcode">
            Atenção, seu tempo
            <span class="time">{{ formattedTime }}</span> para realizar o
            cadastro
          </div>
        </div>
        <p v-else class="escanear-qrcode">
          Escaneie o Qrcode e ganhe prêmios
          <img
            src="https://giphy-teste.vercel.app/assets/confetti-8199bde4.gif"
            width="40"
          />
        </p>
      </div>
      <img
        src="../assets/images/drogariapopular.png"
        alt="Logo DPP"
        width="250"
        style="margin: 0 auto"
      />
    </div>

    <div
      class="site"
      style="display: flex; align-items: center; justify-content: space-around"
    >
      <p>populardopara.com</p>
      <p style="font-size: 12px">
        © todos os direitos reservados de Drogaria Popular Do Pará
      </p>
    </div>
    <pre style="background-color: orange; height: 10px">{{
      userDataAutenticado
    }}</pre>
    <!-- Authentication Popup -->
    <div v-if="tokenFound" class="auth-overlay" @click="closeAuthModal">
      <div class="auth-modal" @click.stop>
        <!-- Authenticating State -->
        <div v-if="!userAutenticado" class="auth-card authenticating">
          <div class="auth-header">
            <div class="auth-spinner">
              <div class="spinner-ring"></div>
              <div class="spinner-center">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </div>
            <h2 class="auth-title">Aguardando Autenticação</h2>
          </div>

          <div class="auth-body">
            <div class="auth-steps">
              <div class="step-item completed">
                <div class="step-icon">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 6L9 17l-5-5"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
                <p>QR Code escaneado com sucesso</p>
              </div>

              <div class="step-item active">
                <div class="step-icon loading">
                  <div class="step-spinner"></div>
                </div>
                <p>
                  Preencha seus dados no smartphone para validar seu cadastro
                </p>
              </div>

              <div class="step-item">
                <div class="step-icon">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 12l2 2 4-4"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
                <p>
                  Caso já possua cadastro, você será redirecionado
                  automaticamente
                </p>
              </div>
            </div>

            <div class="auth-image">
              <img
                src="../assets/images/authface.gif"
                alt="Autenticação"
                width="120"
              />
            </div>

            <div class="countdown-display">
              <div class="countdown-circle-auth">
                <span class="countdown-text-auth">{{ formattedTime }}</span>
              </div>
              <p class="countdown-label">Tempo restante para autenticação</p>
            </div>
          </div>
        </div>

        <!-- Authenticated State -->
        <div v-else class="auth-card authenticated">
          <div class="auth-header success">
            <div class="success-animation">
              <div class="success-circle">
                <svg
                  width="60"
                  height="60"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="12" cy="12" r="10" fill="#10B981" />
                  <path
                    d="M9 12l2 2 4-4"
                    stroke="white"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <div class="confetti">
                <div class="confetti-piece"></div>
                <div class="confetti-piece"></div>
                <div class="confetti-piece"></div>
                <div class="confetti-piece"></div>
                <div class="confetti-piece"></div>
              </div>
            </div>
            <h2 class="auth-title success">🎉 Autenticação Realizada!</h2>
          </div>

          <div class="auth-body">
            <div class="user-welcome">
              <div class="user-avatar-success">
                <img
                  :src="`https://ui-avatars.com/api/?name=${
                    userDataAutenticado?.nome || 'Usuario'
                  }&background=10B981&color=fff`"
                  alt="Avatar"
                />
              </div>
              <div class="user-info-success">
                <h3>Bem-vindo(a)!</h3>
                <p v-if="userDataAutenticado?.nome">
                  {{ userDataAutenticado.nome }}
                </p>
                <p v-if="userDataAutenticado?.email" class="user-email">
                  {{ userDataAutenticado.email }}
                </p>
              </div>
            </div>

            <div class="success-message">
              <p>
                Seus dados foram validados com sucesso! Você será redirecionado
                para a roleta em instantes.
              </p>
            </div>

            <div class="redirect-countdown">
              <div class="redirect-progress">
                <div
                  class="progress-bar"
                  :style="{ width: `${(10 - redirectCountdown) * 10}%` }"
                ></div>
              </div>
              <p>Redirecionando em {{ redirectCountdown }} segundos...</p>
            </div>

            <!-- Debug Info (pode ser removido em produção) -->
            <div v-if="userDataAutenticado && showDebugInfo" class="debug-info">
              <details>
                <summary>Dados do Usuário (Debug)</summary>
                <pre>{{ JSON.stringify(userDataAutenticado, null, 2) }}</pre>
              </details>
            </div>
          </div>
        </div>

        <!-- Close Button -->
        <button
          class="auth-close"
          @click="closeAuthModal"
          v-if="!userAutenticado"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line
              x1="18"
              y1="6"
              x2="6"
              y2="18"
              stroke="currentColor"
              stroke-width="2"
            />
            <line
              x1="6"
              y1="6"
              x2="18"
              y2="18"
              stroke="currentColor"
              stroke-width="2"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserData } from "@/composables/useUserData";
import scan from "./scan.vue";
import { ref, onMounted, watch } from "vue";
import { createClient } from "@supabase/supabase-js";

const userData = useUserData();
const qrCodeUrl = ref("");
const userDataAutenticado = ref(null);
const tokenFound = ref(false);
const totalSeconds = ref(180);
const formattedTime = ref("");
const tokenExists = ref("");
const containUser = ref(null);
const userAutenticado = ref(false);
const redirectCountdown = ref(10);
const showDebugInfo = ref(false); // Toggle para mostrar/esconder debug info

let intervalId = null;
let validateAutenticado = null;
let redirectInterval = null;

const supaStore = useSupabaseClient();
const SUPABASE_URL = supaStore.supabaseUrl;
const SUPABASE_KEY = supaStore.supabaseKey;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function generateToken() {
  return Math.random().toString(36).substring(7);
}

function updateFormattedTime() {
  const minutes = Math.floor(totalSeconds.value / 60);
  const seconds = totalSeconds.value % 60;
  formattedTime.value = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;
}

function startCountdown() {
  const interval = setInterval(() => {
    if (totalSeconds.value > 0) {
      totalSeconds.value--;
      updateFormattedTime();
    } else {
      clearInterval(interval);
      window.location.reload();
    }
  }, 1000);
}

function startRedirectCountdown() {
  redirectInterval = setInterval(() => {
    if (redirectCountdown.value > 0) {
      redirectCountdown.value--;
    } else {
      clearInterval(redirectInterval);
      userData.value = userDataAutenticado.value;
      navigateTo("/roleta");
    }
  }, 1000);
}

function closeAuthModal() {
  if (!userAutenticado.value) {
    tokenFound.value = false;
    // Reiniciar processo se necessário
  }
}

async function generateQRCode() {
  let token = generateToken();
  const url = `${window.location.origin}/cadastro?token=${token}`;
  qrCodeUrl.value = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    url
  )}`;

  console.log("QR Code gerado:", qrCodeUrl.value);
  console.log("Token gerado: ->", token);

  intervalId = setInterval(async () => {
    if (tokenFound.value) return;

    console.log("Verificando token no Supabase...");
    const changes = supabase
      .channel("sorteio_qrcode")
      .on(
        "postgres_changes",
        {
          schema: "public",
          event: "INSERT",
        },
        (payload) => {
          tokenExists.value = payload.new;
        }
      )
      .subscribe();

    if (tokenExists.value.token) {
      console.log("Token tokenExists:", tokenExists.value);
      tokenFound.value = true;
      startCountdown();

      const changes = supabase
        .channel("sorteio_qrcode")
        .on(
          "postgres_changes",
          {
            schema: "public",
            event: "UPDATE",
          },
          (payload) => {
            containUser.value = payload.new;
            console.log("UPDATE DADOS -->:", containUser.value);
            userAutenticado.value = true;
            userDataAutenticado.value = containUser.value.user_data;

            // Iniciar countdown de redirecionamento
            startRedirectCountdown();
          }
        )
        .subscribe();

      clearInterval(intervalId);
    } else {
      tokenFound.value = false;
    }
  }, 5000);
}

onMounted(() => {
  generateQRCode();
});
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.menina {
  display: block;
  left: -55px;
  position: absolute;
}

.time {
  background-color: red;
  padding: 5px 10px;
  border-radius: 20px;
}

.escanear-qrcode {
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  background-color: #001a61;
  padding: 10px 20px;
  border-radius: 30px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.popularcard {
  display: block;
  right: 100px;
  margin: 0 0 80px 0;
  position: absolute;
}

.site {
  text-align: center;
  background: red;
  color: white;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.main-content {
  flex: 1;
  display: grid;
  justify-content: center;
  align-items: flex-end;
  text-align: center;
  background-image: url(/_nuxt/assets/images/background.png);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.main-text {
  max-width: 600px;
  font-size: 24px;
  height: 100%;
  padding: 40px 0 20px 0;
}

.footer {
  height: 100px;
  background-image: url(/_nuxt/assets/images/backgroundblue.png);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: grid;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 0 20px;
}

.footer .qr-code {
  background: #fefefe;
  padding: 15px;
  border-radius: 20px;
  width: 250px;
  margin: 0 auto;
  box-shadow: 10px 10px 10px #011b64;
  transform: scale(1);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
  }
}

/* Authentication Popup Styles */
.auth-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.3s ease-out;
}

.auth-modal {
  position: relative;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  animation: modalSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.auth-card {
  background: linear-gradient(145deg, #ffffff, #f8fafc);
  border-radius: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.auth-header {
  text-align: center;
  padding: 2rem 2rem 1rem;
  background: linear-gradient(135deg, #001a61, #002ca1);
  color: white;
  position: relative;
}

.auth-header.success {
  background: linear-gradient(135deg, #10b981, #059669);
}

.auth-header::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
}

.auth-spinner {
  position: relative;
  margin-bottom: 1rem;
}

.spinner-ring {
  width: 80px;
  height: 80px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

.spinner-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
}

.success-animation {
  position: relative;
  margin-bottom: 1rem;
}

.success-circle {
  animation: bounceIn 0.6s ease-out;
}

.confetti {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 100px;
  pointer-events: none;
}

.confetti-piece {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #fbbf24;
  animation: confettiFall 2s ease-out infinite;
}

.confetti-piece:nth-child(1) {
  left: 10%;
  animation-delay: 0s;
  background: #ef4444;
}

.confetti-piece:nth-child(2) {
  left: 30%;
  animation-delay: 0.2s;
  background: #3b82f6;
}

.confetti-piece:nth-child(3) {
  left: 50%;
  animation-delay: 0.4s;
  background: #10b981;
}

.confetti-piece:nth-child(4) {
  left: 70%;
  animation-delay: 0.6s;
  background: #f59e0b;
}

.confetti-piece:nth-child(5) {
  left: 90%;
  animation-delay: 0.8s;
  background: #8b5cf6;
}

.auth-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.auth-title.success {
  font-size: 1.6rem;
}

.auth-body {
  padding: 2rem;
}

.auth-steps {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.step-item.completed {
  background: #d1fae5;
  border-left: 4px solid #10b981;
}

.step-item.active {
  background: #dbeafe;
  border-left: 4px solid #3b82f6;
}

.step-item:not(.completed):not(.active) {
  background: #f8fafc;
  border-left: 4px solid #e5e7eb;
}

.step-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.step-item.completed .step-icon {
  background: #10b981;
  color: white;
}

.step-item.active .step-icon {
  background: #3b82f6;
  color: white;
}

.step-item:not(.completed):not(.active) .step-icon {
  background: #e5e7eb;
  color: #6b7280;
}

.step-icon.loading {
  background: #3b82f6;
}

.step-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.step-item p {
  margin: 0;
  font-size: 0.9rem;
  color: #374151;
  font-weight: 500;
}

.auth-image {
  text-align: center;
  margin: 2rem 0;
}

.auth-image img {
  border-radius: 12px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

.countdown-display {
  text-align: center;
  margin-top: 2rem;
}

.countdown-circle-auth {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  box-shadow: 0 8px 25px rgba(239, 68, 68, 0.3);
}

.countdown-text-auth {
  font-size: 1.2rem;
  font-weight: 800;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.countdown-label {
  color: #6b7280;
  font-weight: 500;
  margin: 0;
  font-size: 0.9rem;
}

/* Authenticated State Styles */
.user-welcome {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #f0fdf4;
  padding: 1.5rem;
  border-radius: 16px;
  margin-bottom: 2rem;
  border: 1px solid #bbf7d0;
}

.user-avatar-success img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 3px solid #10b981;
}

.user-info-success h3 {
  margin: 0 0 0.5rem 0;
  color: #065f46;
  font-size: 1.2rem;
}

.user-info-success p {
  margin: 0;
  color: #047857;
  font-weight: 500;
}

.user-email {
  font-size: 0.9rem !important;
  opacity: 0.8;
}

.success-message {
  text-align: center;
  margin-bottom: 2rem;
}

.success-message p {
  color: #374151;
  font-size: 1rem;
  line-height: 1.6;
}

.redirect-countdown {
  text-align: center;
}

.redirect-progress {
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #059669);
  border-radius: 4px;
  transition: width 1s ease;
}

.redirect-countdown p {
  color: #6b7280;
  font-weight: 500;
  margin: 0;
}

.debug-info {
  margin-top: 2rem;
  padding: 1rem;
  background: #f3f4f6;
  border-radius: 8px;
  border: 1px solid #d1d5db;
}

.debug-info summary {
  cursor: pointer;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.debug-info pre {
  background: #1f2937;
  color: #f9fafb;
  padding: 1rem;
  border-radius: 6px;
  font-size: 0.8rem;
  overflow-x: auto;
  margin: 0;
}

.auth-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.auth-close:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-50px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes confettiFall {
  0% {
    transform: translateY(-100px) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100px) rotate(360deg);
    opacity: 0;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .main-text {
    font-size: 20px;
  }

  .footer {
    height: 500px;
  }

  .auth-modal {
    margin: 1rem;
    max-width: none;
  }

  .auth-header,
  .auth-body {
    padding: 1.5rem;
  }

  .auth-title {
    font-size: 1.4rem;
  }

  .user-welcome {
    flex-direction: column;
    text-align: center;
  }

  .step-item {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
}

@media (max-width: 480px) {
  .main-text {
    font-size: 18px;
  }

  .footer {
    height: 200px;
  }

  .auth-title {
    font-size: 1.2rem;
  }
}
</style>
