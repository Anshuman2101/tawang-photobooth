import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' keeps built asset URLs relative, so the app works whether it's
// deployed at the root of a domain or in a GitHub Pages subfolder
// (https://<user>.github.io/<repo>/) without any extra configuration.
export default defineConfig({
  plugins: [react()],
  base: './'
});
