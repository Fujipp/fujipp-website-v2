<!-- src/components/Navbar.vue -->
<template>
  <!-- Navbar Fade In/Out -->
  <transition name="fade">
    <header
      :class="[
        'fixed top-0 left-0 w-full z-50 transition-colors duration-300 h-13',
        isScrolled || isSidebarOpen
          ? 'bg-[var(--color-surface)] shadow'
          : 'bg-transparent',
        props.isSidebarOpen ? 'backdrop-blur-md h-13' : '',
      ]"
    >
      <div
        class="container mx-auto relative flex items-center justify-between px-4 py-3"
      >
        <!-- Left: Burger + Logo -->
        <div class="flex items-center space-x-3">
          <button
            @click="emit('toggle')"
            class="md:hidden transition hover:opacity-80 cursor-pointer"
            :style="{ color: 'var(--color-text-primary)' }"
          >
            <Menu class="w-6 h-6" />
          </button>

          <RouterLink
            to="/"
            class="text-xl font-bold hover:opacity-80 transition"
            :style="{ color: 'var(--color-text-secondary)' }"
          >
            FUJIPP
          </RouterLink>
        </div>

        <!-- Center: Nav Links -->
        <nav
          class="hidden md:flex space-x-6 items-center absolute left-1/2 transform -translate-x-1/2"
        >
          <RouterLink
            v-for="(link, i) in navLinks"
            :key="i"
            :to="link.path"
            class="nav-link relative font-medium"
            active-class="font-bold"
          >
            {{ link.label }}
          </RouterLink>
        </nav>

        <!-- Right: Theme Switcher -->
        <div class="transition">
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  </transition>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue';
  import { Menu } from 'lucide-vue-next';
  import ThemeSwitcher from './ThemeSwitcher.vue';

  // รับค่า isSidebarOpen จากภายนอก
  const props = defineProps<{ isSidebarOpen: boolean }>();
  const emit = defineEmits<{ (e: 'toggle'): void }>();

  const navLinks = [
    { label: 'HOME', path: '/' },
    { label: 'ABOUT', path: '/about' },
    { label: 'PROJECTS', path: '/projects' },
    { label: 'CONTACT', path: '/contact' },
    { label: 'PERFORMANCE', path: '/performance' },
  ];

  const isScrolled = ref(false);

  const handleScroll = () => {
    isScrolled.value = window.scrollY > 10;
  };

  onMounted(() => {
    window.addEventListener('scroll', handleScroll);
  });
  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
  });
</script>

<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .nav-link {
    color: var(--color-text-secondary);
    position: relative;
    transition: color 0.3s ease;
  }
  .nav-link:hover {
    color: var(--color-primary);
    cursor: pointer;
  }
  .nav-link::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 50%;
    transform: translateX(-50%) scaleX(0);
    transform-origin: center;
    height: 2px;
    width: 100%;
    background-color: var(--color-primary);
    transition:
      transform 0.3s ease,
      background-color 0.3s ease;
  }
  .nav-link:hover::after {
    transform: translateX(-50%) scaleX(1);
  }
  .router-link-active {
    font-weight: bold;
  }
</style>
