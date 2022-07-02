import ProvidePlugin from 'webpack';

module.exports = {
  plugins: [
    new ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
  ],
};
