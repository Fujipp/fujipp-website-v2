<template>
  <Navbar :isSidebarOpen="isSidebarOpen" @toggle="toggleSidebar" />
  <MobileSidebar :isOpen="isSidebarOpen" @close="isSidebarOpen = false" />
  <ToastPlayer />
  <RouterView />
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import Navbar from '../components/Navbar.vue';
  import ToastPlayer from '../components/music/ToastPlayer.vue';
  import MobileSidebar from '../components/MobileSidebar.vue';

  const isSidebarOpen = ref(false);
  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
  };
</script>
