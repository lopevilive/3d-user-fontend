
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
  base: '/dist/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // console.log(id, 'dddd')
          if (/node_modules\/html5-qrcode/.test(id)) return 'html5-qrcode'
          // if (/node_modules/.test(id)) return 'node_module'
          // if (/src\/views/.test(id)) return 'views'
          return 'index' // 目前代码量少，直接打包到一起
        }
      }
    }
  }
})
