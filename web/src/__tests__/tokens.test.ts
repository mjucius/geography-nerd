import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(__dirname, '../..');
const read = (file: string) => readFileSync(resolve(root, file), 'utf8');
const css = read('src/index.css');

describe('design tokens', () => {
  it('has no dead tailwind.config.js', () => {
    expect(existsSync(resolve(root, 'tailwind.config.js'))).toBe(false);
  });

  it('defines colours, radii and fonts in an @theme block', () => {
    const theme = css.match(/@theme\s*{([^}]*)}/)?.[1] ?? '';
    expect(theme).toMatch(/--color-paper:/);
    expect(theme).toMatch(/--color-teal:/);
    expect(theme).toMatch(/--radius-card:/);
    expect(theme).toMatch(/--font-display:.*Fraunces/);
    expect(theme).toMatch(/--font-sans:.*Inter/);
  });

  it('self-hosts both fonts and has no grid background', () => {
    const main = read('src/main.tsx');
    expect(main).toMatch(/import '@fontsource-variable\/inter/);
    expect(main).toMatch(/import '@fontsource-variable\/fraunces/);
    expect(css).not.toMatch(/gradient/);
  });

  it('makes no request to a font CDN', () => {
    for (const text of [css, read('index.html'), read('src/main.tsx')]) {
      expect(text).not.toMatch(/fonts\.(googleapis|gstatic)/);
    }
  });
});
