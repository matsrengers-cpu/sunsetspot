// Erzeugt die PNG-Icons für das PWA-Manifest aus public/icons/icon.svg.
import { createRequire } from 'module'
import { readFileSync } from 'fs'
const require = createRequire(import.meta.url)
const { chromium } = require('playwright')

const svg = readFileSync(new URL('../public/icons/icon.svg', import.meta.url), 'utf8')
const jobs = [
  { file: 'icon-192.png', size: 192, pad: 0, bg: 'transparent' },
  { file: 'icon-512.png', size: 512, pad: 0, bg: 'transparent' },
  { file: 'apple-touch-icon.png', size: 180, pad: 0, bg: '#120d1f' },
  { file: 'icon-maskable-512.png', size: 512, pad: 0.1, bg: '#120d1f' },
]
const browser = await chromium.launch()
const page = await browser.newPage()
for (const j of jobs) {
  const inner = Math.round(j.size * (1 - 2 * j.pad))
  await page.setViewportSize({ width: j.size, height: j.size })
  await page.setContent(
    `<html><body style="margin:0;background:${j.bg};display:grid;place-items:center;width:${j.size}px;height:${j.size}px">
     <div style="width:${inner}px;height:${inner}px">${svg.replace('<svg ', `<svg width="${inner}" height="${inner}" `)}</div></body></html>`,
  )
  await page.screenshot({ path: `public/icons/${j.file}`, omitBackground: j.bg === 'transparent' })
}
await browser.close()
console.log('Icons erzeugt.')
