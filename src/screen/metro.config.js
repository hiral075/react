// const { getDefaultConfig } = require('metro-config');

// module.exports = (async () => {
//   const defaultConfig = await getDefaultConfig();
//   return {
//     ...defaultConfig,
//     resolver: {
//       ...defaultConfig.resolver,
//       blockList: /.*/,
//     },
//     watchFolders: [
//       // Include any external folders if necessary
//       __dirname,
//     ],
//   };
// })();

const { getDefaultConfig } = require("metro-config");

module.exports = (async () => {
  const {
    resolver: { assetExts },
  } = await getDefaultConfig();
  return {
    resolver: {
      assetExts: [...assetExts, "png", "jpg", "jpeg", "svg"],
    },
  };
})();
