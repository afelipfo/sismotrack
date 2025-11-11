import { useState } from "react";
import { trpc } from "@/lib/trpc";
import EarthquakeMap from "@/components/EarthquakeMap";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Activity, RefreshCw, MapPin, Clock, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Earthquakes() {
  const { t } = useLanguage();
  const [isSyncing, setIsSyncing] = useState(false);

  // Obtener sismos desde la base de datos
  const { data: earthquakes, isLoading, refetch } = trpc.earthquakes.list.useQuery({ limit: 200 });

  // Mutación para sincronizar sismos desde USGS
  const syncMutation = trpc.earthquakes.sync.useMutation({
    onSuccess: (data) => {
      toast.success(t("earthquakes.syncSuccess").replace("{count}", data.inserted.toString()));
      refetch();
      setIsSyncing(false);
    },
    onError: (error) => {
      toast.error(t("earthquakes.syncError").replace("{error}", error.message));
      setIsSyncing(false);
    },
  });

  const handleSync = () => {
    setIsSyncing(true);
    syncMutation.mutate({ minMagnitude: 0, daysBack: 30 });
  };

  // Calcular estadísticas
  const stats = {
    total: earthquakes?.length || 0,
    significant: earthquakes?.filter((e) => parseFloat(e.magnitude) >= 5.0).length || 0,
    strong: earthquakes?.filter((e) => parseFloat(e.magnitude) >= 6.1).length || 0,
    recent: earthquakes?.[0],
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Activity className="h-12 w-12 animate-pulse mx-auto text-primary" />
          <p className="text-muted-foreground">{t("earthquakes.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-500/10 via-orange-500/10 to-yellow-500/10 border-b">
        <div className="container py-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
                <Activity className="h-10 w-10 text-red-600" />
                {t("earthquakes.title")}
              </h1>
              <p className="text-muted-foreground text-lg">
                {t("earthquakes.subtitle")}
              </p>
            </div>
            <Button
              onClick={handleSync}
              disabled={isSyncing}
              size="lg"
              className="gap-2"
            >
              <RefreshCw className={`h-5 w-5 ${isSyncing ? "animate-spin" : ""}`} />
              {isSyncing ? t("earthquakes.updating") : t("earthquakes.updateData")}
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t("earthquakes.total")}</p>
                    <p className="text-3xl font-bold mt-1">{stats.total}</p>
                    <p className="text-xs text-muted-foreground mt-1">{t("earthquakes.last30days")}</p>
                  </div>
                  <Activity className="h-10 w-10 text-blue-500 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t("earthquakes.significant")}</p>
                    <p className="text-3xl font-bold mt-1">{stats.significant}</p>
                    <p className="text-xs text-muted-foreground mt-1">{t("earthquakes.magnitude5")}</p>
                  </div>
                  <TrendingUp className="h-10 w-10 text-orange-500 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t("earthquakes.strong")}</p>
                    <p className="text-3xl font-bold mt-1">{stats.strong}</p>
                    <p className="text-xs text-muted-foreground mt-1">{t("earthquakes.magnitude6")}</p>
                  </div>
                  <AlertTriangle className="h-10 w-10 text-red-500 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t("earthquakes.mostRecent")}</p>
                    <p className="text-2xl font-bold mt-1">
                      M {stats.recent ? parseFloat(stats.recent.magnitude).toFixed(1) : "0.0"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 truncate max-w-[150px]">
                      {stats.recent?.place || t("earthquakes.noData")}
                    </p>
                  </div>
                  <Clock className="h-10 w-10 text-green-500 opacity-50" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8 space-y-8">
        {/* Mapa Interactivo */}
        {earthquakes && earthquakes.length > 0 ? (
          <EarthquakeMap earthquakes={earthquakes} />
        ) : (
          <Card>
            <CardContent className="py-12">
              <div className="flex flex-col items-center justify-center text-center space-y-4">
                <AlertTriangle className="h-16 w-16 text-muted-foreground/50" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">{t("earthquakes.noData")}</h3>
                  <p className="text-muted-foreground mb-4">
                    {t("earthquakes.noDataDesc")}
                  </p>
                  <Button onClick={handleSync} disabled={isSyncing}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? "animate-spin" : ""}`} />
                    {t("earthquakes.syncNow")}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lista de Sismos Recientes */}
        {earthquakes && earthquakes.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {t("earthquakes.recentEvents")}
              </CardTitle>
              <CardDescription>
                {t("earthquakes.recentEventsDesc").replace("{count}", Math.min(10, earthquakes.length).toString())}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {earthquakes.slice(0, 10).map((earthquake, index) => {
                  const magnitude = parseFloat(earthquake.magnitude);
                  const magnitudeColor =
                    magnitude >= 6.1
                      ? "bg-red-500"
                      : magnitude >= 5.1
                        ? "bg-orange-500"
                        : magnitude >= 4.1
                          ? "bg-green-500"
                          : "bg-blue-500";

                  const magnitudeLabel =
                    magnitude >= 6.1
                      ? t("earthquakes.strongLabel")
                      : magnitude >= 5.1
                        ? t("earthquakes.moderateLabel")
                        : magnitude >= 4.1
                          ? t("earthquakes.lightLabel")
                          : t("earthquakes.minorLabel");

                  return (
                    <div
                      key={earthquake.id}
                      className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-shrink-0">
                        <div
                          className={`w-12 h-12 rounded-full ${magnitudeColor} flex items-center justify-center text-white font-bold shadow-lg`}
                        >
                          {magnitude.toFixed(1)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="secondary" className="text-xs">
                            {magnitudeLabel}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(earthquake.time).toLocaleString()}
                          </span>
                        </div>
                        <p className="font-medium truncate">
                          {earthquake.place || earthquake.location}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {t("earthquakes.depth")}: {parseFloat(earthquake.depth).toFixed(1)} km
                        </p>
                      </div>
                      {earthquake.url && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={earthquake.url} target="_blank" rel="noopener noreferrer">
                            {t("earthquakes.viewDetails")}
                          </a>
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

