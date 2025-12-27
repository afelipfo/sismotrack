import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Map as MapIcon, Filter } from "lucide-react";

interface Earthquake {
  id: string;
  magnitude: string;
  location: string;
  latitude: string;
  longitude: string;
  depth: string;
  time: Date;
  place?: string | null;
}

interface EarthquakeMapProps {
  earthquakes: Earthquake[];
}

// Función para obtener el color según la magnitud
function getMagnitudeColor(magnitude: number): string {
  if (magnitude >= 6.1) return "#dc2626"; // Rojo
  if (magnitude >= 5.1) return "#ea580c"; // Naranja
  if (magnitude >= 4.1) return "#16a34a"; // Verde
  return "#2563eb"; // Azul
}

// Función para obtener el radio del círculo según la magnitud
function getMagnitudeRadius(magnitude: number): number {
  if (magnitude >= 6.1) return 15;
  if (magnitude >= 5.1) return 12;
  if (magnitude >= 4.1) return 9;
  return 6;
}

// Función para obtener la etiqueta de intensidad
function getMagnitudeLabel(magnitude: number): string {
  if (magnitude >= 6.1) return "Fuerte";
  if (magnitude >= 5.1) return "Moderado";
  if (magnitude >= 4.1) return "Ligero";
  return "Menor";
}

export default function EarthquakeMap({ earthquakes }: EarthquakeMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.CircleMarker[]>([]);

  // Estados para los filtros
  const [filters, setFilters] = useState({
    minor: true, // 0.1 - 4.0
    light: true, // 4.1 - 5.0
    moderate: true, // 5.1 - 6.0
    strong: true, // 6.1+
  });

  const [showFilters, setShowFilters] = useState(false);

  // Filtrar sismos según los filtros activos
  const filteredEarthquakes = earthquakes.filter((eq) => {
    const mag = parseFloat(eq.magnitude);
    if (mag >= 6.1) return filters.strong;
    if (mag >= 5.1) return filters.moderate;
    if (mag >= 4.1) return filters.light;
    return filters.minor;
  });

  // Inicializar el mapa
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Crear el mapa centrado en Medellín
    const map = L.map(mapContainerRef.current).setView([6.2442, -75.5812], 12);

    // Agregar capa de OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    // Limpiar al desmontar
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Actualizar marcadores cuando cambien los sismos o filtros
  useEffect(() => {
    if (!mapRef.current) return;

    // Limpiar marcadores existentes
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Agregar nuevos marcadores con animación
    filteredEarthquakes.forEach((earthquake, index) => {
      if (!mapRef.current) return;

      const magnitude = parseFloat(earthquake.magnitude);
      const latitude = parseFloat(earthquake.latitude);
      const longitude = parseFloat(earthquake.longitude);
      const depth = parseFloat(earthquake.depth);

      const color = getMagnitudeColor(magnitude);
      const radius = getMagnitudeRadius(magnitude);

      // Crear marcador con animación de entrada
      setTimeout(() => {
        if (!mapRef.current) return;

        const marker = L.circleMarker([latitude, longitude], {
          radius: radius,
          fillColor: color,
          color: "#fff",
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8,
          className: "earthquake-marker",
        }).addTo(mapRef.current);

        // Popup con información del sismo
        const popupContent = `
          <div style="min-width: 220px; font-family: system-ui;">
            <div style="background: ${color}; color: white; padding: 8px 12px; margin: -10px -10px 10px -10px; border-radius: 4px 4px 0 0;">
              <h3 style="margin: 0; font-weight: bold; font-size: 18px;">
                M ${magnitude.toFixed(1)}
              </h3>
              <span style="font-size: 12px; opacity: 0.9;">${getMagnitudeLabel(magnitude)}</span>
            </div>
            <div style="padding: 4px 0;">
              <p style="margin: 6px 0; font-size: 14px;">
                <strong>📍 Ubicación:</strong><br/>
                ${earthquake.place || earthquake.location}
              </p>
              <p style="margin: 6px 0; font-size: 14px;">
                <strong>⬇️ Profundidad:</strong> ${depth.toFixed(1)} km
              </p>
              <p style="margin: 6px 0; font-size: 14px;">
                <strong>🕐 Fecha:</strong><br/>
                ${new Date(earthquake.time).toLocaleString("es-ES")}
              </p>
              <p style="margin: 6px 0; font-size: 13px; color: #666;">
                <strong>🌐 Coordenadas:</strong><br/>
                ${latitude.toFixed(3)}°, ${longitude.toFixed(3)}°
              </p>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
        markersRef.current.push(marker);
      }, index * 20); // Animación escalonada
    });
  }, [filteredEarthquakes]);

  const toggleFilter = (filterKey: keyof typeof filters) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: !prev[filterKey],
    }));
  };

  const filterCount = Object.values(filters).filter(Boolean).length;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <MapIcon className="h-6 w-6" />
              Mapa Interactivo
            </CardTitle>
            <CardDescription className="mt-1">
              Visualización geográfica de {filteredEarthquakes.length} eventos sísmicos
            </CardDescription>
          </div>
          <Button
            variant={showFilters ? "default" : "outline"}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Filtros
            {filterCount < 4 && (
              <Badge variant="secondary" className="ml-1">
                {filterCount}/4
              </Badge>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Filtros Colapsables */}
        {showFilters && (
          <div className="p-4 bg-muted/30 border-b animate-in slide-in-from-top">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="filter-minor"
                  checked={filters.minor}
                  onCheckedChange={() => toggleFilter("minor")}
                />
                <Label htmlFor="filter-minor" className="flex items-center gap-2 cursor-pointer">
                  <div className="w-4 h-4 rounded-full bg-[#2563eb] shadow-sm"></div>
                  <span className="text-sm font-medium">0.1 - 4.0</span>
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="filter-light"
                  checked={filters.light}
                  onCheckedChange={() => toggleFilter("light")}
                />
                <Label htmlFor="filter-light" className="flex items-center gap-2 cursor-pointer">
                  <div className="w-4 h-4 rounded-full bg-[#16a34a] shadow-sm"></div>
                  <span className="text-sm font-medium">4.1 - 5.0</span>
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="filter-moderate"
                  checked={filters.moderate}
                  onCheckedChange={() => toggleFilter("moderate")}
                />
                <Label htmlFor="filter-moderate" className="flex items-center gap-2 cursor-pointer">
                  <div className="w-4 h-4 rounded-full bg-[#ea580c] shadow-sm"></div>
                  <span className="text-sm font-medium">5.1 - 6.0</span>
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="filter-strong"
                  checked={filters.strong}
                  onCheckedChange={() => toggleFilter("strong")}
                />
                <Label htmlFor="filter-strong" className="flex items-center gap-2 cursor-pointer">
                  <div className="w-4 h-4 rounded-full bg-[#dc2626] shadow-sm"></div>
                  <span className="text-sm font-medium">6.1+</span>
                </Label>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Mostrando <strong>{filteredEarthquakes.length}</strong> de{" "}
                <strong>{earthquakes.length}</strong> sismos
              </span>
              {filterCount < 4 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setFilters({
                      minor: true,
                      light: true,
                      moderate: true,
                      strong: true,
                    })
                  }
                >
                  Restablecer Filtros
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Mapa */}
        <div
          ref={mapContainerRef}
          className="w-full h-[600px]"
          style={{ zIndex: 0 }}
        />

        {/* Leyenda Compacta */}
        <div className="p-4 bg-muted/20 border-t">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#2563eb] shadow-sm"></div>
              <span className="font-medium">Menor</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#16a34a] shadow-sm"></div>
              <span className="font-medium">Ligero</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ea580c] shadow-sm"></div>
              <span className="font-medium">Moderado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#dc2626] shadow-sm"></div>
              <span className="font-medium">Fuerte</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

