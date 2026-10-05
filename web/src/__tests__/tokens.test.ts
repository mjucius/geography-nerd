import { describe, expect, it } from 'vitest';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
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

  it('has no hardcoded colours in src outside the @theme block', () => {
    const files = (readdirSync(resolve(root, 'src'), { recursive: true }) as string[]).filter((f) =>
      /\.(tsx?|css)$/.test(f)
    );
    expect(files.length).toBeGreaterThan(10);
    for (const file of files) {
      const text = read(`src/${file}`).replace(/@theme\s*{[^}]*}/, '');
      expect(text, file).not.toMatch(/#[0-9a-fA-F]{3,8}\b|\brgba?\(/);
    }
  });

  it('keeps the colour pairs the UI uses at WCAG AA contrast (4.5:1)', () => {
    const theme = css.match(/@theme\s*{([^}]*)}/)?.[1] ?? '';
    const colour = (name: string) => theme.match(new RegExp(`--color-${name}:\\s*#([0-9a-f]{6})`, 'i'))?.[1] ?? '';
    const luminance = (hex: string) => {
      const [r, g, b] = [0, 2, 4].map((i) => {
        const c = parseInt(hex.slice(i, i + 2), 16) / 255;
        return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const ratio = (a: string, b: string) => {
      const [hi, lo] = [luminance(colour(a)), luminance(colour(b))].sort((x, y) => y - x);
      return (hi + 0.05) / (lo + 0.05);
    };
    const pairs = [
      ['ink', 'paper'], ['ink', 'surface'], ['ink-soft', 'paper'], ['ink-soft', 'surface'],
      ['teal', 'surface'], ['teal', 'paper'], ['surface', 'teal'], ['surface', 'teal-deep'],
      ['ink', 'amber'], ['surface', 'clay'], ['clay', 'paper'],
    ];
    for (const [fg, bg] of pairs) {
      expect(ratio(fg, bg), `${fg} on ${bg}`).toBeGreaterThanOrEqual(4.5);
    }
  });
});
