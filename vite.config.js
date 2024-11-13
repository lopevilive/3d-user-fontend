
import { resolve } from 'path';
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import postcsspxtoviewport from 'postcss-px-to-viewport'
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from '@vant/auto-import-resolver';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), AutoImport({resolvers: [VantResolver()],}),
  Components({resolvers: [VantResolver()]}),],
  css: {
    postcss: {
      plugins: [postcsspxtoviewport({
        viewportWidth: 375,
      })]
    },
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/assets/style/global.scss";',
        javascriptEnabled: true,
        api: 'modern-compiler'
      }
    }
  },
  resolve: {
    alias: [{ find: '@', replacement: resolve(__dirname, 'src') }],
  },
  base: '/dist/'
})
