@echo off
REM ==============================================================================
REM AJ EcoDrive ERP — Automated Database Backup Runner
REM Executes the Node.js backup engine and logs output to backups/backup_run.log
REM Can be registered as a scheduled task in Windows Task Scheduler
REM ==============================================================================

cd /d "C:\xampp\htdocs\ECodrive"
echo [BACKUP] Starting automated database backup at %DATE% %TIME% >> "backups\backup_run.log"

node "backend\scripts\backup_database.js" >> "backups\backup_run.log" 2>&1

if %ERRORLEVEL% EQU 0 (
    echo [BACKUP] Backup completed successfully at %DATE% %TIME% >> "backups\backup_run.log"
    node "backend\scripts\verify_backup.js" >> "backups\backup_run.log" 2>&1
) else (
    echo [BACKUP] ERROR: Backup failed with exit code %ERRORLEVEL% at %DATE% %TIME% >> "backups\backup_run.log"
)

