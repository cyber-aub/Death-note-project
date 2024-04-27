
const nextTranslate = require('next-translate-plugin')
const Visualizer = require('webpack-visualizer-plugin2');
const { StatsWriterPlugin } = require("webpack-stats-plugin");
const path = require('path')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {

    if(process.env.ANALYZE_BUNDLE === true){
      config.plugins.push(
        new BundleAnalyzerPlugin()
      )
    }

    if(process.env.ANALYZE_STATS === true){
      config.plugins.push(
        new StatsWriterPlugin({
          filename: '../analyze/webpack-stats.json',
          stats: {
            assets: true,
            chunks: true,
            modules: true
          }
        })
      );
      config.plugins.push(
          new Visualizer({
            filename: path.join('../analyze', 'stats', 'statistics.html'),
          }),
      )
    }

    return config;
  },
  reactStrictMode: true,
  modularizeImports: {
    "antd": {
      transform: "antd/es/{{loweCase member}}",
    },
    "@ant-design/icons": {
      transform: "@ant-design/icons/lib/icons/{{member}}",
    },
  },
  typescript: { ignoreBuildErrors: false },
  
}


module.exports = nextTranslate(nextConfig)
