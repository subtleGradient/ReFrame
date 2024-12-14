const { getDefaultConfig } = require("expo/metro-config")
const { resolve } = require("path")

const defaultConfig = getDefaultConfig(__dirname, {})

/**
 * @type {import('metro-config').MetroConfig}
 */
module.exports = async () => {
  const repoRoot = await require("git-root-dir")()

  return {
    ...defaultConfig,

    // allows bun link to work
    watchFolders: [repoRoot],

    resolver: {
      ...defaultConfig.resolver,

      nodeModulesPaths: [
        resolve(__dirname, "node_modules"),
        resolve(__dirname, "..", "node_modules"),
        // resolve(repoRoot, "packages"), //
      ],
    },
  }
}
