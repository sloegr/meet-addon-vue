import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), vueDevTools()],
  build: {
    rollupOptions: {
      input: {
        // 'main' is the default, you can remove it if you don't need an index.html
        // main: resolve(__dirname, 'index.html'),

        sidepanel: resolve(__dirname, 'SidePanel.html'),
        mainstage: resolve(__dirname, 'MainStage.html'),
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
