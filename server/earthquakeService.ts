/**
 * Servicio para obtener datos de sismos desde la API del USGS
 * Documentación: https://earthquake.usgs.gov/fdsnws/event/1/
 */

interface USGSFeature {
  id: string;
  properties: {
    mag: number;
    place: string;
    time: number;
    url: string;
    detail: string;
  };
  geometry: {
    coordinates: [number, number, number]; // [longitude, latitude, depth]
  };
}

interface USGSResponse {
  features: USGSFeature[];
}

/**
 * Obtiene sismos recientes de Sudamérica desde la API del USGS
 * Bounding box de Sudamérica aproximado:
 * - minlatitude: -56.0 (sur de Chile/Argentina)
 * - maxlatitude: 13.0 (norte de Colombia/Venezuela)
 * - minlongitude: -81.0 (oeste de Ecuador)
 * - maxlongitude: -34.0 (este de Brasil)
 */
export async function fetchRecentEarthquakes(
  minMagnitude: number = 0,
  daysBack: number = 30
): Promise<USGSFeature[]> {
  const endTime = new Date();
  const startTime = new Date();
  startTime.setDate(startTime.getDate() - daysBack);

  const params = new URLSearchParams({
    format: "geojson",
    starttime: startTime.toISOString().split("T")[0],
    endtime: endTime.toISOString().split("T")[0],
    minlatitude: "-56.0",
    maxlatitude: "13.0",
    minlongitude: "-81.0",
    maxlongitude: "-34.0",
    minmagnitude: minMagnitude.toString(),
    orderby: "time",
  });

  const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?${params.toString()}`;

  try {
    console.log(`Fetching earthquakes from USGS: ${url}`);
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`USGS API error: ${response.status} ${response.statusText} - ${errorText}`);
    }
    const data: USGSResponse = await response.json();
    console.log(`Fetched ${data.features?.length || 0} earthquakes from USGS`);
    return data.features || [];
  } catch (error) {
    console.error("Error fetching earthquakes from USGS:", error);
    // Return empty array instead of throwing to prevent app crash on external API failure
    return [];
  }
}

/**
 * Busca sismos cerca de una ubicación específica
 */
export async function fetchEarthquakesNearLocation(
  latitude: number,
  longitude: number,
  radiusKm: number = 500,
  minMagnitude: number = 0,
  daysBack: number = 30
): Promise<USGSFeature[]> {
  const endTime = new Date();
  const startTime = new Date();
  startTime.setDate(startTime.getDate() - daysBack);

  const params = new URLSearchParams({
    format: "geojson",
    starttime: startTime.toISOString().split("T")[0],
    endtime: endTime.toISOString().split("T")[0],
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    maxradiuskm: radiusKm.toString(),
    minmagnitude: minMagnitude.toString(),
    orderby: "time",
  });

  const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?${params.toString()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`USGS API error: ${response.status}`);
    }
    const data: USGSResponse = await response.json();
    return data.features || [];
  } catch (error) {
    console.error("Error fetching earthquakes near location:", error);
    throw error;
  }
}

/**
 * Convierte un feature del USGS al formato de nuestra base de datos
 */
export function convertUSGSFeatureToEarthquake(feature: USGSFeature) {
  const [longitude, latitude, depth] = feature.geometry.coordinates;
  return {
    id: feature.id,
    magnitude: feature.properties.mag.toString(),
    location: feature.properties.place || "Unknown",
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    depth: depth.toString(),
    time: new Date(feature.properties.time),
    url: feature.properties.url,
    place: feature.properties.place,
  };
}

