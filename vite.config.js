import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 设置 base 路径，根据环境的不同设置不同的路径
  const baseURL = mode === 'production' ? './' : '/';

  return {
    base: baseURL,
    plugins: [
      vue(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    // 默认 publicDir 就是 'public'，如果 publicDir 不是 'public'，可以在这里设置
    publicDir: 'public',
  };
});
