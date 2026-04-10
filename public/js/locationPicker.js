// Location Picker - Use Current Location & Google Maps
let mapboxToken = mapToken || '';

// Debug: Check if mapToken is available
console.log('Mapbox Token Status:', mapboxToken ? '✓ Available' : '✗ Missing');

// Use Current Location
document.getElementById('useCurrentLocation')?.addEventListener('click', function() {
  const btn = this;
  btn.disabled = true;
  btn.textContent = 'Getting location...';

  if (!navigator.geolocation) {
    console.error('Geolocation not supported');
    alert('⚠️ Geolocation is not supported by your browser. Please enter location manually or use Google Maps option.');
    btn.disabled = false;
    btn.textContent = 'Use Current Location';
    return;
  }

  if (!mapboxToken) {
    console.error('Mapbox token missing');
    alert('⚠️ Map service not configured. Please enter location manually.');
    btn.disabled = false;
    btn.textContent = 'Use Current Location';
    return;
  }

  // Request with timeout
  const timeoutId = setTimeout(() => {
    console.error('Geolocation timeout');
    alert('⏱️ Getting location took too long. Please check browser permissions:\n1. Click the lock icon in address bar\n2. Allow location access\n3. Try again');
    btn.disabled = false;
    btn.textContent = 'Use Current Location';
  }, 10000);

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      clearTimeout(timeoutId);
      const { latitude, longitude } = position.coords;
      console.log(`✓ Current Location Detected: ${latitude}, ${longitude}`);

      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxToken}`
        );
        
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.features && data.features.length > 0) {
          const locationName = data.features[0].place_name;
          document.getElementById('location').value = locationName;
          window.listingCoordinates = [longitude, latitude];
          console.log('✓ Location set via Mapbox:', locationName);
          alert('✓ Location found: ' + locationName);
        } else {
          // Fallback to coordinates
          const fallbackLocation = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          document.getElementById('location').value = fallbackLocation;
          window.listingCoordinates = [longitude, latitude];
          console.log('✓ Using coordinates as location:', fallbackLocation);
        }
      } catch (error) {
        console.error('❌ Mapbox Error:', error);
        const fallbackLocation = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
        document.getElementById('location').value = fallbackLocation;
        window.listingCoordinates = [longitude, latitude];
        alert('✓ Location set using coordinates: ' + fallbackLocation);
      }

      btn.disabled = false;
      btn.textContent = 'Use Current Location';
    },
    (error) => {
      clearTimeout(timeoutId);
      console.error('❌ Geolocation Error:', error.code, error.message);
      
      let errorMsg = '⚠️ Unable to get your location.';
      
      if (error.code === error.PERMISSION_DENIED) {
        errorMsg += '\n\nLocation access was denied.\n\nTo enable:\n1. Click the lock icon in the address bar\n2. Select "Manage site settings"\n3. Change location to "Allow"';
      } else if (error.code === error.POSITION_UNAVAILABLE) {
        errorMsg += '\n\nYour location is unavailable.\n\nPlease try:\n• Turning on GPS\n• Moving to an open area\n• Using manual location entry';
      } else if (error.code === error.TIMEOUT) {
        errorMsg += '\n\nRequest timed out. Please try again.';
      }
      
      alert(errorMsg);
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

  if (!mapboxToken) {
    alert('Map service not configured. Please try the "Use Current Location" option instead.');
    return;
  }

  console.log('Processing location input:', googleInput);

  let latitude, longitude;

  // Format 1: Direct coordinates (lat,lng or lat, lng)
  const coordMatch = googleInput.match(/(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)/);
  if (coordMatch) {
    latitude = parseFloat(coordMatch[1]);
    longitude = parseFloat(coordMatch[2]);
    console.log('✓ Coordinates extracted:', latitude, longitude);
  } 
  // Format 2: Google Maps URL with @ format - https://www.google.com/maps/@20.1234,-85.8246
  else if (googleInput.includes('/@')) {
    const urlMatch = googleInput.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (urlMatch) {
      latitude = parseFloat(urlMatch[1]);
      longitude = parseFloat(urlMatch[2]);
      console.log('✓ Coordinates extracted from @-format URL:', latitude, longitude);
    }
  }
  // Format 3: maps.app.goo.gl shortened links (requires special handling)
  else if (googleInput.includes('maps.app.goo.gl') || googleInput.includes('goo.gl')) {
    alert('📍 Shortened Google Maps Links\n\nFor shortened links like maps.app.goo.gl/, please:\n\n1. Click the link to open it\n2. Copy the full URL from address bar\n3. Paste it back here\n\nOr use one of these formats:\n• Coordinates: 20.1234, -85.8246\n• Maps URL: https://www.google.com/maps/@20.1234,-85.8246\n• Place name: https://maps.google.com/?q=Goa');
    return;
  }
  // Format 4: Google Maps URL with place search - https://maps.google.com/?q=place
  else if (googleInput.includes('maps.google.com') || googleInput.includes('google.com/maps')) {
    const placeMatch = googleInput.match(/[?&]q=([^&]*)/);
    if (placeMatch) {
      const placeName = decodeURIComponent(placeMatch[1]).replace(/\+/g, ' ');
      document.getElementById('location').value = placeName;
      console.log('✓ Location set from place search:', placeName);
      alert('✓ Location: ' + placeName);
      return;
    } else {
      // Fallback: just show the error message with better instructions
      alert('❌ Could not parse Google Maps URL.\n\n📍 Supported formats:\n\n1️⃣  Coordinates: 20.1234,-85.8246\n\n2️⃣  Google Maps URL (Regular):\nhttps://www.google.com/maps/@20.1234,-85.8246\n\n3️⃣  Place Name Search:\nhttps://maps.google.com/?q=Goa\n\n📌 For shortened links (maps.app.goo.gl):\nOpen the link first, copy the full URL, then try again.');
      return;
    }
  }

  if (latitude !== undefined && longitude !== undefined) {
    // Validate coordinates
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      alert('❌ Invalid coordinates.\n\nValid ranges:\nLatitude: -90 to 90\nLongitude: -180 to 180');
      return;
    }

    // Use Mapbox Reverse Geocoding
    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxToken}`
    )
    .then(response => response.json())
    .then(data => {
      if (data.features && data.features.length > 0) {
        const locationName = data.features[0].place_name;
        document.getElementById('location').value = locationName;
        window.listingCoordinates = [longitude, latitude];
        console.log('✓ Location: ' + locationName);
        alert('✓ Location Found!\n\n' + locationName);
      } else {
        const fallback = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
        document.getElementById('location').value = fallback;
        window.listingCoordinates = [longitude, latitude];
        console.log('✓ Using coordinates:', fallback);
        alert('✓ Coordinates set:\n' + fallback);
      }
    })
    .catch(error => {
      console.error('Mapbox API Error:', error);
      const fallback = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
      document.getElementById('location').value = fallback;
      window.listingCoordinates = [longitude, latitude];
      alert('✓ Using coordinates:\n' + fallback);
    });
  } else {
    alert('❌ Could not parse location.\n\n📍 Please use one of these formats:\n\n1️⃣  Coordinates: 20.1234, -85.8246\n\n2️⃣  Full Google Maps URL:\nhttps://www.google.com/maps/@20.1234,-85.8246\n\n3️⃣  Place Search URL:\nhttps://maps.google.com/?q=Goa');
  }
});

// Clear Google Location input when clicked
document.getElementById('googleLocationInput')?.addEventListener('focus', function() {
  this.placeholder = 'Example: 20.1234,-85.8246 or https://www.google.com/maps/@20.1234,-85.8246';
});
