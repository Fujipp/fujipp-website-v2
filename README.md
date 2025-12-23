# 🌐 Fujipp Personal Website

![Vue.js](https://img.shields.io/badge/Vue.js-3.5-4FC08D?logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.3-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1-06B6D4?logo=tailwindcss&logoColor=white)

A modern, responsive personal portfolio website built with Vue 3, TypeScript, and Vite.

## ✨ Features

- 🏠 **Home Page** - Hero section with animated background and typed text effects
- 👤 **About Me** - Full-screen background carousel with glassmorphism profile card
- 🎵 **Music Player** - YouTube integration with playlist management
- 📊 **Performance** - Real-time page load metrics and tech stack showcase
- 🎄 **Themes** - Multiple themes including Christmas theme with snow effect
- 🔐 **Song Config** - Hidden admin panel for playlist management

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Vue 3 (Composition API) |
| Language | TypeScript |
| Build Tool | Vite |
| Styling | TailwindCSS |
| Animations | Animate.css, Lottie |
| State Management | Pinia |
| Routing | Vue Router |
| Icons | Lucide Vue, Heroicons |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Fujipp/website-fujipp.git

# Navigate to project directory
cd website-fujipp

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
website-fujipp/
├── public/
│   ├── data/
│   │   └── songs.json       # Music playlist data
│   └── version.json         # App version info
├── src/
│   ├── components/          # Reusable components
│   │   ├── about/           # About page sections
│   │   └── home/            # Home page sections
│   ├── stores/              # Pinia stores
│   ├── views/               # Page components
│   └── App.vue              # Root component
├── scripts/
│   └── update-version.js    # Build version updater
└── package.json
```

## 🎨 Theme System

The website supports multiple color themes:

- **Default** - Clean blue theme
- **Dark** - Dark mode
- **Christmas** - Special holiday theme with snow effects

## 📝 Version Management

Version info is stored in `/public/version.json` and auto-updated on build:

```json
{
  "version": "1.0.0",
  "buildDate": "2025-12-24T00:00:00.000Z",
  "changelog": [...]
}
```

## 🔒 Admin Panel

Access the song configuration panel at `/songconfig` (requires authentication).

## 📄 License

© 2025 Fujipp. All rights reserved.

---

Made with ❤️ by Fujipp
