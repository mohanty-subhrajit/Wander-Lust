
// Mapbox initialization with error handling
let maptoken = mapToken;

if (!maptoken) {
    console.warn('Mapbox token not provided');
}

// Validate coordinates
let coordinates = listing && listing.geometry && listing.geometry.coordinates 
    ? listing.geometry.coordinates 
    : [85.8246, 20.2960]; // Default Bhubaneswar coordinates

console.log("Map Token:", maptoken ? "✓ Available" : "✗ Missing");
console.log("Listing Coordinates:", coordinates);
console.log("Listing Location:", listing?.location);

mapboxgl.accessToken = maptoken;

try {
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/streets-v12', // Explicit style
        center: coordinates, // [longitude, latitude]
        zoom: 10 // starting zoom
    });

    // Add marker for the property location
    const marker = new mapboxgl.Marker({ color: "#fe424d" })
        .setLngLat(coordinates)
        .setPopup(new mapboxgl.Popup({offset: 25}).setHTML(
            `<div style="font-weight: bold; padding: 5px;">
                <h4 style="margin: 5px 0;">${listing.title}</h4>
                <p style="margin: 5px 0; font-size: 12px;">${listing.location}</p>
                <p style="margin: 5px 0; font-size: 12px; color: #666;">📍 Exact location revealed after booking confirmation</p>
            </div>`
        ))
        .addTo(map);

    // Open popup by default
    marker.togglePopup();

    console.log("✓ Map rendered successfully at:", coordinates);
} catch (error) {
    console.error("✗ Map initialization error:", error);
    // Show fallback message if map fails to load
    document.getElementById('map').innerHTML = `
        <div style="width: 100%; height: 400px; background: #f5f5f5; display: flex; align-items: center; justify-content: center; border-radius: 8px; border: 1px solid #ddd;">
            <div style="text-align: center; color: #666;">
                <p><strong>Map could not load</strong></p>
                <p style="font-size: 14px;">Location: ${listing?.location || 'Not specified'}</p>
            </div>
        </div>
    `;
}