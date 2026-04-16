import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'// import thư viện hỗ trợ đường dẫn từ tsconfig
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(), // Sử dụng plugin để hỗ trợ React và đường dẫn từ tsconfig,
    tailwindcss()
  ],
  resolve: {// cấu hình alias để sử dụng '@' thay cho './src'
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@types': path.resolve(__dirname, './src/types'),
    }
  },
  server: {
    port: 5173,
    fs: {
      strict: false
    }
  }
})