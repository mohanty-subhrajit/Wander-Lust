
let maptoken = mapToken;
// console.log("Map Token:", maptoken);
// console.log("Coordinates:", coordinates);

// Validate coordinates or use default
// let validCoordinates = coordinates && Array.isArray(coordinates) && coordinates.length === 2 
//     ? coordinates 
//     : [85.8246, 20.2960]; // Default fallback coordinates



mapboxgl.accessToken = maptoken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: listing.geometry.coordinates, // use listing coordinates or fallback
    zoom: 9 // starting zoom
});

const marker = new mapboxgl.Marker({ color: "red" })
    .setLngLat( listing.geometry.coordinates) //listing.geometry.coordinates
    .setPopup(new mapboxgl.Popup({offset:25}).setHTML(`<h4>${listing.title}</h4><p>Extract Location will be provided after booking</p>`))
    .addTo(map);

console.log("Marker created at:", validCoordinates);