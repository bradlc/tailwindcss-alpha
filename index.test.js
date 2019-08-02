const plugin = require('./index.js')
const tailwindConfig = require('./tailwind.config.js')
const { generatePluginCss } = require('@hacknug/tailwindcss-plugin-utils')

expect.extend({ toMatchCss: require('jest-matcher-css') })

test('generates alphas given a color', () => {
  const testConfig = {
    theme: {
      textColor: { 'blue': '#00f' },
      backgroundColor: { 'red': '#f00' },
      alpha: { '25': 0.25, '50': 0.5, '75': 0.75 },
    },
  }
  const expectedCss = `
    .bg-red-25 { background-color: rgba(255, 0, 0, 0.25) }
    .bg-red-50 { background-color: rgba(255, 0, 0, 0.5) }
    .bg-red-75 { background-color: rgba(255, 0, 0, 0.75) }
  `

  return generatePluginCss(tailwindConfig, testConfig)
    .then(css => expect(css).toMatchCss(expectedCss))
})

test('handles color collections correctly', () => {
  const testConfig = {
    theme: {
      textColor: { 'blue': '#00f' },
      backgroundColor: { 'red': { '500': '#f00' } },
      alpha: { '25': 0.25, '50': 0.5, '75': 0.75 },
    },
  }
  const expectedCss = `
    .bg-red-500-25 { background-color: rgba(255, 0, 0, 0.25) }
    .bg-red-500-50 { background-color: rgba(255, 0, 0, 0.5) }
    .bg-red-500-75 { background-color: rgba(255, 0, 0, 0.75) }
  `

  return generatePluginCss(tailwindConfig, testConfig)
    .then(css => expect(css).toMatchCss(expectedCss))
})

test('filters out alphas `0` and `1`', () => {
  const testConfig = {
    theme: {
      backgroundColor: { 'red': '#f00' },
      alpha: { '0': 0, '50': 0.5, '100': 1 },
    },
  }
  const expectedCss = `
    .bg-red-50 { background-color: rgba(255, 0, 0, 0.5) }
  `

  return generatePluginCss(tailwindConfig, testConfig)
    .then(css => expect(css).toMatchCss(expectedCss))
})

test('filters out color keywords', () => {
  const testConfig = {
    theme: {
      backgroundColor: {
        'inherit': 'inherit',
        'initial': 'initial',
        'red': '#f00',
        'current': 'currentColor',
      },
      alpha: { '0': 0, '50': 0.5, '100': 1 },
    },
  }
  const expectedCss = `
    .bg-red-50 { background-color: rgba(255, 0, 0, 0.5) }
  `

  return generatePluginCss(tailwindConfig, testConfig)
    .then(css => expect(css).toMatchCss(expectedCss))
})

test('uses `opacity` as fallback', () => {
  const testConfig = {
    theme: {
      backgroundColor: { 'red': '#f00' },
      opacity: { '25': 0.25, '50': 0.5, '75': 0.75 },
    },
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
  const testConfig = {
    theme: {
      textColor: { 'blue': '#00f' },
      backgroundColor: { 'red': '#f00' },
      alpha: { '25': 0.25, '50': 0.5, '75': 0.75 },
    },
    plugins: [plugin({
      modules: {
        textColor: true,
      },
    })],
  }
  const expectedCss = `
    .bg-red-25 { background-color: rgba(255, 0, 0, 0.25) }
    .text-blue-25 { color: rgba(0, 0, 255, 0.25) }
    .bg-red-50 { background-color: rgba(255, 0, 0, 0.5) }
    .text-blue-50 { color: rgba(0, 0, 255, 0.5) }
    .bg-red-75 { background-color: rgba(255, 0, 0, 0.75) }
    .text-blue-75 { color: rgba(0, 0, 255, 0.75) }
  `

  return generatePluginCss(tailwindConfig, testConfig)
    .then(css => expect(css).toMatchCss(expectedCss))
})

test('works for modules with multiple properties', () => {
  const testConfig = {
    theme: {
      borderColor: { 'green': '#0f0' },
      alpha: { '25': 0.25, '50': 0.5, '75': 0.75 },
    },
    plugins: [plugin({
      modules: {
        backgroundColor: false,
        borderColor: true,
      },
    })],
  }
  const expectedCss = `
    .border-green-25 { border-color: rgba(0, 255, 0, 0.25) }
    .border-t-green-25 { border-top-color: rgba(0, 255, 0, 0.25) }
    .border-r-green-25 { border-right-color: rgba(0, 255, 0, 0.25) }
    .border-b-green-25 { border-bottom-color: rgba(0, 255, 0, 0.25) }
    .border-l-green-25 { border-left-color: rgba(0, 255, 0, 0.25) }

    .border-green-50 { border-color: rgba(0, 255, 0, 0.5) }
    .border-t-green-50 { border-top-color: rgba(0, 255, 0, 0.5) }
    .border-r-green-50 { border-right-color: rgba(0, 255, 0, 0.5) }
    .border-b-green-50 { border-bottom-color: rgba(0, 255, 0, 0.5) }
    .border-l-green-50 { border-left-color: rgba(0, 255, 0, 0.5) }

    .border-green-75 { border-color: rgba(0, 255, 0, 0.75) }
    .border-t-green-75 { border-top-color: rgba(0, 255, 0, 0.75) }
    .border-r-green-75 { border-right-color: rgba(0, 255, 0, 0.75) }
    .border-b-green-75 { border-bottom-color: rgba(0, 255, 0, 0.75) }
    .border-l-green-75 { border-left-color: rgba(0, 255, 0, 0.75) }
  `

  return generatePluginCss(tailwindConfig, testConfig)
    .then(css => expect(css).toMatchCss(expectedCss))
})

test('users can define a new module recipe', () => {
  const testConfig = {
    theme: {
      columnRuleColor: { 'red': '#f00' },
      alpha: { '25': 0.25, '50': 0.5, '75': 0.75 },
    },
    plugins: [plugin({
      modules: {
        backgroundColor: false,
        columnRuleColor: {
          names: ['columnRuleColor', 'columnRuleColors'],
          prefixes: ['column-rule'],
          properties: ['columnRuleColor'],
        },
      },
    })],
  }
  const expectedCss = `
    .column-rule-red-25 { column-rule-color: rgba(255, 0, 0, 0.25) }
    .column-rule-red-50 { column-rule-color: rgba(255, 0, 0, 0.5) }
    .column-rule-red-75 { column-rule-color: rgba(255, 0, 0, 0.75) }
  `

  return generatePluginCss(tailwindConfig, testConfig)
    .then(css => expect(css).toMatchCss(expectedCss))
})
test.skip('works for Tailwind 0.x', () => {
  const testConfig = {
    textColors: { 'blue': '#00f' },
    backgroundColors: { 'red': '#f00' },
    alpha: { '25': 0.25, '50': 0.5, '75': 0.75 },
  }
  const expectedCss = `
    .bg-red-25 { background-color: rgba(255, 0, 0, 0.25) }
    .bg-red-50 { background-color: rgba(255, 0, 0, 0.5) }
    .bg-red-75 { background-color: rgba(255, 0, 0, 0.75) }
  `

  // TODO: Use TailwindCSS v0.x instead of v1.x
  return generatePluginCss(tailwindConfig, testConfig)
    .then(css => expect(css).toMatchCss(expectedCss))
})

test.todo('utilities are sorted correctly')
