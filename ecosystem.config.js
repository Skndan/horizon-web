module.exports = {
  apps: [
    {
      name: 'horizon-hrms',  // Replace with your app's name
      script: 'npm',  // Use 'yarn' or 'npm' based on your package manager
      args: 'start',  // Command to start the Next.js app
      interpreter: 'bash',  // Specify the interpreter
      watch: true,  // Enable PM2 to watch and restart the app on file changes
      env: {
        NODE_ENV: 'production',  // Environment variable for production
        // Add any other environment variables your app needs here
      },
      env_production: {
        NODE_ENV: 'production',
        // Add any production-specific environment variables here
      },
      instances: 'max',  // Run the app with maximum instances (or specify a number)
      exec_mode: 'cluster',  // Run the app in cluster mode for better performance
      autorestart: true,  // Automatically restart the app on crashes
      error_file: 'logs/error.log',  // Specify log file for errors
      out_file: 'logs/out.log',  // Specify log file for standard output
      log_date_format: 'YYYY-MM-DD HH:mm Z',  // Format log dates
    },
  ],
  deploy: {
    production: {
      key: "id_ed25519.pem",
      user: "root",
      host: "65.21.146.83",
      ref: "origin/main",
      repo: "git@github.com:Skndan/horizon-hrms.git",
      path: "/var/www/horizon-app",
      "pre-deploy-local": "",
      "post-deploy":
        "source ~/.nvm/nvm.sh && npm install && npm run build && pm2 reload ecosystem.config.js --env production",
      "pre-setup": "",
      ssh_options: "ForwardAgent=yes",
    },
  }
};
