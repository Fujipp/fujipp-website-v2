<!-- 🔁 ปรับ UI: Music Station -->
<template>
  <section
    id="music-section"
    class="min-h-screen w-full px-4 py-24 bg-gradient-to-br from-[var(--color-background)] to-[var(--color-surface)] text-[var(--color-text-primary)] transition-all"
  >
    <div class="max-w-screen-xl mx-auto space-y-10">
      <!-- Title & Search -->
      <div class="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
        <h2 class="text-4xl font-extrabold tracking-tight">🎵 Music Station</h2>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search song title..."
          class="w-full md:w-80 px-4 py-2 rounded-md bg-white/10 border border-white/20 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        />
      </div>

      <!-- Player + Playlist -->
      <div class="flex flex-col-reverse lg:flex-row gap-12">
        <!-- 📃 Playlist -->
        <div class="lg:w-1/3">
          <div class="bg-white/5 rounded-xl p-4 backdrop-blur shadow border border-white/10">
            <h3 class="text-lg font-semibold mb-3">Playlist</h3>
            <ul
              class="space-y-2 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--color-primary)]/70 scrollbar-track-white/5"
            >
              <li
                v-for="(song, index) in filteredSongs"
                :key="song.id"
                @click="selectSong(index)"
                :class="[
                  'flex items-center gap-3 p-2 rounded-md cursor-pointer transition',
                  audioStore.currentSongIndex === index
                    ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)]'
                    : 'hover:bg-white/10',
                ]"
              >
                <img :src="song.cover" class="w-10 h-10 rounded object-cover" />
                <div class="flex-1">
                  <p class="text-sm font-medium truncate">{{ song.title }}</p>
                  <p class="text-xs text-white/50 truncate">{{ song.artist }}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!-- 🎧 Player -->
        <div class="lg:w-2/3 flex flex-col items-center space-y-6 transition-all">
          <!-- Cover -->
          <Transition name="fade">
            <img
              v-if="currentSong.cover"
              :src="currentSong.cover"
              class="w-56 h-56 rounded-xl object-cover shadow-lg"
            />
          </Transition>

          <!-- Info -->
          <div class="text-center space-y-1">
            <h3 class="text-2xl font-bold truncate">{{ currentSong.title }}</h3>
            <p class="text-white/60 truncate">{{ currentSong.artist }}</p>
          </div>

          <!-- Status -->
          <p v-if="audioStore.isBuffering" class="text-sm text-white/60">Loading...</p>

          <!-- Controls -->
          <div class="flex items-center gap-6">
            <button
              @click="audioStore.toggleLoop"
              class="p-2 rounded-full hover:bg-white/10 transition"
              :class="{ 'text-[var(--color-primary)]': audioStore.isLoop }"
              title="Loop"
            >
              <ArrowPathRoundedSquareIcon class="w-6 h-6" />
            </button>
            <button @click="audioStore.previousSong" title="Previous">
              <BackwardIcon class="w-6 h-6" />
            </button>
            <button
              @click="audioStore.toggleAudio"
              class="bg-[var(--color-primary)] p-5 rounded-full text-white shadow-xl hover:scale-110 transition"
              title="Play/Pause"
            >
              <PlayIcon v-if="!audioStore.isPlaying" class="w-7 h-7" />
              <PauseIcon v-else class="w-7 h-7" />
            </button>
            <button @click="audioStore.changeSong" title="Next">
              <ForwardIcon class="w-6 h-6" />
            </button>
            <button
              @click="audioStore.toggleShuffle"
              class="p-2 rounded-full hover:bg-white/10 transition"
              :class="{ 'text-[var(--color-primary)]': audioStore.isShuffle }"
              title="Shuffle"
            >
              <ArrowsRightLeftIcon class="w-6 h-6" />
            </button>
          </div>

          <!-- 🎚️ Seek Bar -->
          <div class="w-full px-4 space-y-1">
            <div class="relative h-2 bg-white/20 rounded-full group">
              <div
                class="absolute h-2 bg-[var(--color-primary)] top-0 left-0 rounded-full"
                :style="{ width: `${(seekTime / duration) * 100}%` }"
              ></div>
              <div
                class="absolute -top-1 w-4 h-4 bg-[var(--color-primary)] rounded-full"
                :style="{ left: `calc(${(seekTime / duration) * 100}% - 0.5rem)` }"
              ></div>
              <input
                type="range"
                min="0"
                :max="duration"
                step="0.1"
                v-model.number="seekTime"
                @mousedown="isSeeking = true"
                @input="onSeekPreview"
                @mouseup="onSeek"
                class="absolute top-0 left-0 w-full h-2 opacity-0 cursor-pointer"
              />
            </div>
            <div class="flex justify-between text-xs text-white/50">
              <span>{{ formatTime(seekTime) }}</span>
              <span>{{ formatTime(duration) }}</span>
            </div>
          </div>

          <!-- 🎵 Visualizer -->
          <canvas ref="visualizerRef" class="w-full h-16 mt-2 rounded overflow-hidden bg-white/5" />

          <!-- 🔊 Volume -->
          <div class="flex items-center gap-4 w-full px-4">
            <button @click="adjustVolume(-0.1)" title="Volume down">
              <MinusIcon class="w-5 h-5" />
            </button>
            <div class="relative w-full h-2 bg-white/20 rounded-full">
              <div
                class="absolute h-2 bg-[var(--color-primary)] top-0 left-0 rounded-full"
                :style="{ width: `${volume * 100}%` }"
              ></div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                v-model.number="volume"
                class="absolute top-0 left-0 w-full h-2 opacity-0 cursor-pointer"
              />
            </div>
            <button @click="adjustVolume(0.1)" title="Volume up">
              <PlusIcon class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>


<script setup lang="ts">
  import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue';
  import { useAudioStore } from '@/stores/audioStore';
  import {
    PlayIcon,
    PauseIcon,
    ForwardIcon,
    BackwardIcon,
    MinusIcon,
    PlusIcon,
    ArrowPathRoundedSquareIcon,
    ArrowsRightLeftIcon,
  } from '@heroicons/vue/24/solid';

  const audioStore = useAudioStore();
  const searchQuery = ref('');
  const duration = ref(0);
  const seekTime = ref(0);
  const volume = ref(1);
  const isSeeking = ref(false);
  const visualizerRef = ref<HTMLCanvasElement | null>(null);

  let animationId = 0;

  const drawVisualizer = () => {
    if (!window.analyzerNode || !visualizerRef.value) return;
    const canvas = visualizerRef.value;
    const ctx = canvas.getContext('2d');
    const bufferLength = window.analyzerNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      window.analyzerNode!.getByteFrequencyData(dataArray);
      ctx!.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] / 2;
        ctx!.fillStyle = '#7987AC';
        ctx!.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
      animationId = requestAnimationFrame(draw);
    };

    draw();
  };

  onMounted(() => {
    if (audioStore.songs.length === 0) audioStore.fetchSongs();

    const trackSeekTime = () => {
      if (!isSeeking.value) {
        seekTime.value = audioStore.audio.currentTime || 0;
        duration.value = audioStore.audio.duration || 0;
      }
      animationId = requestAnimationFrame(trackSeekTime);
    };

    audioStore.audio.addEventListener('loadedmetadata', () => {
      duration.value = audioStore.audio.duration || 0;
      seekTime.value = audioStore.audio.currentTime || 0;
    });

    drawVisualizer();
    trackSeekTime();

    volume.value = audioStore.audio.volume || 1;
    audioStore.setVolume(volume.value);
  });

  onBeforeUnmount(() => {
    cancelAnimationFrame(animationId);
  });

  watch(volume, newVol => {
    audioStore.setVolume(newVol);
  });

  const onSeek = () => {
    isSeeking.value = false;
    audioStore.seekTo(seekTime.value);
    if (!audioStore.audio.paused) {
      audioStore.audio.play();
    }
  };

  const onSeekPreview = () => {
    if (audioStore.audio.readyState > 0) {
      audioStore.audio.currentTime = seekTime.value;
    }
  };

  const adjustVolume = (change: number) => {
    volume.value = Math.max(
      0,
      Math.min(1, parseFloat((volume.value + change).toFixed(2)))
    );
  };

  const currentSong = computed(() => {
    return (
      audioStore.songs[audioStore.currentSongIndex] || {
        title: 'Loading...',
        artist: '',
        cover: '',
      }
    );
  });

  const filteredSongs = computed(() =>
    audioStore.songs.filter(song =>
      song.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  );

  const formatTime = (sec: number): string => {
    const min = Math.floor(sec / 60);
    const secStr = String(Math.floor(sec % 60)).padStart(2, '0');
    return `${min}:${secStr}`;
  };

  const selectSong = (index: number) => {
    audioStore.selectSong(index);
  };
</script>

<style scoped>
  .scrollbar-thin::-webkit-scrollbar {
    width: 6px;
  }
  .scrollbar-thin::-webkit-scrollbar-thumb {
    border-radius: 4px;
  }
  .scrollbar-thin::-webkit-scrollbar-track {
    border-radius: 4px;
  }
</style>
