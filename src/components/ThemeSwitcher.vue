<template>
  <div ref="dropdownRef" class="relative">
    <button
      @click="isOpen = !isOpen"
      class="flex items-center gap-2 transition cursor-pointer hover:opacity-80"
      :style="{ color: 'var(--color-text-secondary)' }"
    >
      <component :is="current.icon" class="w-5 h-5" />
      <ChevronDown
        class="w-4 h-4 transform transition-transform duration-200 cursor-pointer hover:opacity-80"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>

    <transition name="fade">
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-44 rounded-md shadow-lg ring-1 z-50"
        :style="{
          backgroundColor: 'var(--color-surface)',
          color: 'var(--color-text-primary)',
          borderColor: 'var(--color-divider)',
        }"
      >
        <ul class="py-1">
          <li
            v-for="option in options"
            :key="option.value"
            @click="setTheme(option.value as ThemeOption)"
            class="flex items-center gap-2 px-4 py-2 text-sm cursor-pointer transition"
            :style="{
              color: 'var(--color-text-primary)',
            }"
            @mouseover="hovered = option.value as ThemeOption"
            @mouseleave="hovered = null"
            :class="{ 'font-semibold': hovered === option.value }"
          >
            <component :is="option.icon" class="w-4 h-4"></component>
            {{ option.label }}
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { useThemeStore } from '@/stores/themeStore';
  import { Sun, Moon, Monitor, ChevronDown } from 'lucide-vue-next';
  import { onClickOutside } from '@vueuse/core';

  type ThemeOption = 'light' | 'dark' | 'system';
  const dropdownRef = ref(null);
  const isOpen = ref(false);
  const hovered = ref<ThemeOption | null>(null);

  const themeStore = useThemeStore();

  const options = [
    { label: 'Light', value: 'light', icon: Sun },
    { label: 'Dark', value: 'dark', icon: Moon },
    { label: 'System', value: 'system', icon: Monitor },
  ];

  const current = computed(() => {
    return options.find(o => o.value === themeStore.theme) || options[2];
  });

  function setTheme(value: ThemeOption) {
    themeStore.setTheme(value);
    isOpen.value = false;
  }

  onMounted(() => {
    themeStore.loadTheme();
  });

  onClickOutside(dropdownRef, () => {
    isOpen.value = false;
  });
</script>

<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
