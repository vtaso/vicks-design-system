#!/usr/bin/env node
// One token source (tokens/*.json, exported from Figma variables) → three platforms.
// Web: CSS variables · Android: Kotlin object for Jetpack Compose · iOS: Swift enum for SwiftUI.
import StyleDictionary from 'style-dictionary'

const BRAND = process.env.BRAND || 'brand-a'

// Figma exports px. The built-in compose/ios transforms assume rem (×16), so swap in px-aware ones.
const px = (t) => parseFloat(String(t.$value ?? t.value))
const isDim = (t) => (t.$type ?? t.type) === 'dimension'
const isFont = (t) => /font-size|letter-spacing|line-height/.test(t.path.join('-'))
StyleDictionary.registerTransform({ name: 'size/px-to-compose', type: 'value', filter: isDim,
  transform: (t) => `${px(t)}.${isFont(t) ? 'sp' : 'dp'}` })
StyleDictionary.registerTransform({ name: 'size/px-to-cgfloat', type: 'value', filter: isDim,
  transform: (t) => `CGFloat(${px(t)})` })
const swapSize = (group, custom) => [...StyleDictionary.hooks.transformGroups[group].filter((n) => !n.startsWith('size/')), custom]
StyleDictionary.registerTransformGroup({ name: 'compose-px', transforms: swapSize('compose', 'size/px-to-compose') })
StyleDictionary.registerTransformGroup({ name: 'ios-swift-px', transforms: swapSize('ios-swift', 'size/px-to-cgfloat') })

// Web: light theme on :root, dark theme overrides color.* only
const web = (theme, selector) => ({
  log: { verbosity: 'silent', warnings: 'disabled' },
  source: ['tokens/brand/base.json', `tokens/alias/${BRAND}.json`, `tokens/color/${theme}.json`, 'tokens/typography/desktop.json', 'tokens/density/web.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'build/web/',
      files: [{
        destination: `tokens-${theme}.css`,
        format: 'css/variables',
        options: { selector, outputReferences: theme === 'light' },
        filter: theme === 'light' ? undefined : (t) => t.path[0] === 'color',
      }],
    },
  },
})

const android = {
  log: { verbosity: 'silent', warnings: 'disabled' },
  source: ['tokens/brand/base.json', `tokens/alias/${BRAND}.json`, 'tokens/color/light.json', 'tokens/typography/mobile-android.json', 'tokens/density/android.json'],
  platforms: {
    compose: {
      transformGroup: 'compose-px',
      buildPath: 'build/android/',
      files: [{
        destination: 'DesignTokens.kt',
        format: 'compose/object',
        options: { className: 'DesignTokens', packageName: 'com.vick.designsystem' },
        filter: (t) => ['color', 'typography', 'density'].includes(t.path[0]),
      }],
    },
  },
}

const ios = {
  log: { verbosity: 'silent', warnings: 'disabled' },
  source: ['tokens/brand/base.json', `tokens/alias/${BRAND}.json`, 'tokens/color/light.json', 'tokens/typography/mobile-ios.json', 'tokens/density/ios.json'],
  platforms: {
    swift: {
      transformGroup: 'ios-swift-px',
      buildPath: 'build/ios/',
      files: [{
        destination: 'DesignTokens.swift',
        format: 'ios-swift/enum.swift',
        options: { className: 'DesignTokens' },
        filter: (t) => ['color', 'typography', 'density'].includes(t.path[0]),
      }],
    },
  },
}

for (const cfg of [web('light', ':root'), web('dark', '[data-theme="dark"]'), android, ios]) {
  const sd = new StyleDictionary(cfg)
  await sd.buildAllPlatforms()
}
console.log(`Built tokens for ${BRAND}: build/web/tokens-light.css, build/web/tokens-dark.css, build/android/DesignTokens.kt, build/ios/DesignTokens.swift`)
