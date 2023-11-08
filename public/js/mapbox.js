/*eslint-disable*/

const locations = JSON.parse(document.getElementById('map').dataset.locations);

mapboxgl.accessToken =
  'pk.eyJ1Ijoia2V2aW5yYW5nZWwiLCJhIjoiY2tobWF1Z2VmMWdpcjJwcWs1N2FqcG80cCJ9.r9KGGjwBxCYYyrJ0ypd8Ig';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/kevinrangel/clolov6rb006001qn3q3ge9s5',
  scrollZoom: false,
  //longitude - latititude
  // center: [-118.113491, 34.111745],
  // zoom: 4,
  // interactive: false,
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach((loc) => {
  //Create  marker
  const el = document.createElement('div');
  el.className = 'marker';

  //Add marker
  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom',
  })
    .setLngLat(loc.coordinates)
    .addTo(map);

  //Add popup
  new mapboxgl.Popup({
    offset: 30,
  })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day}: ${loc.description} </p>`)
    .addTo(map);

  //Extends map bounds to include current location
  bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 150,
    left: 100,
    right: 100,
  },
});
