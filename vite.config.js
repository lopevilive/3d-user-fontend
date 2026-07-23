
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
      plugins: [
        postcsspxtoviewport({
          viewportWidth: 375,
          exclude: [
            /pc-views/i,
            /arco/i, 
            /batch-upload-product/i,
          ]
        })
      ]
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
          if (id.includes('.css') || id.includes('vue&type=style')) {
            return 'index'
          }
          if (/node_modules\/html5-qrcode/.test(id)) return 'no-use'

          // 上传相关 --s
          if (/node_modules\/cos-js-sdk-v5/.test(id)) return 'admin-use';
          if (/\/util\/cos/.test(id)) return 'admin-use';
          if (/node_modules\/vue3-smooth-dnd/.test(id)) return 'admin-use'
          if (/node_modules\/smooth-dnd/.test(id)) return 'admin-use'
          // 上传相关 --e
          // 水印相关 --s
          if (/node_modules\/html-to-image/.test(id)) return 'admin-use' 
          if (/node_modules\/vue3-colorpicker/.test(id)) return 'admin-use'
          if (/node_modules\/tinycolor2/.test(id)) return 'admin-use'
          if (/node_modules\/gradient-parser/.test(id)) return 'admin-use'
          if (/node_modules\/vue-types/.test(id)) return 'admin-use'
          if (/node_modules\/lodash-es/.test(id)) return 'admin-use'
          if (/node_modules\/@aesoper\/normal-utils/.test(id)) return 'admin-use'
          if (/src\/views\/watermark\/DialogColor/.test(id)) return 'admin-use'
          // 水印相关 --e
          // 地区选择相关 --s
          if (/node_modules\/@vant\/area-data/.test(id)) return 'vendor-lazy'
          if (/src\/components\/area-select/.test(id)) return 'vendor-lazy'
          // 地区选择相关 --e
          
          
          // 视频相关 --s
          if (/node_modules\/xgplayer/.test(id)) return 'xgplayer'
          if (/src\/components\/video-player/.test(id)) return 'xgplayer'
          // 视频相关 --e

          //pc端 --s
          if (/src\/pc-views/.test(id)) return 'pc-vendor'
          if (/node_modules\/arco/.test(id)) return 'pc-vendor'
          if (/node_modules\/@arco/.test(id)) return 'pc-vendor'
          //pc端 --e

          
          if (id.includes('node_modules')) return 'vendor'

          return 'index'
        },
      }
    },
  }
})
