import { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYXNod2l0aDEyMyIsImEiOiJjbXBwMW5kZjgwYTBuMnJzN2U1bnd1MHJ5In0.ycM5gaZqD_35oo7LT9chjQ";

function Hospitals() {
  const [coords, setCoords] = useState(null);

  // 🟢 SAMPLE HOSPITAL DATA
  const hospitals = [
    { name: "City Hospital", lng: 72.8777, lat: 19.076 },
    { name: "Life Care Hospital", lng: 72.8856, lat: 19.08 },
    { name: "Apollo Clinic", lng: 72.89, lat: 19.072 },
  ];

  // 🟢 GET USER LOCATION
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setCoords({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
    });
  }, []);

  // 🟢 MAP LOAD
  useEffect(() => {
    if (!coords) return;

    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [coords.lng, coords.lat],
      zoom: 13,
    });

    // 🟢 USER MARKER (BLUE)
    new mapboxgl.Marker({ color: "blue" })
      .setLngLat([coords.lng, coords.lat])
      .setPopup(new mapboxgl.Popup().setText("You are here"))
      .addTo(map);

    // 🟢 HOSPITAL MARKERS (RED)
    hospitals.forEach((h) => {
      new mapboxgl.Marker({ color: "red" })
        .setLngLat([h.lng, h.lat])
        .setPopup(new mapboxgl.Popup().setText(h.name))
        .addTo(map);
    });
  }, [coords]);

  return (
    <div>
      <h1>Nearby Hospitals</h1>

      <div id="map" style={{ width: "100%", height: "500px" }} />
    </div>
  );
}

export default Hospitals;