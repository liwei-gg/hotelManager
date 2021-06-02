const { configure } = require("nprogress");
const path = require("path");
module.exports = {
  devServer: {
    contentBase: path.join(__dirname, "public"),
    port: 8000,
  },
  configureWebpack: {
    resolve: {
      extensions: [".js", ".vue", ".json"],
      alias: {
        Excel: path.resolve(__dirname, "./src/Excel"),
      },
    },
  },
};
