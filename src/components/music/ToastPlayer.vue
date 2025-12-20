<template>
  <transition name="toast-slide">
    <div
      v-if="showToast && audioStore.songs.length > 0"
      class="fixed bottom-4 right-4 z-50 bg-[var(--color-surface)] border border-[var(--color-divider)] shadow-xl rounded-xl p-3 w-[90vw] max-w-xs flex items-center gap-3 cursor-pointer transition hover:shadow-2xl"
      @click="goToHomeMusic"
    >
      <img
        :src="songThumbnail"
        alt="Cover"
        class="w-10 h-10 rounded-md object-cover shrink-0"
      />
      <div class="flex-1 min-w-0">
        <p class="text-sm font-semibold truncate">
          {{ currentSong.title }}
        </p>
        <p class="text-xs text-[var(--color-text-secondary)] truncate">
          {{ currentSong.artist }}
        </p>
      </div>
      <div class="flex gap-1 shrink-0" @click.stop>
        <button @click="audioStore.previousSong" class="toast-icon-btn">
          <BackwardIcon class="w-5 h-5" />
        </button>
        <button @click="audioStore.toggleAudio" class="toast-icon-btn">
          <PlayIcon v-if="!audioStore.isPlaying" class="w-5 h-5" />
          <PauseIcon v-else class="w-5 h-5" />
        </button>
        <button @click="audioStore.changeSong" class="toast-icon-btn">
          <ForwardIcon class="w-5 h-5" />
        </button>
        <button
          @click="closeToast"
          class="toast-icon-btn hover:text-[var(--color-error)]"
        >
          <XMarkIcon class="w-5 h-5" />
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
  import { ref, watch, computed, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useAudioStore } from '@/stores/audioStore';
  import {
    PlayIcon,
    PauseIcon,
    ForwardIcon,
    BackwardIcon,
    XMarkIcon,
  } from '@heroicons/vue/24/solid';

  const audioStore = useAudioStore();
  const route = useRoute();
  const router = useRouter();
  const showToast = ref(false);
  const wasStartedOnHome = ref(false);

  onMounted(() => {
    if (audioStore.songs.length === 0) {
      audioStore.fetchSongs();
    }
  });

  watch(
    () => audioStore.isPlaying,
    playing => {
      if (playing && route.path === '/') {
        wasStartedOnHome.value = true;
        showToast.value = false;
      }
    }
  );

  watch(
    () => route.path,
    path => {
      showToast.value =
        path !== '/' &&
        path !== '/not-found' &&
        wasStartedOnHome.value &&
        audioStore.isPlaying;
    }
  );

  const currentSong = computed(
    () =>
      audioStore.songs[audioStore.currentSongIndex] || {
        title: '',
        artist: '',
        cover: '',
      }
  );

  const songThumbnail = computed(() => currentSong.value.cover || '');

  const closeToast = () => {
    audioStore.stopAudio();
    showToast.value = false;
  };

  const goToHomeMusic = async () => {
    if (route.path !== '/') {
      await router.push({ path: '/', hash: '#music-section' });
      setTimeout(scrollToSection, 300);
    } else {
      scrollToSection();
    }
  };

  const scrollToSection = () => {
    const el = document.querySelector('#music-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };
</script>

<style scoped>
  .toast-slide-enter-active,
  .toast-slide-leave-active {
    transition:
      transform 0.4s ease-in-out,
      opacity 0.3s ease;
  }
  .toast-slide-enter-from,
  .toast-slide-leave-to {
    transform: translateX(100%);
    opacity: 0;
  }
</style>
