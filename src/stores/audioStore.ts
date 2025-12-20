import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

declare global {
  interface Window {
    audio?: HTMLAudioElement;
    audioContext?: AudioContext;
    analyzerNode?: AnalyserNode;
  }
}

interface Song {
  id: number;
  title: string;
  artist: string;
  cover: string;
  file: string;
  link: string;
  favorite?: boolean;
}

export const useAudioStore = defineStore('audio', () => {
  const songs = ref<Song[]>([]);
  const currentSongIndex = ref(0);
  const isPlaying = ref(false);
  const isLoop = ref(false);
  const isShuffle = ref(false);
  const isBuffering = ref(false);

  const audio = ref(window.audio ?? new Audio());
  if (!window.audio) window.audio = audio.value;

  const fetchSongs = async () => {
    try {
      const res = await fetch('/data/songs.json');
      songs.value = await res.json();

      const savedIndex = localStorage.getItem('lastSongIndex');
      const savedTime = localStorage.getItem('lastSeekTime');

      if (savedIndex !== null && savedTime !== null) {
        currentSongIndex.value = Number(savedIndex);
        audio.value.src = songs.value[currentSongIndex.value].file;
        audio.value.currentTime = Number(savedTime);
      } else if (songs.value.length > 0) {
        audio.value.src = songs.value[0].file;
      }
    } catch (err) {
      console.error('Error loading songs:', err);
    }
  };

  const initVisualizer = () => {
    if (!window.audioContext) {
      window.audioContext = new AudioContext();
      const source = window.audioContext.createMediaElementSource(audio.value);
      window.analyzerNode = window.audioContext.createAnalyser();
      source.connect(window.analyzerNode);
      window.analyzerNode.connect(window.audioContext.destination);
    }
  };

  const playSong = () => {
    isBuffering.value = true;
    audio.value
      .play()
      .then(() => {
        isPlaying.value = true;
        isBuffering.value = false;
        initVisualizer();
      })
      .catch(err => {
        console.error('Error playing audio:', err);
        isBuffering.value = false;
      });
  };

  const pauseSong = () => {
    audio.value.pause();
    isPlaying.value = false;
  };

  const stopAudio = () => {
    audio.value.pause();
    audio.value.currentTime = 0;
    isPlaying.value = false;
  };

  const toggleAudio = () => {
    isPlaying.value ? pauseSong() : playSong();
  };

  const changeSong = () => {
    currentSongIndex.value = isShuffle.value
      ? Math.floor(Math.random() * songs.value.length)
      : (currentSongIndex.value + 1) % songs.value.length;

    audio.value.src = songs.value[currentSongIndex.value].file;
    if (isPlaying.value) playSong();
  };

  const previousSong = () => {
    currentSongIndex.value =
      currentSongIndex.value === 0
        ? songs.value.length - 1
        : currentSongIndex.value - 1;

    audio.value.src = songs.value[currentSongIndex.value].file;
    if (isPlaying.value) playSong();
  };

  const seekTo = (value: number) => {
    audio.value.currentTime = value;
  };

  const setVolume = (value: number) => {
    audio.value.volume = Math.min(1, Math.max(0, value));
  };

  const toggleLoop = () => {
    isLoop.value = !isLoop.value;
    audio.value.loop = isLoop.value;
  };

  const toggleShuffle = () => {
    isShuffle.value = !isShuffle.value;
  };

  const toggleFavorite = (id: number) => {
    const song = songs.value.find(s => s.id === id);
    if (song) song.favorite = !song.favorite;
  };

  const selectSong = (index: number) => {
    currentSongIndex.value = index;
    audio.value.src = songs.value[index].file;
    audio.value.load();
    playSong();
  };

  // ✅ Save current song & time
  watch(currentSongIndex, index => {
    localStorage.setItem('lastSongIndex', index.toString());
  });
  watch(
    () => audio.value.currentTime,
    time => {
      localStorage.setItem('lastSeekTime', time.toString());
    }
  );

  audio.value.onended = () => {
    if (!isLoop.value) changeSong();
  };

  return {
    songs,
    currentSongIndex,
    isPlaying,
    isLoop,
    isShuffle,
    isBuffering,
    audio,
    fetchSongs,
    playSong,
    pauseSong,
    stopAudio,
    toggleAudio,
    changeSong,
    previousSong,
    seekTo,
    setVolume,
    toggleLoop,
    toggleShuffle,
    toggleFavorite,
    selectSong,
  };
});
