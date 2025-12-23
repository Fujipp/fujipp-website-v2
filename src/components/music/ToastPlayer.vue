<template>
  <transition name="toast-slide">
    <div
      v-if="showToast && audioStore.songs.length > 0 && currentSong"
      class="toast-player"
      @click="goToHomeMusic"
    >
      <img
        :src="songThumbnail"
        alt="Cover"
        class="toast-cover"
        @error="onImageError"
      />
      <div class="toast-info">
        <p class="toast-title">{{ currentSong.title }}</p>
        <p class="toast-artist">{{ currentSong.artist }}</p>
      </div>
      <div class="toast-controls" @click.stop>
        <button @click="audioStore.previousSong" class="toast-btn">
          <BackwardIcon class="w-5 h-5" />
        </button>
        <button @click="audioStore.toggleAudio" class="toast-btn toast-btn-main">
          <PlayIcon v-if="!audioStore.isPlaying" class="w-5 h-5" />
          <PauseIcon v-else class="w-5 h-5" />
        </button>
        <button @click="audioStore.changeSong" class="toast-btn">
          <ForwardIcon class="w-5 h-5" />
        </button>
        <button @click="closeToast" class="toast-btn toast-btn-close">
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

// Track if music was started
watch(
  () => audioStore.isPlaying,
  (playing) => {
    if (playing && route.path === '/about') {
      wasStartedOnHome.value = true;
      showToast.value = false;
    }
  }
);

// Show toast when not on about page and music is playing
watch(
  () => route.path,
  (path) => {
    showToast.value =
      path !== '/about' &&
      path !== '/not-found' &&
      wasStartedOnHome.value &&
      audioStore.isPlaying;
  }
);

// Also watch isPlaying to update toast visibility
watch(
  () => audioStore.isPlaying,
  (playing) => {
    if (route.path !== '/about') {
      showToast.value = wasStartedOnHome.value && playing;
    }
  }
);

const currentSong = computed(() => audioStore.currentSong);

const songThumbnail = computed(() => {
  if (!currentSong.value) return '';
  return audioStore.getThumbnail(currentSong.value.videoId);
});

const closeToast = () => {
  audioStore.stopAudio();
  showToast.value = false;
};

const goToHomeMusic = async () => {
  if (route.path !== '/about') {
    await router.push({ path: '/about', hash: '#music-section' });
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

const onImageError = (e: Event) => {
  const img = e.target as HTMLImageElement;
  if (img.src.includes('maxresdefault')) {
    img.src = img.src.replace('maxresdefault', 'hqdefault');
  }
};
</script>

<style scoped>
.toast-player {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  z-index: 50;
  background: color-mix(in srgb, var(--color-surface) 90%, transparent);
  backdrop-filter: blur(16px);
  border: 1px solid var(--color-divider);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border-radius: 1rem;
  padding: 0.75rem;
  width: 90vw;
  max-width: 320px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.toast-player:hover {
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
  transform: translateY(-2px);
}

.toast-cover {
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  object-fit: cover;
  flex-shrink: 0;
}

.toast-info {
  flex: 1;
  min-width: 0;
}

.toast-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.toast-artist {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.toast-controls {
  display: flex;
  gap: 0.25rem;
  flex-shrink: 0;
}

.toast-btn {
  padding: 0.5rem;
  border-radius: 50%;
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.toast-btn:hover {
  background: var(--color-divider);
  color: var(--color-text-primary);
}

.toast-btn-main {
  background: var(--color-primary);
  color: white;
}

.toast-btn-main:hover {
  background: var(--color-primary);
  opacity: 0.9;
  color: white;
}

.toast-btn-close:hover {
  color: #ef4444;
}

/* Animations */
.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
              opacity 0.3s ease;
}

.toast-slide-enter-from,
.toast-slide-leave-to {
  transform: translateX(120%);
  opacity: 0;
}
</style>
