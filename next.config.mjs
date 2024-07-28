/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    //console.log(config);
    return config;
  },
};

export default nextConfig;
