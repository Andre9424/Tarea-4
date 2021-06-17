// Mapa Leaflet
var mapa = L.map('mapid').setView([9.74, -84.23], 11.5);


// Definición de capas base
var capa_osm = L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?', 
  {
    maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }
).addTo(mapa);	

var Stamen_Terrain = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 18,
	ext: 'png'
});

var capa_cartoDB_darkMatter = L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', 
    {
	  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	  subdomains: 'abcd',
	  maxZoom: 19
    }
).addTo(mapa);

// Conjunto de capas base
var capas_base = {
  "Base Oscura": capa_cartoDB_darkMatter,
  "OSM": capa_osm,
  "Relieve": Stamen_Terrain
  
};	    


// Ícono personalizado para carnivoros
const iconoNaciente = L.divIcon({
  html: '<i class="fas fa-hand-holding-water fa-2x"></i>',
  className: 'estiloIconos'
});


// Control de capas
control_capas = L.control.layers(capas_base).addTo(mapa);	


// Control de escala
L.control.scale().addTo(mapa);
	    

// Capa vectorial de registros agrupados de nacientes
$.getJSON("https://andre9424.github.io/Tarea-4/Nacientes/NacientesWGS84.geojson", function(geodata) {
  // Registros individuales
  var capa_nacientes = L.geoJson(geodata, {
    style: function(feature) {
	  return {'color': "#00ECF7", 'weight': 3}
    },
    onEachFeature: function(feature, layer) {
      var popupText = "<strong>Descripción</strong>: " + feature.properties.Decripcion + "<br>" + 
                      "<strong>Radio</strong>: " + feature.properties.Radio;
      layer.bindPopup(popupText);
    },
    pointToLayer: function(getJsonPoint, latlng) {
        return L.marker(latlng, {icon: iconoNaciente});
    }
  });
  
    // Capa de calor (heatmap) 
	coordenadas = geodata.features.map(feat => feat.geometry.coordinates.reverse());
	var capa_nacientes_calor = L.heatLayer(coordenadas, {radius: 30, blur: 1});

  // Capa de puntos agrupados
  var capa_nacientes_agrupados = L.markerClusterGroup({showCoverageOnHover: false, spiderfyOnMaxZoom: true});
  capa_nacientes_agrupados.addLayer(capa_nacientes);

  // Se añade la capa al mapa y al control de capas
	capa_nacientes_calor.addTo(mapa); 
	capa_nacientes_agrupados.addTo(mapa);
	
	control_capas.addOverlay(capa_nacientes_calor, 'Mapa de calor'); 
	control_capas.addOverlay(capa_nacientes_agrupados, 'Registros agrupados de nacientes');
	control_capas.addOverlay(capa_nacientes, 'Registros individuales de nacientes');
});
