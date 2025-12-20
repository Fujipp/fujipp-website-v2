<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center text-center px-4"
    :style="{ color: 'var(--color-text-primary)' }"
  >
    <!-- 🛠️ Lottie Animation -->
    <div class="overflow-hidden mb-4" style="width: 250px; height: 240px">
      <Vue3Lottie
        :animation-data="animationData"
        :loop="true"
        :autoplay="true"
        style="
          width: 400px;
          height: 400px;
          transform: translate(-100px, -110px);
        "
      />
    </div>

    <!-- 🧰 Message -->
    <h1 class="text-[32px] font-bold mb-2" style="color: var(--color-primary)">
      We'll be back soon!
    </h1>
    <p class="text-[16px] text-[var(--color-text-secondary)] mb-6 max-w-md">
      Our website is currently undergoing scheduled maintenance. We’ll be back
      shortly. Thanks for your patience!
    </p>

    <!-- 🔙 Back Button -->
    <RouterLink
      to="/"
      class="px-6 py-2 rounded-xl text-white font-semibold text-base shadow-sm hover:opacity-90 transition-all duration-300 ease-in-out hover:scale-105"
      style="background-color: var(--color-primary)"
    >
      Back to Home
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
  import { Vue3Lottie } from 'vue3-lottie';
  import animationData from '@/assets/Cat.json'; // ✅ เปลี่ยนเป็นไฟล์ Lottie ที่เหมาะ
</script>
