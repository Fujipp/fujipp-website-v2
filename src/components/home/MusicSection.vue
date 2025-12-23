<template>
  <section
    id="music-section"
    class="music-section"
  >
    <div class="music-container">
      <!-- Header -->
      <div class="music-header">
        <div class="header-content">
          <div class="header-icon">
            <MusicalNoteIcon class="w-8 h-8" />
          </div>
          <div>
            <h2 class="header-title">Music Station</h2>
            <p class="header-subtitle">My favorite songs</p>
          </div>
        </div>
        <div class="search-wrapper">
          <MagnifyingGlassIcon class="search-icon" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search songs..."
            class="search-input"
          />
        </div>
      </div>

      <!-- Main Content -->
      <div class="music-content">
        <!-- Player Section -->
        <div class="player-section">
          <!-- Video Player -->
          <div class="video-wrapper">
            <div class="video-container">
              <img
                v-if="currentSong"
                :src="audioStore.getThumbnail(currentSong.videoId)"
                :alt="currentSong.title"
                class="cover-image"
                @error="onImageError"
              />
              <div v-if="audioStore.isPlaying" class="playing-overlay">
                <div class="equalizer">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <div v-if="audioStore.isBuffering" class="video-loading">
                <div class="loading-spinner"></div>
                <p>Loading...</p>
              </div>
            </div>
            <div class="video-glow"></div>
          </div>

          <!-- Song Info -->
          <div class="song-info">
            <h3 class="song-title">{{ currentSong?.title || 'Select a song' }}</h3>
            <p class="song-artist">{{ currentSong?.artist || '' }}</p>
          </div>

          <!-- Progress Bar -->
          <div class="progress-section">
            <div class="progress-bar-wrapper">
              <div
                class="progress-bar-fill"
                :style="{ width: `${progressPercent}%` }"
              ></div>
              <div
                class="progress-thumb"
                :style="{ left: `${progressPercent}%` }"
              ></div>
              <input
                type="range"
                min="0"
                :max="audioStore.duration || 100"
                step="0.1"
                :value="audioStore.currentTime"
                @input="onSeekInput"
                @change="onSeekChange"
                class="progress-input"
              />
            </div>
            <div class="progress-time">
              <span>{{ formatTime(audioStore.currentTime) }}</span>
              <span>{{ formatTime(audioStore.duration) }}</span>
            </div>
          </div>

          <!-- Controls -->
          <div class="controls-section">
            <button
              @click="audioStore.toggleShuffle"
              class="control-btn-sm"
              :class="{ active: audioStore.isShuffle }"
              title="Shuffle"
            >
              <ArrowsRightLeftIcon class="w-5 h-5" />
            </button>

            <button @click="audioStore.previousSong" class="control-btn" title="Previous">
              <BackwardIcon class="w-6 h-6" />
            </button>

            <button
              @click="audioStore.toggleAudio"
              class="control-btn-main"
              :disabled="!audioStore.isReady"
              title="Play/Pause"
            >
              <div v-if="audioStore.isBuffering" class="btn-loading"></div>
              <PlayIcon v-else-if="!audioStore.isPlaying" class="w-8 h-8" />
              <PauseIcon v-else class="w-8 h-8" />
            </button>

            <button @click="audioStore.changeSong" class="control-btn" title="Next">
              <ForwardIcon class="w-6 h-6" />
            </button>

            <button
              @click="audioStore.toggleLoop"
              class="control-btn-sm"
              :class="{ active: audioStore.isLoop }"
              title="Loop"
            >
              <ArrowPathRoundedSquareIcon class="w-5 h-5" />
            </button>
          </div>

          <!-- Volume -->
          <div class="volume-section">
            <button @click="toggleMute" class="volume-btn">
              <SpeakerXMarkIcon v-if="audioStore.volume === 0" class="w-5 h-5" />
              <SpeakerWaveIcon v-else class="w-5 h-5" />
            </button>
            <div class="volume-bar-wrapper">
              <div
                class="volume-bar-fill"
                :style="{ width: `${audioStore.volume}%` }"
              ></div>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                :value="audioStore.volume"
                @input="onVolumeChange"
                class="volume-input"
              />
            </div>
            <span class="volume-text">{{ audioStore.volume }}%</span>
          </div>
        </div>

        <!-- Playlist Section -->
        <div class="playlist-section">
          <div class="playlist-header">
            <h3 class="playlist-title">Playlist</h3>
            <span class="playlist-count">{{ filteredSongs.length }} songs</span>
          </div>
          <ul class="playlist-list">
            <li
              v-for="(song, index) in filteredSongs"
              :key="song.id"
              @click="audioStore.selectSong(index)"
              :class="[
                'playlist-item',
                { active: audioStore.currentSongIndex === index }
              ]"
            >
              <div class="playlist-item-cover">
                <img
                  :src="audioStore.getThumbnail(song.videoId)"
                  :alt="song.title"
                  class="playlist-cover-img"
                  @error="onImageError"
                />
                <div class="playlist-item-overlay">
                  <PlayIcon v-if="audioStore.currentSongIndex !== index" class="w-5 h-5" />
                  <div v-else-if="audioStore.isPlaying" class="playing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <PauseIcon v-else class="w-5 h-5" />
                </div>
              </div>
              <div class="playlist-item-info">
                <p class="playlist-item-title">{{ song.title }}</p>
                <p class="playlist-item-artist">{{ song.artist }}</p>
              </div>
              <button
                @click.stop="audioStore.toggleFavorite(song.id)"
                class="favorite-btn"
                :class="{ active: song.favorite }"
              >
                <HeartIcon class="w-4 h-4" />
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAudioStore } from '@/stores/audioStore';
import {
  PlayIcon,
  PauseIcon,
  ForwardIcon,
  BackwardIcon,
  ArrowPathRoundedSquareIcon,
  ArrowsRightLeftIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  MagnifyingGlassIcon,
  MusicalNoteIcon,
  HeartIcon,
} from '@heroicons/vue/24/solid';

const audioStore = useAudioStore();
const searchQuery = ref('');
const previousVolume = ref(100);

const onImageError = (e: Event) => {
  const img = e.target as HTMLImageElement;
  if (img.src.includes('maxresdefault')) {
    img.src = img.src.replace('maxresdefault', 'hqdefault');
  }
};

const currentSong = computed(() => audioStore.currentSong);

const progressPercent = computed(() => {
  if (!audioStore.duration) return 0;
  return (audioStore.currentTime / audioStore.duration) * 100;
});

const filteredSongs = computed(() =>
  audioStore.songs.filter((song) =>
    song.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);

const formatTime = (sec: number): string => {
  if (!sec || isNaN(sec)) return '0:00';
  const min = Math.floor(sec / 60);
  const secStr = String(Math.floor(sec % 60)).padStart(2, '0');
  return `${min}:${secStr}`;
};

const onSeekInput = (e: Event) => {
  const value = parseFloat((e.target as HTMLInputElement).value);
  audioStore.seekTo(value);
};

const onSeekChange = (e: Event) => {
  const value = parseFloat((e.target as HTMLInputElement).value);
  audioStore.seekTo(value);
};

const onVolumeChange = (e: Event) => {
  const value = parseInt((e.target as HTMLInputElement).value);
  audioStore.setVolume(value);
};

const toggleMute = () => {
  if (audioStore.volume > 0) {
    previousVolume.value = audioStore.volume;
    audioStore.setVolume(0);
  } else {
    audioStore.setVolume(previousVolume.value || 100);
  }
};
</script>

<style scoped>
.music-section {
  min-height: auto;
  padding: 4rem 1.5rem;
  background: linear-gradient(135deg, 
    var(--color-background) 0%, 
    color-mix(in srgb, var(--color-primary) 8%, var(--color-background)) 50%,
    var(--color-background) 100%
  );
}

.music-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Header */
.music-header {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 3rem;
}

@media (min-width: 768px) {
  .music-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-icon {
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

.header-title {
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--color-text-primary), var(--color-primary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-subtitle {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
}

.search-wrapper {
  position: relative;
  width: 100%;
  max-width: 20rem;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  color: var(--color-text-secondary);
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  background: color-mix(in srgb, var(--color-surface) 80%, transparent);
  backdrop-filter: blur(12px);
  border: 1px solid var(--color-divider);
  border-radius: 9999px;
  color: var(--color-text-primary);
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-primary) 20%, transparent);
}

.search-input::placeholder {
  color: var(--color-text-secondary);
}

/* Main Content */
.music-content {
  display: flex;
  flex-direction: column-reverse;
  gap: 2rem;
}

@media (min-width: 1024px) {
  .music-content {
    flex-direction: row;
    gap: 3rem;
  }
}

/* Player Section */
.player-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

@media (min-width: 1024px) {
  .player-section {
    flex: 2;
  }
}

.video-wrapper {
  position: relative;
  width: 100%;
  max-width: 480px;
}

.video-container {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 1.5rem;
  overflow: hidden;
  background: var(--color-surface);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.video-container:hover .cover-image {
  transform: scale(1.05);
}

.playing-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.equalizer {
  display: flex;
  gap: 4px;
  align-items: flex-end;
  height: 3rem;
}

.equalizer span {
  width: 6px;
  background: var(--color-text-primary);
  border-radius: 3px;
  animation: eq-bar 0.8s ease-in-out infinite;
}

.equalizer span:nth-child(1) { height: 40%; animation-delay: 0s; }
.equalizer span:nth-child(2) { height: 70%; animation-delay: 0.1s; }
.equalizer span:nth-child(3) { height: 100%; animation-delay: 0.2s; }
.equalizer span:nth-child(4) { height: 60%; animation-delay: 0.3s; }
.equalizer span:nth-child(5) { height: 30%; animation-delay: 0.4s; }

@keyframes eq-bar {
  0%, 100% { transform: scaleY(0.5); }
  50% { transform: scaleY(1); }
}

.video-container :deep(iframe) {
  width: 100%;
  height: 100%;
  border: none;
}

.video-glow {
  position: absolute;
  inset: -20%;
  background: radial-gradient(ellipse at center, 
    color-mix(in srgb, var(--color-primary) 30%, transparent) 0%,
    transparent 70%
  );
  z-index: -1;
  filter: blur(40px);
  animation: pulse-glow 4s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.05); }
}

.video-loading {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  background: var(--color-surface);
  color: var(--color-text-secondary);
}

.loading-spinner {
  width: 2.5rem;
  height: 2.5rem;
  border: 3px solid var(--color-divider);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Song Info */
.song-info {
  text-align: center;
  max-width: 100%;
  padding: 0 1rem;
}

.song-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.song-artist {
  color: var(--color-text-secondary);
  font-size: 1rem;
}

/* Progress Bar */
.progress-section {
  width: 100%;
  max-width: 480px;
  padding: 0 1rem;
}

.progress-bar-wrapper {
  position: relative;
  height: 0.5rem;
  background: var(--color-divider);
  border-radius: 9999px;
  overflow: visible;
}

.progress-bar-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary), var(--color-primary-light));
  border-radius: 9999px;
  transition: width 0.1s linear;
}

.progress-thumb {
  position: absolute;
  top: 50%;
  width: 1rem;
  height: 1rem;
  background: var(--color-text-primary);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.progress-bar-wrapper:hover .progress-thumb {
  opacity: 1;
}

.progress-input {
  position: absolute;
  inset: -0.5rem 0;
  width: 100%;
  height: calc(100% + 1rem);
  opacity: 0;
  cursor: pointer;
}

.progress-time {
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}

/* Controls */
.controls-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.control-btn-sm {
  padding: 0.5rem;
  border-radius: 50%;
  color: var(--color-text-secondary);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.control-btn-sm:hover {
  color: var(--color-text-primary);
  background: var(--color-divider);
}

.control-btn-sm.active {
  color: var(--color-primary);
}

.control-btn {
  padding: 0.75rem;
  border-radius: 50%;
  color: var(--color-text-primary);
  background: color-mix(in srgb, var(--color-surface) 80%, transparent);
  border: 1px solid var(--color-divider);
  cursor: pointer;
  transition: all 0.2s ease;
}

.control-btn:hover {
  background: var(--color-surface);
  transform: scale(1.05);
}

.control-btn-main {
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  color: var(--color-background);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px color-mix(in srgb, var(--color-primary) 50%, transparent);
  transition: all 0.2s ease;
}

.control-btn-main:hover:not(:disabled) {
  transform: scale(1.08);
  box-shadow: 0 12px 40px color-mix(in srgb, var(--color-primary) 60%, transparent);
}

.control-btn-main:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-loading {
  width: 1.5rem;
  height: 1.5rem;
  border: 2px solid color-mix(in srgb, var(--color-background) 30%, transparent);
  border-top-color: var(--color-background);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Volume */
.volume-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  max-width: 200px;
}

.volume-btn {
  padding: 0.5rem;
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: color 0.2s ease;
}

.volume-btn:hover {
  color: var(--color-text-primary);
}

.volume-bar-wrapper {
  flex: 1;
  position: relative;
  height: 0.375rem;
  background: var(--color-divider);
  border-radius: 9999px;
}

.volume-bar-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: var(--color-primary);
  border-radius: 9999px;
}

.volume-input {
  position: absolute;
  inset: -0.5rem 0;
  width: 100%;
  height: calc(100% + 1rem);
  opacity: 0;
  cursor: pointer;
}

.volume-text {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  min-width: 2.5rem;
  text-align: right;
}

/* Playlist Section */
.playlist-section {
  background: color-mix(in srgb, var(--color-surface) 60%, transparent);
  backdrop-filter: blur(16px);
  border-radius: 1.5rem;
  border: 1px solid var(--color-divider);
  padding: 1.5rem;
  max-height: 600px;
  display: flex;
  flex-direction: column;
}

@media (min-width: 1024px) {
  .playlist-section {
    flex: 1;
    max-width: 380px;
  }
}

.playlist-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.playlist-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.playlist-count {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  background: var(--color-divider);
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
}

.playlist-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-right: 0.5rem;
}

.playlist-list::-webkit-scrollbar {
  width: 4px;
}

.playlist-list::-webkit-scrollbar-thumb {
  background: var(--color-primary);
  border-radius: 9999px;
}

.playlist-list::-webkit-scrollbar-track {
  background: var(--color-divider);
  border-radius: 9999px;
}

.playlist-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.playlist-item:hover {
  background: color-mix(in srgb, var(--color-primary) 10%, transparent);
}

.playlist-item.active {
  background: color-mix(in srgb, var(--color-primary) 20%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-primary) 30%, transparent);
}

.playlist-item-cover {
  position: relative;
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  overflow: hidden;
  flex-shrink: 0;
}

.playlist-cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.playlist-item-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-primary);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.playlist-item:hover .playlist-item-overlay,
.playlist-item.active .playlist-item-overlay {
  opacity: 1;
}

.playing-indicator {
  display: flex;
  gap: 2px;
  align-items: flex-end;
  height: 1rem;
}

.playing-indicator span {
  width: 3px;
  background: var(--color-text-primary);
  border-radius: 1px;
  animation: equalizer 0.6s ease infinite;
}

.playing-indicator span:nth-child(1) { height: 60%; animation-delay: 0s; }
.playing-indicator span:nth-child(2) { height: 100%; animation-delay: 0.2s; }
.playing-indicator span:nth-child(3) { height: 40%; animation-delay: 0.4s; }

@keyframes equalizer {
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(0.5); }
}

.playlist-item-info {
  flex: 1;
  min-width: 0;
}

.playlist-item-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.playlist-item-artist {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.favorite-btn {
  padding: 0.375rem;
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  opacity: 0;
  transition: all 0.2s ease;
}

.playlist-item:hover .favorite-btn {
  opacity: 1;
}

.favorite-btn:hover {
  color: var(--color-accent);
}

.favorite-btn.active {
  color: var(--color-accent);
  opacity: 1;
}

/* Mobile Responsive */
@media (max-width: 480px) {
  .music-section {
    padding: 2rem 0.75rem;
  }

  .music-container {
    max-width: 100%;
  }

  .music-header {
    margin-bottom: 1.5rem;
    gap: 1rem;
  }

  .header-icon {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 0.625rem;
  }

  .header-title {
    font-size: 1.35rem;
  }

  .header-subtitle {
    font-size: 0.7rem;
  }

  .search-wrapper {
    max-width: 100%;
  }

  .search-input {
    padding: 0.6rem 0.875rem 0.6rem 2.5rem;
    font-size: 0.8rem;
  }

  .search-icon {
    left: 0.75rem;
    width: 1rem;
    height: 1rem;
  }

  .music-content {
    gap: 1.5rem;
  }

  .video-wrapper {
    max-width: 280px;
    margin: 0 auto;
  }

  .video-container {
    border-radius: 1rem;
    aspect-ratio: 1;
  }

  .song-info {
    padding: 0 0.5rem;
  }

  .song-title {
    font-size: 1rem;
  }

  .song-artist {
    font-size: 0.8rem;
  }

  .progress-section {
    max-width: 100%;
    padding: 0;
  }

  .controls-section {
    gap: 0.4rem;
  }

  .control-btn-main {
    width: 3rem;
    height: 3rem;
  }

  .control-btn-main svg {
    width: 1.5rem;
    height: 1.5rem;
  }

  .control-btn {
    padding: 0.4rem;
  }

  .control-btn svg {
    width: 1.25rem;
    height: 1.25rem;
  }

  .control-btn-sm {
    padding: 0.35rem;
  }

  .control-btn-sm svg {
    width: 1rem;
    height: 1rem;
  }

  .volume-section {
    max-width: 160px;
    gap: 0.5rem;
  }

  .volume-text {
    font-size: 0.65rem;
    min-width: 2rem;
  }

  .playlist-section {
    padding: 0.875rem;
    border-radius: 1rem;
    max-height: 300px;
  }

  .playlist-header {
    margin-bottom: 0.75rem;
  }

  .playlist-title {
    font-size: 0.9rem;
  }

  .playlist-count {
    font-size: 0.65rem;
    padding: 0.2rem 0.5rem;
  }

  .playlist-item {
    padding: 0.375rem;
    gap: 0.5rem;
  }

  .playlist-item-cover {
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 0.375rem;
  }

  .playlist-item-title {
    font-size: 0.75rem;
  }

  .playlist-item-artist {
    font-size: 0.65rem;
  }

  .favorite-btn {
    padding: 0.25rem;
  }
}

@media (min-width: 481px) and (max-width: 767px) {
  .music-section {
    padding: 3rem 1rem;
  }

  .video-wrapper {
    max-width: 320px;
    margin: 0 auto;
  }

  .playlist-section {
    max-height: 400px;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .music-section {
    padding: 3rem 1.5rem;
  }

  .video-wrapper {
    max-width: 400px;
  }
}

/* Prevent horizontal overflow */
.music-section,
.music-container {
  max-width: 100vw;
  box-sizing: border-box;
  overflow-x: hidden;
}
</style>
