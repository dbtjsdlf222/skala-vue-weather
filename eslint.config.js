// JavaScript와 Vue 파일에서 오류 가능성이 있는 코드를 검사한다.
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'

export default [
  // 빌드 결과, Vercel 로컬 파일, 설치된 라이브러리는 검사하지 않는다.
  {
    ignores: ['dist/**', '.vercel/**', 'node_modules/**'],
  },

  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],

  {
    files: ['**/*.{js,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      // 실습 페이지는 짧은 단일 단어 파일명을 사용한다.
      'vue/multi-word-component-names': 'off',
    },
  },
]
