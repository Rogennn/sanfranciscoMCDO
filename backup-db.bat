@echo off
REM Database Backup Script for Windows
REM This script creates backups of mcdo_db.sqlite in a backups folder

setlocal enabledelayedexpansion
set BACKUP_DIR=%cd%\backups
set DB_FILE=%cd%\mcdo_db.sqlite

REM Create backup directory if it doesn't exist
if not exist "%BACKUP_DIR%" (
    mkdir "%BACKUP_DIR%"
    echo Created backup directory: %BACKUP_DIR%
)

REM Generate timestamp
for /f "tokens=2-4 delims=/ " %%a in ('date /t') do (set mydate=%%c-%%a-%%b)
for /f "tokens=1-2 delims=/:" %%a in ('time /t') do (set mytime=%%a-%%b)

set TIMESTAMP=%mydate%_%mytime%
set BACKUP_FILE=%BACKUP_DIR%\mcdo_db_backup_%TIMESTAMP%.sqlite

REM Copy database file
if exist "%DB_FILE%" (
    copy "%DB_FILE%" "%BACKUP_FILE%"
    echo Backup created: %BACKUP_FILE%
) else (
    echo Database file not found: %DB_FILE%
    exit /b 1
)

REM Clean up old backups (keep only last 30 days)
REM Note: This requires additional tools on Windows. For now, just create the backup.
echo Backup completed successfully!
