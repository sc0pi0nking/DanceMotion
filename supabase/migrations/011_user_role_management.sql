# Scripts auf Server kopieren
scp scripts/backup.sh dev@192.168.178.116:/opt/dancemotion/backups/
scp scripts/restore-latest.sh dev@192.168.178.116:/opt/dancemotion/backups/

# Executable machen
ssh dev@192.168.178.116 "chmod +x /opt/dancemotion/backups/*.sh"

# Testen
ssh dev@192.168.178.116 "/opt/dancemotion/backups/backup.sh"