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
      </section>

      <!-- Infrastructure Section -->
      <section class="infra-section">
        <h2 class="section-title">
          <ServerStackIcon class="w-5 h-5" />
          Infrastructure
        </h2>
        <div class="infra-grid">
          <div v-for="infra in infrastructure" :key="infra.name" class="infra-card">
            <div class="infra-icon" :style="{ background: infra.color }">
              <component :is="infra.icon" class="w-6 h-6" />
            </div>
            <div class="infra-content">
              <h3 class="infra-name">{{ infra.name }}</h3>
              <p class="infra-provider">{{ infra.provider }}</p>
              <p class="infra-desc">{{ infra.description }}</p>
            </div>
          </div>
        </div>
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

      <!-- Version & Build Info -->
      <section class="version-section">
        <h2 class="section-title">
          <TagIcon class="w-5 h-5" />
          Version & Build
        </h2>
        <div class="version-grid">
          <div class="version-card">
            <span class="version-label">App Version</span>
            <span class="version-value">v1.0.9</span>
          </div>
          <div class="version-card">
            <span class="version-label">Build Date</span>
            <span class="version-value">{{ buildDate }}</span>
          </div>
          <div class="version-card">
            <span class="version-label">Node.js</span>
            <span class="version-value">v22.x LTS</span>
          </div>
          <div class="version-card">
            <span class="version-label">Package Manager</span>
            <span class="version-value">npm v10.x</span>
          </div>
        </div>
      </section>

      <!-- Copyright Section -->
      <section class="copyright-section">
        <div class="copyright-card">
          <div class="copyright-header">
            <ShieldCheckIcon class="w-6 h-6" />
            <h3>Copyright & Legal</h3>
          </div>
          <div class="copyright-content">
            <p class="copyright-text">
              © {{ currentYear }} Fujipp. All rights reserved.
            </p>
            <p class="copyright-desc">
              This website and its content are the property of Fujipp. 
              Unauthorized use, reproduction, or distribution is prohibited.
            </p>
            <div class="copyright-links">
              <a href="#" class="copyright-link">Privacy Policy</a>
              <a href="#" class="copyright-link">Terms of Service</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, markRaw, type Component } from 'vue';
import {
  ChartBarIcon,
  ClockIcon,
  CpuChipIcon,
  GlobeAltIcon,
  BoltIcon,
  DocumentIcon,
  PhotoIcon,
  ServerIcon,
  CodeBracketIcon,
  PaintBrushIcon,
  MusicalNoteIcon,
  ServerStackIcon,
  ShieldCheckIcon,
  CloudIcon,
  GlobeAmericasIcon,
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

interface InfraItem {
  name: string;
  provider: string;
  description: string;
  color: string;
  icon: Component;
}

const metrics = ref<Metric[]>([]);
const currentYear = new Date().getFullYear();
const buildDate = new Date().toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

const browserInfo = ref({
  userAgent: '',
  platform: '',
  language: '',
  online: true,
});

const infrastructure: InfraItem[] = [
  {
    name: 'Hosting',
    provider: 'Rukcom',
    description: 'Thai Cloud Hosting Provider with high-performance servers',
    color: 'linear-gradient(135deg, #ff6b6b, #ee5a5a)',
    icon: markRaw(CloudIcon),
  },
  {
    name: 'Domain',
    provider: 'GoDaddy',
    description: 'World-leading domain registrar and web services',
    color: 'linear-gradient(135deg, #00a4a6, #00c389)',
    icon: markRaw(GlobeAmericasIcon),
  },
  // {
  //   name: 'CDN',
  //   provider: 'Cloudflare',
  //   description: 'Global content delivery network for fast loading',
  //   color: 'linear-gradient(135deg, #f38020, #faad3f)',
  //   icon: markRaw(ServerStackIcon),
  // },
  {
    name: 'Source Control',
    provider: 'GitHub',
    description: 'Version control and collaboration platform',
    color: 'linear-gradient(135deg, #6e5494, #8a63d2)',
    icon: markRaw(CodeBracketIcon),
  },
];

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
    name: 'Firebase',
    version: 'v11.x',
    description: 'Cloud Database & Authentication',
    color: '#ffca28',
    logo: 'https://www.gstatic.com/mobilesdk/240501_mobilesdk/firebase_28dp.png',
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
    name: 'Lucide Icons',
    version: 'v0.511.0',
    description: 'Simply Beautiful Icons',
    color: '#f56565',
    icon: markRaw(PaintBrushIcon),
  },
  {
    name: 'YouTube IFrame API',
    version: 'v3',
    description: 'Audio Streaming via YouTube',
    color: '#ff0000',
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

  // Auto-refresh metrics every 10 seconds
  const metricsInterval = setInterval(() => {
    metrics.value = getPerformanceMetrics();
  }, 10000);

  // Browser info
  browserInfo.value = {
    userAgent: navigator.userAgent.split(' ').slice(-3).join(' '),
    platform: navigator.platform,
    language: navigator.language,
    online: navigator.onLine,
  };

  window.addEventListener('online', () => (browserInfo.value.online = true));
  window.addEventListener('offline', () => (browserInfo.value.online = false));

  // Cleanup interval on unmount
  onUnmounted(() => {
    clearInterval(metricsInterval);
  });
});
</script>

<style scoped>
.performance-page {
  min-height: 100vh;
  padding: 6rem 1rem 4rem;
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
  background: var(--color-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-divider);
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.refresh-btn:hover {
  background: var(--color-divider);
}

/* Infrastructure Section */
.infra-section {
  margin-bottom: 3rem;
}

.infra-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.infra-card {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background: color-mix(in srgb, var(--color-surface) 80%, transparent);
  backdrop-filter: blur(12px);
  border: 1px solid var(--color-divider);
  border-radius: 1rem;
  transition: all 0.3s ease;
}

.infra-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px color-mix(in srgb, var(--color-primary) 15%, transparent);
}

.infra-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.infra-content {
  flex: 1;
}

.infra-name {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
}

.infra-provider {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 0.5rem;
}

.infra-desc {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
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
  margin-bottom: 3rem;
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

/* Version Section */
.version-section {
  margin-bottom: 3rem;
}

.version-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.version-card {
  padding: 1.25rem;
  background: color-mix(in srgb, var(--color-surface) 80%, transparent);
  backdrop-filter: blur(12px);
  border: 1px solid var(--color-divider);
  border-radius: 1rem;
  text-align: center;
  transition: all 0.3s ease;
}

.version-card:hover {
  transform: translateY(-2px);
  border-color: var(--color-primary);
}

.version-label {
  display: block;
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.version-value {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-text-primary);
}

/* Copyright Section */
.copyright-section {
  margin-bottom: 2rem;
}

.copyright-card {
  background: color-mix(in srgb, var(--color-surface) 80%, transparent);
  backdrop-filter: blur(12px);
  border: 1px solid var(--color-divider);
  border-radius: 1rem;
  padding: 1.5rem;
}

.copyright-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-divider);
  color: var(--color-primary);
}

.copyright-header h3 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.copyright-content {
  text-align: center;
}

.copyright-text {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 0.5rem;
}

.copyright-desc {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
  max-width: 500px;
  margin: 0 auto 1rem;
}

.copyright-links {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
}

.copyright-link {
  font-size: 0.8rem;
  color: var(--color-primary);
  text-decoration: none;
  transition: opacity 0.2s ease;
}

.copyright-link:hover {
  opacity: 0.8;
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 480px) {
  .performance-page {
    padding: 5rem 0.75rem 3rem;
    overflow-x: hidden;
  }

  .performance-container {
    max-width: 100%;
    overflow-x: hidden;
  }

  .page-header {
    margin-bottom: 2rem;
  }

  .header-icon {
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 0.75rem;
  }

  .header-title {
    font-size: 1.5rem;
  }

  .header-subtitle {
    font-size: 0.75rem;
  }

  .section-title {
    font-size: 1rem;
    margin-bottom: 1rem;
  }

  .metrics-grid,
  .infra-grid,
  .tech-grid,
  .version-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .metric-card,
  .infra-card,
  .tech-card,
  .version-card {
    padding: 1rem;
  }

  .metric-icon,
  .infra-icon {
    width: 2.5rem;
    height: 2.5rem;
  }

  .metric-value {
    font-size: 1.25rem;
  }

  .metric-label {
    font-size: 0.75rem;
  }

  .infra-provider {
    font-size: 1.1rem;
  }

  .tech-icon {
    width: 2.5rem;
    height: 2.5rem;
    margin-bottom: 0.75rem;
  }

  .tech-name {
    font-size: 0.9rem;
  }

  .refresh-btn {
    width: 100%;
    justify-content: center;
    padding: 0.875rem 1rem;
  }

  .browser-info {
    padding: 1rem;
  }

  .browser-value {
    font-size: 0.8rem;
    word-break: break-word;
  }

  .version-value {
    font-size: 1rem;
  }

  .copyright-card {
    padding: 1rem;
  }

  .copyright-desc {
    font-size: 0.75rem;
  }

  .copyright-links {
    flex-direction: column;
    gap: 0.75rem;
  }
}

@media (min-width: 481px) and (max-width: 767px) {
  .performance-page {
    padding: 5rem 1rem 3rem;
    overflow-x: hidden;
  }

  .metrics-grid,
  .infra-grid {
    grid-template-columns: 1fr;
  }

  .tech-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .version-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

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

/* Prevent horizontal overflow globally */
.performance-page,
.performance-container {
  max-width: 100vw;
  overflow-x: hidden;
}

</style>
