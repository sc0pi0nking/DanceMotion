#!/bin/bash
# DanceMotion Production Deployment Script
# Für neue VM: 192.168.178.116

set -e

echo "🚀 DanceMotion Production Setup startet..."
echo "=========================================="

# ============================================================
# Phase 1: System vorbereiten
# ============================================================
echo "📦 Phase 1: System-Updates..."
apt update && apt upgrade -y
apt install -y curl git wget software-properties-common

# ============================================================
# Phase 2: Docker installieren
# ============================================================
echo "🐳 Phase 2: Docker installieren..."
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
rm get-docker.sh

# Docker Compose (bereits in neuem Docker enthalten)
docker compose --version

# ============================================================
# Phase 3: Firewall konfigurieren
# ============================================================
echo "🔥 Phase 3: Firewall..."
ufw enable -y
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw reload
ufw status

# ============================================================
# Phase 4: Verzeichnisse erstellen
# ============================================================
echo "📁 Phase 4: Verzeichnisse..."
mkdir -p /opt/dancemotion/web
mkdir -p /opt/traefik/dynamic
touch /opt/traefik/acme.json
chmod 600 /opt/traefik/acme.json

# ============================================================
# Phase 5: Git Repository clonen
# ============================================================
echo "📥 Phase 5: Repository clonen..."
cd /opt/dancemotion/web
git clone https://github.com/sc0pi0nking/DanceMotion.git . || true

# ============================================================
# Phase 6: Docker Network erstellen
# ============================================================
echo "🌐 Phase 6: Docker Network..."
docker network create proxy || true

# ============================================================
# Phase 7: Traefik starten
# ============================================================
echo "🔄 Phase 7: Traefik starten..."

cat > /opt/traefik/docker-compose.yml << 'TRAEFIK_EOF'
version: '3.8'

services:
  traefik:
    image: traefik:v3.1
    container_name: traefik
    restart: unless-stopped
    
    networks:
      - proxy
    
    ports:
      - "80:80"
      - "443:443"
    
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - /opt/traefik/dynamic:/etc/traefik/dynamic:ro
      - /opt/traefik/acme.json:/acme.json
    
    command:
      - --api.insecure=false
      - --providers.docker=true
      - --providers.docker.exposedbydefault=false
      - --providers.file.directory=/etc/traefik/dynamic
      - --providers.file.watch=true
      - --entrypoints.web.address=:80
      - --entrypoints.websecure.address=:443
      - --certificatesresolvers.letsencrypt.acme.httpchallenge=true
      - --certificatesresolvers.letsencrypt.acme.httpchallenge.entrypoint=web
      - --certificatesresolvers.letsencrypt.acme.storage=/acme.json
      - --certificatesresolvers.letsencrypt.acme.email=admin@dancemotion.org
      - --log.level=INFO

networks:
  proxy:
    driver: bridge

TRAEFIK_EOF

cd /opt/traefik
docker compose up -d --build
sleep 5

# ============================================================
# Phase 8: DanceMotion docker-compose.yml vorbereiten
# ============================================================
echo "🎭 Phase 8: DanceMotion konfigurieren..."

# .env kopieren von alter VM
echo "⏳ Warte auf .env von alter VM..."
# Du musst das .env manuell kopieren oder SSH sync machen

# Docker Compose für DanceMotion mit Traefik-Labels
cat > /opt/dancemotion/web/docker-compose.yml << 'DOCKER_EOF'
version: '3.8'

services:
  dancemotion-web:
    build:
      context: .
      dockerfile: dockerfile
      args:
        NEXT_PUBLIC_SUPABASE_URL: ${NEXT_PUBLIC_SUPABASE_URL}
        NEXT_PUBLIC_SUPABASE_ANON_KEY: ${NEXT_PUBLIC_SUPABASE_ANON_KEY}
        SUPABASE_SERVICE_ROLE_KEY: ${SUPABASE_SERVICE_ROLE_KEY}
        ADMIN_EMAIL: ${ADMIN_EMAIL}
        ADMIN_PASSWORD: ${ADMIN_PASSWORD}
        NEXT_PUBLIC_APP_URL: ${NEXT_PUBLIC_APP_URL:-https://dancemotion.org}
    
    container_name: dancemotion-web
    restart: unless-stopped
    
    networks:
      - proxy
    
    env_file:
      - .env
    
    environment:
      NODE_ENV: production
    
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.dancemotion.rule=Host(\`dancemotion.org\`, \`www.dancemotion.org\`)"
      - "traefik.http.routers.dancemotion.entrypoints=web,websecure"
      - "traefik.http.routers.dancemotion.tls=true"
      - "traefik.http.routers.dancemotion.tls.certresolver=letsencrypt"
      - "traefik.http.services.dancemotion.loadbalancer.server.port=3000"

networks:
  proxy:
    external: true

DOCKER_EOF

echo "✅ Setup abgeschlossen!"
echo ""
echo "Nächste Schritte:"
echo "1. .env Datei kopieren: scp luca@192.168.178.104:/opt/dancemotion/web/.env /opt/dancemotion/web/"
echo "2. Build & Deploy: cd /opt/dancemotion/web && docker compose up -d --build"
echo "3. Fritzbox: Port-Forwarding zu 192.168.178.116 statt 192.168.178.104"
echo "4. Test: curl https://dancemotion.org"
echo ""
echo "Container Status:"
docker ps | grep -E "traefik|dancemotion"
