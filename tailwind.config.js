const plugin = require('./index.js')
const pluginOptions = {}

module.exports = {
  theme: {},
  plugins: [plugin(pluginOptions)],
}
