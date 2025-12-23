<template>
  <section class="about-section">
    <!-- Background Image with Fade -->
    <div class="bg-wrapper">
      <transition name="fade" mode="out-in">
        <img
          :src="currentImage"
          :key="currentImageIndex"
          alt="Background"
          class="bg-image"
        />
      </transition>
      <div class="bg-overlay"></div>
      <div class="bg-gradient-top"></div>
      <div class="bg-gradient-bottom"></div>
    </div>

    <!-- Content -->
    <div class="about-content">
      <!-- Profile Card -->
      <div class="profile-card">
        <div class="profile-header">
          <div class="profile-avatar">
            <!-- <img :src="currentImage" alt="Profile" class="avatar-img" /> -->
            <img src="https://img5.pic.in.th/file/secure-sv1/Black-and-White-Instagram-Post.gif" alt="Profile" class="avatar-img" />
          </div>
          <div class="profile-info-header">
            <h1 class="profile-name">Fujipp</h1>
            <p class="profile-role">Fullstack Developer</p>
          </div>
        </div>
        
        <div class="profile-bio">
          <p>
            Hello! I'm a Fullstack Developer who loves building Web Applications 
            with Vue.js, TypeScript, and Node.js. I have a passion for designing 
            beautiful and user-friendly UI/UX.
          </p>
          <p>
            Besides coding, I enjoy playing games, listening to music, and constantly 
            learning new technologies. I believe that learning never ends!
          </p>
        </div>

        <!-- Skills -->
        <div class="skills-section">
          <h3 class="skills-title">Skills</h3>
          <div class="skills-tags">
            <span v-for="skill in skills" :key="skill" class="skill-tag">
              {{ skill }}
            </span>
          </div>
        </div>

        <!-- Social Links -->
        <div class="social-section">
          <a 
            v-for="social in socials" 
            :key="social.name" 
            :href="social.url" 
            target="_blank"
            rel="noopener noreferrer"
            class="social-link"
          >
            <component :is="social.icon" class="social-icon" />
            <span class="social-label">{{ social.name }}</span>
          </a>
        </div>
      </div>

      <!-- Image Indicators -->
      <div class="image-indicators">
        <button
          v-for="(_img, index) in images"
          :key="index"
          @click="currentImageIndex = index"
          class="indicator"
          :class="{ active: currentImageIndex === index }"
        ></button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, markRaw, h, type FunctionalComponent } from 'vue';
import { Github } from 'lucide-vue-next';

// Discord SVG Icon as a functional component
const DiscordIcon: FunctionalComponent = () => {
  return h('svg', {
    viewBox: '0 0 24 24',
    fill: 'currentColor',
    class: 'w-5 h-5'
  }, [
    h('path', {
      d: 'M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z'
    })
  ]);
};

// Profile images - replace with actual image URLs
const images = ref([
  'https://img5.pic.in.th/file/secure-sv1/Black-and-White-Instagram-Post.gif',
  'https://img5.pic.in.th/file/secure-sv1/1_bg.jpg',
  'https://img5.pic.in.th/file/secure-sv1/GTA5-2025-01-10-20-35-22.png',
  'https://img2.pic.in.th/pic/GTA5-2025-01-13-08-32-20.png',
]);

const currentImageIndex = ref(0);
let imageInterval: number | null = null;

const currentImage = computed(() => images.value[currentImageIndex.value]);

const skills = [
  'Vue.js', 'TypeScript', 'Node.js', 'Tailwind CSS',
  'Python', 'PostgreSQL', 'Docker', 'Git'
];

const socials = [
  { name: 'GitHub', url: 'https://github.com/fujipp', icon: markRaw(Github) },
  { name: 'Discord', url: 'https://discord.gg/snowwhite', icon: markRaw(DiscordIcon) },
];

onMounted(() => {
  imageInterval = window.setInterval(() => {
    currentImageIndex.value = (currentImageIndex.value + 1) % images.value.length;
  }, 5000);
});

onUnmounted(() => {
  if (imageInterval) {
    clearInterval(imageInterval);
  }
});
</script>

<style scoped>
.about-section {
  position: relative;
  min-height: 100vh;
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* Background */
.bg-wrapper {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.bg-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.8s ease;
}

.bg-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
}

.bg-gradient-top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 150px;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.6), transparent);
}

.bg-gradient-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 200px;
  background: linear-gradient(to top, var(--color-background), transparent);
}

/* Content */
.about-content {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem 1rem;
  width: 100%;
  max-width: 600px;
}

/* Profile Card */
.profile-card {
  background: color-mix(in srgb, var(--color-surface) 70%, transparent);
  backdrop-filter: blur(20px);
  border: 1px solid color-mix(in srgb, var(--color-divider) 50%, transparent);
  border-radius: 1.5rem;
  padding: 2rem;
  width: 100%;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid var(--color-primary);
  flex-shrink: 0;
  box-shadow: 0 8px 24px color-mix(in srgb, var(--color-primary) 40%, transparent);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-info-header {
  flex: 1;
}

.profile-name {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--color-text-primary);
  margin-bottom: 0.25rem;
  line-height: 1.2;
}

.profile-role {
  font-size: 1rem;
  color: var(--color-primary);
  font-weight: 600;
}

.profile-bio {
  margin-bottom: 1.5rem;
}

.profile-bio p {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  line-height: 1.7;
  margin-bottom: 0.75rem;
}

.profile-bio p:last-child {
  margin-bottom: 0;
}

/* Skills */
.skills-section {
  margin-bottom: 1.5rem;
}

.skills-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 0.75rem;
}

.skills-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.skill-tag {
  padding: 0.4rem 0.8rem;
  background: color-mix(in srgb, var(--color-background) 80%, transparent);
  color: var(--color-text-secondary);
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid var(--color-divider);
  transition: all 0.2s ease;
}

.skill-tag:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

/* Social Links */
.social-section {
  display: flex;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-divider);
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  height: 2.5rem;
  min-width: 2.5rem;
  padding: 0 0.75rem;
  background: color-mix(in srgb, var(--color-background) 80%, transparent);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-divider);
  border-radius: 0.75rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  text-decoration: none;
}

.social-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.social-label {
  max-width: 0;
  opacity: 0;
  white-space: nowrap;
  font-size: 0.8rem;
  font-weight: 600;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.social-link:hover {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
  gap: 0.5rem;
  padding-right: 1rem;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px color-mix(in srgb, var(--color-primary) 40%, transparent);
}

.social-link:hover .social-label {
  max-width: 100px;
  opacity: 1;
}

/* Image Indicators */
.image-indicators {
  display: flex;
  gap: 0.5rem;
}

.indicator {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator.active {
  width: 1.5rem;
  border-radius: 0.25rem;
  background: white;
}

.indicator:hover {
  background: rgba(255, 255, 255, 0.7);
}

/* Fade Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive - Tablet */
@media (max-width: 768px) {
  .about-content {
    max-width: 100%;
    padding: 1.5rem 1rem;
  }

  .profile-card {
    padding: 1.5rem;
  }

  .profile-avatar {
    width: 70px;
    height: 70px;
  }

  .profile-name {
    font-size: 1.5rem;
  }
}

/* Responsive - Mobile */
@media (max-width: 480px) {
  .about-content {
    padding: 1rem 0.75rem;
  }

  .profile-card {
    padding: 1.25rem;
    border-radius: 1rem;
  }

  .profile-header {
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .profile-avatar {
    width: 60px;
    height: 60px;
  }

  .profile-name {
    font-size: 1.25rem;
  }

  .profile-role {
    font-size: 0.875rem;
  }

  .profile-bio p {
    font-size: 0.8rem;
    line-height: 1.6;
  }

  .skills-title {
    font-size: 0.8rem;
  }

  .skill-tag {
    padding: 0.3rem 0.6rem;
    font-size: 0.7rem;
  }

  .social-link {
    width: 2.25rem;
    height: 2.25rem;
  }

  .indicator {
    width: 0.4rem;
    height: 0.4rem;
  }

  .indicator.active {
    width: 1.25rem;
  }
}

/* Prevent overflow */
.about-section {
  max-width: 100vw;
  box-sizing: border-box;
}
</style>

