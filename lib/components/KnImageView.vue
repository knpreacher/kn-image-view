<script setup lang="ts">
import {computed, nextTick, onMounted, ref, type TransitionGroupProps, watch} from "vue";
import {Point} from "@/types.ts";

const props = withDefaults(defineProps<{
  imageSrc: string,
  minScale?: number,
  maxScale?: number,
  transition?: TransitionGroupProps,
  background?: boolean | string | ((ctx: CanvasRenderingContext2D) => void)
}>(), {
  minScale: 0.1,
  transition: () => ({
    name: 'kn-image-view-transition'
  }),
  maxScale: 8
})

const scale = defineModel<number>('scale', {
  default: 1
})

const rotate = defineModel<number>('rotate', {
  default: 0
})

const scalePoint = ref<Point | undefined>()
const canvasWrapperRef = ref<HTMLCanvasElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

// const scale = ref(1)
const canvasSize = ref<Point>({x: 200, y: 200})
const imPosition = ref<Point>({x: 0, y: 0})

const isMouseClicked = ref<boolean>(false)
const prevTouch = ref<Touch | undefined>()

const cursorStyle = ref('move') // zoom-in

const isImageLoading = ref(false)
const isImageError = ref(false)

function drawTransparentBackground(
    ctx: CanvasRenderingContext2D,
    squareSize: number = 10,
    lightColor: string = 'rgba(0, 0, 0, 0.1)',
    darkColor: string = 'rgba(0, 0, 0, 0.3)'
) {
  if (!ctx) return

  const cols = Math.ceil(ctx.canvas.width / squareSize)
  const rows = Math.ceil(ctx.canvas.height / squareSize)

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Alternate colors
      const isLight = (row + col) % 2 === 0;
      ctx.fillStyle = isLight ? lightColor : darkColor;

      // Draw square
      ctx.fillRect(
          col * squareSize,
          row * squareSize,
          squareSize,
          squareSize
      );
    }
  }
}

function drawBackground(ctx: CanvasRenderingContext2D) {
  if (!ctx) return
  if (typeof props.background === 'function') {
    props.background(ctx)
    return
  }
  if (typeof props.background === 'string') {
    ctx.fillStyle = props.background
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    return
  }
  if (props.background) drawTransparentBackground(ctx)
}

function onImageLoaded() {
  updateCanvas()
  isImageLoading.value = false
  nextTick(createCanvasMouseEvents)
}

function onImageError() {
  isImageLoading.value = false
  isImageError.value = true
}

const canvasImage = computed(() => {
  isImageLoading.value = true
  const img = new Image()
  img.src = props.imageSrc
  img.onload = onImageLoaded
  img.onerror = onImageError
  return img
})

function getCanvasContext() {
  return canvasRef.value?.getContext('2d')
}

const getInitialRatio = (): number => {
  const ctx = getCanvasContext()
  if (!ctx) return 1
  return Math.min(ctx.canvas.width / canvasImage.value.width, ctx.canvas.height / canvasImage.value.height)
}

const getImCenterOffset = (): Point => {
  const ctx = getCanvasContext()
  if (!ctx) return {x: 0, y: 0}
  const ratio = getInitialRatio()

  const imWidth = canvasImage.value.width * ratio
  const imHeight = canvasImage.value.height * ratio

  return {
    x: (ctx.canvas.width - imWidth) / 2,
    y: (ctx.canvas.height - imHeight) / 2
  }
}

function renderImage() {
  const ctx = getCanvasContext()
  if (!ctx) return
  const img = canvasImage.value
  if (!img) return

  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  const ratio = getInitialRatio()
  const imC = getImCenterOffset()

  drawBackground(ctx)

  ctx.setTransform(
      scale.value,
      0,
      0,
      scale.value,
      imPosition.value.x,
      imPosition.value.y
  )
  ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2)
  ctx.rotate(rotate.value * Math.PI / 180)

  ctx.drawImage(img, imC.x - ctx.canvas.width / 2, imC.y - ctx.canvas.height / 2, img.width * ratio, img.height * ratio)

}

function updateCanvas() {
  requestAnimationFrame(renderImage)
}

function windowZoomHandler(e: WheelEvent) {
  if (e.target !== canvasRef.value) return
  e.preventDefault()
  const ctx = getCanvasContext()
  if (!ctx) return

  scalePoint.value = {
    x: e.offsetX,
    y: e.offsetY,
  }

  // @ts-ignore
  const amount = e.wheelDelta > 0 ? 1.1 : 1 / 1.1
  // const dir = e.deltaY < 0 ? 1 : -1
  const newScale = scale.value * amount

  if (newScale >= props.minScale && newScale <= props.maxScale) {
    scale.value = newScale
    nextTick(() => {
      scalePoint.value = undefined
    })
  }
}

function resizeCanvas() {
  canvasSize.value = {
    x: canvasWrapperRef.value?.clientWidth ?? 300,
    y: (canvasWrapperRef.value?.clientHeight ?? 300 + 6),
  }
  updateCanvas()
}

function createCanvasMouseEvents() {
  const c = canvasRef.value
  if (!c) return
  c.addEventListener("mousemove", (e: MouseEvent) => {
    const boundRect = c.getBoundingClientRect()
    if (!boundRect) return
    if (isMouseClicked.value) {
      imPosition.value = {
        x: imPosition.value.x + e.movementX,
        y: imPosition.value.y + e.movementY,
      }
      updateCanvas()
    }
  })
  c.addEventListener("mousedown", () => {
    isMouseClicked.value = true
  })

  c.addEventListener("mouseup", () => {
    isMouseClicked.value = false
  })
  c.addEventListener("mouseleave", () => {
    isMouseClicked.value = false
  })

  c.addEventListener("touchmove", (e: TouchEvent) => {
    const touch = e.touches.item(0)
    if (!touch) return
    console.log(e)
    if (prevTouch.value) {
      const mx = touch.pageX - prevTouch.value.pageX
      const my = touch.pageY - prevTouch.value.pageY
      imPosition.value = {
        x: imPosition.value.x + mx,
        y: imPosition.value.y + my,
      }
      updateCanvas()
    }
    prevTouch.value = touch
  })

  c.addEventListener("touchend", () => {
    prevTouch.value = undefined
  })
}

function onDoubleClick() {
  // console.log('dcl')
  updateCanvas()
  imPosition.value = {x: 0, y: 0}
  scale.value = 1
  updateCanvas()
}

watch(scale, (value, oldValue) => {
  const amount = value / oldValue
  const {x, y} = scalePoint.value ?? {
    x: canvasSize.value.x / 2,
    y: canvasSize.value.y / 2,
  }
  imPosition.value = {
    x: x - (x - imPosition.value.x) * amount,
    y: y - (y - imPosition.value.y) * amount
  }
  updateCanvas()
})

watch(rotate, () => {
  updateCanvas()
})

onMounted(() => {
  window.addEventListener("wheel", windowZoomHandler, {passive: false})
  // createCanvasMouseEvents()
  canvasSize.value = {
    x: canvasWrapperRef.value?.clientWidth ?? 300,
    y: canvasWrapperRef.value?.clientHeight ?? 300,
  }

  window.addEventListener("resize", () => {
    resizeCanvas()
  })

  updateCanvas()
})

defineSlots<{
  default: () => any
  loading: () => any
  error: () => any
}>()

</script>

<template>
  <div ref="canvasWrapperRef" class="kn-image-view__canvas-wrapper">
    <transition-group v-bind="transition">
      <slot name="loading" v-if="isImageLoading">
        <div>Loading</div>
      </slot>
      <slot name="error" v-else-if="isImageError">
        <div>Error</div>
      </slot>
      <slot v-else>
        <canvas
            @dblclick="onDoubleClick"
            ref="canvasRef"
            :style="{cursor: cursorStyle}"
            :width="canvasSize.x" :height="canvasSize.y"
        ></canvas>
      </slot>
    </transition-group>
  </div>
</template>

<style scoped></style>
