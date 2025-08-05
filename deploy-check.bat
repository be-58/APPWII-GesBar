@echo off
REM Script de verificación de despliegue para Windows
echo 🔍 Verificando configuracion de despliegue...

REM Verificar archivos necesarios
echo 📁 Verificando archivos de configuracion:

if exist "netlify.toml" (
    echo ✅ netlify.toml - OK
) else (
    echo ❌ netlify.toml - FALTA
)

if exist "public\_redirects" (
    echo ✅ public\_redirects - OK
) else (
    echo ❌ public\_redirects - FALTA
)

if exist "src\config\index.ts" (
    echo ✅ src\config\index.ts - OK
) else (
    echo ❌ src\config\index.ts - FALTA
)

REM Verificar build
echo.
echo 🔨 Ejecutando build...
call npm run build

if %errorlevel% equ 0 (
    echo ✅ Build exitoso
    
    REM Verificar archivos de build
    echo.
    echo 📦 Verificando archivos de build:
    
    if exist "dist\index.html" (
        echo ✅ dist\index.html - OK
    ) else (
        echo ❌ dist\index.html - FALTA
    )
    
    if exist "dist\_redirects" (
        echo ✅ dist\_redirects - OK
    ) else (
        echo ❌ dist\_redirects - FALTA
    )
    
    if exist "dist\assets" (
        echo ✅ dist\assets\ - OK
    ) else (
        echo ❌ dist\assets\ - FALTA
    )
    
    echo.
    echo 🎉 ¡Proyecto listo para Netlify!
    echo 📝 Proximos pasos:
    echo    1. Push tu codigo a GitHub
    echo    2. Conecta el repo a Netlify
    echo    3. ¡Deploy automatico!
    
) else (
    echo ❌ Error en el build
    exit /b 1
)

pause
