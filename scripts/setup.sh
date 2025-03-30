#!/bin/bash

# Update system packages
apt-get update
apt-get upgrade -y

# Install Docker
apt-get install -y apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/download/v2.15.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Install Nginx
apt-get install -y nginx

# Configure firewall
ufw allow 'Nginx Full'
ufw allow 22/tcp
ufw allow 25565:25665/tcp
ufw enable

# Create minecraft data directory
mkdir -p /var/minecraft/data

# Set up Nginx configuration
cp nginx.conf /etc/nginx/sites-available/minecraft-manager
ln -s /etc/nginx/sites-available/minecraft-manager /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx

echo "Server setup complete!"

