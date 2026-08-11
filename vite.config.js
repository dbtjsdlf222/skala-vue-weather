// Node.js의 파일 URL을 일반 파일 경로로 바꿀 때 사용합니다.
import { fileURLToPath, URL } from 'node:url'

// defineConfig는 Vite 설정을 작성하기 쉽게 도와줍니다.
import { defineConfig } from 'vite'
// vue 플러그인은 Vite가 .vue 파일을 처리할 수 있게 합니다.
import vue from '@vitejs/plugin-vue'

// Vite에서 사용할 설정을 내보냅니다.
export default defineConfig({
  // Vue 파일 처리를 위한 플러그인을 등록합니다.
  plugins: [vue()],
  resolve: {
    // @를 src 폴더 경로 대신 사용할 수 있도록 설정합니다.
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
