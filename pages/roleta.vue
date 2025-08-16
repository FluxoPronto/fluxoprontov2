<template>
  <div class="roulette-container">
    <div v-if="modalHide" class="container-opc">
      <!-- Modal de Resultado -->
      <div v-if="selectedItem" class="modal-card result-modal">
        <div class="modal-header">
          <div class="success-icon">
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
          <h2 class="result-title">🎉 Parabéns!</h2>
        </div>
        <div class="modal-body">
          <p class="result-label">Você ganhou:</p>
          <div class="result-prize">{{ selectedItem }}</div>
          <div class="countdown-container">
            <div class="countdown-circle">
              <span class="countdown-number">{{ countdownSelected }}</span>
            </div>
            <p class="countdown-text">Redirecionando automaticamente...</p>
          </div>
        </div>
      </div>

      <!-- Modal de Carregamento -->
      <div v-else class="modal-card loading-modal">
        <div class="modal-header">
          <div class="loading-spinner">
            <div class="spinner"></div>
          </div>
          <h1 class="loading-title">Preparando sua Roleta</h1>
        </div>
        <div class="modal-body">
          <div v-if="userData && userData.value" class="user-info">
            <div class="user-avatar">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="10" fill="#3B82F6" />
                <path
                  d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                  fill="white"
                />
              </svg>
            </div>
            <div class="user-details">
              <p class="user-name">
                Bem-vindo, {{ userData.name || "Jogador" }}!
              </p>
              <p class="user-status">Carregando seus dados...</p>
            </div>
          </div>

          <div class="countdown-container">
            <div class="countdown-circle loading">
              <span class="countdown-number">{{ countdown }}</span>
            </div>
            <p class="countdown-text">Iniciando em segundos...</p>
          </div>

          <div class="loading-dots">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="wheel-container">
      <canvas
        ref="canvasRef"
        width="600"
        height="600"
        class="wheel-canvas"
        :class="{ 'wheel-container-scaled': isScaled }"
      ></canvas>
      <div class="pointer-container">
        <div class="pointer-wrapper">
          <div
            class="pointer-tip"
            :style="{
              transform: `rotate(${pointerTipOffset}deg)`,
              transition:
                pointerTipOffset === 0
                  ? 'transform 0.15s ease-out'
                  : 'transform 0.05s ease-in-out',
            }"
          >
            <img
              src="../public/point.png"
              alt="Pointer"
              width="50"
              height="60"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserData } from "@/composables/useUserData";
import { ref, onMounted, onUnmounted, watch } from "vue";
import { createClient } from "@supabase/supabase-js";
import useConfetti from "canvas-confetti";
let collisionSound = null;
const isScaled = ref(false);
const imageCache = {};
let centralImage = null;
const supaStore = useSupabaseClient();
const SUPABASE_URL = supaStore.supabaseUrl;
const SUPABASE_KEY = supaStore.supabaseKey;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const userData = useUserData();

watch(userData, (newValue) => {
  console.log("Dados atualizados:", newValue);
});

const triggerConfetti = () => {
  const colors = ["#bb0000", "#0000ee"];
  const end = Date.now() + 5 * 1000;
  function frame() {
    useConfetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors,
    });
    useConfetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colors,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }
  requestAnimationFrame(frame);
};

if (typeof window !== "undefined" && typeof Audio !== "undefined") {
  collisionSound = new Audio(
    "https://commondatastorage.googleapis.com/codeskulptor-demos/pyman_assets/eatpellet.ogg"
  );
} else {
  console.warn("Audio API não está disponível no ambiente atual.");
}

let goodSound = null;
let badSound = null;

if (typeof window !== "undefined" && typeof Audio !== "undefined") {
  goodSound = new Audio(
    "https://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/pause.wav"
  );
  badSound = new Audio(
    "https://rpg.hamsterrepublic.com/wiki-images/d/d7/Oddbounce.ogg"
  );
} else {
  console.warn("Audio API não está disponível no ambiente atual.");
}

let items = [];
const nowImg = ref([]);
const countdown = ref(10);
const countdownSelected = ref(15);
const indisponivel = ref(false);

// Configurações da física da roleta - ajustadas para movimento mais natural
const FRICTION = 0.995;
const MIN_VELOCITY = 0.0005;
const INITIAL_VELOCITY = 0.05;
const MAX_VELOCITY = 0.25;
const MAX_SPIN_TIME = 5000;
const ACCELERATION_PHASE = 0.3;
const CONSTANT_PHASE = 0.4;
const DECELERATION_PHASE = 0.3;

const CONSTANT_VELOCITY = 0.002; // Ajuste para controlar a velocidade lenta
const SPIN_DURATION = 5000; // Duração do giro em milissegundos

// Refs para estado
const canvasRef = ref(null);
const spinning = ref(false);
const modalHide = ref(true);
const selectedItem = ref(null);
const angle = ref(0);
const velocity = ref(0);
const lastFrameTime = ref(0);
const pointerTipOffset = ref(0);
const animationId = ref(null);
const spinStartTime = ref(0);
const centerX = ref(200);
const centerY = ref(200);
const radius = ref(190);
const markerPositions = ref([]);
const lastCollisionTime = ref(0);
const targetEndAngle = ref(0);
const lastSelectedItem = ref(null); // Armazena o último item selecionado
const lastCollisionIndex = ref(null); // Índice do último ponto de colis

// Função para obter um índice aleatório que não seja o último selecionado
const getRandomIndex = () => {
  // Recupera o último item sorteado do localStorage
  const lastItemFromStorage = localStorage.getItem("lastRouletteItem");
  let lastIndex = null;

  if (lastItemFromStorage) {
    lastIndex = items.findIndex((item) => item.title === lastItemFromStorage);
  }

  let availableIndices = items.map((_, index) => index);

  // Se houver um último item selecionado e houver mais de um item, removemos ele das opções
  if (lastIndex !== null && items.length > 1) {
    availableIndices = availableIndices.filter((index) => index !== lastIndex);
  }

  // Seleciona um índice aleatório entre os disponíveis
  const randomIndex =
    availableIndices[Math.floor(Math.random() * availableIndices.length)];
  return randomIndex;
};

// Funções de easing para movimento mais natural
const easeInQuad = (t) => t * t;
const easeOutQuad = (t) => t * (2 - t);

onMounted(() => {
  fetchSorteioData();
  centralImage = new Image();
  centralImage.src = "/center.png"; // Substitua pelo caminho da sua imagem
  centralImage.onload = () => {
    drawWheel(); // Garante que a imagem central seja desenhada após o carregamento
  };
  // Pré-carrega todas as imagens
  console.log("Carregando imagem:", items);
  // const imagePromises = items.map((item) => {

  //   if (item.image) {
  //     return new Promise((resolve) => {
  //       const img = new Image();
  //       img.src = item.image;
  //       img.onload = () => {
  //         imageCache[item.id] = img;
  //         resolve();
  //       };
  //     });
  //   }
  //   return Promise.resolve();
  // });

  // // Aguarda o carregamento de todas as imagens antes de desenhar a roleta
  // Promise.all(imagePromises).then(() => {
  //   setTimeout(() => {
  //     isScaled.value = true; // Aplica a classe para aumentar a escala
  //   }, 3000); // 3 segundos

  //   // Define um ângulo inicial aleatório para evitar sempre começar na mesma posição
  //   angle.value = Math.random() * 2 * Math.PI;

  //   const canvas = canvasRef.value;
  //   if (!canvas) return;

  //   const ctx = canvas.getContext("2d");
  //   if (!ctx) return;

  //   // Ajusta o tamanho do canvas
  //   const dpr = window.devicePixelRatio || 1;
  //   const rect = canvas.getBoundingClientRect();
  //   canvas.width = rect.width * dpr;
  //   canvas.height = rect.height * dpr;
  //   ctx.scale(dpr, dpr);

  //   centerX.value = rect.width / 2;
  //   centerY.value = rect.height / 2;
  //   radius.value = Math.min(centerX.value, centerY.value) - 10;

  //   const segmentAngle = (2 * Math.PI) / items.length;
  //   markerPositions.value = items.map((item, index) => {
  //     const angle = index * segmentAngle;
  //     return { angle, title: item.title };
  //   });

  //   drawWheel(); // Desenha a roleta após o carregamento das imagens
  // });
});

// Limpa animação quando o componente é desmontado
onUnmounted(() => {
  if (animationId.value) {
    cancelAnimationFrame(animationId.value);
  }
});

// Observa mudanças no estado de spinning para iniciar/parar a animação
watch(spinning, (isSpinning) => {
  if (isSpinning) {
    animate();
  } else if (animationId.value) {
    cancelAnimationFrame(animationId.value);
    animationId.value = null;
  }
});

// Função de animação principal (permanece a mesma)
const animate = (timestamp) => {
  if (!timestamp) {
    animationId.value = requestAnimationFrame(animate);
    return;
  }

  if (!lastFrameTime.value) {
    lastFrameTime.value = timestamp;
    spinStartTime.value = timestamp;
    animationId.value = requestAnimationFrame(animate);
    return;
  }

  const deltaTime = timestamp - lastFrameTime.value;
  lastFrameTime.value = timestamp;

  // Calcula o tempo total de giro
  const spinDuration = timestamp - spinStartTime.value;

  if (spinDuration >= SPIN_DURATION) {
    // Tempo esgotado - para a roleta
    spinning.value = false;
    velocity.value = 0;
    checkSelectedItem();
    return;
  }

  // Ajusta a velocidade com base no tempo restante
  const timeLeft = SPIN_DURATION - spinDuration;
  if (timeLeft <= 2000) {
    // Últimos 2 segundos para desacelerar
    const progress = 1 - timeLeft / 2000; // Progresso da desaceleração (0 a 1)
    velocity.value = CONSTANT_VELOCITY * easeOutQuad(1 - progress); // Reduz a velocidade suavemente
  }

  // Atualiza o ângulo com base na velocidade
  angle.value = (angle.value + velocity.value * deltaTime) % (2 * Math.PI);

  // Verifica colisões com os marcadores para animar a ponta do ponteiro
  checkCollisions(timestamp);

  drawWheel();
  animationId.value = requestAnimationFrame(animate);
};

const checkCollisions = (timestamp) => {
  if (timestamp - lastCollisionTime.value < 100) return; // Evita múltiplas colisões em um curto período

  const segmentAngle = (2 * Math.PI) / items.length;
  const pointerAngle = 0; // 0 graus (direita)
  const normalizedAngle = (angle.value + 2 * Math.PI) % (2 * Math.PI);

  for (let i = 0; i < items.length; i++) {
    const markerAngle = (i * segmentAngle + normalizedAngle) % (2 * Math.PI);
    const angleDiff = Math.abs(markerAngle - pointerAngle);

    // Ajuste a sensibilidade da colisão
    const collisionThreshold = 0.05; // Reduza para aumentar a precisão da colisão
    if (
      angleDiff < collisionThreshold ||
      angleDiff > 2 * Math.PI - collisionThreshold
    ) {
      if (lastCollisionIndex.value === i) return; // Ignora se for o mesmo ponto

      lastCollisionIndex.value = i;

      // Animação da ponta do ponteiro
      const direction = -1;
      pointerTipOffset.value = direction * (10 + Math.random() * 5); // Aumenta o deslocamento para um impacto mais visível

      setTimeout(() => {
        pointerTipOffset.value = Math.abs(pointerTipOffset.value) * 0.6; // Reduz o deslocamento gradualmente
        setTimeout(() => {
          pointerTipOffset.value = 0;
        }, 80); // Aumenta o tempo para suavizar o retorno
      }, 80);

      // Vibração ao colidir
      if ("vibrate" in navigator) {
        navigator.vibrate(50); // Aumenta a duração da vibração
      }

      // Reproduz o som de colisão
      if (collisionSound) {
        collisionSound.currentTime = 0; // Reinicia o som para evitar atrasos
        collisionSound.play().catch((error) => {
          console.error("Erro ao reproduzir o som de colisão:", error);
        });
      }

      lastCollisionTime.value = timestamp; // Atualiza o tempo da última colisão
      break;
    }
  }
};
// Desenha a roleta no canvas (permanece a mesma)
const drawWheel = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Limpa o canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Desenha o círculo de fundo
  ctx.beginPath();
  ctx.arc(centerX.value, centerY.value, radius.value, 0, 2 * Math.PI);
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();
  ctx.strokeStyle = "#025cdb";
  ctx.lineWidth = 8;
  ctx.stroke();

  // Desenha os segmentos da roleta
  const segmentAngle = (2 * Math.PI) / items.length;
  items.forEach((item, index) => {
    if (!item || !item.title) {
      console.warn(`Item inválido no índice ${index}:`, item);
      return; // Ignora itens inválidos
    }
    const startAngle = angle.value + index * segmentAngle;
    const endAngle = startAngle + segmentAngle;

    // Desenha o segmento
    ctx.beginPath();
    ctx.moveTo(centerX.value, centerY.value);
    ctx.arc(centerX.value, centerY.value, radius.value, startAngle, endAngle);
    ctx.closePath();

    // Cria o gradiente linear para o segmento
    const gradient = ctx.createLinearGradient(
      centerX.value,
      centerY.value - radius.value,
      centerX.value,
      centerY.value + radius.value
    );

    const colors = item.color
      ? item.color
          .replace("linear-gradient(45deg, ", "")
          .replace(")", "")
          .split(",")
      : ["#8be8fe", "#fefefe"];

    gradient.addColorStop(0, colors[0].trim());
    gradient.addColorStop(1, colors[1].trim());

    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.stroke();

    // Calcula a posição do centro do segmento
    const segmentCenterX =
      centerX.value +
      Math.cos(startAngle + segmentAngle / 2) * (radius.value * 0.88);
    const segmentCenterY =
      centerY.value +
      Math.sin(startAngle + segmentAngle / 2) * (radius.value * 0.88);

    // Desenha a imagem do item primeiro
    if (item.fileName && imageCache[item.id]) {
      const image = imageCache[item.id];
      const imageSize = radius.value * 0.2; // Ajuste o tamanho da imagem

      // Exemplo: Rotação baseada em um valor vindo do banco (item.rotationAngle)
      const rotationAngle = item.rotationAngle
        ? (item.rotationAngle * Math.PI) / 900 // Converte graus para radianos
        : 900; // Valor padrão se não houver rotação

      ctx.save();
      ctx.translate(segmentCenterX, segmentCenterY); // Translada para o centro da imagem
      ctx.rotate(rotationAngle); // Aplica a rotação

      ctx.drawImage(
        image,
        -imageSize / 2, // Ajusta a posição X para centralizar
        -imageSize / 2, // Ajusta a posição Y para centralizar
        imageSize, // Largura da imagem
        imageSize // Altura da imagem
      );

      ctx.restore(); // Restaura o estado original do contexto
    }

    // Desenha o título do item
    ctx.save();
    ctx.translate(
      centerX.value +
        Math.cos(startAngle + segmentAngle / 2) * (radius.value * 0.7),
      centerY.value +
        Math.sin(startAngle + segmentAngle / 2) * (radius.value * 0.7)
    );

    const textAngle = startAngle + segmentAngle / 2 + Math.PI / 2;
    ctx.rotate(textAngle);

    const maxWidth = 70; // Ajuste o valor conforme necessário
    const lineHeight = 14; // Altura de cada linha (ajuste conforme necessário)

    // Desenha o fundo vermelho antes do texto
    ctx.fillStyle = "transparent";
    ctx.fillRect(-maxWidth / 2, -10, maxWidth, 70); // Retângulo centralizado

    // Configurações do texto
    ctx.fillStyle = "transparent";
    ctx.font = "bold 12.5px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Função para quebrar o texto em múltiplas linhas
    function wrapText(ctx, text, maxWidth) {
      const words = text.split(" ");
      let lines = [];
      let currentLine = words[0];

      for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
          currentLine += " " + word;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }
      lines.push(currentLine);
      return lines;
    }

    // Divide o texto em múltiplas linhas
    const lines = wrapText(ctx, item.title, maxWidth);

    // Ajusta a altura do fundo vermelho para acomodar múltiplas linhas
    const totalHeight = lines.length * lineHeight;
    ctx.fillStyle = "transparent";
    ctx.fillRect(-maxWidth / 2, -totalHeight / 2, maxWidth, totalHeight);

    // Renderiza cada linha de texto
    ctx.fillStyle = "#0031ff";
    lines.forEach((line, index) => {
      ctx.fillText(
        line,
        0,
        -totalHeight / 2 + index * lineHeight + lineHeight / 2
      );
    });

    // Desenha a descrição abaixo do título
    ctx.font = "normal 10px Arial"; // Fonte menor para a descrição
    ctx.fillText(item.description, 0, 20); // Ajuste o valor `15` para posicionar abaixo do título

    ctx.font = "normal 10px Arial"; // Fonte menor para a descrição

    // Validação para exibir apenas o campo que não está vazio
    if (item.desconto === undefined && item.valor === undefined) {
      // ctx.fillText("asdas", 0, 30);
    } else if (item.desconto && item.valor) {
      ctx.fillText(`${item.desconto} - ${item.valor}`, 0, 30);
    } else if (item.desconto) {
      ctx.fillText(item.desconto, 0, 30);
    } else if (item.valor) {
      ctx.fillText(item.valor, 0, 30);
    }

    ctx.restore();
  });

  // Desenha a imagem central em cada frame
  if (centralImage) {
    const symbolSize = radius.value * 1; // Ajuste o tamanho da imagem
    const rotationAngle = Math.PI / 0; // Ângulo de rotação em radianos (45 graus neste exemplo)

    ctx.save(); // Salva o estado atual do contexto

    // Translada o contexto para o centro da imagem
    ctx.translate(centerX.value, centerY.value);

    // Aplica a rotação
    ctx.rotate(rotationAngle);

    // Desenha a imagem no centro (ajustando para o ponto de origem)
    ctx.drawImage(
      centralImage,
      -symbolSize / 2, // Ajusta a posição X para centralizar
      -symbolSize / 2, // Ajusta a posição Y para centralizar
      symbolSize, // Largura da imagem
      symbolSize // Altura da imagem
    );

    ctx.restore(); // Restaura o estado original do contexto
  }
};

// Inicia o giro da roleta
const spinWheel = () => {
  if (spinning.value) return;

  // Define um ângulo final aleatório que não seja o mesmo do último sorteio
  const segmentAngle = (2 * Math.PI) / items.length;
  const randomIndex = getRandomIndex();
  targetEndAngle.value =
    randomIndex * segmentAngle +
    (Math.random() * segmentAngle * 0.5 - segmentAngle * 0.25); // Adiciona uma pequena variação

  // velocity.value = INITIAL_VELOCITY;
  velocity.value = CONSTANT_VELOCITY; // Define a velocidade constante
  spinning.value = true;
  selectedItem.value = null;
  lastFrameTime.value = 0;
  spinStartTime.value = 0;
  lastCollisionTime.value = 0;

  animationId.value = requestAnimationFrame(animate);
};

// Verifica qual item foi selecionado quando a roleta para
const checkSelectedItem = async () => {
  const normalizedAngle = (angle.value + 2 * Math.PI) % (2 * Math.PI);
  const segmentAngle = (2 * Math.PI) / items.length;
  const selectedIndex = Math.floor(
    ((2 * Math.PI - normalizedAngle) % (2 * Math.PI)) / segmentAngle
  );

  // Armazena o item selecionado no localStorage e na ref
  lastSelectedItem.value = items[selectedIndex].title;
  localStorage.setItem("lastRouletteItem", lastSelectedItem.value);

  selectedItem.value = lastSelectedItem.value;

  if (selectedItem.value) {
    modalHide.value = true;

    const interval = setInterval(() => {
      if (countdownSelected.value > 0) {
        countdownSelected.value -= 1;
      } else {
        clearInterval(interval);
        // spinWheel();
        modalHide.value = false;
        navigateTo("/qrcode");
      }
    }, 1000);
    // console.log("CHAMANDO O INSERT ==>", selectedItem.value);
    // console.log("CHAMANDO SEGUNDO INSERT ->", userData);
    const { error: dbError } = await supabase.from("resgates_sorteio").insert([
      {
        user_id: userData.value.user_id,
        premio: selectedItem.value,
        retirada_at: null,
        entregue_por: "",
      },
    ]);
  }

  // Verifica o tipoSom do item selecionado e toca o som correspondente
  const tipoSom = items[selectedIndex].tipoSom;
  console.log("Tipo de som selecionado:", tipoSom);
  if (tipoSom === "bom" && goodSound) {
    goodSound.currentTime = 0;
    goodSound
      .play()
      .catch((error) => console.error("Erro ao reproduzir o som bom:", error));
    triggerConfetti(); // Chama a função de confete
  } else if (tipoSom === "ruim" && badSound) {
    badSound.currentTime = 0;
    badSound
      .play()
      .catch((error) => console.error("Erro ao reproduzir o som ruim:", error));
    triggerConfetti(); // Chama a função de confete
  }
};

async function fetchSorteioData() {
  console.log("DADOS roleta data...", userData.value);

  const { data: data_ultima_compra, error: error_ultima_compra } =
    await supabase.from("ultima_compra").select("*");

  if (error_ultima_compra) {
    console.error("Erro ao buscar ultima_compra:", error_ultima_compra);
  } else {
    // Filtrar os objetos com base no campo user_id
    const filteredData = data_ultima_compra.filter(
      (item) => item.user_id === userData.value.user_id
    );
    console.log("Dados filtrados ULTIMA COMPRA =>:", filteredData);
  }

  console.log("DADOS roleta data_ultima_compra...", data_ultima_compra);
  console.log("USER DATA ---> ", userData._value);
  if (
    userData.value &&
    userData.value.pontos <= 0 &&
    userData._value !== null &&
    userData._value !== undefined &&
    userData.value !== ""
  ) {
    console.log("Pontos insuficientes para girar a roleta.");
  } else {
    console.log("Pontos disponíveis:", userData.value);
    // startCountdown();
    indisponivel.value = true;
    const interval = setInterval(() => {
      if (countdown.value > 0) {
        countdown.value -= 1;
      } else {
        clearInterval(interval);
        // spinWheel();
        setTimeout(() => {
          spinWheel();
        }, 1000);
        modalHide.value = false;
      }
    }, 1000);
  }

  const { data, error } = await supabase.from("produtos_sorteio").select("*");
  if (error) {
    console.error("Error fetching sorteio data:", error);
  } else {
    console.log("Sorteio data:", data);
    items = data;
    // nowImg.value = items.map(item => item.image);
    nowImg.value = data;
    // Redesenha a roleta após carregar os dados
    if (items.length > 0) {
      const segmentAngle = (2 * Math.PI) / items.length;
      markerPositions.value = items.map((item, index) => {
        const angle = index * segmentAngle;
        return { angle, title: item.title };
      });
      drawWheel();
    }

    const imagePromises = items.map((item) => {
      if (item.fileName) {
        // Monta a URL da imagem com o caminho base
        const imageUrl = `https://api.visaonews.org/storage/v1/object/public/premios/667d38d3-b1a8-44b2-b959-6ce45a580173/${item.fileName}`;
        console.log("Carregando imagem:", imageUrl);

        return new Promise((resolve) => {
          const img = new Image();
          img.src = imageUrl; // Define a URL da imagem
          console.log("Carregando imagem:", imageUrl);
          img.onload = () => {
            imageCache[item.id] = img; // Armazena a imagem no cache
            resolve();
          };
          img.onerror = (error) => {
            console.error("Erro ao carregar a imagem:", imageUrl, error);
            resolve(); // Resolve mesmo em caso de erro para evitar travar o carregamento
          };
        });
      }
      return Promise.resolve();
    });

    // Aguarda o carregamento de todas as imagens antes de desenhar a roleta
    Promise.all(imagePromises).then(() => {
      drawWheel(); // Desenha a roleta após o carregamento das imagens
    });

    Promise.all(imagePromises).then(() => {
      setTimeout(() => {
        isScaled.value = true; // Aplica a classe para aumentar a escala
      }, 3000); // 3 segundos

      // Define um ângulo inicial aleatório para evitar sempre começar na mesma posição
      angle.value = Math.random() * 2 * Math.PI;

      const canvas = canvasRef.value;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Ajusta o tamanho do canvas
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      centerX.value = rect.width / 2;
      centerY.value = rect.height / 2;
      radius.value = Math.min(centerX.value, centerY.value) - 10;

      const segmentAngle = (2 * Math.PI) / items.length;
      markerPositions.value = items.map((item, index) => {
        const angle = index * segmentAngle;
        return { angle, title: item.title };
      });

      drawWheel(); // Desenha a roleta após o carregamento das imagens
    });
  }
}
</script>

<style scoped>
.roulette-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-image: url(/_nuxt/assets/images/background.png);
  height: 100vh;
}

.wheel-container {
  position: relative;
  margin-top: 60px;
}

.wheel-canvas {
  width: 600px;
  height: 600px;
  background: rgb(0 46 185);
  background: linear-gradient(
    270deg,
    rgb(140 204 241) 0,
    9%,
    rgb(0 46 185) 90%,
    rgb(85 183 235) 100%
  );
  border-radius: 100%;
  padding: 15px;
  rotate: 270deg;
}

.pointer-container {
  position: absolute;
  top: -24px;
  right: 45%;
  transform: translateY(-60%);
  z-index: 10;
}

.pointer-wrapper {
  position: relative;
}

.pointer-tip {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
}

/* Modal Styles */
.container-opc {
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
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

.modal-card {
  background: linear-gradient(145deg, #ffffff, #f8fafc);
  border-radius: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  max-width: 450px;
  width: 90%;
  max-height: 80vh;
  overflow: hidden;
  animation: modalSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-header {
  text-align: center;
  padding: 2rem 2rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  position: relative;
}

.modal-header::after {
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

.success-icon {
  margin-bottom: 1rem;
  animation: bounceIn 0.6s ease-out 0.2s both;
}

.loading-spinner {
  margin-bottom: 1rem;
}

.spinner {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

.result-title,
.loading-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.loading-title {
  font-size: 1.6rem;
}

.modal-body {
  padding: 2rem;
  text-align: center;
}

/* Result Modal Specific */
.result-label {
  font-size: 1.1rem;
  color: #6b7280;
  margin-bottom: 1rem;
  font-weight: 500;
}

.result-prize {
  font-size: 2rem;
  font-weight: 800;
  color: #1f2937;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 2rem;
  padding: 1rem;
  border-radius: 12px;
  background-color: #fef3c7;
  animation: pulse 2s infinite;
}

/* Loading Modal Specific */
.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 16px;
  margin-bottom: 2rem;
  border: 1px solid #e2e8f0;
}

.user-avatar {
  flex-shrink: 0;
}

.user-details {
  text-align: left;
  flex: 1;
}

.user-name {
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
}

.user-status {
  color: #6b7280;
  margin: 0;
  font-size: 0.9rem;
}

/* Countdown Styles */
.countdown-container {
  margin: 2rem 0;
}

.countdown-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
  position: relative;
  overflow: hidden;
}

.countdown-circle.loading {
  background: linear-gradient(135deg, #10b981, #059669);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
}

.countdown-circle::before {
  content: "";
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, #3b82f6, #8b5cf6, #3b82f6);
  border-radius: 50%;
  z-index: -1;
  animation: rotate 3s linear infinite;
}

.countdown-number {
  font-size: 2rem;
  font-weight: 800;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.countdown-text {
  color: #6b7280;
  font-weight: 500;
  margin: 0;
}

/* Loading Dots */
.loading-dots {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
}

.dot {
  width: 8px;
  height: 8px;
  background: #3b82f6;
  border-radius: 50%;
  animation: loadingDots 1.4s infinite ease-in-out both;
}

.dot:nth-child(1) {
  animation-delay: -0.32s;
}
.dot:nth-child(2) {
  animation-delay: -0.16s;
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

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes loadingDots {
  0%,
  80%,
  100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .modal-card {
    margin: 1rem;
    max-width: none;
  }

  .modal-header,
  .modal-body {
    padding: 1.5rem;
  }

  .result-title,
  .loading-title {
    font-size: 1.4rem;
  }

  .result-prize {
    font-size: 1.5rem;
  }

  .user-info {
    flex-direction: column;
    text-align: center;
  }

  .user-details {
    text-align: center;
  }
}
</style>
