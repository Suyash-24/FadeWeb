import fs from 'node:fs';
import path from 'node:path';

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Copy essential assets to publicDir so Vite includes them in dist/
const filesToSync = ['CNAME', 'logo.png', 'stats.json'];
for (const file of filesToSync) {
  if (fs.existsSync(file)) {
    fs.copyFileSync(file, path.join(publicDir, file));
  }
}

// Ensure GitHub Pages doesn't run Jekyll processing
fs.writeFileSync(path.join(publicDir, '.nojekyll'), '');
