
module.exports = {
  plugins: [
    require('autoprefixer')({
      browsers: ['>1%']
    }),
    require('stylelint'),
    // require('postcss-easing-gradients'),
    require("css-mqpacker"),
    require('cssnano')({
      preset: 'default',
    }),
    // require('@fullhuman/postcss-purgecss')({
    //   content: ['./public/**/*.html']
    // }),
  ]
}
