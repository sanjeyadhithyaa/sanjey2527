function startTracking() {
  const destLat = parseFloat(document.getElementById('destLat').value);
  const destLng = parseFloat(document.getElementById('destLng').value);
  const phone = document.getElementById('phone').value;

  if (!navigator.geolocation) {
    alert("Geolocation not supported!");
    return;
  }

  const watch = navigator.geolocation.watchPosition(pos => {
    const userLat = pos.coords.latitude;
    const userLng = pos.coords.longitude;

    const dist = getDistance(userLat, userLng, destLat, destLng);
    console.log(`Distance: ${dist} meters`);

    if (dist < 500) {
      alert("📍 You reached your destination! Calling...");
      fetch("https://your-backend.onrender.com/trigger-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone })
      });
      navigator.geolocation.clearWatch(watch);
    }
  });
}

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = x => x * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}