const Color = require('color')

const modules = {
  backgroundColor: {
    properties: ['backgroundColor'],
    prefix: ['bg']
  },
  textColor: {
    properties: ['color'],
    prefix: ['text']
  },
  borderColor: {
    properties: [
      'borderColor',
      'borderTopColor',
      'borderRightColor',
      'borderBottomColor',
      'borderLeftColor'
    ],
    prefix: ['border', 'border-t', 'border-r', 'border-b', 'border-l']
  },
  fill: {
    properties: ['fill'],
    prefix: ['fill']
  },
  stroke: {
    properties: ['stroke'],
    prefix: ['stroke']
  }
}

module.exports = function(opts = {}) {
  return function({ e, addUtilities, theme, variants }) {
    let alpha = theme('alpha', theme('opacity', {}))

    Object.entries(alpha).forEach(([alphaKey, alphaValue]) => {
      let alphaValueFloat = parseFloat(alphaValue)
      if (alphaValueFloat === 0 || alphaValueFloat === 1) return null

      Object.entries(modules).forEach(([mod, { properties, prefix }]) => {
        let key = `${mod}Alpha`
        let modVariants = variants(key, variants(mod, []))
        if (!modVariants.length) return

        let colors = flattenColors(theme(key, {}))

        addUtilities(
          Object.entries(colors)
            .map(([colorKey, color]) => {
              try {
                let parsed = Color(color)
                if (parsed.valpha === 1) {
                  return prefix.map((prefix, i) => {
                    return {
                      [`.${e(`${prefix}-${colorKey}-${alphaKey}`)}`]: {
                        [`${properties[i]}`]: parsed
                          .alpha(alphaValueFloat)
                          .string()
                      }
                    }
                  })
                }
              } catch (_) {}
            })
            .filter(Boolean),
          modVariants
        )
      })
    })
  }
}

function flattenColors(colors) {
  let result = {}
  for (let color in colors) {
    if (colors[color] === Object(colors[color])) {
      for (let key in colors[color]) {
        let suffix = key === 'default' ? '' : `-${key}`
        result[`${color}${suffix}`] = colors[color][key]
      }
    } else {
      result[color] = colors[color]
    }
  }
  return result
}
