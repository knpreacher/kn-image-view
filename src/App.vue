<script setup lang="ts">

import {type KnImageData, KnImageView, KnImageViewDialog} from "../lib";
import {ref} from "vue";

const dialogOpen = ref(false)
const openDialog = () => {
  dialogOpen.value = !dialogOpen.value
}

const images: KnImageData = [
  {
    src: '/cat1.jpg',
    thumb: '/cat1.jpg'
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
    <kn-image-view style="width: 100vw; height: 50vh"
                   image-src="https://promislab.ru/media/public/product/14/PromisCNC.png"/>
    <hr>
    <kn-image-view-dialog
        v-model:open="dialogOpen"
        :images="images"
    />
    <div>
      <button @click="openDialog">Dialog</button>
    </div>
  </div>
</template>

<style scoped>
.app-wrapper {
  background: aqua;
}
</style>
