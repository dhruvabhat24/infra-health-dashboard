#!/bin/sh
set -eu
sudo iptables -I DOCKER-USER 1 -s 172.28.0.0/24 -d 172.29.0.10 -j DROP
echo "Installed Linux Docker firewall rule."
sudo iptables -L DOCKER-USER -n --line-numbers
