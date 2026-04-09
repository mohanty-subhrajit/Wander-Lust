// Location Picker - Use Current Location & Google Maps
let mapboxToken = mapToken || '';

// Use Current Location
document.getElementById('useCurrentLocation')?.addEventListener('click', function() {
  const btn = this;
  btn.disabled = true;
  btn.textContent = 'Getting location...';

  if (!navigator.geolocation) {
    alert('Geolocation is not supported by your browser');
    btn.disabled = false;
    btn.textContent = 'Use Current Location';
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      console.log(`Current Location: ${latitude}, ${longitude}`);

      // Use Mapbox Reverse Geocoding to get address
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxToken}`
        );
        const data = await response.json();
        
        if (data.features.length > 0) {
          const locationName = data.features[0].place_name || `${latitude}, ${longitude}`;
          document.getElementById('location').value = locationName;
          
          // Store coordinates for map
          window.listingCoordinates = [longitude, latitude];
          console.log('Location set to:', locationName);
        }
      } catch (error) {
        console.error('Error getting address:', error);
        document.getElementById('location').value = `${latitude}, ${longitude}`;
      }

      btn.disabled = false;
      btn.textContent = 'Use Current Location';
    },
    (error) => {
      console.error('Geolocation error:', error);
      alert('Unable to get your location. Please check your browser permissions.');
      btn.disabled = false;
      btn.textContent = 'Use Current Location';
    }
  );
});

// Parse Google Maps URL/Location
document.getElementById('useGoogleLocation')?.addEventListener('click', function() {
  const googleInput = document.getElementById('googleLocationInput').value.trim();
  
  if (!googleInput) {
    alert('Please enter a Google Maps URL or coordinates');
    return;
  }

  // Try to extract coordinates from Google Maps URL
  let latitude, longitude;

  // Format 1: Direct coordinates (lat,lng or lat, lng)
  const coordMatch = googleInput.match(/(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)/);
  if (coordMatch) {
    latitude = parseFloat(coordMatch[1]);
    longitude = parseFloat(coordMatch[2]);
  } 
  // Format 2: Google Maps URL with @ format - https://www.google.com/maps/@20.1234,-85.8246
  else if (googleInput.includes('/@')) {
    const urlMatch = googleInput.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (urlMatch) {
      latitude = parseFloat(urlMatch[1]);
      longitude = parseFloat(urlMatch[2]);
    }
  }
  // Format 3: Google Maps URL with z parameter - https://maps.google.com/?q=place
  else if (googleInput.includes('maps.google.com') || googleInput.includes('google.com/maps')) {
    // Try to extract place name from URL
    const placeMatch = googleInput.match(/[?&]q=([^&]*)/);
    if (placeMatch) {
      const placeName = decodeURIComponent(placeMatch[1]);
      document.getElementById('location').value = placeName;
      console.log('Location set to: ' + placeName);
      alert('Location: ' + placeName);
      return;
    } else {
      alert('Could not parse Google Maps URL. \n\nSupported formats:\n1. Direct coordinates: 20.1234,-85.8246\n2. Google Maps URL: https://www.google.com/maps/@20.1234,-85.8246\n3. Search: https://maps.google.com/?q=place+name');
      return;
    }
  }

  if (latitude !== undefined && longitude !== undefined) {
    // Validate coordinates (Google Maps uses lat,lng but Mapbox uses lng,lat)
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      alert('Invalid coordinates.\n\nValid ranges:\nLatitude: -90 to 90\nLongitude: -180 to 180');
      return;
    }

    // Swap coordinates for Mapbox if needed (Mapbox uses [lng, lat])
    // Google gives us [lat, lng], so we need to use [lng, lat] for Mapbox
    const mapboxLng = longitude;
    const mapboxLat = latitude;

    // Use Mapbox Reverse Geocoding to get address
    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${mapboxLng},${mapboxLat}.json?access_token=${mapboxToken}`
    )
    .then(response => response.json())
    .then(data => {
      if (data.features && data.features.length > 0) {
        const locationName = data.features[0].place_name;
        document.getElementById('location').value = locationName;
        window.listingCoordinates = [mapboxLng, mapboxLat];
        console.log('Location set via Mapbox:', locationName);
        console.log('Coordinates:', [mapboxLng, mapboxLat]);
        alert('Location:\n' + locationName);
      } else {
        // Fallback if no features found
        document.getElementById('location').value = `${latitude}, ${longitude}`;
        window.listingCoordinates = [mapboxLng, mapboxLat];
        alert('Coordinates set: ' + latitude.toFixed(4) + ', ' + longitude.toFixed(4));
      }
    })
    .catch(error => {
      console.error('Mapbox Reverse Geocoding Error:', error);
      document.getElementById('location').value = `${latitude}, ${longitude}`;
      window.listingCoordinates = [mapboxLng, mapboxLat];
      alert('Coordinates set: ' + latitude.toFixed(4) + ', ' + longitude.toFixed(4) + '\n(Could not retrieve place name)');
    });
  } else {
    alert('Could not parse location from input.\n\nSupported formats:\n1. Coordinates: 20.1234,-85.8246\n2. Google Maps URL: https://www.google.com/maps/@20.1234,-85.8246\n3. Place name URL: https://maps.google.com/?q=Goa');
  }
});

// Clear Google Location input when clicked
document.getElementById('googleLocationInput')?.addEventListener('focus', function() {
  this.placeholder = 'Paste Google Maps URL or coordinates (lat,lng)';
});
