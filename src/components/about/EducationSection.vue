<template>
  <section class="education-section">
    <div class="education-container">
      <!-- Header -->
      <div class="section-header">
        <div class="header-icon">
          <AcademicCapIcon class="w-8 h-8" />
        </div>
        <div>
          <h2 class="header-title">Education</h2>
          <p class="header-subtitle">My educational background</p>
        </div>
      </div>

      <!-- Timeline -->
      <div class="timeline">
        <div 
          v-for="(edu, index) in educations" 
          :key="edu.id" 
          class="timeline-item"
          :class="{ 'timeline-item--right': index % 2 === 1 }"
        >
          <div class="timeline-marker">
            <div class="timeline-dot"></div>
          </div>
          
          <div class="timeline-content">
            <div class="edu-card">
              <div class="edu-logo">
                <img 
                  v-if="edu.logo" 
                  :src="edu.logo" 
                  :alt="edu.school"
                  class="logo-img"
                />
                <AcademicCapIcon v-else class="w-8 h-8" />
              </div>
              
              <div class="edu-info">
                <span class="edu-period">{{ edu.period }}</span>
                <h3 class="edu-school">{{ edu.school }}</h3>
                <p class="edu-level">{{ edu.level }}</p>
                <p v-if="edu.description" class="edu-description">
                  {{ edu.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { AcademicCapIcon } from '@heroicons/vue/24/solid';

interface Education {
  id: number;
  period: string;
  school: string;
  level: string;
  logo?: string;
  description?: string;
}

// Education data - replace with actual data
const educations: Education[] = [
  {
    id: 1,
    period: '2007 - 2018',
    school: 'Kajornroaj Wittaya School',
    level: 'Kindergarten - Grade 9 (M.3)',
    logo: 'http://fth0.com/uppic/10240001/news/10240001_0_20230126-104320.png', // Add school logo URL
    description: 'Primary and junior high school education'
  },
  {
    id: 2,
    period: '2019 - 2021',
    school: 'Bangpakok Wittayakom School',
    level: 'Grade 10 - 12 (M.4 - M.6)',
    logo: 'https://lh3.googleusercontent.com/proxy/vnHTxP5gyd6U_JGXQ2Jx69IqLy38Q2rrAIU_SuNVDBrRQwAUhZiTa1SnS_eOM7p-Wzb41KRgAS4clfMK1OL7Y5J9167xbNGiiTlJ', // Add school logo URL
    description: 'Senior high school education'
  },
  {
    id: 3,
    period: '2022 - Present',
    school: 'King Mongkut’s University of Technology Thonburi',
    level: 'Bachelor\'s Degree',
    logo: 'https://www.kmutt.ac.th/wp-content/uploads/2020/09/KMUTT_CI_Primary_Logo-Full.png', // Add university logo URL
    description: 'School of Information Technology / B.Sc. in Information Technology'
  }
];
</script>

<style scoped>
.education-section {
  padding: 4rem 1.5rem;
  background: linear-gradient(
    180deg,
    var(--color-background) 0%,
    color-mix(in srgb, var(--color-primary) 5%, var(--color-background)) 50%,
    var(--color-background) 100%
  );
}

.education-container {
  max-width: 900px;
  margin: 0 auto;
  overflow: visible;
}

/* Header */
.section-header {
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

/* Timeline */
.timeline {
  position: relative;
  padding: 1rem 0;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 3px;
  height: 100%;
  background: linear-gradient(
    to bottom,
    var(--color-primary),
    var(--color-primary-light),
    var(--color-primary)
  );
  border-radius: 2px;
}

.timeline-item {
  display: flex;
  justify-content: flex-start;
  padding-left: calc(50% + 2rem);
  padding-right: 1rem;
  margin-bottom: 2rem;
  position: relative;
}

.timeline-item--right {
  justify-content: flex-end;
  padding-left: 1rem;
  padding-right: calc(50% + 2rem);
}

.timeline-marker {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}

.timeline-dot {
  width: 1rem;
  height: 1rem;
  background: var(--color-primary);
  border: 3px solid var(--color-background);
  border-radius: 50%;
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-primary) 30%, transparent);
  transition: all 0.3s ease;
}

.timeline-item:hover .timeline-dot {
  transform: scale(1.3);
  box-shadow: 0 0 0 6px color-mix(in srgb, var(--color-primary) 40%, transparent);
}

.timeline-content {
  width: 100%;
  max-width: 400px;
}

/* Education Card */
.edu-card {
  display: flex;
  gap: 1.25rem;
  padding: 1.5rem;
  background: color-mix(in srgb, var(--color-surface) 80%, transparent);
  backdrop-filter: blur(12px);
  border: 1px solid var(--color-divider);
  border-radius: 1rem;
  transition: all 0.3s ease;
}

.edu-card:hover {
  transform: translateY(-4px);
  border-color: var(--color-primary);
  box-shadow: 0 12px 40px color-mix(in srgb, var(--color-primary) 15%, transparent);
}

.edu-logo {
  width: 4rem;
  height: 4rem;
  border-radius: 0.75rem;
  background: var(--color-background);
  border: 1px solid var(--color-divider);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
  color: var(--color-primary);
}

.logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 0.25rem;
}

.edu-info {
  flex: 1;
  min-width: 0;
}

.edu-period {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-primary);
  background: color-mix(in srgb, var(--color-primary) 15%, transparent);
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  margin-bottom: 0.5rem;
}

.edu-school {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 0.25rem;
  line-height: 1.3;
}

.edu-level {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.edu-description {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
}

/* Responsive - Tablet */
@media (max-width: 768px) {
  .timeline::before {
    left: 1.5rem;
  }

  .timeline-item,
  .timeline-item--right {
    padding-left: 4rem;
    padding-right: 0;
    justify-content: flex-start;
  }

  .timeline-marker {
    left: 1.5rem;
  }

  .timeline-content {
    max-width: 100%;
  }

  .edu-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1rem;
    padding: 1.25rem;
  }

  .edu-period {
    margin-bottom: 0.375rem;
  }
}

/* Responsive - Mobile */
@media (max-width: 480px) {
  .education-section {
    padding: 2.5rem 0.75rem;
  }

  .section-header {
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

  .timeline::before {
    left: 1rem;
    width: 2px;
  }

  .timeline-item,
  .timeline-item--right {
    padding-left: 3rem;
    margin-bottom: 1.5rem;
  }

  .timeline-marker {
    left: 1rem;
  }

  .timeline-dot {
    width: 0.75rem;
    height: 0.75rem;
  }

  .edu-card {
    padding: 1rem;
  }

  .edu-logo {
    width: 3rem;
    height: 3rem;
    border-radius: 0.5rem;
  }

  .edu-school {
    font-size: 1rem;
  }

  .edu-level {
    font-size: 0.8rem;
  }

  .edu-period {
    font-size: 0.65rem;
    padding: 0.2rem 0.5rem;
  }

  .edu-description {
    font-size: 0.75rem;
  }
}

/* Prevent overflow */
.education-section,
.education-container {
  max-width: 100vw;
  box-sizing: border-box;
  /* overflow-x: hidden; */
}
</style>
