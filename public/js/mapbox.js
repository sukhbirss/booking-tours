/* eslint-disable */

mapboxgl.accessToken = 'pk.eyJ1IjoidXNlcm5hbWUxMjM0NTY3ODkiLCJhIjoiY2tjbTBvNmNrMDB4dzJ4bjJtcmppMGkwcyJ9.MlkfB1yTd6_OG3bJmadmqQ';

var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/streets-v11'
});

  const bounds = new mapboxgl.LngLatBounds();
  console.log("////////////////////////",locations)

  locations.forEach(loc => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 30
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100
    }
  });


