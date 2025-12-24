<template>
  <section class="supporters-section">
    <div class="supporters-container">
      <div class="supporters-header">
        <div class="header-icon">
          <Heart class="w-8 h-8" />
        </div>
        <div>
          <h2 class="header-title">Supporters</h2>
          <p class="header-subtitle">Thank you for your support</p>
        </div>
      </div>

      <!-- Marquee Cards -->
      <div class="marquee-wrapper">
        <div class="marquee-track">
          <div
            v-for="(supporter, index) in [...supporters, ...supporters]"
            :key="index"
            class="supporter-card"
          >
            <img :src="supporter.avatar" :alt="supporter.name" class="supporter-avatar" />
            <div class="supporter-info">
              <p class="supporter-name">{{ supporter.name }}</p>
              <p v-if="supporter.role" class="supporter-role">{{ supporter.role }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Heart } from 'lucide-vue-next';

// Supporters data - replace with actual supporters
const supporters = [
  { 
    name: 'Kanom TopUp', 
    avatar: 'https://img2.pic.in.th/pic/Discord-Chat-Kanom.webp',
    role: 'Supporter' 
  },
  { 
    name: 'Snow White', 
    avatar: 'https://img2.pic.in.th/pic/Minimal-Cat-Logo.gif',
    role: 'Supporter' 
  },
  { 
    name: 'Baebie', 
    avatar: 'https://tr.rbxcdn.com/30DAY-AvatarHeadshot-7316359941F680E0DB384D93158794E4-Png/150/150/AvatarHeadshot/Webp/noFilter',
    role: 'Supporter' 
  },
  { 
    name: 'Empty', 
    avatar: 'https://img5.pic.in.th/file/secure-sv1/Bear-icon.png',
    role: 'Comming Soon' 
  },
  { 
    name: 'Empty', 
    avatar: 'https://img5.pic.in.th/file/secure-sv1/Bear-icon.png',
    role: 'Comming Soon' 
  },
  { 
    name: 'Empty', 
    avatar: 'https://img5.pic.in.th/file/secure-sv1/Bear-icon.png',
    role: 'Comming Soon' 
  },
  { 
    name: 'Empty', 
    avatar: 'https://img5.pic.in.th/file/secure-sv1/Bear-icon.png',
    role: 'Comming Soon' 
  },
  { 
    name: 'Empty', 
    avatar: 'https://img5.pic.in.th/file/secure-sv1/Bear-icon.png',
    role: 'Comming Soon' 
  }
];
</script>

<style scoped>
.supporters-section {
  padding: 4rem 1rem;
  background: var(--color-background);
  overflow: hidden;
}

.supporters-container {
  max-width: 1200px;
  margin: 0 auto;
}

.supporters-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 0 1rem;
}

.header-icon {
  width: 3.5rem;
  height: 3.5rem;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
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

/* Marquee */
.marquee-wrapper {
  position: relative;
  overflow: hidden;
  mask-image: linear-gradient(
    to right,
    transparent 0%,
    black 10%,
    black 90%,
    transparent 100%
  );
  -webkit-mask-image: linear-gradient(
    to right,
    transparent 0%,
    black 10%,
    black 90%,
    transparent 100%
  );
}

.marquee-track {
  display: flex;
  gap: 1.5rem;
  animation: marquee 25s linear infinite;
  width: max-content;
  will-change: transform;
}

.marquee-wrapper:hover .marquee-track {
  animation-play-state: paused;
}

@keyframes marquee {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(calc(-50% - 0.75rem));
  }
}

.supporter-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  background: color-mix(in srgb, var(--color-surface) 80%, transparent);
  backdrop-filter: blur(12px);
  border: 1px solid var(--color-divider);
  border-radius: 1rem;
  flex-shrink: 0;
  min-width: 160px;
  transition: all 0.3s ease;
}

.supporter-card:hover {
  transform: translateY(-4px);
  border-color: var(--color-primary);
  box-shadow: 0 12px 40px color-mix(in srgb, var(--color-primary) 20%, transparent);
}

.supporter-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
  border: 3px solid var(--color-divider);
  transition: all 0.3s ease;
}

.supporter-card:hover .supporter-avatar {
  border-color: var(--color-primary);
  transform: scale(1.05);
}

.supporter-info {
  text-align: center;
}

.supporter-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 0.25rem;
}

.supporter-role {
  font-size: 0.75rem;
  color: var(--color-primary);
  font-weight: 500;
  padding: 0.15rem 0.5rem;
  background: color-mix(in srgb, var(--color-primary) 15%, transparent);
  border-radius: 9999px;
}

/* Mobile Responsive */
@media (max-width: 480px) {
  .supporters-section {
    padding: 3rem 0.75rem;
    overflow-x: hidden;
  }

  .supporters-container {
    max-width: 100%;
    overflow-x: hidden;
  }

  .supporters-header {
    margin-bottom: 1.5rem;
    padding: 0;
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

  .supporter-card {
    padding: 1rem;
    min-width: 130px;
  }

  .supporter-avatar {
    width: 60px;
    height: 60px;
    margin-bottom: 0.75rem;
  }

  .supporter-name {
    font-size: 0.85rem;
  }

  .supporter-role {
    font-size: 0.65rem;
  }

  .marquee-track {
    gap: 1rem;
  }
}

/* Prevent horizontal overflow */
.supporters-section,
.supporters-container {
  max-width: 100vw;
  box-sizing: border-box;
}
</style>
