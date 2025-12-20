<template>
  <!-- Sidebar อยู่ข้างบนสุด -->
  <transition name="slide">
    <aside
      v-show="isOpen"
      class="fixed top-[52px] left-0 h-screen w-[80vw] max-w-xs bg-[var(--color-background)] z-[100] shadow-lg px-5 py-6 space-y-6 md:hidden flex flex-col"
      @click.stop="closeSidebar"
    >
      <!-- Section: FUJIPP MENU -->
      <div class="flex-1">
        <nav class="space-y-3">
          <RouterLink
            v-for="(link, i) in navLinks"
            :key="i"
            :to="link.path"
            class="nav-link block font-medium text-base transition"
            @click="closeSidebar"
          >
            {{ link.label }}
          </RouterLink>
        </nav>
      </div>
    </aside>
  </transition>

  <!-- Overlay ด้านหลัง -->
  <transition name="fade">
    <div
      v-show="props.isOpen"
      class="fixed inset-0 top-[52px] z-40 md:hidden backdrop-blur-sm bg-black/20 transition-opacity"
      @click="closeSidebar"
    />
  </transition>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue';

  const props = defineProps<{
    isOpen: boolean;
  }>();

  const emit = defineEmits<{
    (e: 'close'): void;
  }>();

  const isMobile = ref(window.innerWidth <= 767); // Check if screen size is mobile

  // Function to close sidebar when clicking outside or on a link
  const closeSidebar = () => {
    emit('close'); // Close sidebar when clicked outside or on a link
  };

  // Navigation links
  const navLinks = [
    { label: 'HOME', path: '/' },
    { label: 'ABOUT', path: '/about' },
    { label: 'PROJECTS', path: '/projects' },
    { label: 'CONTACT', path: '/contact' },
    { label: 'PERFORMANCE', path: '/performance' },
  ];

  // Handle window resize to detect screen size change
  const handleResize = () => {
    isMobile.value = window.innerWidth <= 767; // Update if screen is mobile size
    if (!isMobile.value) {
      // Close sidebar if screen size exceeds 767px
      emit('close');
    }
  };

  // Add event listener for window resize
  onMounted(() => {
    window.addEventListener('resize', handleResize);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
  });
</script>

<style scoped>
  /* Animation for fade in/out */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  /* Animation for slide in/out */
  .slide-enter-active {
    transition: transform 0.3s ease;
  }
  .slide-leave-active {
    transition: transform 0.2s ease;
  }
  .slide-enter-from {
    transform: translateX(-100%);
  }
  .slide-leave-to {
    transform: translateX(-100%);
  }

  /* Navigation link styling */
  .nav-link {
    color: var(--color-text-primary);
    transition: color 0.3s ease;
  }

  /* Hover effect - change text color */
  .nav-link:hover {
    color: var(--color-primary); /* สีเปลี่ยนเมื่อ hover */
    cursor: pointer; /* เพิ่ม cursor pointer เมื่อ hover */
  }
</style>
