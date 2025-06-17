<script setup lang="ts">
import {computed, onBeforeUnmount, onMounted, TransitionProps} from "vue";
import type {KnImageData} from "@/types.ts";
import {KnImageView} from "@/index.ts";
import KnImageGallery from "@/components/KnImageGallery.vue";


const props = withDefaults(defineProps<{
  transition?: TransitionProps,
  images: KnImageData,
  zIndex?: number,
  padding?: number
}>(), {
  transition: () => ({
    name: 'kn-image-view-transition'
  }),
  padding: 10,
  zIndex: 100
})
const isOpen = defineModel('open', {default: false})
const activeIndex = defineModel('activeIndex', {default: 0})

const activeImage = computed(() => props.images[activeIndex.value])

const dialogStyle = computed(() => ({
  zIndex: props.zIndex,
  padding: `${props.padding}px`,
  background: 'rgba(0, 0, 0, 0.5)',
  width: `calc(100% - ${props.padding * 2}px)`,
  height: `calc(100% - ${props.padding * 2}px)`,
  maxWidth: `calc(100% - ${props.padding * 2}px)`,
  maxHeight: `calc(100% - ${props.padding * 2}px)`,
}))

const escapeKeyHandler = (e: KeyboardEvent) => {
  // console.log(e.key, e)
  if (e.key === 'Escape') {
    e.preventDefault()
    e.stopPropagation()
    isOpen.value = false
  }
}

function createDialogEvents() {
  window.addEventListener('keydown', escapeKeyHandler)
}

function destroyDialogEvents() {
  window.removeEventListener('keydown', escapeKeyHandler)
}

onMounted(createDialogEvents)
onBeforeUnmount(destroyDialogEvents)
</script>

<template>
  <transition v-bind="transition">
    <dialog
        v-if="isOpen"
        open aria-modal="true"
        class="kn-image-view-dialog"
        :style="dialogStyle"
    >
      <kn-image-view
          style="width: 100%; flex-grow: 1"
          :key="activeImage.src"
          :image-src="activeImage.src"
      />
      <kn-image-gallery v-model="activeIndex" :images="images"/>
    </dialog>
  </transition>
</template>

<style scoped>

</style>