import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

import DefaultLayout from '@/layouts/DefaultLayout.vue';
import NotFound from '@/views/NotFound.vue';
import Maintenance from '@/views/Maintenance.vue';

const Home = () => import('@/views/Home.vue');
// const About = () => import('@/views/About.vue'); // สำหรับเปิดใช้งานจริงในอนาคต
// const Projects = () => import('@/views/Projects.vue');
// const Contact = () => import('@/views/Contact.vue');
// const Performance = () => import('@/views/Performance.vue');

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'Home',
        component: Home,
        meta: { title: 'Home' },
      },
      {
        path: 'about',
        name: 'About',
        component: Maintenance,
        meta: { title: 'About Me' },
      },
      {
        path: 'projects',
        name: 'Projects',
        component: Maintenance,
        meta: { title: 'Projects' },
      },
      {
        path: 'contact',
        name: 'Contact',
        component: Maintenance,
        meta: { title: 'Contact' },
      },
      {
        path: 'performance',
        name: 'Performance',
        component: Maintenance,
        meta: { title: 'Performance' }, // ตัวอย่างที่ล็อกไว้
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: { title: '404 Not Found' },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }; // กลับไปบนสุดทุกครั้งที่เปลี่ยนหน้า
  },
});

router.beforeEach((to, _from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const title = to.meta.title as string | undefined;

  document.title = title ? `Fujipp | ${title}` : 'Fujipp';

  if (to.meta.requiresAuth && !isAuthenticated) {
    alert('คุณต้องเข้าสู่ระบบก่อน');
    next('/');
  } else {
    next();
  }
});

export default router;
