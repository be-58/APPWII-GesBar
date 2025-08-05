@echo off
REM Script de utilidades para Docker - GesBar Frontend

echo ========================================
echo       GESBAR FRONTEND - DOCKER
echo ========================================
echo.

:MENU
echo Selecciona una opcion:
echo 1. Construir imagen Docker
echo 2. Ejecutar contenedor (puerto 3000)
echo 3. Iniciar stack completo (docker-compose)
echo 4. Detener todos los contenedores
echo 5. Ver logs del frontend
echo 6. Limpiar imagenes y contenedores
echo 7. Verificar estado de Docker
echo 8. Salir
echo.
set /p choice="Ingresa tu opcion (1-8): "

if "%choice%"=="1" goto BUILD
if "%choice%"=="2" goto RUN
if "%choice%"=="3" goto COMPOSE
if "%choice%"=="4" goto STOP
if "%choice%"=="5" goto LOGS
if "%choice%"=="6" goto CLEAN
if "%choice%"=="7" goto STATUS
if "%choice%"=="8" goto EXIT
goto MENU

:BUILD
echo.
echo Construyendo imagen Docker...
docker build -t gesbar-frontend .
if %ERRORLEVEL% EQU 0 (
    echo Imagen construida exitosamente!
) else (
    echo Error al construir la imagen. Verifica que Docker Desktop este corriendo.
)
pause
goto MENU

:RUN
echo.
echo Ejecutando contenedor en puerto 3000...
docker run -d -p 3000:80 --name gesbar-frontend-container gesbar-frontend
if %ERRORLEVEL% EQU 0 (
    echo Contenedor iniciado! Accede en: http://localhost:3000
) else (
    echo Error al ejecutar contenedor. Verifica que no haya otro contenedor corriendo.
)
pause
goto MENU

:COMPOSE
echo.
echo Iniciando stack completo con docker-compose...
docker-compose up -d
if %ERRORLEVEL% EQU 0 (
    echo Stack iniciado! Frontend: http://localhost:3000
) else (
    echo Error al iniciar stack. Verifica docker-compose.yml
)
pause
goto MENU

:STOP
echo.
echo Deteniendo todos los contenedores...
docker-compose down
docker stop gesbar-frontend-container 2>nul
docker rm gesbar-frontend-container 2>nul
echo Contenedores detenidos.
pause
goto MENU

:LOGS
echo.
echo Mostrando logs del frontend...
docker logs gesbar-frontend-container
if %ERRORLEVEL% NEQ 0 (
    echo No se encontro contenedor activo.
)
pause
goto MENU

:CLEAN
echo.
echo Limpiando imagenes y contenedores...
docker container prune -f
docker image prune -f
echo Limpieza completada.
pause
goto MENU

:STATUS
echo.
echo Estado de Docker:
docker --version
echo.
echo Contenedores activos:
docker ps
echo.
echo Imagenes disponibles:
docker images | findstr gesbar
pause
goto MENU

:EXIT
echo.
echo Saliendo...
exit /b 0
