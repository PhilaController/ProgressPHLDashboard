const { defineConfig } = require("@vue/cli-service");
const webpack = require("webpack");

module.exports = defineConfig({
  transpileDependencies: true,
  css: {
    extract: false,
  },
  configureWebpack: () => {
    return {
      externals: {
        jquery: "jQuery",
        $: "jQuery",
      },
      entry: {
        main: "./src/main.js",
      },
      output: {
        filename: "spi-dashboard.[name].[fullhash:7].js",
      },
      plugins: [
        new webpack.ProvidePlugin({
          $: "jquery",
          jQuery: "jquery",
        }),
      ],
      optimization: { splitChunks: false },
    };
  },
});
