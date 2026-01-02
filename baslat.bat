@echo off
echo FindBack Baslatiliyor... Lutfen pencereleri kapatma.

:: 1. Backend'i baslat
start "Backend Sunucusu" cmd /k "node server.js"

:: 2. Frontend'i baslat
start "Frontend Sunucusu" cmd /k "npm run dev"

:: 3. Biraz bekle ve siteyi ac
timeout /t 5
start http://localhost:3000