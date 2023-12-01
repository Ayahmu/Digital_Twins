const { defineConfig } = require("@vue/cli-service");
// 获取当前时间戳
module.exports = defineConfig({
  outputDir: "dist",
  filenameHashing: true,
  transpileDependencies: true,
  devServer: {
    webSocketServer: false,
  },
});
