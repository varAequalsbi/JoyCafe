import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { sites } from '@openai/sites-vite-plugin';
import { cardGameLocal } from './server/card-game-local.js';

export default defineConfig({
  plugins: [react(), sites(), cardGameLocal()],
});
