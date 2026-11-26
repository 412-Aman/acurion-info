import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { iconSvg } from './src/icons'

const root = fileURLToPath(new URL('.', import.meta.url))
// `vite preview` serves the same security headers as production (vercel.json).
const headers = Object.fromEntries(
  (JSON.parse(readFileSync(resolve(root, 'vercel.json'), 'utf8')).headers[0].headers as { key: string; value: string }[]).map((h) => [h.key, h.value]),
)
const pages = ['index', 'platform', 'how-it-works', 'technology', 'results', 'team']

// Every page shares one header and footer. They are written once in src/partials and placed into each page
// at build time, with the current page marked, so navigation is real pages rather than anchors on one page.
function partials(): Plugin {
  const read = (name: string) => readFileSync(resolve(root, 'src/partials', name), 'utf8')
  return {
    name: 'acurion-partials',
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        const page = (ctx.filename.split('/').pop() || 'index.html').replace('.html', '')
        const mark = (part: string) =>
          part.replace(new RegExp(`data-page="${page}"`, 'g'), `data-page="${page}" aria-current="page"`)
        return html
          .replace('<!-- @head -->', read('head.html'))
          .replace('<!-- @header -->', mark(read('header.html')))
          .replace('<!-- @footer -->', mark(read('footer.html')))
          // <i data-i="name" data-s="18"></i> becomes the inline icon, so pages need no script to draw them
          .replace(/<i data-i="(\w+)"(?: data-s="(\d+)")?><\/i>/g, (_, name, size) => iconSvg(name, size ? Number(size) : 18))
      },
    },
  }
}

export default defineConfig({
  plugins: [partials(), react()],
  preview: { headers },
  build: {
    rollupOptions: { input: Object.fromEntries(pages.map((p) => [p, resolve(root, `${p}.html`)])) },
  },
})
