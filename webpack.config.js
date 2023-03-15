const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    index: "./src/js/index.js",
    recipes: "./src/js/recipes.js",
    cookingsites: "./src/js/cookingsites.js",
    ingredients: "./src/js/ingredients.js",
    settings: "./src/js/settings.js",
  },
  output: {
    path: path.resolve(__dirname, "dist/bundles"),
    filename: "[name].bundle.js",
    libraryTarget: "var",
    library: "EntryPoint",
  },
  watch: true,
  module: {
    rules: [
      {
        test: /\.(scss)$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: () => [
                  require('autoprefixer')
                ]
              }
            }
          },
          {
            loader: 'sass-loader'
          }
        ]
      }
    ]
  }
};
