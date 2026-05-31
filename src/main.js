import './style.css'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

const places = [
  {
    title: 'Bellas Artes',
    mood: 'Noches de Arte Urbao',
    description: 'Exposiciones, cerveza, mezcal y cafés con vibra bohemia.',
    coordinates: [19.4352,-99.1437749],
  }
]

const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN?.trim()
const styleUrl = import.meta.env.VITE_MAPBOX_STYLE_URL?.trim() || 'mapbox://styles/mapbox/dark-v11'

const app = document.querySelector('#app')

app.innerHTML = `
  <main class="layout">
    <section class="hero">
      <h1>MHY</h1>
      <div class="token-note ${mapboxToken ? 'is-ready' : ''}">
        ${mapboxToken
          ? '<strong>Mapbox listo.</strong><span>El token está cargado y el mapa puede renderizarse.</span>'
          : '<strong>Falta el token de Mapbox.</strong><span>Configura <code>VITE_MAPBOX_TOKEN</code> en local o el secret <code>MAPBOX_ACCESS_TOKEN</code> en GitHub Actions.</span>'}
      </div>
    </section>

    <section class="content">
      <div class="panel map-panel">
        <div id="map" class="map" aria-label="Mapa con lugares de visita"></div>
      </div>

      <aside class="panel sidebar" aria-label="Lista de lugares a visitar">
        <h2>Lugares de visita</h2>
        <ul class="places-list"></ul>
      </aside>
    </section>
  </main>
`

const placesList = document.querySelector('.places-list')

for (const place of places) {
  const item = document.createElement('li')
  item.className = 'place-card'
  item.innerHTML = `
    <span class="place-mood">${escapeHtml(place.mood)}</span>
    <h3>${escapeHtml(place.title)}</h3>
    <p>${escapeHtml(place.description)}</p>
  `
  placesList.appendChild(item)
}

if (!mapboxToken) {
  document.querySelector('#map').innerHTML = `
    <div class="map-placeholder">
      <p>El mapa aparecerá aquí cuando exista un token válido de Mapbox.</p>
      <p class="map-placeholder__hint">Secret recomendado: <code>MAPBOX_ACCESS_TOKEN</code></p>
    </div>
  `
} else {
  mapboxgl.accessToken = mapboxToken

  const map = new mapboxgl.Map({
    container: 'map',
    style: styleUrl,
    center: [-3.6995, 40.4192],
    zoom: 12,
    pitch: 48,
    bearing: -22,
    antialias: true,
  })

  map.addControl(new mapboxgl.NavigationControl(), 'top-right')
  map.addControl(new mapboxgl.AttributionControl({ compact: true }))

  map.on('load', () => {
    if (map.getLayer('water')) {
      map.setPaintProperty('water', 'fill-color', '#4d1b63')
    }

    if (map.getLayer('building')) {
      map.setPaintProperty('building', 'fill-color', '#1f0d2b')
      map.setPaintProperty('building', 'fill-opacity', 0.82)
    }
  })

  for (const place of places) {
    const marker = document.createElement('button')
    marker.type = 'button'
    marker.className = 'map-marker'
    marker.setAttribute('aria-label', `Ver ${place.title}`)

    const popupMarkup = `
      <article class="popup-card">
        <p>${escapeHtml(place.mood)}</p>
        <h3>${escapeHtml(place.title)}</h3>
        <span>${escapeHtml(place.description)}</span>
      </article>
    `

    new mapboxgl.Marker(marker)
      .setLngLat(place.coordinates)
      .setPopup(new mapboxgl.Popup({ offset: 20 }).setHTML(popupMarkup))
      .addTo(map)
  }
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}
