# MHY

Mapa customizado con Mapbox, estética rocker/sexy, marcadores para lugares de visita y despliegue automático en GitHub Pages.

## Desarrollo local

1. Instala dependencias:
   ```bash
   npm install
   ```
2. Crea un `.env.local` a partir de `.env.example` y añade tu token de Mapbox:
   ```bash
   cp .env.example .env.local
   ```
3. Arranca el proyecto:
   ```bash
   npm run dev
   ```

## Variables de entorno

- `VITE_MAPBOX_TOKEN`: token público de Mapbox necesario para renderizar el mapa.
- `VITE_MAPBOX_STYLE_URL`: estilo del mapa. Por defecto usa `mapbox://styles/mapbox/dark-v11`, pero puedes sustituirlo por tu estilo custom de Mapbox Studio.

## GitHub Pages + GitHub Actions

El workflow `.github/workflows/deploy.yml` construye el proyecto y lo publica en GitHub Pages cuando hay cambios en `main`.

Configura en GitHub:

- **Secret** `MAPBOX_ACCESS_TOKEN`: se inyecta automáticamente como `VITE_MAPBOX_TOKEN` durante la build.
- **Repository variable** `MAPBOX_STYLE_URL` (opcional): para indicar un estilo custom de Mapbox Studio sin tocar el código.

Después, activa GitHub Pages con **Source: GitHub Actions** en la configuración del repositorio.
