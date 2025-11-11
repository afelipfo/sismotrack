import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Link, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Home from "./pages/Home";
import Earthquakes from "./pages/Earthquakes";
import ReportEmergency from "./pages/ReportEmergency";
import Donations from "./pages/Donations";
import Notifications from "./pages/Notifications";
import { Button } from "@/components/ui/button";
import { useAuth } from "./_core/hooks/useAuth";
import { getLoginUrl } from "./const";
import { Activity, AlertTriangle, Heart, Menu, X, Bell } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "./contexts/LanguageContext";
import Chatbot from "./components/Chatbot";
import { SettingsSwitches } from "./components/SettingsSwitches";

function Navigation() {
  const { t } = useLanguage();
  const [location] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/", label: t("nav.home"), icon: Activity },
    { path: "/sismos", label: t("nav.earthquakes"), icon: Activity },
    { path: "/reportar", label: t("nav.report"), icon: AlertTriangle },
    { path: "/donaciones", label: t("nav.donations"), icon: Heart },
  ];
  
  // Solo mostrar notificaciones si el usuario está autenticado
  const navItemsWithAuth = isAuthenticated
    ? [...navItems, { path: "/notificaciones", label: t("nav.notifications"), icon: Bell }]
    : navItems;

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/">
            <span className="flex items-center space-x-2 font-bold text-xl cursor-pointer">
              <Activity className="h-6 w-6 text-primary" />
              <span>SismoTracker</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItemsWithAuth.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              return (
                <Link key={item.path} href={item.path}>
                  <span
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Auth Section */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {user?.name || user?.email}
              </span>
              <SettingsSwitches />
              <Button variant="ghost" size="sm" onClick={logout}>
                {t("nav.logout")}
              </Button>
            </>
          ) : (
            <Button size="sm" asChild>
              <a href={getLoginUrl()}>Iniciar Sesión</a>
            </Button>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container py-4 space-y-2">
            {navItemsWithAuth.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              return (
                <Link key={item.path} href={item.path}>
                  <span
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}

function Router() {
  return (
    <>
      <Navigation />
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/sismos"} component={Earthquakes} />
        <Route path={"/reportar"} component={ReportEmergency} />
        <Route path={"/donaciones"} component={Donations} />
        <Route path={"/notificaciones"} component={Notifications} />
        <Route path={"/404"} component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        switchable
      >
        <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
