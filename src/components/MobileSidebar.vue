<template>
  <!-- Sidebar อยู่ข้างบนสุด -->
  <transition name="slide">
    <aside
      v-show="isOpen"
      class="fixed top-[52px] left-0 h-screen w-[80vw] max-w-xs bg-[var(--color-background)] z-[100] shadow-lg px-4 py-6 md:hidden flex flex-col"
      @click.stop="closeSidebar"
    >
      <!-- Section: FUJIPP MENU -->
      <div class="flex-1">
        <p class="menu-title">MENU</p>
        <nav class="nav-container">
          <RouterLink
            v-for="(link, i) in navLinks"
            :key="i"
            :to="link.path"
            class="nav-link"
            @click="closeSidebar"
          >
            <component :is="link.icon" class="nav-icon" />
            <span>{{ link.label }}</span>
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
  import { Home, User, FolderKanban, Mail, Activity } from 'lucide-vue-next';

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

  // Navigation links with icons
  const navLinks = [
    { label: 'HOME', path: '/', icon: Home },
    { label: 'ABOUT', path: '/about', icon: User },
    { label: 'PROJECTS', path: '/projects', icon: FolderKanban },
    { label: 'CONTACT', path: '/contact', icon: Mail },
    { label: 'PERFORMANCE', path: '/performance', icon: Activity },
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

  /* Menu Title */
  .menu-title {
    font-size: 0.7rem;
    font-weight: 600;
    color: var(--color-text-secondary);
    letter-spacing: 0.1em;
    margin-bottom: 0.75rem;
    padding-left: 0.5rem;
  }

  /* Navigation Container */
  .nav-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  /* Navigation link styling - Button-like */
  .nav-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem 1rem;
    border-radius: 12px;
    font-weight: 500;
    font-size: 0.95rem;
    color: var(--color-text-primary);
    background: var(--color-surface);
    border: 1px solid var(--color-divider);
    transition: all 0.2s ease;
    text-decoration: none;
  }

  .nav-icon {
    width: 1.25rem;
    height: 1.25rem;
    color: var(--color-text-secondary);
    transition: color 0.2s ease;
  }

  /* Hover effect */
  .nav-link:hover {
    background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
    color: var(--color-background);
    border-color: transparent;
    transform: translateX(4px);
    box-shadow: 0 4px 16px color-mix(in srgb, var(--color-primary) 30%, transparent);
  }

  .nav-link:hover .nav-icon {
    color: var(--color-background);
  }

  /* Active state - use exact-active to prevent "/" matching all routes */
  .router-link-exact-active {
    background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
    color: var(--color-background);
    border-color: transparent;
    box-shadow: 0 4px 16px color-mix(in srgb, var(--color-primary) 30%, transparent);
  }

  .router-link-exact-active .nav-icon {
    color: var(--color-background);
  }
</style>

