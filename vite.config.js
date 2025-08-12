
import { resolve } from 'path';
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import postcsspxtoviewport from 'postcss-px-to-viewport'
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from '@vant/auto-import-resolver';
import { visualizer } from "rollup-plugin-visualizer";


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(), AutoImport({resolvers: [VantResolver()],}),
    Components({resolvers: [VantResolver()]}),
    visualizer({
      gzipSize: true,
        brotliSize: true,
        emitFile: false,
        filename: "test.html", //分析图生成的文件名
        open: false //如果存在本地服务端口，将在打包后自动展示
    })
  ],
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
          if (/node_modules\/html5-qrcode/.test(id)) return 'no-use'
          if (/node_modules\/three\//.test(id)) return 'no-use'
          // if (/node_modules\/vue/.test(id)) return 'vue'
          // if (/node_modules/.test(id)) return 'node_module'
          // if (/src\/components/.test(id)) return 'components'
          // if (/src\/views/.test(id)) return 'views'
          // if (/src/.test(id)) return 'src'
          return 'index' // 目前代码量少，直接打包到一起
        }
      }
    }
  }
})
