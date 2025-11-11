// Script para probar la API del USGS
const testUSGSAPI = async () => {
  const endTime = new Date();
  const startTime = new Date();
  startTime.setDate(startTime.getDate() - 7);

  const params = new URLSearchParams({
    format: "geojson",
    starttime: startTime.toISOString().split("T")[0],
    endtime: endTime.toISOString().split("T")[0],
    minlatitude: "-56.0",
    maxlatitude: "13.0",
    minlongitude: "-81.0",
    maxlongitude: "-34.0",
    minmagnitude: "2.5",
    orderby: "time",
  });

  const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?${params.toString()}`;
  
  console.log("🔍 Consultando API del USGS...");
  console.log("URL:", url);
  console.log("");

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    console.log("✅ Conexión exitosa!");
    console.log(`📊 Total de sismos encontrados: ${data.features.length}`);
    console.log("");
    
    if (data.features.length > 0) {
      console.log("🌍 Últimos 5 sismos registrados:");
      console.log("─".repeat(80));
      
      data.features.slice(0, 5).forEach((feature, index) => {
        const mag = feature.properties.mag;
        const place = feature.properties.place;
        const time = new Date(feature.properties.time);
        const [lon, lat, depth] = feature.geometry.coordinates;
        
        console.log(`${index + 1}. Magnitud ${mag} - ${place}`);
        console.log(`   📅 Fecha: ${time.toLocaleString('es-ES')}`);
        console.log(`   📍 Coordenadas: ${lat.toFixed(2)}°, ${lon.toFixed(2)}°`);
        console.log(`   🔽 Profundidad: ${depth} km`);
        console.log("");
      });
    } else {
      console.log("⚠️  No se encontraron sismos en el rango especificado");
    }
    
  } catch (error) {
    console.error("❌ Error al conectar con la API del USGS:");
    console.error(error.message);
  }
};

testUSGSAPI();
