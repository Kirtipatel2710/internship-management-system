module.exports = {
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false
    }
    return config
  },
}
