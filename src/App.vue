<template>
  <RouterView />
  <Background />
</template>

<script setup lang="ts">
  import Background from './components/Background.vue';
  import { useThemeStore } from '@/stores/themeStore';
  useThemeStore().loadTheme();
</script>

<style>
  /* global.css หรือใน <style> global */
  :root,
  html,
  body {
    transition:
      background-color 0.3s ease,
      color 0.3s ease,
      border-color 0.3s ease,
      fill 0.3s ease;
  }

  html {
    background-color: var(--color-background);
    color: var(--color-text-primary);
    font-family: 'Kanit', sans-serif;
  }

  body {
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }

  img {
    img {
      -webkit-user-drag: none;
    }

    -webkit-user-drag: none;
  }
</style>
