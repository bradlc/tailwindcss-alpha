const Color = require('color')
const flatten = require('flat')
const { FLATTEN_CONFIG, getSettings } = require('@hacknug/tailwindcss-plugin-utils')

module.exports = function(pluginOptions = {}) {
  return function({
    addUtilities, addComponents, addBase, addVariant,
    e, prefix, theme, variants, config,
  }) {
    const {
      modules: userModules = {},
      // TODO: Make sure its backwards compatible with 0.x
      alpha = getSettings(theme || config, 'alpha', ['opacity']),
    } = pluginOptions
    const modules = {
      backgroundColor: {
        prefixes: ['bg'],
        properties: ['backgroundColor'],
        fallbacks: ['backgroundColors'],
        process: true,
      },
      textColor: {
        prefixes: ['text'],
        properties: ['color'],
        fallbacks: ['textColors'],
        process: false,
      },
      borderColor: {
        prefixes: ['border', 'border-t', 'border-r', 'border-b', 'border-l'],
        properties: ['borderColor', 'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor'],
        fallbacks: ['borderColors'],
        process: false,
      },
      fill: {
        prefixes: ['fill'],
        properties: ['fill'],
        fallbacks: ['svgFill'],
        process: false,
      },
      stroke: {
        prefixes: ['stroke'],
        properties: ['stroke'],
        fallbacks: ['svgStroke'],
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

        const colors = getSettings(theme || config, configKey, moduleConfig.fallbacks)
        const colorAlphas = Object
          .entries(flatten(colors, FLATTEN_CONFIG))
          .map(processColor).filter(Boolean)

        addUtilities(colorAlphas, variants(configKey))
      })
    })
  }
}
