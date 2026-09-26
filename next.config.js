const dns = require('dns');
try {
  // Force Node.js to prioritize IPv4 over IPv6 on Windows to prevent undici 'fetch failed' timeouts
  dns.setDefaultResultOrder('ipv4first');
} catch (_) {}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = nextConfig;
