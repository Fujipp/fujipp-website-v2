<template>
  <section class="roblox-section">
    <div class="roblox-container">
      <!-- Header -->
      <div class="section-header">
        <div class="header-icon">
          <Gamepad2 class="w-8 h-8" />
        </div>
        <div>
          <h2 class="header-title">Roblox Profile</h2>
          <p class="header-subtitle">My Avatar & Game Stats</p>
        </div>
      </div>

      <!-- Content Grid -->
      <div class="content-grid">
        <!-- 3D Avatar Viewer -->
        <div class="avatar-viewer">
          <div class="avatar-frame" ref="avatarContainer">
            <div v-if="loading" class="loading-spinner">
              <Loader2 class="w-12 h-12 animate-spin" />
              <p class="loading-text">Loading 3D Avatar...</p>
            </div>
            <canvas ref="canvasRef" class="avatar-canvas"></canvas>
          </div>
          <p class="avatar-hint">
            <Move3D class="w-4 h-4" />
            Drag to rotate
          </p>
        </div>

        <!-- Profile Info -->
        <div class="profile-info">
          <div class="profile-card">
            <!-- User Info -->
            <div class="user-header">
              <img
                :src="headshotUrl"
                alt="Profile"
                class="profile-avatar"
              />
              <div class="user-details">
                <h3 class="display-name">{{ userInfo.displayName || 'Loading...' }}</h3>
                <p class="username">@{{ userInfo.name || '...' }}</p>
              </div>
            </div>

            <!-- Stats -->
            <div class="stats-grid">
              <div class="stat-item">
                <Users class="stat-icon" />
                <div class="stat-content">
                  <span class="stat-value">{{ formatNumber(stats.friends) }}</span>
                  <span class="stat-label">Friends</span>
                </div>
              </div>
              <div class="stat-item">
                <UserPlus class="stat-icon" />
                <div class="stat-content">
                  <span class="stat-value">{{ formatNumber(stats.followers) }}</span>
                  <span class="stat-label">Followers</span>
                </div>
              </div>
              <div class="stat-item">
                <Heart class="stat-icon" />
                <div class="stat-content">
                  <span class="stat-value">{{ formatNumber(stats.following) }}</span>
                  <span class="stat-label">Following</span>
                </div>
              </div>
            </div>

            <!-- Description -->
            <div v-if="userInfo.description" class="description">
              <p>{{ userInfo.description }}</p>
            </div>

            <!-- Join Date -->
            <div class="join-date">
              <Calendar class="w-4 h-4" />
              <span>Joined {{ formatDate(userInfo.created) }}</span>
            </div>

            <!-- Profile Link -->
            <a
              :href="`https://www.roblox.com/users/${userId}/profile`"
              target="_blank"
              rel="noopener noreferrer"
              class="profile-link"
            >
              <ExternalLink class="w-4 h-4" />
              View Full Profile
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import {
  Gamepad2,
  Loader2,
  Move3D,
  Users,
  UserPlus,
  Heart,
  Calendar,
  ExternalLink,
} from 'lucide-vue-next';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const userId = 409219737;
const proxyUrl = 'https://corsproxy.io/?';

// Hardcoded 3D avatar data from Roblox (extracted from their internal API)
const avatar3DData = {
  obj: '30DAY-bcd5bdc5dced3f5d1ad1c71f1a6be89e',
  mtl: '30DAY-4a7c7a8c936f74edf942354d183d4ed1',
};

const loading = ref(true);
const avatarContainer = ref<HTMLDivElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const headshotUrl = ref('');

interface UserInfo {
  name: string;
  displayName: string;
  description: string;
  created: string;
}

const userInfo = ref<UserInfo>({
  name: '',
  displayName: '',
  description: '',
  created: '',
});

const stats = ref({
  friends: 0,
  followers: 0,
  following: 0,
});

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let controls: OrbitControls;
let animationId: number;

const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

const formatDate = (dateStr: string): string => {
  if (!dateStr) return '...';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const fetchUserInfo = async () => {
  try {
    const userRes = await fetch(`${proxyUrl}https://users.roblox.com/v1/users/${userId}`);
    const userData = await userRes.json();
    userInfo.value = userData;

    const friendsRes = await fetch(`${proxyUrl}https://friends.roblox.com/v1/users/${userId}/friends/count`);
    const friendsData = await friendsRes.json();
    stats.value.friends = friendsData.count || 0;

    const followersRes = await fetch(`${proxyUrl}https://friends.roblox.com/v1/users/${userId}/followers/count`);
    const followersData = await followersRes.json();
    stats.value.followers = followersData.count || 0;

    const followingRes = await fetch(`${proxyUrl}https://friends.roblox.com/v1/users/${userId}/followings/count`);
    const followingData = await followingRes.json();
    stats.value.following = followingData.count || 0;

  } catch (error) {
    console.error('Error fetching user info:', error);
  }
};

const fetchHeadshot = async () => {
  try {
    const res = await fetch(
      `${proxyUrl}https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png&isCircular=false`
    );
    const data = await res.json();
    if (data.data?.[0]?.imageUrl) {
      headshotUrl.value = data.data[0].imageUrl;
    }
  } catch (error) {
    console.error('Error fetching headshot:', error);
  }
};

const init3DScene = () => {
  if (!canvasRef.value || !avatarContainer.value) return;

  const container = avatarContainer.value;
  const canvas = canvasRef.value;
  const width = container.clientWidth;
  const height = container.clientHeight;

  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a1a2e);

  // Camera
  camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
  camera.position.set(0, 2, 8);

  // Renderer
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Controls
  controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enableZoom = true;
  controls.enablePan = false;
  controls.minDistance = 4;
  controls.maxDistance = 15;
  controls.target.set(0, 2, 0);
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1;

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 10, 5);
  scene.add(directionalLight);

  const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
  backLight.position.set(-5, 5, -5);
  scene.add(backLight);

  // Ground glow
  const groundGeometry = new THREE.CircleGeometry(2, 32);
  const groundMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x00a2ff, 
    transparent: true, 
    opacity: 0.15 
  });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.01;
  scene.add(ground);

  // Load 3D Avatar
  load3DAvatar();

  // Animation loop
  const animate = () => {
    animationId = requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  };
  animate();

  // Handle resize
  window.addEventListener('resize', handleResize);
};

const load3DAvatar = () => {
  const cdnBase = 'https://t7.rbxcdn.com/';
  const objUrl = `${proxyUrl}${cdnBase}${avatar3DData.obj}`;

  console.log('Loading OBJ from:', objUrl);

  const objLoader = new OBJLoader();
  
  objLoader.load(
    objUrl,
    (object) => {
      console.log('OBJ loaded successfully!');
      
      // Apply a nice material to the model
      const material = new THREE.MeshStandardMaterial({
        color: 0x888888,
        metalness: 0.1,
        roughness: 0.6,
      });

      object.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          (child as THREE.Mesh).material = material;
        }
      });

      // Center and scale the model
      const box = new THREE.Box3().setFromObject(object);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());

      object.position.x = -center.x;
      object.position.y = -box.min.y;
      object.position.z = -center.z;

      // Scale to fit nicely
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 4 / maxDim;
      object.scale.set(scale, scale, scale);

      scene.add(object);
      loading.value = false;
    },
    (progress) => {
      if (progress.total > 0) {
        console.log('Loading:', ((progress.loaded / progress.total) * 100).toFixed(0) + '%');
      }
    },
    (error) => {
      console.error('Error loading OBJ:', error);
      loading.value = false;
    }
  );
};

const handleResize = () => {
  if (!avatarContainer.value || !renderer || !camera) return;

  const width = avatarContainer.value.clientWidth;
  const height = avatarContainer.value.clientHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
};

onMounted(() => {
  fetchUserInfo();
  fetchHeadshot();
  init3DScene();
});

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  window.removeEventListener('resize', handleResize);
  
  if (renderer) {
    renderer.dispose();
  }
  if (controls) {
    controls.dispose();
  }
});
</script>

<style scoped>
.roblox-section {
  padding: 4rem 1rem;
  background: linear-gradient(
    180deg,
    var(--color-background) 0%,
    color-mix(in srgb, var(--color-primary) 5%, var(--color-background)) 50%,
    var(--color-background) 100%
  );
}

.roblox-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Header */
.section-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2.5rem;
}

.header-icon {
  width: 3.5rem;
  height: 3.5rem;
  background: linear-gradient(135deg, #00a2ff, #00d4aa);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 32px rgba(0, 162, 255, 0.3);
}

.header-title {
  font-size: 1.75rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--color-text-primary), #00a2ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-subtitle {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
}

/* Content Grid */
.content-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 768px) {
  .content-grid {
    grid-template-columns: 1fr 1fr;
  }
}

/* Avatar Viewer */
.avatar-viewer {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-frame {
  width: 100%;
  max-width: 400px;
  aspect-ratio: 1;
  background: linear-gradient(135deg, #0f0f1a, #1a1a2e);
  border: 1px solid rgba(0, 162, 255, 0.2);
  border-radius: 1.5rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: grab;
}

.avatar-frame:active {
  cursor: grabbing;
}

.loading-spinner {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: var(--color-primary);
  z-index: 10;
}

.loading-text {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.avatar-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.avatar-hint {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  font-size: 0.8rem;
  color: var(--color-text-secondary);
}

/* Profile Info */
.profile-card {
  background: color-mix(in srgb, var(--color-surface) 80%, transparent);
  backdrop-filter: blur(12px);
  border: 1px solid var(--color-divider);
  border-radius: 1.5rem;
  padding: 1.5rem;
}

.user-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--color-divider);
}

.profile-avatar {
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  border: 3px solid var(--color-primary);
}

.display-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text-primary);
}

.username {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 0.5rem;
  background: var(--color-background);
  border-radius: 1rem;
  text-align: center;
}

.stat-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--color-primary);
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-text-primary);
}

.stat-label {
  font-size: 0.7rem;
  color: var(--color-text-secondary);
}

/* Description */
.description {
  padding: 1rem;
  background: var(--color-background);
  border-radius: 0.75rem;
  margin-bottom: 1rem;
}

.description p {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

/* Join Date */
.join-date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  margin-bottom: 1.5rem;
}

/* Profile Link */
.profile-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.875rem;
  background: linear-gradient(135deg, #00a2ff, #00d4aa);
  color: white;
  text-decoration: none;
  font-weight: 600;
  border-radius: 0.75rem;
  transition: all 0.2s ease;
}

.profile-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 162, 255, 0.4);
}

/* Animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
