<template>
  <div class="performance-page">
    <div class="performance-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-icon">
          <ChartBarIcon class="w-8 h-8" />
        </div>
        <div>
          <h1 class="header-title">Performance</h1>
          <p class="header-subtitle">Page Load Metrics & Tech Stack</p>
        </div>
      </div>

      <!-- Metrics Section -->
      <section class="metrics-section">
        <h2 class="section-title">
          <ClockIcon class="w-5 h-5" />
          Page Load Metrics
        </h2>
        <div class="metrics-grid">
          <div v-for="metric in metrics" :key="metric.label" class="metric-card">
            <div class="metric-icon" :style="{ background: metric.color }">
              <component :is="metric.icon" class="w-5 h-5" />
            </div>
            <div class="metric-content">
              <span class="metric-value">{{ metric.value }}</span>
              <span class="metric-label">{{ metric.label }}</span>
            </div>
          </div>
        </div>
        <button @click="refreshMetrics" class="refresh-btn">
          <ArrowPathIcon class="w-4 h-4" />
          Refresh Metrics
        </button>
      </section>

      <!-- Tech Stack Section -->
      <section class="tech-section">
        <h2 class="section-title">
          <CpuChipIcon class="w-5 h-5" />
          Tech Stack
        </h2>
        <div class="tech-grid">
          <div
            v-for="tech in techStack"
            :key="tech.name"
            class="tech-card"
            :style="{ '--tech-color': tech.color }"
          >
            <div class="tech-icon">
              <img v-if="tech.logo" :src="tech.logo" :alt="tech.name" class="tech-logo" />
              <component v-else :is="tech.icon" class="w-8 h-8" />
            </div>
            <h3 class="tech-name">{{ tech.name }}</h3>
            <span class="tech-version">{{ tech.version }}</span>
            <p class="tech-desc">{{ tech.description }}</p>
          </div>
        </div>
      </section>

      <!-- Browser Info -->
      <section class="browser-section">
        <h2 class="section-title">
          <GlobeAltIcon class="w-5 h-5" />
          Browser Info
        </h2>
        <div class="browser-info">
          <div class="browser-item">
            <span class="browser-label">User Agent</span>
            <span class="browser-value">{{ browserInfo.userAgent }}</span>
          </div>
          <div class="browser-item">
            <span class="browser-label">Platform</span>
            <span class="browser-value">{{ browserInfo.platform }}</span>
          </div>
          <div class="browser-item">
            <span class="browser-label">Language</span>
            <span class="browser-value">{{ browserInfo.language }}</span>
          </div>
          <div class="browser-item">
            <span class="browser-label">Online Status</span>
            <span class="browser-value status" :class="{ online: browserInfo.online }">
              {{ browserInfo.online ? 'Online' : 'Offline' }}
            </span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, markRaw, type Component } from 'vue';
import {
  ChartBarIcon,
  ClockIcon,
  CpuChipIcon,
  GlobeAltIcon,
  ArrowPathIcon,
  BoltIcon,
  DocumentIcon,
  PhotoIcon,
  ServerIcon,
  CodeBracketIcon,
  PaintBrushIcon,
  CubeIcon,
  MusicalNoteIcon,
} from '@heroicons/vue/24/solid';

interface Metric {
  label: string;
  value: string;
  icon: Component;
  color: string;
}

interface TechItem {
  name: string;
  version: string;
  description: string;
  color: string;
  logo?: string;
  icon?: Component;
}

const metrics = ref<Metric[]>([]);

const browserInfo = ref({
  userAgent: '',
  platform: '',
  language: '',
  online: true,
});

const techStack: TechItem[] = [
  {
    name: 'Vue 3',
    version: 'v3.5.13',
    description: 'Progressive JavaScript Framework',
    color: '#42b883',
    logo: 'https://vuejs.org/images/logo.png',
  },
  {
    name: 'TypeScript',
    version: 'v5.8.3',
    description: 'JavaScript with Types',
    color: '#3178c6',
    logo: 'https://raw.githubusercontent.com/remojansen/logo.ts/master/ts.png',
  },
  {
    name: 'Vite',
    version: 'v6.3.5',
    description: 'Next Generation Frontend Tooling',
    color: '#646cff',
    logo: 'https://vitejs.dev/logo.svg',
  },
  {
    name: 'Tailwind CSS',
    version: 'v4.1.7',
    description: 'Utility-First CSS Framework',
    color: '#06b6d4',
    logo: 'https://tailwindcss.com/_next/static/media/tailwindcss-mark.d52e9897.svg',
  },
  {
    name: 'Pinia',
    version: 'v3.0.2',
    description: 'State Management for Vue',
    color: '#ffd859',
    logo: 'https://pinia.vuejs.org/logo.svg',
  },
  {
    name: 'Vue Router',
    version: 'v4.5.1',
    description: 'Official Router for Vue.js',
    color: '#42b883',
    icon: markRaw(CodeBracketIcon),
  },
  {
    name: 'Heroicons',
    version: 'v2.2.0',
    description: 'Beautiful Hand-Crafted SVG Icons',
    color: '#8b5cf6',
    icon: markRaw(PaintBrushIcon),
  },
  {
    name: 'Swiper',
    version: 'v11.2.8',
    description: 'Modern Touch Slider',
    color: '#0080ff',
    icon: markRaw(PhotoIcon),
  },
  {
    name: 'Lottie',
    version: 'v5.13.0',
    description: 'Lightweight Animation Library',
    color: '#00ddb3',
    icon: markRaw(CubeIcon),
  },
  {
    name: 'WaveSurfer.js',
    version: 'v7.9.5',
    description: 'Audio Waveform Visualization',
    color: '#ff6b6b',
    icon: markRaw(MusicalNoteIcon),
  },
];

const getPerformanceMetrics = (): Metric[] => {
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  const paint = performance.getEntriesByType('paint');

  if (!navigation) {
    return [
      { label: 'Page Load', value: 'N/A', icon: markRaw(BoltIcon), color: 'var(--color-primary)' },
    ];
  }

  const formatMs = (ms: number) => {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const fcp = paint.find(p => p.name === 'first-contentful-paint');
  const fp = paint.find(p => p.name === 'first-paint');

  return [
    {
      label: 'Total Load Time',
      value: formatMs(navigation.loadEventEnd - navigation.startTime),
      icon: markRaw(BoltIcon),
      color: 'linear-gradient(135deg, #667eea, #764ba2)',
    },
    {
      label: 'DOM Content Loaded',
      value: formatMs(navigation.domContentLoadedEventEnd - navigation.startTime),
      icon: markRaw(DocumentIcon),
      color: 'linear-gradient(135deg, #f093fb, #f5576c)',
    },
    {
      label: 'First Paint',
      value: fp ? formatMs(fp.startTime) : 'N/A',
      icon: markRaw(PaintBrushIcon),
      color: 'linear-gradient(135deg, #4facfe, #00f2fe)',
    },
    {
      label: 'First Contentful Paint',
      value: fcp ? formatMs(fcp.startTime) : 'N/A',
      icon: markRaw(PhotoIcon),
      color: 'linear-gradient(135deg, #43e97b, #38f9d7)',
    },
    {
      label: 'DNS Lookup',
      value: formatMs(navigation.domainLookupEnd - navigation.domainLookupStart),
      icon: markRaw(GlobeAltIcon),
      color: 'linear-gradient(135deg, #fa709a, #fee140)',
    },
    {
      label: 'Transfer Size',
      value: navigation.transferSize ? `${(navigation.transferSize / 1024).toFixed(1)} KB` : 'N/A',
      icon: markRaw(ServerIcon),
      color: 'linear-gradient(135deg, #a8edea, #fed6e3)',
    },
  ];
};

const refreshMetrics = () => {
  metrics.value = getPerformanceMetrics();
};

onMounted(() => {
  // Wait for page to fully load
  if (document.readyState === 'complete') {
    metrics.value = getPerformanceMetrics();
  } else {
    window.addEventListener('load', () => {
      setTimeout(() => {
        metrics.value = getPerformanceMetrics();
      }, 100);
    });
  }

  // Browser info
  browserInfo.value = {
    userAgent: navigator.userAgent.split(' ').slice(-3).join(' '),
    platform: navigator.platform,
    language: navigator.language,
    online: navigator.onLine,
  };

  window.addEventListener('online', () => (browserInfo.value.online = true));
  window.addEventListener('offline', () => (browserInfo.value.online = false));
});
</script>

<style scoped>
.performance-page {
  min-height: 100vh;
  padding: 6rem 1rem 4rem;
  /* background: var(--color-background); */
}

.performance-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Header */
.page-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 3rem;
}

.header-icon {
  width: 3.5rem;
  height: 3.5rem;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-background);
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

/* Section Titles */
.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 1.5rem;
}

/* Metrics Section */
.metrics-section {
  margin-bottom: 3rem;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.metric-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: color-mix(in srgb, var(--color-surface) 80%, transparent);
  backdrop-filter: blur(12px);
  border: 1px solid var(--color-divider);
  border-radius: 1rem;
  transition: all 0.3s ease;
}

.metric-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px color-mix(in srgb, var(--color-primary) 15%, transparent);
}

.metric-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.metric-content {
  display: flex;
  flex-direction: column;
}

.metric-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text-primary);
}

.metric-label {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.refresh-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--color-primary);
  color: var(--color-background);
  border: none;
  border-radius: 9999px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.refresh-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 24px color-mix(in srgb, var(--color-primary) 40%, transparent);
}

/* Tech Stack Section */
.tech-section {
  margin-bottom: 3rem;
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.tech-card {
  padding: 1.5rem;
  background: color-mix(in srgb, var(--color-surface) 80%, transparent);
  backdrop-filter: blur(12px);
  border: 1px solid var(--color-divider);
  border-radius: 1rem;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.tech-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--tech-color);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.tech-card:hover {
  transform: translateY(-4px);
  border-color: var(--tech-color);
}

.tech-card:hover::before {
  opacity: 1;
}

.tech-icon {
  width: 3.5rem;
  height: 3.5rem;
  margin: 0 auto 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--tech-color);
}

.tech-logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.tech-name {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 0.25rem;
}

.tech-version {
  font-size: 0.75rem;
  color: var(--tech-color);
  font-weight: 500;
}

.tech-desc {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  margin-top: 0.5rem;
  line-height: 1.4;
}

/* Browser Info */
.browser-section {
  margin-bottom: 2rem;
}

.browser-info {
  background: color-mix(in srgb, var(--color-surface) 80%, transparent);
  backdrop-filter: blur(12px);
  border: 1px solid var(--color-divider);
  border-radius: 1rem;
  padding: 1.5rem;
}

.browser-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--color-divider);
}

.browser-item:last-child {
  border-bottom: none;
}

.browser-label {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.browser-value {
  font-size: 0.875rem;
  color: var(--color-text-primary);
  word-break: break-all;
}

.browser-value.status {
  font-weight: 600;
  color: var(--color-error);
}

.browser-value.status.online {
  color: var(--color-success);
}

/* Responsive */
@media (min-width: 768px) {
  .browser-item {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .browser-value {
    text-align: right;
    max-width: 60%;
  }
}
</style>
