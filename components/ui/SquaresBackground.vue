<template>
  <canvas ref="canvasRef" class="squares-canvas"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  direction: { type: String, default: 'diagonal' }, // 'right' | 'left' | 'up' | 'down' | 'diagonal'
  speed: { type: Number, default: 0.5 },
  borderColor: { type: String, default: '#333' },
  squareSize: { type: Number, default: 40 },
  hoverFillColor: { type: String, default: '#222' },
  animated: { type: Boolean, default: true },
})

const canvasRef = ref(null)
let requestId = null
const gridOffset = { x: 0, y: 0 }
const hoveredSquare = ref(null)
let squareSizeRuntime = props.squareSize
let fpsSamples = []
let lastFrameTime = 0
let reduceMotion = false

function resizeCanvas(canvas) {
  canvas.width = canvas.offsetWidth
  canvas.height = canvas.offsetHeight
}

function drawGrid(ctx, canvas) {
  const { borderColor, hoverFillColor } = props
  const squareSize = squareSizeRuntime
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const startX = Math.floor(gridOffset.x / squareSize) * squareSize
  const startY = Math.floor(gridOffset.y / squareSize) * squareSize

  ctx.lineWidth = 0.5

  for (let x = startX; x < canvas.width + squareSize; x += squareSize) {
    for (let y = startY; y < canvas.height + squareSize; y += squareSize) {
      const squareX = x - (gridOffset.x % squareSize)
      const squareY = y - (gridOffset.y % squareSize)

      const idxX = Math.floor((x - startX) / squareSize)
      const idxY = Math.floor((y - startY) / squareSize)

      if (hoveredSquare.value && idxX === hoveredSquare.value.x && idxY === hoveredSquare.value.y) {
        ctx.fillStyle = hoverFillColor
        ctx.fillRect(squareX, squareY, squareSize, squareSize)
      }

      ctx.strokeStyle = borderColor
      ctx.strokeRect(squareX, squareY, squareSize, squareSize)
    }
  }

  // Radial gradient vignette
  const gradient = ctx.createRadialGradient(
    canvas.width / 2,
    canvas.height / 2,
    0,
    canvas.width / 2,
    canvas.height / 2,
    Math.sqrt(canvas.width ** 2 + canvas.height ** 2) / 2
  )
  gradient.addColorStop(0, 'rgba(6, 6, 6, 0)')
  gradient.addColorStop(1, '#060606')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)
}

function updateAnimation(ctx, canvas) {
  const { speed, direction } = props
  const squareSize = squareSizeRuntime
  const effectiveSpeed = reduceMotion ? 0 : Math.max(speed, 0.1)

  switch (direction) {
    case 'right':
      gridOffset.x = (gridOffset.x - effectiveSpeed + squareSize) % squareSize
      break
    case 'left':
      gridOffset.x = (gridOffset.x + effectiveSpeed + squareSize) % squareSize
      break
    case 'up':
      gridOffset.y = (gridOffset.y + effectiveSpeed + squareSize) % squareSize
      break
    case 'down':
      gridOffset.y = (gridOffset.y - effectiveSpeed + squareSize) % squareSize
      break
    case 'diagonal':
    default:
      gridOffset.x = (gridOffset.x - effectiveSpeed + squareSize) % squareSize
      gridOffset.y = (gridOffset.y - effectiveSpeed + squareSize) % squareSize
      break
  }

  // FPS adaptive sampling
  const now = performance.now()
  if (lastFrameTime) {
    const delta = now - lastFrameTime
    const fps = 1000 / delta
    fpsSamples.push(fps)
    if (fpsSamples.length > 30) fpsSamples.shift()
    const avgFps = fpsSamples.reduce((a, b) => a + b, 0) / fpsSamples.length
    // Se FPS médio cair abaixo de 45, reduzir densidade (aumentar square size)
    if (avgFps < 45 && squareSizeRuntime < 80) {
      squareSizeRuntime = Math.min(squareSizeRuntime + 4, 80)
    }
    // Se FPS confortável acima de 55 e aumentamos demais, recuar um pouco até o original
    if (avgFps > 55 && squareSizeRuntime > props.squareSize) {
      squareSizeRuntime = Math.max(props.squareSize, squareSizeRuntime - 2)
    }
  }
  lastFrameTime = now

  drawGrid(ctx, canvas)
  requestId = requestAnimationFrame(() => updateAnimation(ctx, canvas))
}

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  canvas.style.background = '#060606'
  const onResize = () => {
    resizeCanvas(canvas)
    // Mobile: reduzir densidade por padrão
    if (window.innerWidth < 768) {
      squareSizeRuntime = Math.max(props.squareSize, 48)
    } else {
      squareSizeRuntime = props.squareSize
    }
  }
  onResize()

  const onMouseMove = (event) => {
    const rect = canvas.getBoundingClientRect()
    const mouseX = event.clientX - rect.left
    const mouseY = event.clientY - rect.top

    const startX = Math.floor(gridOffset.x / squareSizeRuntime) * squareSizeRuntime
    const startY = Math.floor(gridOffset.y / squareSizeRuntime) * squareSizeRuntime

    const hoveredSquareX = Math.floor((mouseX + gridOffset.x - startX) / squareSizeRuntime)
    const hoveredSquareY = Math.floor((mouseY + gridOffset.y - startY) / squareSizeRuntime)
    hoveredSquare.value = { x: hoveredSquareX, y: hoveredSquareY }
  }
  const onMouseLeave = () => { hoveredSquare.value = null }

  // Respeitar preferências de movimento reduzido
  const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
  const onMotion = () => { reduceMotion = mql.matches }
  onMotion()

  window.addEventListener('resize', onResize)
  if (props.animated) {
    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mouseleave', onMouseLeave)
    mql.addEventListener?.('change', onMotion)
    requestId = requestAnimationFrame(() => updateAnimation(ctx, canvas))
  } else {
    // Desenho estático inicial e em cada resize
    drawGrid(ctx, canvas)
  }

  // Watch for prop changes that affect drawing
  const stop = watch(() => ({ ...props }), () => {
    if (!props.animated) drawGrid(ctx, canvas)
  }, { deep: true })

  onUnmounted(() => {
    window.removeEventListener('resize', onResize)
    if (props.animated) {
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mouseleave', onMouseLeave)
      mql.removeEventListener?.('change', onMotion)
      if (requestId) cancelAnimationFrame(requestId)
    }
    stop()
  })
})
</script>

<style scoped>
.squares-canvas {
  width: 100%;
  height: 100%;
  display: block;
  border: none;
}
</style>


