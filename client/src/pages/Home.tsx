import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_LOGO, getLoginUrl } from "@/const";
import { Activity, AlertTriangle, Heart, MapPin, Bell, Bot } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Home() {
  const { t } = useLanguage();
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-red-950/20 dark:via-orange-950/20 dark:to-yellow-950/20 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25"></div>
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm font-medium">
              <Activity className="h-4 w-4 animate-pulse" />
              {t("home.badge")}
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              {t("home.title")}
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("home.subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" asChild className="gap-2">
                <Link href="/sismos">
                  <Activity className="h-5 w-5" />
                  {t("home.viewEarthquakes")}
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="gap-2">
                <Link href="/reportar">
                  <AlertTriangle className="h-5 w-5" />
                  {t("home.reportEmergency")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">{t("home.featuresTitle")}</h2>
            <p className="text-lg text-muted-foreground">
              {t("home.featuresSubtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Monitoreo de Sismos */}
            <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle>{t("home.earthquakeMonitoring")}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {t("home.earthquakeMonitoringDesc")}
                </CardDescription>
                <Button variant="link" className="mt-4 p-0" asChild>
                  <Link href="/sismos">{t("home.viewEarthquakes")} →</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Reporte de Emergencias */}
            <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                    <AlertTriangle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <CardTitle>{t("home.emergencyReports")}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {t("home.emergencyReportsDesc")}
                </CardDescription>
                <Button variant="link" className="mt-4 p-0" asChild>
                  <Link href="/reportar">{t("home.reportNow")} →</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Donaciones */}
            <Card className="border-l-4 border-l-red-500 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                    <Heart className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <CardTitle>{t("home.donations")}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {t("home.donationsDesc")}
                </CardDescription>
                <Button variant="link" className="mt-4 p-0" asChild>
                  <Link href="/donaciones">{t("home.donate")} →</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Mapa Interactivo */}
            <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                    <MapPin className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle>{t("home.interactiveMap")}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {t("home.interactiveMapDesc")}
                </CardDescription>
                <Button variant="link" className="mt-4 p-0" asChild>
                  <Link href="/sismos">{t("home.exploreMap")} →</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Notificaciones */}
            <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                    <Bell className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle>{t("home.notifications")}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {t("home.notificationsDesc")}
                </CardDescription>
                {isAuthenticated && (
                  <Button variant="link" className="mt-4 p-0" asChild>
                    <Link href="/notificaciones">{t("home.configure")} →</Link>
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Asistente Inteligente */}
            <Card className="border-l-4 border-l-indigo-500 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                    <Bot className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <CardTitle>{t("home.intelligentAssistant")}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {t("home.intelligentAssistantDesc")}
                </CardDescription>
                <Button variant="link" className="mt-4 p-0">
                  {t("home.chat")} →
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-red-600 dark:text-red-400">24/7</div>
              <div className="text-lg font-medium">{t("home.continuousMonitoring")}</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-orange-600 dark:text-orange-400">100%</div>
              <div className="text-lg font-medium">{t("home.donationTransparency")}</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-green-600 dark:text-green-400">{t("home.realTime")}</div>
              <div className="text-lg font-medium">{t("home.updatedData")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-900 dark:to-orange-900 text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">
              {t("home.ctaTitle")}
            </h2>
            <p className="text-lg text-red-50 dark:text-red-100">
              {t("home.ctaSubtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/reportar">{t("home.reportEmergency")}</Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10" asChild>
                <Link href="/donaciones">{t("home.viewCampaigns")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t bg-background">
        <div className="container">
          <div className="text-center text-sm text-muted-foreground space-y-2">
            <p>© 2025 SismoTracker. {t("home.footerRights")}</p>
            <p>{t("home.footerDesc")}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

