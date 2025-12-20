<template>
  <!-- Overlay -->
  <div class="absolute inset-0 bg-black/50 z-10"></div>

  <!-- Gradient บน -->
  <div
    class="absolute top-0 left-0 w-full h-32 z-20 bg-gradient-to-b from-black/60 to-transparent pointer-events-none"
  ></div>

  <!-- Gradient ล่าง -->
  <div
    class="absolute bottom-0 left-0 w-full h-32 z-20 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"
  ></div>

  <section class="relative w-full h-screen overflow-hidden">
    <!-- ภาพพื้นหลังแบบ fade -->
    <transition name="fade" mode="out-in">
      <img
        :src="slides[currentIndex].url"
        :key="slides[currentIndex].url"
        class="absolute inset-0 w-full h-full object-cover"
        alt="background"
      />
    </transition>

    <!-- Overlay -->
    <div class="absolute inset-0 bg-black/50 z-10"></div>

    <!-- Center Text -->
    <div
      class="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4"
    >
      <h1
        class="text-4xl md:text-6xl font-bold animate__animated animate__fadeInDown mb-2 text-white"
      >
        {{ slides[currentIndex].title }}
      </h1>

      <div class="flex justify-center px-ุ4">
        <span
          class="typed-wrapper text-lg md:text-xl font-medium tracking-wide text-center max-w-screen-sm w-full"
        >
          <span class="typed-text block"></span>
        </span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import Typed from 'typed.js';

  const slides = [
    {
      url: '/users-Fuji_1.png',
      title: "Hi, I'm Dev Fuji",
    },
    {
      url: '/users-Fuji_2.png',
      title: 'Passionate Fullstack Developer',
    },
    {
      url: '/users-Fuji_1.png',
      title: 'Vue & Tailwind Enthusiast',
    },
  ];

  const currentIndex = ref(0);

  // เปลี่ยนรูปทุก 5 วินาที
  setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % slides.length;
  }, 5000);

  onMounted(() => {
    const el = document.querySelector('.typed-text');
    if (el) {
      new Typed(el, {
        strings: [
          // 'Building modern web interfaces with Vue 3, TypeScript, and Tailwind CSS.',
          // 'Designing clean UI and writing maintainable code is my passion.',
          // 'Always learning. Always improving. Always shipping.',
          // 'Turning coffee ☕ into quality frontend experience.',
          // 'I love transforming complex problems into elegant solutions.',
        ],
        typeSpeed: 22, // 🐢 ช้าลง
        backSpeed: 15,
        backDelay: 3000,
        loop: true,
        showCursor: true,
        cursorChar: '',
      });
    }
  });
</script>

<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.8s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .typed-text {
    font-family: inherit;
    display: block; /* ✅ ใช้ block แทน inline-block */
    color: white;
    font-size: 1.25rem;
    line-height: 0.75rem;
    word-wrap: break-word; /* ✅ รองรับคำยาว */
    white-space: normal; /* ✅ แก้ให้ห่อบรรทัด */
    text-align: center;
  }

  .typed-wrapper {
    line-height: 1.75rem;
    width: 100%;
  }

  /* ✅ ปรับ cursor ให้ตรงพอดีกับข้อความ */
  .typed-cursor {
    display: inline-block;
    font-size: 1.25rem;
    line-height: 1.75rem;
    vertical-align: bottom;
    margin-left: 1px;
    color: white;
  }
</style>
