<template>
  <SnowEffect />
  <RouterView />
  <Background />
  <!-- Hidden YouTube Player - persists across routes -->
  <div id="global-youtube-player" class="youtube-player-container"></div>
  <ToastPlayer />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import Background from './components/Background.vue';
import ToastPlayer from './components/music/ToastPlayer.vue';
import SnowEffect from './components/SnowEffect.vue';
import { useThemeStore } from '@/stores/themeStore';
import { useAudioStore } from '@/stores/audioStore';

useThemeStore().loadTheme();

const audioStore = useAudioStore();

onMounted(async () => {
  // Use real-time subscription for songs
  await audioStore.subscribeToSongs();
  await audioStore.initPlayer('global-youtube-player');
});
</script>

<style>
/* Global Theme Transitions */
:root,
html,
body,
*::before,
*::after {
  transition:
    background-color 0.3s ease,
    color 0.3s ease,
    border-color 0.3s ease,
    fill 0.3s ease,
    box-shadow 0.3s ease;
}

/* About page specific transitions */
.about-page,
.about-page * {
  transition:
    background-color 0.3s ease,
    background 0.3s ease,
    color 0.3s ease,
    border-color 0.3s ease,
    box-shadow 0.3s ease;
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
  -webkit-user-drag: none;
}

/* Hidden YouTube player */
.youtube-player-container {
  position: fixed;
  bottom: -9999px;
  left: -9999px;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

/* Hide Scrollbar - Webkit (Chrome, Safari, Edge) */
::-webkit-scrollbar {
  display: none;
}

/* Hide Scrollbar - Firefox */
* {
  scrollbar-width: none;
}
</style>
