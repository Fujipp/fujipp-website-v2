<template>
  <section id="music-section" class="music-cards-section">
    <div class="music-cards-container">
      <!-- Header -->
      <div class="mc-header">
        <div class="mc-header-content">
          <div class="mc-header-icon">
            <MusicalNoteIcon class="w-8 h-8" />
          </div>
          <div>
            <h2 class="mc-header-title">Music Station</h2>
            <p class="mc-header-subtitle">My favorite songs</p>
          </div>
        </div>
      </div>

      <!-- Carousel -->
      <div class="mc-carousel-wrapper">
        <!-- Edge shadows -->
        <div class="mc-edge-shadow mc-edge-left"></div>
        <div class="mc-edge-shadow mc-edge-right"></div>

        <!-- Cards track -->
        <div
          ref="trackRef"
          class="mc-track"
          @mousedown="onPointerDown"
          @touchstart.passive="onTouchDown"
        >
          <div
            v-for="item in visibleCards"
            :key="item.key"
            class="mc-card-slot"
            :class="slideDir"
            :style="{
              transform: `translateX(${item.offset}px) scale(${item.scale})`,
              opacity: item.opacity,
              zIndex: item.zIndex,
              filter: `brightness(${item.brightness})`,
            }"
          >
            <div
              class="mc-card"
              :class="{ active: item.isPlaying }"
              @click="onCardClick(item.realIndex)"
            >
              <!-- Full image -->
              <img
                :src="audioStore.getThumbnail(item.song.videoId)"
                :alt="item.song.title"
                class="mc-card-img"
                @error="onImageError"
              />

              <!-- Play indicator (center) -->
              <div class="mc-card-play">
                <div v-if="item.isPlaying && audioStore.isPlaying" class="mc-eq">
                  <span></span><span></span><span></span>
                </div>
                <PlayIcon v-else class="mc-play-icon" />
              </div>
            </div>
          </div>
        </div>

        <!-- Arrow buttons -->
        <button class="mc-arrow mc-arrow-left" @click="goPrev">
          <ChevronLeftIcon class="w-6 h-6" />
        </button>
        <button class="mc-arrow mc-arrow-right" @click="goNext">
          <ChevronRightIcon class="w-6 h-6" />
        </button>
      </div>

      <!-- Song Info (between carousel and player) -->
      <div class="mc-song-info" v-if="currentSong">
        <transition name="info-fade" mode="out-in">
          <div :key="currentSong.id" class="mc-song-info-inner">
            <h3 class="mc-song-title">{{ currentSong.title }}</h3>
            <p class="mc-song-artist">{{ currentSong.artist }}</p>
          </div>
        </transition>
      </div>

      <!-- Player Controls -->
      <div class="mc-player" v-if="currentSong">
        <div class="mc-progress">
          <span class="mc-time">{{ formatTime(audioStore.currentTime) }}</span>
          <div class="mc-progress-bar">
            <div class="mc-progress-fill" :style="{ width: `${progressPercent}%` }"></div>
            <input
              type="range" min="0" :max="audioStore.duration || 100" step="0.1"
              :value="audioStore.currentTime" @input="onSeek" class="mc-progress-input"
            />
          </div>
          <span class="mc-time">{{ formatTime(audioStore.duration) }}</span>
        </div>

        <div class="mc-controls">
          <button @click="audioStore.toggleShuffle" class="mc-ctrl-sm" :class="{ active: audioStore.isShuffle }">
            <ArrowsRightLeftIcon class="w-5 h-5" />
          </button>
          <button @click="goPrevSong" class="mc-ctrl">
            <BackwardIcon class="w-6 h-6" />
          </button>
          <button @click="audioStore.toggleAudio" class="mc-ctrl-main" :disabled="!audioStore.isReady">
            <div v-if="audioStore.isBuffering" class="mc-spinner"></div>
            <PlayIcon v-else-if="!audioStore.isPlaying" class="w-7 h-7" />
            <PauseIcon v-else class="w-7 h-7" />
          </button>
          <button @click="goNextSong" class="mc-ctrl">
            <ForwardIcon class="w-6 h-6" />
          </button>
          <button @click="audioStore.toggleLoop" class="mc-ctrl-sm" :class="{ active: audioStore.isLoop }">
            <ArrowPathRoundedSquareIcon class="w-5 h-5" />
          </button>
        </div>

        <div class="mc-volume">
          <button @click="toggleMute" class="mc-vol-btn">
            <SpeakerXMarkIcon v-if="audioStore.volume === 0" class="w-5 h-5" />
            <SpeakerWaveIcon v-else class="w-5 h-5" />
          </button>
          <div class="mc-vol-bar">
            <div class="mc-vol-fill" :style="{ width: `${audioStore.volume}%` }"></div>
            <input type="range" min="0" max="100" step="1" :value="audioStore.volume"
              @input="onVolumeChange" class="mc-vol-input" />
          </div>
          <span class="mc-vol-text">{{ audioStore.volume }}%</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useAudioStore } from '@/stores/audioStore';
import {
  PlayIcon, PauseIcon, ForwardIcon, BackwardIcon,
  ArrowPathRoundedSquareIcon, ArrowsRightLeftIcon,
  SpeakerWaveIcon, SpeakerXMarkIcon, MusicalNoteIcon,
  ChevronLeftIcon, ChevronRightIcon,
} from '@heroicons/vue/24/solid';

const audioStore = useAudioStore();
const focusIndex = ref(0);
const previousVolume = ref(100);
const slideDir = ref(''); // 'slide-left' | 'slide-right' | ''
const CARD_W = 270; // card width + gap
const VISIBLE_SIDE = 3; // จำนวน card ข้าง ๆ

const currentSong = computed(() => audioStore.currentSong);
const progressPercent = computed(() => {
  if (!audioStore.duration) return 0;
  return (audioStore.currentTime / audioStore.duration) * 100;
});

// Wrap index ให้วนลูป
const wrapIndex = (i: number, len: number) => ((i % len) + len) % len;

// สร้าง visible cards array พร้อมตำแหน่ง/scale/opacity
const visibleCards = computed(() => {
  const songs = audioStore.songs;
  if (!songs.length) return [];

  const count = songs.length;
  const items = [];

  for (let offset = -VISIBLE_SIDE; offset <= VISIBLE_SIDE; offset++) {
    const realIdx = wrapIndex(focusIndex.value + offset, count);
    const absDist = Math.abs(offset);
    const scale = offset === 0 ? 1 : Math.max(0.65, 1 - absDist * 0.12);
    const opacity = offset === 0 ? 1 : Math.max(0.3, 1 - absDist * 0.22);
    const brightness = offset === 0 ? 1 : Math.max(0.5, 1 - absDist * 0.18);

    items.push({
      key: `${realIdx}-${offset}`,
      realIndex: realIdx,
      song: songs[realIdx],
      offset: offset * CARD_W,
      scale,
      opacity,
      brightness,
      zIndex: 10 - absDist,
      isPlaying: audioStore.currentSongIndex === realIdx,
    });
  }

  return items;
});

// ── Navigate ──
const animateSlide = (dir: string) => {
  slideDir.value = dir;
  setTimeout(() => { slideDir.value = ''; }, 500);
};

const goNext = () => {
  animateSlide('slide-left');
  focusIndex.value = wrapIndex(focusIndex.value + 1, audioStore.songs.length);
};

const goPrev = () => {
  animateSlide('slide-right');
  focusIndex.value = wrapIndex(focusIndex.value - 1, audioStore.songs.length);
};

const goNextSong = () => {
  audioStore.changeSong();
};

const goPrevSong = () => {
  audioStore.previousSong();
};

const onCardClick = (realIndex: number) => {
  if (realIndex === focusIndex.value) {
    // คลิก card ตรงกลาง → toggle play
    audioStore.selectSong(realIndex);
  } else {
    // คลิก card ข้าง → scroll มาตรงกลาง
    focusIndex.value = realIndex;
  }
};

// ── Drag / Swipe ──
let startX = 0;
let dragging = false;
let dragDelta = 0;

const onPointerDown = (e: MouseEvent) => {
  dragging = true;
  startX = e.clientX;
  dragDelta = 0;
  document.addEventListener('mousemove', onPointerMove);
  document.addEventListener('mouseup', onPointerUp);
};

const onTouchDown = (e: TouchEvent) => {
  dragging = true;
  startX = e.touches[0].clientX;
  dragDelta = 0;
  document.addEventListener('touchmove', onTouchMove, { passive: false });
  document.addEventListener('touchend', onTouchUp);
};

const onPointerMove = (e: MouseEvent) => {
  if (!dragging) return;
  dragDelta = e.clientX - startX;
};

const onTouchMove = (e: TouchEvent) => {
  if (!dragging) return;
  dragDelta = e.touches[0].clientX - startX;
};

const finishDrag = () => {
  dragging = false;
  const threshold = CARD_W / 3;
  if (dragDelta < -threshold) goNext();
  else if (dragDelta > threshold) goPrev();
  dragDelta = 0;
  document.removeEventListener('mousemove', onPointerMove);
  document.removeEventListener('mouseup', onPointerUp);
  document.removeEventListener('touchmove', onTouchMove);
  document.removeEventListener('touchend', onTouchUp);
};

const onPointerUp = () => finishDrag();
const onTouchUp = () => finishDrag();

// Sync เมื่อเปลี่ยนเพลง → carousel ตาม
watch(() => audioStore.currentSongIndex, (idx) => {
  focusIndex.value = idx;
});

// ── Player controls ──
const formatTime = (sec: number) => {
  if (!sec || isNaN(sec)) return '0:00';
  return `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, '0')}`;
};

const onImageError = (e: Event) => {
  const img = e.target as HTMLImageElement;
  if (img.src.includes('maxresdefault')) img.src = img.src.replace('maxresdefault', 'hqdefault');
};

const onSeek = (e: Event) => audioStore.seekTo(parseFloat((e.target as HTMLInputElement).value));
const onVolumeChange = (e: Event) => audioStore.setVolume(parseInt((e.target as HTMLInputElement).value));

const toggleMute = () => {
  if (audioStore.volume > 0) { previousVolume.value = audioStore.volume; audioStore.setVolume(0); }
  else audioStore.setVolume(previousVolume.value || 100);
};

onMounted(() => {
  focusIndex.value = audioStore.currentSongIndex;
});

onUnmounted(() => {
  document.removeEventListener('mousemove', onPointerMove);
  document.removeEventListener('mouseup', onPointerUp);
  document.removeEventListener('touchmove', onTouchMove);
  document.removeEventListener('touchend', onTouchUp);
});
</script>

<style scoped>
/* ── Section ── */
.music-cards-section {
  padding: 4rem 0;
  background: linear-gradient(135deg,
    var(--color-background) 0%,
    color-mix(in srgb, var(--color-primary) 8%, var(--color-background)) 50%,
    var(--color-background) 100%
  );
  overflow: hidden;
}

/* ── Header ── */
.mc-header {
  margin-bottom: 2.5rem;
  padding: 0 2rem;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.mc-header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.mc-header-icon {
  width: 3.5rem;
  height: 3.5rem;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light, #8b5cf6));
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 32px color-mix(in srgb, var(--color-primary) 40%, transparent);
}

.mc-header-title {
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--color-text-primary), var(--color-primary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.mc-header-subtitle {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
}

/* ── Carousel ── */
.mc-carousel-wrapper {
  position: relative;
  margin-bottom: 2.5rem;
  height: 360px;
}

.mc-track {
  position: relative;
  width: 100%;
  height: 100%;
  cursor: grab;
  user-select: none;
}

.mc-track:active {
  cursor: grabbing;
}

/* ── Edge Shadows ── */
.mc-edge-shadow {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 8rem;
  z-index: 15;
  pointer-events: none;
}

.mc-edge-left {
  left: 0;
  background: linear-gradient(to right, var(--color-background), transparent);
}

.mc-edge-right {
  right: 0;
  background: linear-gradient(to left, var(--color-background), transparent);
}

/* ── Card slot ── */
.mc-card-slot {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 250px;
  margin-left: -125px;
  margin-top: -150px;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform, opacity;
}

/* Slide animation classes */
.mc-card-slot.slide-left {
  animation: mc-slide-in-left 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.mc-card-slot.slide-right {
  animation: mc-slide-in-right 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes mc-slide-in-left {
  0% { transform: translateX(calc(var(--offset, 0px) + 40px)) scale(var(--sc, 1)); opacity: 0.2; }
  100% { transform: translateX(var(--offset, 0px)) scale(var(--sc, 1)); }
}

@keyframes mc-slide-in-right {
  0% { transform: translateX(calc(var(--offset, 0px) - 40px)) scale(var(--sc, 1)); opacity: 0.2; }
  100% { transform: translateX(var(--offset, 0px)) scale(var(--sc, 1)); }
}

/* ── Card (image only) ── */
.mc-card {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 1.25rem;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.35s ease;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  border: 2px solid color-mix(in srgb, var(--color-divider) 50%, transparent);
  user-select: none;
}

.mc-card:hover {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
  border-color: color-mix(in srgb, var(--color-divider) 80%, transparent);
}

.mc-card.active {
  border-color: color-mix(in srgb, var(--color-primary) 70%, transparent);
  box-shadow:
    0 16px 48px rgba(0, 0, 0, 0.3),
    0 0 0 1px color-mix(in srgb, var(--color-primary) 40%, transparent),
    0 0 30px color-mix(in srgb, var(--color-primary) 12%, transparent);
}

/* Image fills entire card */
.mc-card-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Play indicator */
.mc-card-play {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: opacity 0.25s ease;
}

.mc-card:hover .mc-card-play,
.mc-card.active .mc-card-play {
  opacity: 1;
}

.mc-play-icon {
  width: 2.5rem;
  height: 2.5rem;
  color: white;
  filter: drop-shadow(0 2px 8px rgba(0,0,0,0.4));
}

/* Equalizer */
.mc-eq {
  display: flex;
  gap: 3px;
  align-items: flex-end;
  height: 1.5rem;
}

.mc-eq span {
  width: 5px;
  background: white;
  border-radius: 2px;
  animation: mc-eq-bar 0.7s ease-in-out infinite;
}

.mc-eq span:nth-child(1) { height: 50%; animation-delay: 0s; }
.mc-eq span:nth-child(2) { height: 100%; animation-delay: 0.15s; }
.mc-eq span:nth-child(3) { height: 35%; animation-delay: 0.3s; }

@keyframes mc-eq-bar {
  0%, 100% { transform: scaleY(0.4); }
  50% { transform: scaleY(1); }
}

/* ── Song Info (between carousel and player) ── */
.mc-song-info {
  text-align: center;
  margin-bottom: 2rem;
  min-height: 3.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mc-song-info-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.mc-song-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text-primary);
  max-width: 320px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mc-song-artist {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

/* Info fade transition */
.info-fade-enter-active,
.info-fade-leave-active {
  transition: all 0.3s ease;
}

.info-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.info-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* ── Arrow Buttons ── */
.mc-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  border: 1px solid var(--color-divider);
  background: color-mix(in srgb, var(--color-surface) 90%, transparent);
  backdrop-filter: blur(8px);
  color: var(--color-text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 20;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.mc-arrow:hover {
  background: var(--color-surface);
  transform: translateY(-50%) scale(1.08);
}

.mc-arrow-left { left: 1.5rem; }
.mc-arrow-right { right: 1.5rem; }

/* ── Player ── */
.mc-player {
  max-width: 480px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  padding: 1.5rem 2rem;
  background: color-mix(in srgb, var(--color-surface) 60%, transparent);
  backdrop-filter: blur(16px);
  border-radius: 1.25rem;
  border: 1px solid var(--color-divider);
}

/* Progress */
.mc-progress {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
}

.mc-time {
  font-size: 0.7rem;
  color: var(--color-text-secondary);
  min-width: 2.5rem;
  text-align: center;
}

.mc-progress-bar {
  flex: 1;
  position: relative;
  height: 0.375rem;
  background: var(--color-divider);
  border-radius: 9999px;
}

.mc-progress-fill {
  position: absolute;
  top: 0; left: 0;
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary), var(--color-primary-light));
  border-radius: 9999px;
  transition: width 0.15s linear;
}

.mc-progress-input {
  position: absolute;
  inset: -0.5rem 0;
  width: 100%;
  height: calc(100% + 1rem);
  opacity: 0;
  cursor: pointer;
}

/* Controls */
.mc-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.mc-ctrl-sm {
  padding: 0.5rem;
  border-radius: 50%;
  color: var(--color-text-secondary);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mc-ctrl-sm:hover { color: var(--color-text-primary); background: var(--color-divider); }
.mc-ctrl-sm.active { color: var(--color-primary); }

.mc-ctrl {
  padding: 0.625rem;
  border-radius: 50%;
  color: var(--color-text-primary);
  background: color-mix(in srgb, var(--color-surface) 80%, transparent);
  border: 1px solid var(--color-divider);
  cursor: pointer;
  transition: all 0.2s ease;
}

.mc-ctrl:hover { background: var(--color-surface); transform: scale(1.05); }

.mc-ctrl-main {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px color-mix(in srgb, var(--color-primary) 50%, transparent);
  transition: all 0.2s ease;
}

.mc-ctrl-main:hover:not(:disabled) {
  transform: scale(1.08);
  box-shadow: 0 12px 32px color-mix(in srgb, var(--color-primary) 60%, transparent);
}

.mc-ctrl-main:disabled { opacity: 0.6; cursor: not-allowed; }

.mc-spinner {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: mc-spin 1s linear infinite;
}

@keyframes mc-spin { to { transform: rotate(360deg); } }

/* Volume */
.mc-volume {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  max-width: 200px;
}

.mc-vol-btn {
  padding: 0.375rem;
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: color 0.2s ease;
}

.mc-vol-btn:hover { color: var(--color-text-primary); }

.mc-vol-bar {
  flex: 1;
  position: relative;
  height: 0.3rem;
  background: var(--color-divider);
  border-radius: 9999px;
}

.mc-vol-fill {
  position: absolute;
  top: 0; left: 0;
  height: 100%;
  background: var(--color-primary);
  border-radius: 9999px;
}

.mc-vol-input {
  position: absolute;
  inset: -0.5rem 0;
  width: 100%;
  height: calc(100% + 1rem);
  opacity: 0;
  cursor: pointer;
}

.mc-vol-text {
  font-size: 0.7rem;
  color: var(--color-text-secondary);
  min-width: 2rem;
  text-align: right;
}

/* ── Responsive ── */
@media (max-width: 480px) {
  .music-cards-section {
    padding: 2rem 0;
  }

  .mc-header {
    padding: 0 1rem;
    margin-bottom: 1.5rem;
  }

  .mc-header-icon {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 0.625rem;
  }

  .mc-header-title {
    font-size: 1.35rem;
  }

  .mc-carousel-wrapper {
    height: 320px;
  }

  .mc-card-slot {
    width: 200px;
    margin-left: -100px;
    margin-top: -145px;
  }

  .mc-card {
    padding: 1.5rem 1rem 1.25rem;
  }

  .mc-card-cover {
    width: 5.5rem;
    height: 5.5rem;
    margin-bottom: 1rem;
  }

  .mc-card-title { font-size: 0.85rem; }
  .mc-card-artist { font-size: 0.7rem; }

  .mc-arrow { display: none; }

  .mc-edge-shadow { width: 3rem; }

  .mc-player {
    padding: 1rem;
    border-radius: 1rem;
    margin: 0 1rem;
  }

  .mc-ctrl-main { width: 3rem; height: 3rem; }
  .mc-controls { gap: 0.5rem; }
}
</style>
