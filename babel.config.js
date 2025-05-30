module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Existing plugins...
      [
        'react-native-web',
        {
          commonjs: true,
          removeUnknownProps: true,
        },
      ],
      'react-native-reanimated/plugin', // Must be last in the plugins array
    ],
  };
};