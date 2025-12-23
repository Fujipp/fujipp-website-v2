<template>
  <div class="about-page">
    <!-- Section 1: About Me - Full Screen -->
    <section class="full-section">
      <AboutMeSection />
    </section>
    
    <!-- Section 2: Music + Education + Supporters -->
    <section class="content-section">
      <MusicSection id="music-section" />
      <EducationSection />
      <SupportersSection />
    </section>
  </div>
</template>

<script setup lang="ts">
import AboutMeSection from '@/components/about/AboutMeSection.vue';
import EducationSection from '@/components/about/EducationSection.vue';
import SupportersSection from '@/components/about/SupportersSection.vue';
import MusicSection from '@/components/home/MusicSection.vue';
</script>

<style scoped>
.about-page {
  min-height: 100vh;
}

.full-section {
  min-height: 100vh;
  height: 100vh;
  width: 100%;
}

.content-section {
  width: 100%;
}
</style>
