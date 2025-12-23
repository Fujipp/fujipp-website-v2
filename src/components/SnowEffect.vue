<template>
  <div v-if="snowStore.enabled" class="snow-container" aria-hidden="true">
    <div
      v-for="flake in snowflakes"
      :key="flake.id"
      class="snowflake"
      :style="flake.style"
    >
      ❄
    </div>
  </div>

  <!-- Snow Settings Panel -->
  <Teleport to="body">
    <transition name="slide">
      <div v-if="snowStore.showPanel" class="snow-panel">
        <div class="panel-header">
          <div class="header-title">
            <Snowflake class="w-5 h-5" />
            <span>Snow Settings</span>
          </div>
          <button @click="snowStore.togglePanel" class="close-btn">
            <X class="w-4 h-4" />
          </button>
        </div>

        <div class="setting-group">
          <label>Enable Snow</label>
          <button 
            @click="snowStore.enabled = !snowStore.enabled" 
            class="toggle-btn"
            :class="{ active: snowStore.enabled }"
          >
            {{ snowStore.enabled ? 'ON' : 'OFF' }}
          </button>
        </div>

        <div class="setting-group">
          <label>Snow Count: {{ snowStore.count }}</label>
          <input type="range" v-model.number="snowStore.count" min="10" max="150" />
        </div>

        <div class="setting-group">
          <label>Speed (seconds): {{ snowStore.speedMin }} - {{ snowStore.speedMax }}</label>
          <div class="dual-slider">
            <input type="range" v-model.number="snowStore.speedMin" min="2" max="20" />
            <input type="range" v-model.number="snowStore.speedMax" min="5" max="30" />
          </div>
        </div>

        <div class="setting-group">
          <label>Size (rem): {{ snowStore.sizeMin.toFixed(1) }} - {{ snowStore.sizeMax.toFixed(1) }}</label>
          <div class="dual-slider">
            <input type="range" v-model.number="snowStore.sizeMin" min="0.3" max="2" step="0.1" />
            <input type="range" v-model.number="snowStore.sizeMax" min="0.5" max="3" step="0.1" />
          </div>
        </div>

        <button @click="snowStore.reset" class="reset-btn">
          <RotateCcw class="w-4 h-4" />
          Reset
        </button>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useSnowStore } from '@/stores/snowStore';
import { Snowflake, X, RotateCcw } from 'lucide-vue-next';

const snowStore = useSnowStore();

// Pre-generate random values to avoid recalculation on every render
const random = (min: number, max: number) => Math.random() * (max - min) + min;

interface SnowflakeData {
  id: number;
  style: {
    left: string;
    top: string;
    animationDuration: string;
    animationDelay: string;
    fontSize: string;
    opacity: number;
  };
}

// Cache snowflake data to prevent recalculations
const snowflakesCache = ref<SnowflakeData[]>([]);

const generateSnowflakes = (count: number): SnowflakeData[] => {
  return Array.from({ length: count }, (_, i) => {
    const duration = random(snowStore.speedMin, snowStore.speedMax);
    // Start snowflakes at random positions across the screen
    // Use negative delay to make them appear mid-animation
    const initialOffset = random(0, duration);
    
    return {
      id: i,
      style: {
        left: `${random(0, 100)}%`,
        top: '-5%', // Start position
        animationDuration: `${duration}s`,
        // Negative delay = start animation mid-way (already falling)
        animationDelay: `-${initialOffset}s`,
        fontSize: `${random(snowStore.sizeMin, snowStore.sizeMax)}rem`,
        opacity: random(0.4, 1),
      },
    };
  });
};

// Generate initial snowflakes
snowflakesCache.value = generateSnowflakes(snowStore.count);

// Only regenerate when count changes significantly
watch(
  () => snowStore.count,
  (newCount) => {
    if (snowflakesCache.value.length !== newCount) {
      snowflakesCache.value = generateSnowflakes(newCount);
    }
  }
);

// Regenerate when speed/size settings change
watch(
  [() => snowStore.speedMin, () => snowStore.speedMax, () => snowStore.sizeMin, () => snowStore.sizeMax],
  () => {
    snowflakesCache.value = generateSnowflakes(snowStore.count);
  }
);

const snowflakes = computed(() => snowflakesCache.value);
</script>

<style scoped>
.snow-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
  overflow: hidden;
  contain: strict;
}

.snowflake {
  position: absolute;
  top: -5%;
  color: #fff;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
  animation: snowfall linear infinite;
  user-select: none;
  will-change: transform;
  contain: layout style;
}

@keyframes snowfall {
  0% {
    transform: translateY(-10vh) rotate(0deg);
  }
  100% {
    transform: translateY(110vh) rotate(360deg);
  }
}

/* Settings Panel */
.snow-panel {
  position: fixed;
  top: 70px;
  right: 20px;
  width: 280px;
  background: color-mix(in srgb, var(--color-surface) 95%, transparent);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1rem;
  z-index: 10001;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid var(--color-divider);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-divider);
}

.header-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  color: var(--color-text-primary);
}

.close-btn {
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: var(--color-text-primary);
  background: var(--color-divider);
}

.setting-group {
  margin-bottom: 1rem;
}

.setting-group label {
  display: block;
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  margin-bottom: 0.5rem;
}

.setting-group input[type="range"] {
  width: 100%;
  accent-color: var(--color-primary);
}

.dual-slider {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.toggle-btn {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: 1px solid var(--color-divider);
  background: var(--color-surface);
  color: var(--color-text-secondary);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.toggle-btn.active {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  color: var(--color-background);
  border-color: transparent;
}

.reset-btn {
  width: 100%;
  padding: 0.6rem;
  border-radius: 8px;
  border: 1px solid var(--color-divider);
  background: var(--color-surface);
  color: var(--color-text-primary);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.reset-btn:hover {
  background: var(--color-divider);
}

/* Transitions */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>

