/// <reference types="youtube" />
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

declare global {
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface Song {
  id: number;
  title: string;
  artist: string;
  videoId: string;
  favorite?: boolean;
}

export const useAudioStore = defineStore('audio', () => {
  const songs = ref<Song[]>([]);
  const currentSongIndex = ref(0);
  const isPlaying = ref(false);
  const isLoop = ref(false);
  const isShuffle = ref(false);
  const isBuffering = ref(false);
  const isReady = ref(false);
  const currentTime = ref(0);
  const duration = ref(0);
  const volume = ref(100);

  let player: YT.Player | null = null;
  let timeUpdateInterval: number | null = null;

  const currentSong = computed(() => songs.value[currentSongIndex.value] || null);

  const getThumbnail = (videoId: string) => {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  const loadYouTubeAPI = (): Promise<void> => {
    return new Promise((resolve) => {
      if (window.YT && window.YT.Player) {
        resolve();
        return;
      }

      const existingScript = document.getElementById('youtube-iframe-api');
      if (existingScript) {
        window.onYouTubeIframeAPIReady = () => resolve();
        return;
      }

      const script = document.createElement('script');
      script.id = 'youtube-iframe-api';
      script.src = 'https://www.youtube.com/iframe_api';
      window.onYouTubeIframeAPIReady = () => resolve();
      document.head.appendChild(script);
    });
  };

  const initPlayer = async (containerId: string) => {
    await loadYouTubeAPI();

    if (player) {
      player.destroy();
    }

    const videoId = songs.value[currentSongIndex.value]?.videoId || '';

    player = new window.YT.Player(containerId, {
      height: '100%',
      width: '100%',
      videoId,
      playerVars: {
        autoplay: 0,
        controls: 0,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        iv_load_policy: 3,
        playsinline: 1,
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
      },
    });
  };

  const onPlayerReady = (event: YT.PlayerEvent) => {
    isReady.value = true;
    event.target.setVolume(volume.value);

    // Restore last position
    const savedIndex = localStorage.getItem('lastSongIndex');
    const savedTime = localStorage.getItem('lastSeekTime');

    if (savedIndex !== null) {
      const index = Number(savedIndex);
      if (index !== currentSongIndex.value && songs.value[index]) {
        currentSongIndex.value = index;
        loadVideo(songs.value[index].videoId);
      }
    }

    if (savedTime !== null) {
      seekTo(Number(savedTime));
    }
  };

  const onPlayerStateChange = (event: YT.OnStateChangeEvent) => {
    switch (event.data) {
      case window.YT.PlayerState.PLAYING:
        isPlaying.value = true;
        isBuffering.value = false;
        startTimeUpdate();
        break;
      case window.YT.PlayerState.PAUSED:
        isPlaying.value = false;
        stopTimeUpdate();
        break;
      case window.YT.PlayerState.BUFFERING:
        isBuffering.value = true;
        break;
      case window.YT.PlayerState.ENDED:
        isPlaying.value = false;
        stopTimeUpdate();
        if (isLoop.value) {
          seekTo(0);
          playSong();
        } else {
          changeSong();
        }
        break;
    }
  };

  const startTimeUpdate = () => {
    stopTimeUpdate();
    timeUpdateInterval = window.setInterval(() => {
      if (player && typeof player.getCurrentTime === 'function') {
        currentTime.value = player.getCurrentTime() || 0;
        duration.value = player.getDuration() || 0;
        localStorage.setItem('lastSeekTime', currentTime.value.toString());
      }
    }, 250);
  };

  const stopTimeUpdate = () => {
    if (timeUpdateInterval) {
      clearInterval(timeUpdateInterval);
      timeUpdateInterval = null;
    }
  };

  const loadVideo = (videoId: string) => {
    if (player && typeof player.loadVideoById === 'function') {
      player.loadVideoById(videoId);
    }
  };

  const fetchSongs = async () => {
    try {
      const res = await fetch('/data/songs.json');
      songs.value = await res.json();

      const savedIndex = localStorage.getItem('lastSongIndex');
      if (savedIndex !== null) {
        const index = Number(savedIndex);
        if (songs.value[index]) {
          currentSongIndex.value = index;
        }
      }
    } catch (err) {
      console.error('Error loading songs:', err);
    }
  };

  const playSong = () => {
    if (player && typeof player.playVideo === 'function') {
      isBuffering.value = true;
      player.playVideo();
    }
  };

  const pauseSong = () => {
    if (player && typeof player.pauseVideo === 'function') {
      player.pauseVideo();
    }
  };

  const stopAudio = () => {
    if (player && typeof player.stopVideo === 'function') {
      player.stopVideo();
    }
    isPlaying.value = false;
    currentTime.value = 0;
  };

  const toggleAudio = () => {
    isPlaying.value ? pauseSong() : playSong();
  };

  const changeSong = () => {
    const newIndex = isShuffle.value
      ? Math.floor(Math.random() * songs.value.length)
      : (currentSongIndex.value + 1) % songs.value.length;

    selectSong(newIndex);
  };

  const previousSong = () => {
    const newIndex =
      currentSongIndex.value === 0
        ? songs.value.length - 1
        : currentSongIndex.value - 1;

    selectSong(newIndex);
  };

  const selectSong = (index: number) => {
    if (!songs.value[index]) return;

    currentSongIndex.value = index;
    localStorage.setItem('lastSongIndex', index.toString());

    if (player && typeof player.loadVideoById === 'function') {
      player.loadVideoById(songs.value[index].videoId);
      playSong();
    }
  };

  const seekTo = (value: number) => {
    if (player && typeof player.seekTo === 'function') {
      player.seekTo(value, true);
      currentTime.value = value;
    }
  };

  const setVolume = (value: number) => {
    volume.value = Math.min(100, Math.max(0, value));
    if (player && typeof player.setVolume === 'function') {
      player.setVolume(volume.value);
    }
  };

  const toggleLoop = () => {
    isLoop.value = !isLoop.value;
  };

  const toggleShuffle = () => {
    isShuffle.value = !isShuffle.value;
  };

  const toggleFavorite = (id: number) => {
    const song = songs.value.find((s) => s.id === id);
    if (song) song.favorite = !song.favorite;
  };

  return {
    songs,
    currentSongIndex,
    currentSong,
    isPlaying,
    isLoop,
    isShuffle,
    isBuffering,
    isReady,
    currentTime,
    duration,
    volume,
    getThumbnail,
    fetchSongs,
    initPlayer,
    playSong,
    pauseSong,
    stopAudio,
    toggleAudio,
    changeSong,
    previousSong,
    selectSong,
    seekTo,
    setVolume,
    toggleLoop,
    toggleShuffle,
    toggleFavorite,
  };
});
