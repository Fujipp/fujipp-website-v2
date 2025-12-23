<template>
  <div class="config-page">
    <!-- Login Form -->
    <div v-if="!isAuthenticated" class="login-container">
      <div class="login-card">
        <div class="login-header">
          <div class="login-icon">
            <LockKeyhole class="w-10 h-10" />
          </div>
          <h1>Song Config</h1>
          <p>Admin Access Required</p>
        </div>
        
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="input-group">
            <label for="userId">User ID</label>
            <input 
              id="userId"
              v-model="loginForm.userId" 
              type="text" 
              placeholder="Enter User ID"
              autocomplete="off"
            />
          </div>
          
          <div class="input-group">
            <label for="password">Password</label>
            <input 
              id="password"
              v-model="loginForm.password" 
              type="password" 
              placeholder="Enter Password"
            />
          </div>
          
          <p v-if="loginError" class="error-msg">{{ loginError }}</p>
          
          <button type="submit" class="login-btn">
            <LogIn class="w-5 h-5" />
            Login
          </button>
        </form>
      </div>
    </div>

    <!-- Admin Panel -->
    <div v-else class="admin-container">
      <div class="admin-header">
        <div class="header-left">
          <Music class="w-8 h-8" />
          <h1>Song Configuration</h1>
        </div>
        <button @click="logout" class="logout-btn">
          <LogOut class="w-5 h-5" />
          Logout
        </button>
      </div>

      <!-- Add New Song Form -->
      <div class="section">
        <h2 class="section-title">
          <Plus class="w-5 h-5" />
          {{ editingSong ? 'Edit Song' : 'Add New Song' }}
        </h2>
        
        <form @submit.prevent="editingSong ? updateSong() : addSong()" class="song-form">
          <div class="form-row">
            <div class="input-group">
              <label>Title</label>
              <input v-model="songForm.title" type="text" placeholder="Song title" required />
            </div>
            <div class="input-group">
              <label>Artist</label>
              <input v-model="songForm.artist" type="text" placeholder="Artist name" required />
            </div>
            <div class="input-group">
              <label>YouTube Video ID</label>
              <input v-model="songForm.videoId" type="text" placeholder="e.g. dQw4w9WgXcQ" required />
            </div>
          </div>
          
          <div class="form-actions">
            <button v-if="editingSong" type="button" @click="cancelEdit" class="cancel-btn">
              <X class="w-4 h-4" />
              Cancel
            </button>
            <button type="submit" class="submit-btn">
              <Check class="w-4 h-4" />
              {{ editingSong ? 'Update' : 'Add Song' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Songs List -->
      <div class="section">
        <div class="section-header-row">
          <h2 class="section-title">
            <List class="w-5 h-5" />
            Song List ({{ songs.length }} songs)
          </h2>
          <button @click="reloadSongs" class="reload-btn" title="Reload from server">
            <RefreshCw class="w-4 h-4" />
            Reload
          </button>
        </div>
        
        <div v-if="songs.length === 0" class="empty-state">
          <Music class="w-12 h-12" />
          <p>No songs found</p>
          <button @click="reloadSongs" class="reload-btn">Load from server</button>
        </div>
        
        <div v-else class="songs-list">
          <div v-for="song in songs" :key="song.id" class="song-item">
            <div class="song-info">
              <span class="song-id">#{{ song.id }}</span>
              <div class="song-details">
                <h3>{{ song.title }}</h3>
                <p>{{ song.artist }}</p>
              </div>
              <span class="song-video-id">{{ song.videoId }}</span>
            </div>
            <div class="song-actions">
              <button @click="editSong(song)" class="edit-btn" title="Edit">
                <Pencil class="w-4 h-4" />
              </button>
              <button @click="requestDelete(song.id, song.title)" class="delete-btn" title="Delete">
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Export/Import -->
      <div class="section">
        <h2 class="section-title">
          <Download class="w-5 h-5" />
          Export Data
        </h2>
        <div class="export-section">
          <button @click="exportJson" class="export-btn">
            <Download class="w-4 h-4" />
            Download songs.json
          </button>
          <p class="export-note">
            Copy this to <code>/public/data/songs.json</code> to apply changes.
          </p>
        </div>
        
        <pre class="json-preview">{{ jsonPreview }}</pre>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
          <div class="modal-card">
            <div class="modal-icon" :class="modalType">
              <AlertTriangle v-if="modalType === 'delete'" class="w-8 h-8" />
              <Pencil v-else class="w-8 h-8" />
            </div>
            <h3>{{ modalTitle }}</h3>
            <p>{{ modalMessage }}</p>
            <div class="modal-actions">
              <button @click="closeModal" class="modal-btn cancel">Cancel</button>
              <button @click="confirmModal" class="modal-btn confirm" :class="modalType">
                {{ modalType === 'delete' ? 'Delete' : 'Confirm' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Toast Notifications -->
    <Teleport to="body">
      <Transition name="toast">
        <div v-if="toast.show" class="toast" :class="toast.type">
          <CheckCircle v-if="toast.type === 'success'" class="w-5 h-5" />
          <AlertCircle v-else-if="toast.type === 'error'" class="w-5 h-5" />
          <Info v-else class="w-5 h-5" />
          <span>{{ toast.message }}</span>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { 
  LockKeyhole, 
  LogIn, 
  LogOut, 
  Music, 
  Plus, 
  List, 
  Pencil, 
  Trash2, 
  Check, 
  X,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-vue-next';

interface Song {
  id: number;
  title: string;
  artist: string;
  videoId: string;
}

// Auth
const VALID_USER_ID = 'Fujipp';
const VALID_PASSWORD = 'FUJIPP_Fujipp_2003@00';

const isAuthenticated = ref(false);
const loginError = ref('');
const loginForm = ref({
  userId: '',
  password: ''
});

// Songs
const songs = ref<Song[]>([]);
const editingSong = ref<Song | null>(null);
const songForm = ref({
  title: '',
  artist: '',
  videoId: ''
});

// Modal State
const showModal = ref(false);
const modalType = ref<'delete' | 'edit'>('delete');
const modalTitle = ref('');
const modalMessage = ref('');
const pendingAction = ref<(() => void) | null>(null);
const pendingSongId = ref<number | null>(null);

// Toast State
const toast = ref({
  show: false,
  message: '',
  type: 'success' as 'success' | 'error' | 'info'
});

const jsonPreview = computed(() => JSON.stringify(songs.value, null, 2));

// Auth Methods
function handleLogin() {
  if (loginForm.value.userId === VALID_USER_ID && loginForm.value.password === VALID_PASSWORD) {
    isAuthenticated.value = true;
    loginError.value = '';
    sessionStorage.setItem('songConfigAuth', 'true');
  } else {
    loginError.value = 'Invalid credentials. Please try again.';
  }
}

function logout() {
  isAuthenticated.value = false;
  sessionStorage.removeItem('songConfigAuth');
  loginForm.value = { userId: '', password: '' };
}

// CRUD Methods
function addSong() {
  const newId = songs.value.length > 0 ? Math.max(...songs.value.map(s => s.id)) + 1 : 1;
  songs.value.push({
    id: newId,
    title: songForm.value.title,
    artist: songForm.value.artist,
    videoId: songForm.value.videoId
  });
  resetForm();
  saveSongs();
  showToast('Song added successfully!', 'success');
}

function editSong(song: Song) {
  editingSong.value = song;
  songForm.value = {
    title: song.title,
    artist: song.artist,
    videoId: song.videoId
  };
  showToast(`Editing "${song.title}"`, 'info');
}

function updateSong() {
  if (editingSong.value) {
    const index = songs.value.findIndex(s => s.id === editingSong.value!.id);
    if (index !== -1) {
      songs.value[index] = {
        ...songs.value[index],
        title: songForm.value.title,
        artist: songForm.value.artist,
        videoId: songForm.value.videoId
      };
    }
    showToast('Song updated successfully!', 'success');
    cancelEdit();
    saveSongs();
  }
}

function requestDelete(id: number, title: string) {
  pendingSongId.value = id;
  modalType.value = 'delete';
  modalTitle.value = 'Delete Song';
  modalMessage.value = `Are you sure you want to delete "${title}"? This action cannot be undone.`;
  showModal.value = true;
}

function confirmModal() {
  if (modalType.value === 'delete' && pendingSongId.value !== null) {
    songs.value = songs.value.filter(s => s.id !== pendingSongId.value);
    saveSongs();
    showToast('Song deleted successfully!', 'success');
  }
  closeModal();
}

function closeModal() {
  showModal.value = false;
  pendingSongId.value = null;
  pendingAction.value = null;
}

function showToast(message: string, type: 'success' | 'error' | 'info' = 'success') {
  toast.value = { show: true, message, type };
  setTimeout(() => {
    toast.value.show = false;
  }, 3000);
}

function cancelEdit() {
  editingSong.value = null;
  resetForm();
}

function resetForm() {
  songForm.value = { title: '', artist: '', videoId: '' };
}

function saveSongs() {
  localStorage.setItem('songConfigData', JSON.stringify(songs.value));
}

function loadSongs() {
  const saved = localStorage.getItem('songConfigData');
  if (saved) {
    songs.value = JSON.parse(saved);
  }
}

async function fetchOriginalSongs() {
  try {
    const response = await fetch('/data/songs.json');
    const data = await response.json();
    songs.value = data;
    saveSongs();
  } catch (error) {
    console.error('Failed to fetch songs:', error);
  }
}

function exportJson() {
  const blob = new Blob([JSON.stringify(songs.value, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'songs.json';
  a.click();
  URL.revokeObjectURL(url);
}

async function reloadSongs() {
  localStorage.removeItem('songConfigData');
  await fetchOriginalSongs();
}

onMounted(() => {
  // Check session auth
  if (sessionStorage.getItem('songConfigAuth') === 'true') {
    isAuthenticated.value = true;
  }
  
  // Load songs
  const saved = localStorage.getItem('songConfigData');
  if (saved) {
    loadSongs();
  } else {
    fetchOriginalSongs();
  }
});
</script>

<style scoped>
.config-page {
  min-height: 100vh;
  padding: 1.5rem;
  padding-top: 5rem;
  /* background: linear-gradient(
    180deg,
    var(--color-background) 0%,
    color-mix(in srgb, var(--color-primary) 3%, var(--color-background)) 50%,
    var(--color-background) 100%
  ); */
  transition: background 0.3s ease;
}

/* Login */
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 10rem);
}

.login-card {
  background: color-mix(in srgb, var(--color-surface) 90%, transparent);
  backdrop-filter: blur(20px);
  border: 1px solid color-mix(in srgb, var(--color-divider) 50%, transparent);
  border-radius: 1.5rem;
  padding: 2.5rem;
  width: 100%;
  max-width: 420px;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.2),
    0 0 0 1px color-mix(in srgb, var(--color-primary) 10%, transparent);
  transition: all 0.3s ease;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  color: var(--color-primary);
  margin-bottom: 1rem;
  padding: 1rem;
  background: color-mix(in srgb, var(--color-primary) 15%, transparent);
  border-radius: 1rem;
}

.login-header svg {
  width: 2.5rem;
  height: 2.5rem;
}

.login-header h1 {
  font-size: 1.75rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--color-text-primary), var(--color-primary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
}

.login-header p {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.input-group input {
  padding: 0.875rem 1rem;
  background: var(--color-background);
  border: 2px solid var(--color-divider);
  border-radius: 0.75rem;
  font-size: 1rem;
  color: var(--color-text-primary);
  transition: all 0.2s ease;
}

.input-group input::placeholder {
  color: var(--color-text-secondary);
  opacity: 0.6;
}

.input-group input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-primary) 15%, transparent);
}

.error-msg {
  color: #ef4444;
  font-size: 0.85rem;
  text-align: center;
  background: color-mix(in srgb, #ef4444 10%, transparent);
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid color-mix(in srgb, #ef4444 30%, transparent);
}

.login-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
}

.login-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px color-mix(in srgb, var(--color-primary) 50%, transparent);
}

.login-btn:active {
  transform: translateY(-1px);
}

/* Admin Panel */
.admin-container {
  max-width: 1100px;
  margin: 0 auto;
}

.admin-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: color-mix(in srgb, var(--color-surface) 80%, transparent);
  backdrop-filter: blur(12px);
  border: 1px solid var(--color-divider);
  border-radius: 1rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-left svg {
  color: var(--color-primary);
  padding: 0.75rem;
  background: color-mix(in srgb, var(--color-primary) 15%, transparent);
  border-radius: 0.75rem;
}

.header-left h1 {
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--color-text-primary), var(--color-primary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: transparent;
  color: var(--color-text-secondary);
  border: 1px solid var(--color-divider);
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.logout-btn:hover {
  background: #ef4444;
  color: white;
  border-color: #ef4444;
  transform: translateY(-2px);
}

/* Sections */
.section {
  background: color-mix(in srgb, var(--color-surface) 80%, transparent);
  backdrop-filter: blur(12px);
  border: 1px solid var(--color-divider);
  border-radius: 1.25rem;
  padding: 1.75rem;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
}

.section:hover {
  border-color: color-mix(in srgb, var(--color-primary) 30%, var(--color-divider));
}

.section-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-divider);
}

.section-header-row .section-title {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 1.25rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-divider);
}

.section-title svg {
  color: var(--color-primary);
}

.reload-btn {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem 1rem;
  background: color-mix(in srgb, var(--color-primary) 15%, transparent);
  color: var(--color-primary);
  border: 1px solid color-mix(in srgb, var(--color-primary) 30%, transparent);
  border-radius: 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.reload-btn:hover {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 3rem 1rem;
  color: var(--color-text-secondary);
}

.empty-state svg {
  opacity: 0.5;
}

.empty-state p {
  font-size: 1rem;
}

/* Song Form */
.song-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  padding-top: 0.5rem;
}

.submit-btn, .cancel-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-btn {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  color: white;
  border: none;
  box-shadow: 0 4px 12px color-mix(in srgb, var(--color-primary) 30%, transparent);
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px color-mix(in srgb, var(--color-primary) 40%, transparent);
}

.cancel-btn {
  background: var(--color-background);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-divider);
}

.cancel-btn:hover {
  background: var(--color-divider);
  color: var(--color-text-primary);
}

/* Songs List */
.songs-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 450px;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.songs-list::-webkit-scrollbar {
  width: 6px;
}

.songs-list::-webkit-scrollbar-track {
  background: var(--color-divider);
  border-radius: 3px;
}

.songs-list::-webkit-scrollbar-thumb {
  background: var(--color-primary);
  border-radius: 3px;
}

.song-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  background: var(--color-background);
  border: 1px solid transparent;
  border-radius: 0.75rem;
  transition: all 0.2s ease;
}

.song-item:hover {
  background: color-mix(in srgb, var(--color-primary) 8%, var(--color-background));
  border-color: color-mix(in srgb, var(--color-primary) 20%, transparent);
  transform: translateX(4px);
}

.song-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  min-width: 0;
}

.song-id {
  font-size: 0.75rem;
  font-weight: 700;
  color: white;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  padding: 0.35rem 0.65rem;
  border-radius: 0.5rem;
  min-width: 2.5rem;
  text-align: center;
}

.song-details {
  flex: 1;
  min-width: 0;
}

.song-details h3 {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-details p {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-video-id {
  font-size: 0.7rem;
  font-family: 'Monaco', 'Menlo', monospace;
  color: var(--color-text-secondary);
  background: var(--color-surface);
  padding: 0.35rem 0.75rem;
  border-radius: 0.375rem;
  border: 1px solid var(--color-divider);
}

.song-actions {
  display: flex;
  gap: 0.5rem;
  margin-left: 1rem;
}

.edit-btn, .delete-btn {
  padding: 0.5rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.edit-btn {
  background: color-mix(in srgb, var(--color-primary) 15%, transparent);
  color: var(--color-primary);
}

.edit-btn:hover {
  background: var(--color-primary);
  color: white;
  transform: scale(1.1);
}

.delete-btn {
  background: color-mix(in srgb, #ef4444 15%, transparent);
  color: #ef4444;
}

.delete-btn:hover {
  background: #ef4444;
  color: white;
  transform: scale(1.1);
}

/* Export */
.export-section {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin-bottom: 1.25rem;
}

.export-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px color-mix(in srgb, var(--color-primary) 30%, transparent);
}

.export-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px color-mix(in srgb, var(--color-primary) 40%, transparent);
}

.export-note {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
}

.export-note code {
  background: var(--color-background);
  color: var(--color-primary);
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  border: 1px solid var(--color-divider);
}

.json-preview {
  background: var(--color-background);
  border: 1px solid var(--color-divider);
  border-radius: 0.75rem;
  padding: 1.25rem;
  font-size: 0.8rem;
  font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
  color: var(--color-text-secondary);
  max-height: 350px;
  overflow: auto;
  white-space: pre-wrap;
  line-height: 1.6;
}

/* Responsive - Tablet */
@media (max-width: 900px) {
  .form-row {
    grid-template-columns: 1fr 1fr;
  }
}

/* Responsive - Mobile */
@media (max-width: 640px) {
  .config-page {
    padding: 1rem;
  }

  .login-card {
    padding: 1.75rem;
  }

  .login-header h1 {
    font-size: 1.5rem;
  }

  .admin-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
    padding: 1.25rem;
  }

  .header-left h1 {
    font-size: 1.25rem;
  }

  .logout-btn {
    justify-content: center;
  }

  .section {
    padding: 1.25rem;
    border-radius: 1rem;
  }

  .section-title {
    font-size: 1rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .submit-btn, .cancel-btn {
    width: 100%;
    justify-content: center;
  }

  .song-item {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
    padding: 1rem;
  }

  .song-info {
    flex-wrap: wrap;
  }

  .song-video-id {
    display: none;
  }

  .song-actions {
    margin-left: 0;
    justify-content: flex-end;
  }

  .export-section {
    flex-direction: column;
    align-items: stretch;
  }

  .export-btn {
    width: 100%;
    justify-content: center;
  }

  .export-note {
    text-align: center;
  }

  .json-preview {
    font-size: 0.7rem;
    max-height: 250px;
  }
}

/* Theme Transition */
.config-page,
.config-page * {
  transition: 
    background-color 0.3s ease,
    background 0.3s ease,
    color 0.3s ease,
    border-color 0.3s ease,
    box-shadow 0.3s ease;
}

/* Modal Overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

.modal-card {
  background: var(--color-surface);
  border: 1px solid var(--color-divider);
  border-radius: 1.25rem;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
}

.modal-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  margin-bottom: 1.25rem;
}

.modal-icon.delete {
  background: color-mix(in srgb, #ef4444 15%, transparent);
  color: #ef4444;
}

.modal-icon.edit {
  background: color-mix(in srgb, var(--color-primary) 15%, transparent);
  color: var(--color-primary);
}

.modal-card h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 0.5rem;
}

.modal-card p {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}

.modal-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.modal-btn.cancel {
  background: var(--color-background);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-divider);
}

.modal-btn.cancel:hover {
  background: var(--color-divider);
}

.modal-btn.confirm.delete {
  background: #ef4444;
  color: white;
}

.modal-btn.confirm.delete:hover {
  background: #dc2626;
  transform: translateY(-2px);
}

.modal-btn.confirm.edit {
  background: var(--color-primary);
  color: white;
}

/* Modal Transition */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-card,
.modal-leave-to .modal-card {
  transform: scale(0.9);
}

/* Toast */
.toast {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-radius: 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  z-index: 10000;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.toast.success {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.toast.error {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
}

.toast.info {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  color: white;
}

/* Toast Transition */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translate(-50%, 20px);
}

.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}

@media (max-width: 640px) {
  .toast {
    left: 1rem;
    right: 1rem;
    transform: none;
    bottom: 1rem;
  }

  .toast-enter-from {
    transform: translateY(20px);
  }

  .toast-leave-to {
    transform: translateY(-20px);
  }

  .modal-card {
    padding: 1.5rem;
    margin: 1rem;
  }
}
</style>
