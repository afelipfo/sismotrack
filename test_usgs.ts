
import { fetchRecentEarthquakes } from './server/earthquakeService';

async function test() {
    console.log("Testing USGS API connection...");
    try {
        const quakes = await fetchRecentEarthquakes(2.5, 1);
        console.log(`Successfully fetched ${quakes.length} earthquakes.`);
        if (quakes.length > 0) {
            console.log("Sample:", JSON.stringify(quakes[0], null, 2));
        }
    } catch (error) {
        console.error("Failed to fetch earthquakes:", error);
        process.exit(1);
    }
}

test();
