/** @type {import('next').NextConfig} */
const ESLintPlugin = require("eslint-webpack-plugin")
const ESLintOption = require("./.eslintrc.json")
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { dev }) => {
    if (dev) {
      config.plugins.push(new ESLintPlugin({ overrideConfig: ESLintOption }))
    }
    return config
  },
}

module.exports = nextConfig
