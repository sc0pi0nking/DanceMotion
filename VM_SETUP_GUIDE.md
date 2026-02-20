# DanceMotion VM Setup Guide (Proxmox)

## Phase 1: VM erstellen in Proxmox

### 1.1 Neue VM erstellen
- **Name**: `dancemotion-prod`
- **VMID**: `105` (oder nächste verfügbare)
- **OS**: Ubuntu 24.04 LTS
- **Cores**: 4
- **RAM**: 4GB (8GB wenn möglich)
- **Disk**: 50GB
- **Network**: Bridge (gleiche wie Host)

### 1.2 Nach Start: SSH-Key einrichten
```bash
# Auf deinem PC (lokal)
ssh-copy-id -i ~/.ssh/id_ed25519.pub root@<VM-IP>

# Dann testen:
ssh root@<VM-IP>
```

---

## Phase 2: Ubuntu vorbereiten

```bash
# SSH in die VM (als root)
ssh root@<VM-IP>

# System updaten
apt update && apt upgrade -y

# Docker installieren
curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh

# Docker compose
apt install -y docker-compose

# Firewall aktivieren und konfigurieren
ufw enable
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw reload

# Test
docker ps
docker-compose --version
```

---

## Phase 3: Verzeichnisse vorbereiten

```bash
# Arbeitsverzeichnis erstellen
mkdir -p /opt/dancemotion
cd /opt/dancemotion

# Git repo clonen
git clone https://github.com/sc0pi0nking/DanceMotion.git web
cd web

# .env Datei kopieren von Alt-Server
scp dev@192.168.178.116:/opt/dancemotion/web/.env .
```

---

## Phase 4: Traefik Setup (Host-Level)

### 4.1 Traefik Verzeichnis erstellen

```bash
mkdir -p /opt/traefik/dynamic
chmod 777 /opt/traefik

# acme.json für Let's Encrypt
touch /opt/traefik/acme.json
chmod 600 /opt/traefik/acme.json
```

### 4.2 Traefik docker-compose.yml

```bash
cat > /opt/traefik/docker-compose.yml << 'EOF'
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

EOF

# Traefik starten
docker-compose up -d --build
docker ps | grep traefik
```

---

## Phase 5: DanceMotion Setup

### 5.1 docker-compose.yml anpassen

```bash
cd /opt/dancemotion/web

# Vereinfachte docker-compose.yml für diese VM
cat > docker-compose.yml << 'EOF'
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

EOF
```

### 5.2 Starten

```bash
docker-compose up -d --build

# Logs prüfen
docker logs dancemotion-web
docker logs traefik | tail -30
```

---

## Phase 6: Fritzbox konfigurieren (neu)

In der Fritzbox:
- **HTTP (Port 80)** → `<neue-VM-IP>:80`
- **HTTPS (Port 443)** → `<neue-VM-IP>:443`

**Nicht mehr zu 192.168.178.104 portforwarden!**

---

## Phase 7: Test

```bash
# Von deinem PC aus:
curl -v https://dancemotion.org

# Sollte:
# - HTTP 200 geben
# - Gültiges SSL-Zertifikat haben
# - Die Seite laden
```

---

## Checkliste

- [ ] VM in Proxmox erstellt (4cores, 4-8GB RAM)
- [ ] SSH-Key funktioniert
- [ ] Docker & compose installiert
- [ ] UFW Firewall: 22, 80, 443 erlaubt
- [ ] Traefik läuft auf Port 80/443
- [ ] DanceMotion Container läuft
- [ ] `curl https://dancemotion.org` funktioniert
- [ ] Fritzbox Port-Forwarding zu neuer VM konfiguriert
- [ ] SSL-Zertifikat gültig

---

## VM Informationen speichern

```
VM Name: dancemotion-prod
VM IP: _______________
SSH: ssh root@<VM-IP>
```

