import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import envCompatible from 'vite-plugin-env-compatible';



export default defineConfig({
  server: {
    port: parseInt(process.env.PORT || '5173', 10), // Use $PORT for railway, and 5173 for running locally
    host: '0.0.0.0', // Allow connections from external hosts
  },
  plugins: [react(), envCompatible()],
});
