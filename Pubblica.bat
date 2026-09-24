@echo off
cd /d "c:\Sviluppo\Progetti\GiocoLoCa"

echo.
echo ========================================
echo        PUBBLICAZIONE GIOCOLOCA
echo ========================================
echo.

echo [1/3] Aggiungo le modifiche...
git add .

echo.
echo [2/3] Creo il commit...
git commit -m "Aggiornamento GiocoLoCa"

echo.
echo [3/3] Invio a GitHub...
git push origin main

echo.
echo ========================================
echo        PUBBLICAZIONE COMPLETATA
echo ========================================
echo.
pause