const Color = require('color')

const PREFIXES = {
  backgroundColors: ['bg'],
  textColors: ['text'],
  borderColors: ['border', 'border-t', 'border-r', 'border-b', 'border-l'],
  svgFill: ['fill'],
  svgStroke: ['stroke']
}

const PROPERTIES = {
  backgroundColors: ['backgroundColor'],
  textColors: ['color'],
  borderColors: [
    'borderColor',
    'borderTopColor',
    'borderRightColor',
    'borderBottomColor',
    'borderLeftColor'
  ],
  svgFill: ['fill'],
  svgStroke: ['stroke']
}

module.exports = function(opts = {}) {
  return function({ e, addUtilities, config }) {
    let {
      alpha = config('alpha', config('opacity', {})),
      modules = {
        backgroundColors: true,
        textColors: false,
        borderColors: false,
        svgFill: false,
        svgStroke: false
      }
    } = opts

    Object.entries(alpha).forEach(([alphaKey, alphaValue]) => {
      let alphaValueFloat = parseFloat(alphaValue)
      if (alphaValueFloat === 0 || alphaValueFloat === 1) return null

      Object.entries(modules).forEach(([configKey, variants]) => {
        if (variants === true) {
          variants = config(`modules.${configKey}`, [])
        }
        if (variants === false) return

        let colors = config(configKey, {})

        addUtilities(
          Object.entries(colors)
            .map(([colorKey, color]) => {
              try {
                let parsed = Color(color)
                if (parsed.valpha === 1) {
                  return PREFIXES[configKey].map((prefix, i) => {
                    return {
                      [`.${e(`${prefix}-${colorKey}-${alphaKey}`)}`]: {
                        [`${PROPERTIES[configKey][i]}`]: parsed
                          .alpha(alphaValueFloat)
                          .string()
                      }
                    }
                  })
                }
              } catch (err) {
                return null
              }
              return null
            })
            .filter(Boolean),
          variants
        )
      })
    })
  }
}
