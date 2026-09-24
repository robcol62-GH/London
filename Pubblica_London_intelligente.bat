@echo off
cd /d "c:\Sviluppo\Progetti\London"

echo.
echo ========================================
echo        PUBBLICAZIONE LONDON
echo ========================================
echo.

echo [1/4] Aggiorno la versione di CSS e JS...

for /f %%V in ('powershell -NoProfile -Command "Get-Date -Format yyyyMMddHHmmss"') do set "VERSION=%%V"

powershell -NoProfile -Command "$v='%VERSION%'; $p='index.html'; $c=Get-Content $p -Raw; $c=[regex]::Replace($c,'((?:src|href)=[\"''](?:js|css)/[^\"'']+\.(?:js|css))(?:\?v=[^\"'']*)?([\"''])','$1?v='+$v+'$2'); Set-Content $p $c -NoNewline"

echo       Versione: %VERSION%

echo.
echo [2/4] Aggiungo le modifiche...
git add .

echo.
echo [3/4] Creo il commit...
git commit -m "Aggiornamento London %VERSION%"

echo.
echo [4/4] Invio a GitHub...
git push origin main

echo.
echo ========================================
echo        PUBBLICAZIONE COMPLETATA
echo ========================================
echo.
echo CSS e JS pubblicati con versione %VERSION%.
echo Non dovrebbe essere necessario CTRL+F5.
echo.
pause
