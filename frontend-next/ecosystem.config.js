module.exports = {
  apps: [
    {
      name: 'frontend-next',
      cwd: __dirname,
      script: 'node_modules/.bin/next',
      args: 'start -p 3000',
      env: {
        NODE_ENV: 'production',
      },
      instances: 1,
      exec_mode: 'fork',
      max_memory_restart: '500M',
      autorestart: true,
      time: true,
      error_file: '/var/log/frontend-next-error.log',
      out_file: '/var/log/frontend-next-out.log',
    },
  ],
};