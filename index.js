const Color = require('color')
const defaultColors = require('tailwindcss/defaultTheme').colors
const PREFIXES = {
  backgroundColor: ['bg'],
  textColors: ['text'],
  borderColors: ['border', 'border-t', 'border-r', 'border-b', 'border-l'],
  svgFill: ['fill'],
  svgStroke: ['stroke']
}

const PROPERTIES = {
  backgroundColor: ['backgroundColor'],
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
  return function({ e, addUtilities, config, theme }) {
    let {
      alpha = config('alpha', config('opacity', {})),
      modules = {
        backgroundColor: true,
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
          variants = theme(configKey, [])
        }
        if (variants === false) return

        const colors = Object.keys( defaultColors ).reduce((newColors, colorKey) => 
          (typeof defaultColors[ colorKey ] === 'object') ? 
          {...newColors, ...(Object.entries(defaultColors[ colorKey ]).reduce((tmp, [strength, color]) => { return {...tmp, [colorKey + '-' + strength] : color}; }, {}))} : 
          {...newColors, ...{[colorKey] : defaultColors[ colorKey ]}}, {})

            let utilities = Object.entries(colors)
              .reduce((utilities, [colorKey, color]) => {
                try {
                  let parsed = Color(color)
                  if (parsed.valpha === 1) {
                    let eachColor = PREFIXES[configKey].reduce((acc, prefix, i) => {
                      return {...acc,
                        [`.${e(`${prefix}-${colorKey}-${alphaKey}`)}`]: {
                          [`${PROPERTIES[configKey][i]}`]: parsed
                            .alpha(alphaValueFloat)
                            .string()
                        }
                      }
                    }, {})
                    return {...utilities, ...eachColor}
                  }
                } catch (err) {
                  return null
                }
                return null
              }, {})
            addUtilities(utilities, variants)
      })
    })
  }
}
