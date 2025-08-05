#!/bin/bash

# Script de verificación de despliegue
echo "🔍 Verificando configuración de despliegue..."

# Verificar archivos necesarios
echo "📁 Verificando archivos de configuración:"

if [ -f "netlify.toml" ]; then
    echo "✅ netlify.toml - OK"
else
    echo "❌ netlify.toml - FALTA"
fi

if [ -f "public/_redirects" ]; then
    echo "✅ public/_redirects - OK"
else
    echo "❌ public/_redirects - FALTA"
fi

if [ -f "src/config/index.ts" ]; then
    echo "✅ src/config/index.ts - OK"
else
    echo "❌ src/config/index.ts - FALTA"
fi

# Verificar build
echo -e "\n🔨 Ejecutando build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build exitoso"
    
    # Verificar archivos de build
    echo -e "\n📦 Verificando archivos de build:"
    
    if [ -f "dist/index.html" ]; then
        echo "✅ dist/index.html - OK"
    else
        echo "❌ dist/index.html - FALTA"
    fi
    
    if [ -f "dist/_redirects" ]; then
        echo "✅ dist/_redirects - OK"
    else
        echo "❌ dist/_redirects - FALTA"
    fi
    
    if [ -d "dist/assets" ]; then
        echo "✅ dist/assets/ - OK"
        echo "   Archivos: $(ls dist/assets/ | wc -l)"
    else
        echo "❌ dist/assets/ - FALTA"
    fi
    
    echo -e "\n🎉 ¡Proyecto listo para Netlify!"
    echo "📝 Próximos pasos:"
    echo "   1. Push tu código a GitHub"
    echo "   2. Conecta el repo a Netlify"
    echo "   3. ¡Deploy automático!"
    
else
    echo "❌ Error en el build"
    exit 1
fi
