const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    Index: "./src/js/index.js",
    Recipes: "./src/js/recipes.js",
    Ingredients: "./src/js/ingredients.js",
    Settings: "./src/js/settings.js",
    Firebase: "./src/js/firebase.js",
  },
  output: {
    path: path.resolve(__dirname, "dist/bundles"),
    filename: "[name].bundle.js",
    libraryTarget: "var",
    library: "[name]",
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
