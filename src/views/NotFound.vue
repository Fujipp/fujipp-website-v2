<template>
  <div
    class="relative min-h-screen flex flex-col items-center justify-center text-center px-4"
    :style="{ color: 'var(--color-text-primary)' }"
  >
    <!-- 📦 Main Content (404 + Text + Button) -->
    <div class="mt-[20px] flex flex-col items-center">
      <h1
        class="text-[56px] font-bold mb-2"
        style="color: var(--color-primary)"
      >
        404
      </h1>
      <p class="text-[18px] text-[var(--color-text-secondary)] mb-6">
        Sorry, we couldn’t find the page you were looking for.
      </p>
      <RouterLink
        to="/"
        class="px-6 py-2 rounded-xl text-white font-semibold text-base shadow-sm transition-all duration-300 ease-in-out hover:opacity-90 hover:scale-105"
        style="background-color: var(--color-primary)"
      >
        Go Back Home
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
