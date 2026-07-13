import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      "curliness-unfeeling-antidote.ngrok-free.dev"
    ]
}
});
