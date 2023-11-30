import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import monkey, { util, cdn } from 'vite-plugin-monkey';
import AutoImport from 'unplugin-auto-import/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
        // Auto import functions from Vue, e.g. ref, reactive, toRef...
        // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
        imports: [
            'vue',
            util.unimportPreset
        ],
    }),
    monkey({
      entry: 'src/main.js',
      userscript: {
        name : 'QQ群管理者',
        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0ZGUwOGRiNi0zMGM1LWI0NGQtYTc1Ni1mNjQ2MmU1MzBiMWUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MzU2ODRGRTVGRTgxMTFFODg4RUQ5NDE3MDZENDZFNjgiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MzU2ODRGRTRGRTgxMTFFODg4RUQ5NDE3MDZENDZFNjgiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6ZjlkYWE3M2ItOWU0MC04NTQwLTgwMGYtMjlhNjgxNmU4MDRkIiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6ZGI1M2M3MWItNDYwYi0yNDRkLWFhNDkt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',
        namespace: 'http://www.bmqy.net/',
        match: ['https://qun.qq.com/*', 'https://qun.qq.com/#/*'],
      },
      build: {
        externalGlobals: {
          vue: cdn.jsdelivr('Vue', 'dist/vue.global.prod.js').concat(
            'data:application/javascript,' +
              encodeURIComponent(
                `;window.Vue=Vue;`,
              ),
          ),
          'element-plus': cdn.jsdelivr('ElementPlus', 'dist/index.full.min.js'),
          '@element-plus/icons-vue': cdn.jsdelivr('ElementPlusIconsVue', 'dist/index.iife.min.js'),
          'js-cookie': cdn.jsdelivr('Cookies', 'dist/js.cookie.min.js')
        },
        externalResource: {
          'element-plus/dist/index.css': cdn.jsdelivr(),
          'animate.css': cdn.jsdelivr(),
        },
      },
    }),
  ],
});
