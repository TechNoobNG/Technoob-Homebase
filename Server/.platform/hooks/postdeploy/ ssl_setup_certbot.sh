#!/usr/bin/env bash

echo "Installing CERTBOT.."
CERT_DOMAIN=`/opt/elasticbeanstalk/bin/get-config environment -k DOMAIN_LINK`
EBS_CERT_DOMAIN=`/opt/elasticbeanstalk/bin/get-config environment -k EBS_DOMAIN_LINK`
CERT_EMAIL=`/opt/elasticbeanstalk/bin/get-config environment -k EMAIL_LINK`
sudo yum -y install certbot python-certbot-nginx
sudo certbot --agree-tos --non-interactive --domains ${CERT_DOMAIN} --email ${CERT_EMAIL} --nginx
sudo certbot renew --dry-run
sudo certbot --agree-tos --non-interactive --domains ${EBS_CERT_DOMAIN} --email ${CERT_EMAIL} --nginx
sudo certbot renew --dry-run
echo "CERTBOT installed!"
echo "Copying nginx config"
sudo cp /var/app/current/.platform/01_client_max_body_size.conf /etc/nginx/conf.d
sudo systemctl reload nginx
