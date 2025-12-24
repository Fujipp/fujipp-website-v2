<template>
  <div class="contact-page">
    <div class="contact-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-icon">
          <Mail class="w-8 h-8" />
        </div>
        <div>
          <h1 class="header-title">Contact</h1>
          <p class="header-subtitle">Connect with me on social media</p>
        </div>
      </div>

      <!-- Social Links Section -->
      <section class="social-section">
        <h2 class="section-title">
          <Globe class="w-5 h-5" />
          Social Media
        </h2>
        
        <div class="social-grid">
          <!-- Discord -->
          <div class="social-card discord">
            <div class="card-header">
              <div class="platform-icon discord-icon">
                <svg viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </div>
              <div class="platform-info">
                <h3 class="platform-name">Discord</h3>
                <span class="platform-handle">@{{ discordUsername }}</span>
              </div>
            </div>
            
            <div class="card-body">
              <div class="profile-section">
                <div class="avatar-wrapper">
                  <img :src="discordAvatar" alt="Discord Avatar" class="avatar" />
                  <img v-if="avatarDecoration" :src="avatarDecoration" alt="" class="avatar-decoration" />
                  <svg v-if="discordData" class="status-indicator" width="16" height="16" viewBox="0 0 16 16">
                    <defs>
                      <mask id="status-online">
                        <circle cx="8" cy="8" r="8" fill="white"/>
                      </mask>
                      <mask id="status-idle">
                        <circle cx="8" cy="8" r="8" fill="white"/>
                        <circle cx="5" cy="5" r="5" fill="black"/>
                      </mask>
                      <mask id="status-dnd">
                        <circle cx="8" cy="8" r="8" fill="white"/>
                        <rect x="3" y="6.5" width="10" height="3" rx="1.5" fill="black"/>
                      </mask>
                      <mask id="status-offline">
                        <circle cx="8" cy="8" r="8" fill="white"/>
                        <circle cx="8" cy="8" r="4" fill="black"/>
                      </mask>
                    </defs>
                    <rect 
                      width="16" height="16" 
                      :fill="statusColor" 
                      :mask="`url(#status-${discordData.discord_status})`"
                    />
                  </svg>
                </div>
                <div class="profile-info">
                  <span class="display-name">{{ discordDisplayName }}</span>
                  <div v-if="discordData" class="status-row">
                    <span class="status-badge" :class="discordData.discord_status">{{ statusText }}</span>
                  </div>
                </div>
              </div>
              
              <!-- Custom Status -->
              <p v-if="customStatus" class="bio-text">{{ customStatus }}</p>
              
              <!-- Badges -->
              <div class="badges-row">
                <div v-if="discordData?.listening_to_spotify && discordData.spotify" class="badge spotify-badge">
                  <Music class="w-3.5 h-3.5" />
                  <span>{{ discordData.spotify.song }} - {{ discordData.spotify.artist }}</span>
                </div>
                <div v-if="currentActivity" class="badge activity-badge">
                  <Gamepad2 class="w-3.5 h-3.5" />
                  <span>{{ currentActivity.name }}</span>
                </div>
              </div>
            </div>
            
            <a 
              :href="`https://discord.com/users/${DISCORD_USER_ID}`"
              target="_blank"
              class="card-btn"
            >
              <ExternalLink class="w-4 h-4" />
              View Profile
            </a>
          </div>

          <!-- Facebook -->
          <div class="social-card facebook">
            <div class="card-header">
              <div class="platform-icon facebook-icon">
                <Facebook class="w-6 h-6" />
              </div>
              <div class="platform-info">
                <h3 class="platform-name">Facebook</h3>
                <span class="platform-handle">Fujipp</span>
              </div>
            </div>
            
            <div class="card-body">
              <div class="profile-section">
                <div class="avatar-wrapper">
                  <img 
                    src="https://scontent.fbkk29-9.fna.fbcdn.net/v/t39.30808-1/484358924_2838700686311937_8900273445187468267_n.jpg?stp=dst-jpg_s480x480_tt6&_nc_cat=104&ccb=1-7&_nc_sid=e99d92&_nc_ohc=a31zR3FcvD8Q7kNvwEnvmtf&_nc_oc=Adly4iMTYzi7CO3T21EdTH9TqZW4j10VMuRzhsuK69G3WPk3PjCFUoz4DdCA8fuXcuE7k4tZLP007bA0cteX1koc&_nc_zt=24&_nc_ht=scontent.fbkk29-9.fna&_nc_gid=OrGLwYDbSZXfJBKkiXcBfg&oh=00_AfliEtb8rby0h78n5EP9l_cZWVXokrHk8QANkj9fMEYCCw&oe=6950D886" 
                    alt="Facebook" 
                    class="avatar"
                    @error="handleAvatarError"
                  />
                  <img src="https://cdn.discordapp.com/avatar-decoration-presets/a_4d60f7270b12d3939b108859982af4cd.png?size=80&passthrough=true" alt="" class="avatar-decoration" />
                </div>
                <div class="profile-info">
                  <span class="display-name">Anawat Grudtoop</span>
                </div>
              </div>
              <p class="bio-text">Follow for news and updates</p>
            </div>
            
            <a 
              href="https://www.facebook.com/fujipp"
              target="_blank"
              class="card-btn"
            >
              <ExternalLink class="w-4 h-4" />
              View Profile
            </a>
          </div>

          <!-- Instagram -->
          <div class="social-card instagram">
            <div class="card-header">
              <div class="platform-icon instagram-icon">
                <Instagram class="w-6 h-6" />
              </div>
              <div class="platform-info">
                <h3 class="platform-name">Instagram</h3>
                <span class="platform-handle">@v.vnwxt</span>
              </div>
            </div>
            
            <div class="card-body">
              <div class="profile-section">
                <div class="avatar-wrapper">
                  <img src="https://scontent.fbkk29-9.fna.fbcdn.net/v/t39.30808-1/484358924_2838700686311937_8900273445187468267_n.jpg?stp=dst-jpg_s480x480_tt6&_nc_cat=104&ccb=1-7&_nc_sid=e99d92&_nc_ohc=a31zR3FcvD8Q7kNvwEnvmtf&_nc_oc=Adly4iMTYzi7CO3T21EdTH9TqZW4j10VMuRzhsuK69G3WPk3PjCFUoz4DdCA8fuXcuE7k4tZLP007bA0cteX1koc&_nc_zt=24&_nc_ht=scontent.fbkk29-9.fna&_nc_gid=OrGLwYDbSZXfJBKkiXcBfg&oh=00_AfliEtb8rby0h78n5EP9l_cZWVXokrHk8QANkj9fMEYCCw&oe=6950D886" alt="Instagram" class="avatar" @error="handleAvatarError" />
                  <img src="https://cdn.discordapp.com/avatar-decoration-presets/a_65cce62b814c5d0c17ee2be00e5f2f77.png?size=240&passthrough=true" alt="" class="avatar-decoration" />
                </div>
                <div class="profile-info">
                  <span class="display-name">v.vnwxt</span>
                </div>
              </div>
              <p class="bio-text">Capturing moments and memories</p>
            </div>
            
            <a 
              href="https://www.instagram.com/v.vnwxt/"
              target="_blank"
              class="card-btn"
            >
              <ExternalLink class="w-4 h-4" />
              View Profile
            </a>
          </div>

          <!-- GitHub -->
          <div class="social-card github">
            <div class="card-header">
              <div class="platform-icon github-icon">
                <Github class="w-6 h-6" />
              </div>
              <div class="platform-info">
                <h3 class="platform-name">GitHub</h3>
                <span class="platform-handle">@Fujipp</span>
              </div>
            </div>
            
            <div class="card-body">
              <div class="profile-section">
                <div class="avatar-wrapper">
                  <img src="https://github.com/Fujipp.png" alt="GitHub" class="avatar" />
                  <img src="https://cdn.discordapp.com/avatar-decoration-presets/a_98c7600d304b86ca3b18272e1da05559.png?size=240&passthrough=true" alt="" class="avatar-decoration" />
                </div>
                <div class="profile-info">
                  <span class="display-name">Fujipp</span>
                </div>
              </div>
              <p class="bio-text">Open source projects and code</p>
            </div>
            
            <a 
              href="https://github.com/Fujipp"
              target="_blank"
              class="card-btn"
            >
              <ExternalLink class="w-4 h-4" />
              View Profile
            </a>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { Mail, Globe, Facebook, Instagram, Github, Music, Gamepad2, ExternalLink } from 'lucide-vue-next';

interface DiscordUser {
  id: string;
  username: string;
  display_name?: string;
  avatar: string;
  avatar_decoration_data?: {
    asset: string;
  };
}

interface SpotifyData {
  song: string;
  artist: string;
}

interface Activity {
  name: string;
  type: number;
  state?: string;
}

interface LanyardData {
  discord_user: DiscordUser;
  discord_status: 'online' | 'idle' | 'dnd' | 'offline';
  activities: Activity[];
  listening_to_spotify: boolean;
  spotify?: SpotifyData;
}

const DISCORD_USER_ID = '1108816021915176962';

const discordData = ref<LanyardData | null>(null);
let pollInterval: ReturnType<typeof setInterval> | null = null;

const discordAvatar = computed(() => {
  if (discordData.value?.discord_user?.avatar) {
    const avatar = discordData.value.discord_user.avatar;
    const ext = avatar.startsWith('a_') ? 'gif' : 'png';
    return `https://cdn.discordapp.com/avatars/${DISCORD_USER_ID}/${avatar}.${ext}?size=128`;
  }
  return 'https://cdn.discordapp.com/embed/avatars/0.png';
});

const avatarDecoration = computed(() => {
  const decoration = discordData.value?.discord_user?.avatar_decoration_data;
  if (decoration?.asset) {
    return `https://cdn.discordapp.com/avatar-decoration-presets/${decoration.asset}.png?size=128&passthrough=true`;
  }
  return null;
});

const discordDisplayName = computed(() => {
  return discordData.value?.discord_user?.display_name || 
         discordData.value?.discord_user?.username || 
         'Fuji';
});

const discordUsername = computed(() => {
  return discordData.value?.discord_user?.username || 'fujipp.';
});

const statusText = computed(() => {
  const status = discordData.value?.discord_status;
  switch (status) {
    case 'online': return 'Online';
    case 'idle': return 'Idle';
    case 'dnd': return 'Do Not Disturb';
    case 'offline': return 'Offline';
    default: return 'Offline';
  }
});

const statusColor = computed(() => {
  const status = discordData.value?.discord_status;
  switch (status) {
    case 'online': return '#43a25a';
    case 'idle': return '#ca9654';
    case 'dnd': return '#d83a42';
    case 'offline': return '#747f8d';
    default: return '#747f8d';
  }
});

const customStatus = computed(() => {
  const activity = discordData.value?.activities?.find(a => a.type === 4);
  return activity?.state || null;
});

const currentActivity = computed(() => {
  return discordData.value?.activities?.find(a => a.type === 0) || null;
});

function handleAvatarError(e: Event) {
  const img = e.target as HTMLImageElement;
  img.src = 'https://cdn.discordapp.com/embed/avatars/0.png';
}

async function fetchDiscordStatus() {
  try {
    const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`);
    const data = await response.json();
    if (data.success && data.data) {
      discordData.value = data.data;
    }
  } catch (error) {
    console.error('Failed to fetch Discord status:', error);
  }
}

onMounted(() => {
  fetchDiscordStatus();
  pollInterval = setInterval(fetchDiscordStatus, 5000);
});

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval);
});
</script>

<style scoped>
.contact-page {
  min-height: 100vh;
  padding: 6rem 1rem 4rem;
}

.contact-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Header */
.page-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.header-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  border-radius: 1rem;
  color: white;
}

.header-title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--color-text-primary);
  margin: 0;
}

.header-subtitle {
  font-size: 0.95rem;
  color: var(--color-text-secondary);
  margin: 0.25rem 0 0;
}

/* Section */
.social-section {
  margin-bottom: 2rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 1.25rem;
}

.section-title svg {
  color: var(--color-primary);
}

/* Grid */
.social-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
}

/* Social Card */
.social-card {
  display: flex;
  flex-direction: column;
  background: var(--color-surface);
  border: 1px solid var(--color-divider);
  border-radius: 1rem;
  overflow: hidden;
  transition: all 0.3s ease;
}

.social-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
}

/* Card Header */
.card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--color-divider);
}

.platform-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 0.75rem;
  background: var(--color-background);
  color: var(--color-text-secondary);
  transition: all 0.3s ease;
}

.social-card:hover .platform-icon {
  color: var(--color-primary);
}

.platform-info {
  flex: 1;
  min-width: 0;
}

.platform-name {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
}

.platform-handle {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
}

/* Card Body */
.card-body {
  flex: 1;
  padding: 1.25rem;
}

.profile-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.avatar-wrapper {
  position: relative;
  flex-shrink: 0;
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  border: none;
}

.avatar-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 72px;
  height: 72px;
  pointer-events: none;
  object-fit: contain;
}

.status-indicator {
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 16px;
  height: 16px;
  background: var(--color-surface);
  border-radius: 50%;
  padding: 2px;
  box-sizing: content-box;
}

.profile-info {
  flex: 1;
  min-width: 0;
}

.display-name {
  display: block;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.status-row {
  margin-top: 0.35rem;
}

.status-badge {
  display: inline-block;
  font-size: 0.65rem;
  font-weight: 600;
  padding: 0.2rem 0.5rem;
  border-radius: 0.25rem;
  text-transform: uppercase;
}

.status-badge.online { background: color-mix(in srgb, #22c55e 20%, transparent); color: #22c55e; }
.status-badge.idle { background: color-mix(in srgb, #facc15 20%, transparent); color: #ca8a04; }
.status-badge.dnd { background: color-mix(in srgb, #ef4444 20%, transparent); color: #ef4444; }
.status-badge.offline { background: var(--color-background); color: var(--color-text-secondary); }

.bio-text {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  margin: 0;
  line-height: 1.4;
}

/* Badges */
.badges-row {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.badge {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.6rem;
  border-radius: 0.35rem;
  font-size: 0.7rem;
  font-weight: 500;
}

.badge span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.spotify-badge {
  background: color-mix(in srgb, #1db954 15%, transparent);
  color: #1db954;
}

.activity-badge {
  background: var(--color-background);
  color: var(--color-text-secondary);
}

/* Card Button */
.card-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  margin: 0 1.25rem 1.25rem;
  border-radius: 0.75rem;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 600;
  background: var(--color-background);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-divider);
  transition: all 0.2s ease;
}

.card-btn:hover {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px color-mix(in srgb, var(--color-primary) 30%, transparent);
}

/* Responsive */
@media (max-width: 1100px) {
  .social-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .contact-page {
    padding: 5rem 1rem 3rem;
  }

  .header-title {
    font-size: 1.5rem;
  }

  .social-grid {
    grid-template-columns: 1fr;
  }

  .card-header {
    padding: 0.85rem 1rem;
  }

  .card-body {
    padding: 1rem;
  }

  .card-btn {
    margin: 0 1rem 1rem;
  }
}
</style>
