module.exports = {
  apps: [
    {
      cwd: '/home/azureuser/wwwroot/website',
      env: {
        NODE_ENV: 'production',
        PORT: 3300
      },
      env_test: {
        NODE_ENV: 'test',
        PORT: 3301
      },
      name: 'website',
      script: 'server.js'
    }
  ]
};
