const plugin = require('./index.js')
const pluginOptions = {
  modules: {
    backgroundColors: true,
    textColors: false,
    borderColors: false,
    svgFill: false,
    svgStroke: false,
  },
}

module.exports = {
  theme: {},
  plugins: [plugin(pluginOptions)],
}
