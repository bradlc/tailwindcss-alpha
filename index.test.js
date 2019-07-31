const plugin = require('./index.js')
const tailwindConfig = require('./tailwind.config.js')
const { generatePluginCss } = require('@hacknug/tailwindcss-plugin-utils')

expect.extend({ toMatchCss: require('jest-matcher-css') })

test('generates alphas given a color', () => {
  const testConfig = {
    textColors: { 'blue': '#00f' },
    backgroundColors: { 'red': '#f00' },
    alpha: { '25': 0.25, '50': 0.5, '75': 0.75 }
  }
  const expectedCss = `
    .bg-red-25 { background-color: rgba(255, 0, 0, 0.25) }
    .bg-red-50 { background-color: rgba(255, 0, 0, 0.5) }
    .bg-red-75 { background-color: rgba(255, 0, 0, 0.75) }
  `

  return generatePluginCss(tailwindConfig, testConfig)
    .then(css => expect(css).toMatchCss(expectedCss))
})

test('filters out alphas `0` and `1`', () => {
  const testConfig = {
    backgroundColors: { 'red': '#f00' },
    alpha: { '0': 0, '50': 0.5, '100': 1 }
  }
  const expectedCss = `
    .bg-red-50 { background-color: rgba(255, 0, 0, 0.5) }
  `

  return generatePluginCss(tailwindConfig, testConfig)
    .then(css => expect(css).toMatchCss(expectedCss))
})

test('filters out color keywords', () => {
  const testConfig = {
    backgroundColors: {
      'inherit': 'inherit',
      'initial': 'initial',
      'red': '#f00',
      'current': 'currentColor',
    },
    alpha: { '0': 0, '50': 0.5, '100': 1 }
  }
  const expectedCss = `
    .bg-red-50 { background-color: rgba(255, 0, 0, 0.5) }
  `

  return generatePluginCss(tailwindConfig, testConfig)
    .then(css => expect(css).toMatchCss(expectedCss))
})

test('uses `opacity` as fallback', () => {
  const testConfig = {
    backgroundColors: { 'red': '#f00' },
    opacity: { '25': 0.25, '50': 0.5, '75': 0.75 }
  }
  const expectedCss = `
    .bg-red-25 { background-color: rgba(255, 0, 0, 0.25) }
    .bg-red-50 { background-color: rgba(255, 0, 0, 0.5) }
    .bg-red-75 { background-color: rgba(255, 0, 0, 0.75) }
  `

  return generatePluginCss(tailwindConfig, testConfig)
    .then(css => expect(css).toMatchCss(expectedCss))
})

test('allows users to configure plugin', () => {
  const pluginOptions = {
    modules: {
      backgroundColors: true,
      textColors: true,
      borderColors: false,
      svgFill: false,
      svgStroke: false,
    },
  }
  const testConfig = {
    textColors: { 'blue': '#00f' },
    backgroundColors: { 'red': '#f00' },
    alpha: { '25': 0.25, '50': 0.5, '75': 0.75 },
    plugins: [plugin(pluginOptions)],
  }
  const expectedCss = `
    .bg-red-25 { background-color: rgba(255, 0, 0, 0.25) }
    .text-blue-25 { color: rgba(0, 0, 255, 0.25) }
    .bg-red-50 { background-color: rgba(255, 0, 0, 0.5) }
    .text-blue-50 { color: rgba(0, 0, 255, 0.5) }
    .bg-red-75 { background-color: rgba(255, 0, 0, 0.75) }
    .text-blue-75 { color: rgba(0, 0, 255, 0.75) }
  `

  return generatePluginCss(tailwindConfig, testConfig, pluginOptions)
    .then(css => expect(css).toMatchCss(expectedCss))
})
