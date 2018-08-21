const common = require('./common')
const merge = require('webpack-merge')

module.exports = merge(common, {
    mode: "production"
})