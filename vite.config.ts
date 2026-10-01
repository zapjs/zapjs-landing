import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

const projectRoot = dirname(fileURLToPath(import.meta.url));

function materializeStaticRoutes(): Plugin {
  return {
    name: 'zapjs-static-routes',
    closeBundle() {
      const outDir = join(projectRoot, 'dist');
      const shell = join(outDir, 'index.html');
      if (!existsSync(shell)) return;

      const articles = JSON.parse(
        readFileSync(join(projectRoot, 'src/content/posts.json'), 'utf8'),
      ) as Array<{ slug: string }>;

      const routes = new Set(['docs', 'examples', 'blog']);
      for (const article of articles) {
        routes.add(`blog/${article.slug}`);
      }

      for (const route of routes) {
        const directory = join(outDir, route);
        mkdirSync(directory, { recursive: true });
        copyFileSync(shell, join(directory, 'index.html'));
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), materializeStaticRoutes()],
});
