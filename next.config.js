/** @type {import('next').NextConfig} */
module.exports = {
  // async headers() {
  //   return [
  //     {
  //       source: '/(.*)',
  //       headers: [
  //         {
  //           key: 'Content-Security-Policy',
  //           value: "connect-src 'self' *.googleapis.com;"
  //         }
  //       ]
  //     }
  //   ]
  // },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '**'
      },
      {
        protocol: 'https',
        hostname: '*.googleapis.com',
        port: '',
        pathname: '**'
      }
    ]
  }
}
