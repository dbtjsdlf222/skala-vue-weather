import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    // OpenWeatherMap 측정소 API의 CORS 오류를 피하기 위한 개발용 프록시다.
    proxy: {
      // KBO 공식 일정 서비스의 CORS 오류를 피하기 위한 개발용 프록시다.
      '/api/kbo-schedule': {
        target: 'https://www.koreabaseball.com',
        changeOrigin: true,
        rewrite: () => '/ws/Schedule.asmx/GetScheduleList',
        configure(proxy) {
          proxy.on('proxyReq', (proxyRequest) => {
            proxyRequest.setHeader('Origin', 'https://www.koreabaseball.com')
            proxyRequest.setHeader('Referer', 'https://www.koreabaseball.com/Schedule/Schedule.aspx')
            proxyRequest.setHeader('X-Requested-With', 'XMLHttpRequest')
          })
        },
      },
      '/openweather-stations': {
        target: 'https://api.openweathermap.org',
        changeOrigin: true,
        rewrite: (path) => path.replace('/openweather-stations', '/data/3.0/stations'),
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
