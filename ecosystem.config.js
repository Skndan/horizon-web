module.exports = {
  apps: [
    {
      script: "npm start",
    }
  ],
  deploy: {
    production: {
      key: "id_ed25519.pem",
      user: "root",
      host: "65.21.146.83",
      ref: "origin/main",
      repo: "git@github.com:Skndan/horizon-hrms.git",
      path: "/var/www",
      "pre-deploy-local": "",
      "post-deploy":
        "source ~/.nvm/nvm.sh && npm install && npm run build && pm2 reload ecosystem.config.js --env production",
      "pre-setup": "",
      ssh_options: "ForwardAgent=yes",
    },
  }
};
