<script setup lang="ts">

import {type KnImageData, KnImageView, KnImageViewDialog, KnImageGallery} from "../lib";
import {ref} from "vue";

const dialogOpen = ref(false)
const readOnly = ref(false)
const openDialog = () => {
  dialogOpen.value = !dialogOpen.value
}

const activeIndex = ref(0)

const images: KnImageData = [
  {
    src: '/cat1.jpg',
    thumb: '/cat1.jpg',
    title: 'Cat 1'
  },
  {
    src: '/cat2.jpg',
    thumb: '/cat2.jpg'
  },
  {
    src: 'https://promislab.ru/media/public/product/14/PromisCNC123.png',
    thumb: 'https://promislab.ru/media/public/product/14/PromisCNC123.png'
  },
  {
    src: 'https://promislab.ru/media/public/product/14/PromisCNC.png',
    thumb: 'https://promislab.ru/media/public/product/14/PromisCNC.png'
  },

]
</script>

<template>
  <div class="app-wrapper">
    <!--    <kn-image-view image-src="/cat1.jpg" />-->
    <kn-image-view style="width: 100vw; height: 50vh" background
                   image-src="https://promislab.ru/media/public/product/14/PromisCNC.png"/>
    <hr>
    <kn-image-view-dialog
        v-model:active-index="activeIndex"
        v-model:open="dialogOpen"
        :images="images"
    >
      <template #sideLeft="{prevImage}">
        <button @click="prevImage">[<]</button>
      </template>
      <template #sideRight="{nextImage}">
        <button @click="nextImage">[>]</button>
      </template>
    </kn-image-view-dialog>
    <div>
      <button @click="openDialog">Dialog</button>
    </div>
    <div>
      <label>
        <input type="checkbox" v-model="readOnly"> Readonly
      </label>
    </div>
    <div>
      <kn-image-gallery v-model="activeIndex" :readonly="readOnly" :images="images" wrap />

    </div>
  </div>
</template>

<style scoped>
.app-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: #f3f3f3;
}
</style>
