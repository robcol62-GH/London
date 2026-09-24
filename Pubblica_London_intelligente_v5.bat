@echo off
setlocal

cd /d "c:\Sviluppo\Progetti\London"

echo.
echo ========================================
echo        PUBBLICAZIONE LONDON
echo ========================================
echo.

echo [1/4] Aggiorno la versione cache...

for /f "tokens=1-6 delims=/:., " %%a in ("%date% %time%") do set VERSION=%%f%%e%%d%%c%%b%%a
set VERSION=%VERSION: =0%

echo Versione cache: %VERSION%

rem ============================================================
rem Aggiunge/sostituisce ?v=... nei riferimenti di index.html
rem senza riscrivere il file: usa solo PowerShell -Command,
rem NON EncodedCommand e preserva UTF-8/Unicode.
rem ============================================================

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
"$version='%VERSION%';" ^
"$files=@('index.html') + (Get-ChildItem -Path 'js' -Filter '*.js' -File | ForEach-Object { $_.FullName });" ^
"foreach($file in $files) {" ^
"  $bytes=[IO.File]::ReadAllBytes($file);" ^
"  $text=[Text.Encoding]::UTF8.GetString($bytes);" ^
"  $new=[regex]::Replace($text,'((?:src|href|fetch\()\s*[""'' ])([^""'']+\.(?:css|js|json))(?:\?v=[^""'']*)?([""'' ])','$1$2?v='+$version+'$3',[Text.RegularExpressions.RegexOptions]::IgnoreCase);" ^
"  if($new -ne $text) {[IO.File]::WriteAllBytes($file,[Text.Encoding]::UTF8.GetBytes($new))}" ^
"};" ^
"Write-Host 'Riferimenti aggiornati.'"

if errorlevel 1 (
    echo.
    echo ERRORE durante l'aggiornamento della cache.
    pause
    exit /b 1
)

echo.
echo [2/4] Aggiungo le modifiche...
git add .

echo.
echo [3/4] Creo il commit...
git commit -m "Aggiornamento London"

echo.
echo [4/4] Invio a GitHub...
git push origin main

echo.
echo ========================================
echo        PUBBLICAZIONE COMPLETATA
echo ========================================
echo.
pause
