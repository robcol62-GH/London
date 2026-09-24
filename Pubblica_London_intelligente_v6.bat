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

powershell -NoProfile -ExecutionPolicy Bypass -Command "$v='%VERSION%'; $q1=[char]34; $q2=[char]39; $p='((?:src|href|fetch\()\s*['+$q1+$q2+'])([^'+$q1+$q2+']+\.(?:css|js|json))(?:\?v=[^'+$q1+$q2+']*)?(['+$q1+$q2+'])'; $fs=@('index.html') + @(Get-ChildItem -Path 'js' -Filter '*.js' -File | %% { $_.FullName }); foreach($f in $fs) { $b=[IO.File]::ReadAllBytes($f); $t=[Text.Encoding]::UTF8.GetString($b); $n=[regex]::Replace($t,$p,'$1$2?v='+$v+'$3',[Text.RegularExpressions.RegexOptions]::IgnoreCase); if($n -ne $t) { [IO.File]::WriteAllBytes($f,[Text.Encoding]::UTF8.GetBytes($n)) } }; Write-Host 'Riferimenti aggiornati.'"

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
