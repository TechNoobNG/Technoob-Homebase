#!/usr/bin/env bash

echo "Installing CERTBOT.."
CERT_DOMAIN=`/opt/elasticbeanstalk/bin/get-config environment -k DOMAIN_LINK`
CERT_EMAIL=`/opt/elasticbeanstalk/bin/get-config environment -k EMAIL_LINK`
sudo yum -y install certbot python-certbot-nginx
sudo certbot --agree-tos --non-interactive --domains ${CERT_DOMAIN} --email ${CERT_EMAIL} --nginx
sudo certbot renew --dry-run
echo "CERTBOT installed!"