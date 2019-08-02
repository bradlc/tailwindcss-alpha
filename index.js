const Color = require('color')
const flatten = require('flat')
const { FLATTEN_CONFIG } = require('@hacknug/tailwindcss-plugin-utils')

module.exports = function(pluginOptions = {}) {
  return function({
    addUtilities, addComponents, addBase, addVariant,
    e, prefix, theme, variants, config,
  }) {
    const {
      modules: userModules = {},
      // TODO: Make sure its backwards compatible with 0.x
      alpha = theme('alpha', theme('opacity', {})),
    } = pluginOptions
    const modules = {
      backgroundColor: {
        names: ['backgroundColor', 'backgroundColors'],
        prefixes: ['bg'],
        properties: ['backgroundColor'],
        process: true,
      },
      textColor: {
        names: ['textColor', 'textColors'],
        prefixes: ['text'],
        properties: ['color'],
        process: false,
      },
      borderColor: {
        names: ['borderColor', 'borderColors'],
        prefixes: ['border', 'border-t', 'border-r', 'border-b', 'border-l'],
        properties: ['borderColor', 'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor'],
        process: false,
      },
      fill: {
        names: ['fill', 'svgFill'],
        prefixes: ['fill'],
        properties: ['fill'],
        process: false,
      },
      stroke: {
        names: ['stroke', 'svgStroke'],
        prefixes: ['stroke'],
        properties: ['stroke'],
        process: false,
      },
    }

    Object.entries(userModules).forEach(([moduleKey, moduleConfig]) => {
      if (modules[moduleKey]) {
        modules[moduleKey].process = moduleConfig
      } else {
        modules[moduleKey] = moduleConfig
      }
    })

    Object.entries(alpha).forEach(([alphaKey, alphaValue]) => {
      let alphaValueFloat = parseFloat(alphaValue)
      if (alphaValueFloat === 0 || alphaValueFloat === 1) return null

      Object.entries(modules).forEach(([configKey, moduleConfig]) => {
        if (moduleConfig.process === false) return

        const processColor = ([colorKey, color]) => {
          try {
            let parsed = Color(color)
            if (parsed.valpha === 1) {
              return moduleConfig.prefixes.map((prefix, i) => ({
                [`.${e(`${prefix}-${colorKey}-${alphaKey}`)}`]: {
                  [`${moduleConfig.properties[i]}`]: parsed.alpha(alphaValueFloat).string()
                }
              }))
            }
          } catch (err) {
            return null
          }
          return null
        }

        const colors = theme(configKey, {})
        const colorAlphas = Object
          .entries(flatten(colors, FLATTEN_CONFIG))
          .map(processColor).filter(Boolean)

        addUtilities(colorAlphas, variants(configKey))
      })
    })
  }
}
