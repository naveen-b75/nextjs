const { hostname } = require('os');

/** @type {import('next').NextConfig} */
if (process.env.ECOMMERCE_PLATFORM === 'shopify') {
  module.exports.images = {
    domains: ['cdn.shopify.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/s/files/!**',
        port: ''
      }
    ]
  };
} else if (process.env.ECOMMERCE_PLATFORM === 'bigcommerce') {
  module.exports.images = {
    remotePatterns: [
      {
        hostname: process.env.BIGCOMMERCE_CDN_HOSTNAME ?? '*.bigcommerce.com'
      },
      {
        hostname: 'cdn11.bigcommerce.com'
      },
      { hostname: 'vercel.kensiumcommerce.com' }
    ]
  };
} else if (process.env.ECOMMERCE_PLATFORM === 'magento') {
  module.exports.images = {
    remotePatterns: [
      {
        hostname: 'vercel.kensiumcommerce.com'
      }
    ]
  };
}
