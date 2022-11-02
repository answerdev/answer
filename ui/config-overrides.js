const path = require('path');

module.exports = {
  webpack: function (config, env) {
    if (env === 'production') {
      config.output.publicPath = process.env.REACT_APP_PUBLIC_PATH;
    }
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
      '@answer/pages': path.resolve(__dirname, 'src/pages'),
      '@answer/components': path.resolve(__dirname, 'src/components'),
      '@answer/stores': path.resolve(__dirname, 'src/stores'),
      '@answer/hooks': path.resolve(__dirname, 'src/hooks'),
      '@answer/utils': path.resolve(__dirname, 'src/utils'),
      '@answer/common': path.resolve(__dirname, 'src/common'),
      '@answer/api': path.resolve(__dirname, 'src/services/api'),
    };

    return config;
  },

  devServer: function (configFunction) {
    return function (proxy, allowedHost) {
      const config = configFunction(proxy, allowedHost);
      config.proxy = {
        '/answer': {
          target: 'http://10.0.10.98:2060',
          changeOrigin: true,
          secure: false,
        },
      };
      return config;
    };
  },
};
