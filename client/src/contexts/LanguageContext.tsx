import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "es" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  es: {
    // Navigation
    "nav.home": "Inicio",
    "nav.earthquakes": "Sismos",
    "nav.report": "Reportar Emergencia",
    "nav.donations": "Donaciones",
    "nav.notifications": "Notificaciones",
    "nav.logout": "Cerrar Sesión",

    // Home Page
    "home.title": "SismoTracker",
    "home.subtitle": "Monitorea la actividad sísmica en Sudamérica, reporta emergencias y apoya a las comunidades afectadas a través de donaciones verificadas.",
    "home.viewEarthquakes": "Ver Sismos Recientes",
    "home.reportEmergency": "Reportar Emergencia",
    "home.features": "Funcionalidades Principales",
    "home.featuresDesc": "SismoTracker integra múltiples herramientas para proporcionar información actualizada y facilitar la ayuda humanitaria en situaciones de emergencia.",
    "home.monitoring": "Monitoreo de Sismos",
    "home.monitoringDesc": "Seguimiento en tiempo real de la actividad sísmica en toda Sudamérica utilizando datos del USGS.",
    "home.viewMap": "Ver Sismos →",
    "home.emergencyReport": "Reporte de Emergencias",
    "home.emergencyReportDesc": "Reporta daños, lesiones o situaciones de emergencia para que las autoridades puedan responder rápidamente.",
    "home.reportNow": "Reportar Ahora →",
    "home.donationsTitle": "Donaciones",
    "home.donationsDesc": "Apoya a las comunidades afectadas a través de campañas de donación verificadas y transparentes.",
    "home.donate": "Donar →",
    "home.interactiveMap": "Mapa Interactivo",
    "home.interactiveMapDesc": "Visualiza la ubicación y magnitud de los sismos en un mapa interactivo con información detallada.",
    "home.exploreMap": "Explorar Mapa →",
    "home.notificationsTitle": "Notificaciones",
    "home.notificationsDesc": "Recibe alertas sobre nuevos sismos, reportes de emergencia y actualizaciones de campañas.",
    "home.configure": "Configurar →",
    "home.chatbot": "Asistente Inteligente",
    "home.chatbotDesc": "Consulta con nuestro chatbot sobre sismos cercanos, reportes de emergencia y campañas activas.",
    "home.chat": "Chatear →",
    "home.monitoring247": "Monitoreo Continuo",
    "home.transparency": "Transparencia en Donaciones",
    "home.realtime": "Datos Actualizados",
    "home.realtimeData": "Tiempo Real",
    "home.needHelp": "¿Necesitas Ayuda o Quieres Ayudar?",
    "home.needHelpDesc": "Ya sea que necesites reportar una emergencia o quieras contribuir con una donación, estamos aquí para facilitar el proceso.",
    "home.reportEmergencyBtn": "Reportar Emergencia",
    "home.viewCampaigns": "Ver Campañas de Donación",
    "home.footer": "© 2025 SismoTracker. Datos sísmicos proporcionados por USGS.",
    "home.footerDesc": "Sistema desarrollado para ayudar a las comunidades afectadas por sismos en Sudamérica.",
    "home.badge": "Monitoreo en Tiempo Real",
    "home.featuresTitle": "Funcionalidades Principales",
    "home.featuresSubtitle": "SismoTracker integra múltiples herramientas para proporcionar información actualizada y facilitar la ayuda humanitaria en situaciones de emergencia.",
    "home.earthquakeMonitoring": "Monitoreo de Sismos",
    "home.earthquakeMonitoringDesc": "Seguimiento en tiempo real de la actividad sísmica en toda Sudamérica utilizando datos del USGS.",
    "home.emergencyReports": "Reporte de Emergencias",
    "home.emergencyReportsDesc": "Reporta daños, lesiones o situaciones de emergencia para que las autoridades puedan responder rápidamente.",
    "home.donations": "Donaciones",
    "home.notifications": "Notificaciones",
    "home.intelligentAssistant": "Asistente Inteligente",
    "home.intelligentAssistantDesc": "Consulta con nuestro chatbot sobre sismos cercanos, reportes de emergencia y campañas activas.",
    "home.continuousMonitoring": "Monitoreo Continuo",
    "home.donationTransparency": "Transparencia en Donaciones",
    "home.realTime": "Tiempo Real",
    "home.updatedData": "Datos Actualizados",
    "home.ctaTitle": "¿Necesitas Ayuda o Quieres Ayudar?",
    "home.ctaSubtitle": "Ya sea que necesites reportar una emergencia o quieras contribuir con una donación, estamos aquí para facilitar el proceso.",
    "home.footerRights": "Todos los derechos reservados.",

    // Earthquakes Page
    "earthquakes.title": "Monitoreo Sísmico",
    "earthquakes.subtitle": "Actividad sísmica en tiempo real en Sudamérica",
    "earthquakes.updateData": "Actualizar Datos",
    "earthquakes.updating": "Sincronizando...",
    "earthquakes.total": "Total de Sismos",
    "earthquakes.last30days": "Últimos 30 días",
    "earthquakes.significant": "Significativos",
    "earthquakes.magnitude5": "Magnitud ≥ 5.0",
    "earthquakes.strong": "Fuertes",
    "earthquakes.magnitude6": "Magnitud ≥ 6.1",
    "earthquakes.mostRecent": "Más Reciente",
    "earthquakes.mapTitle": "Mapa Interactivo",
    "earthquakes.mapDesc": "Visualización geográfica de {count} eventos sísmicos",
    "earthquakes.filters": "Filtros",
    "earthquakes.minor": "0.1 - 4.0",
    "earthquakes.light": "4.1 - 5.0",
    "earthquakes.moderate": "5.1 - 6.0",
    "earthquakes.strongFilter": "6.1+",
    "earthquakes.showing": "Mostrando",
    "earthquakes.of": "de",
    "earthquakes.earthquakes": "sismos",
    "earthquakes.resetFilters": "Restablecer Filtros",
    "earthquakes.minorLabel": "Menor",
    "earthquakes.lightLabel": "Ligero",
    "earthquakes.moderateLabel": "Moderado",
    "earthquakes.strongLabel": "Fuerte",
    "earthquakes.recentEvents": "Eventos Sísmicos Recientes",
    "earthquakes.recentEventsDesc": "Últimos {count} sismos registrados en orden cronológico",
    "earthquakes.depth": "Profundidad",
    "earthquakes.viewDetails": "Ver Detalles",
    "earthquakes.noData": "No hay datos disponibles",
    "earthquakes.noDataDesc": "Haz clic en \"Actualizar Datos\" para sincronizar los sismos más recientes",
    "earthquakes.syncNow": "Sincronizar Ahora",
    "earthquakes.loading": "Cargando datos sísmicos...",
    "earthquakes.syncSuccess": "✅ {count} sismos sincronizados desde USGS",
    "earthquakes.syncError": "❌ Error al sincronizar: {error}",

    // Common
    "common.loading": "Cargando...",
    "common.error": "Error",
    "common.success": "Éxito",
    "common.cancel": "Cancelar",
    "common.save": "Guardar",
    "common.close": "Cerrar",
  },
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.earthquakes": "Earthquakes",
    "nav.report": "Report Emergency",
    "nav.donations": "Donations",
    "nav.notifications": "Notifications",
    "nav.logout": "Logout",

    // Home Page
    "home.title": "SismoTracker",
    "home.subtitle": "Monitor seismic activity in South America, report emergencies and support affected communities through verified donations.",
    "home.viewEarthquakes": "View Recent Earthquakes",
    "home.reportEmergency": "Report Emergency",
    "home.features": "Main Features",
    "home.featuresDesc": "SismoTracker integrates multiple tools to provide updated information and facilitate humanitarian aid in emergency situations.",
    "home.monitoring": "Earthquake Monitoring",
    "home.monitoringDesc": "Real-time tracking of seismic activity across South America using USGS data.",
    "home.viewMap": "View Earthquakes →",
    "home.emergencyReport": "Emergency Reports",
    "home.emergencyReportDesc": "Report damage, injuries or emergency situations so authorities can respond quickly.",
    "home.reportNow": "Report Now →",
    "home.donationsTitle": "Donations",
    "home.donationsDesc": "Support affected communities through verified and transparent donation campaigns.",
    "home.donate": "Donate →",
    "home.interactiveMap": "Interactive Map",
    "home.interactiveMapDesc": "Visualize the location and magnitude of earthquakes on an interactive map with detailed information.",
    "home.exploreMap": "Explore Map →",
    "home.notificationsTitle": "Notifications",
    "home.notificationsDesc": "Receive alerts about new earthquakes, emergency reports and campaign updates.",
    "home.configure": "Configure →",
    "home.chatbot": "Smart Assistant",
    "home.chatbotDesc": "Consult with our chatbot about nearby earthquakes, emergency reports and active campaigns.",
    "home.chat": "Chat →",
    "home.monitoring247": "Continuous Monitoring",
    "home.transparency": "Donation Transparency",
    "home.realtime": "Updated Data",
    "home.realtimeData": "Real Time",
    "home.needHelp": "Need Help or Want to Help?",
    "home.needHelpDesc": "Whether you need to report an emergency or want to contribute with a donation, we're here to facilitate the process.",
    "home.reportEmergencyBtn": "Report Emergency",
    "home.viewCampaigns": "View Donation Campaigns",
    "home.footer": "© 2025 SismoTracker. Seismic data provided by USGS.",
    "home.footerDesc": "System developed to help communities affected by earthquakes in South America.",
    "home.badge": "Real-Time Monitoring",
    "home.featuresTitle": "Main Features",
    "home.featuresSubtitle": "SismoTracker integrates multiple tools to provide updated information and facilitate humanitarian aid in emergency situations.",
    "home.earthquakeMonitoring": "Earthquake Monitoring",
    "home.earthquakeMonitoringDesc": "Real-time tracking of seismic activity across South America using USGS data.",
    "home.emergencyReports": "Emergency Reports",
    "home.emergencyReportsDesc": "Report damage, injuries or emergency situations so authorities can respond quickly.",
    "home.donations": "Donations",
    "home.notifications": "Notifications",
    "home.intelligentAssistant": "Smart Assistant",
    "home.intelligentAssistantDesc": "Consult with our chatbot about nearby earthquakes, emergency reports and active campaigns.",
    "home.continuousMonitoring": "Continuous Monitoring",
    "home.donationTransparency": "Donation Transparency",
    "home.realTime": "Real Time",
    "home.updatedData": "Updated Data",
    "home.ctaTitle": "Need Help or Want to Help?",
    "home.ctaSubtitle": "Whether you need to report an emergency or want to contribute with a donation, we're here to facilitate the process.",
    "home.footerRights": "All rights reserved.",

    // Earthquakes Page
    "earthquakes.title": "Seismic Monitoring",
    "earthquakes.subtitle": "Real-time seismic activity in South America",
    "earthquakes.updateData": "Update Data",
    "earthquakes.updating": "Syncing...",
    "earthquakes.total": "Total Earthquakes",
    "earthquakes.last30days": "Last 30 days",
    "earthquakes.significant": "Significant",
    "earthquakes.magnitude5": "Magnitude ≥ 5.0",
    "earthquakes.strong": "Strong",
    "earthquakes.magnitude6": "Magnitude ≥ 6.1",
    "earthquakes.mostRecent": "Most Recent",
    "earthquakes.mapTitle": "Interactive Map",
    "earthquakes.mapDesc": "Geographic visualization of {count} seismic events",
    "earthquakes.filters": "Filters",
    "earthquakes.minor": "0.1 - 4.0",
    "earthquakes.light": "4.1 - 5.0",
    "earthquakes.moderate": "5.1 - 6.0",
    "earthquakes.strongFilter": "6.1+",
    "earthquakes.showing": "Showing",
    "earthquakes.of": "of",
    "earthquakes.earthquakes": "earthquakes",
    "earthquakes.resetFilters": "Reset Filters",
    "earthquakes.minorLabel": "Minor",
    "earthquakes.lightLabel": "Light",
    "earthquakes.moderateLabel": "Moderate",
    "earthquakes.strongLabel": "Strong",
    "earthquakes.recentEvents": "Recent Seismic Events",
    "earthquakes.recentEventsDesc": "Last {count} earthquakes recorded in chronological order",
    "earthquakes.depth": "Depth",
    "earthquakes.viewDetails": "View Details",
    "earthquakes.noData": "No data available",
    "earthquakes.noDataDesc": "Click \"Update Data\" to sync the most recent earthquakes",
    "earthquakes.syncNow": "Sync Now",
    "earthquakes.loading": "Loading seismic data...",
    "earthquakes.syncSuccess": "✅ {count} earthquakes synced from USGS",
    "earthquakes.syncError": "❌ Sync error: {error}",

    // Common
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success",
    "common.cancel": "Cancel",
    "common.save": "Save",
    "common.close": "Close",
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    return (saved as Language) || "es";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    try {
      // Primero intentar con la clave completa (notación plana)
      const flatValue = (translations[language] as any)[key];
      if (typeof flatValue === 'string') {
        return flatValue;
      }

      // Si no funciona, intentar con notación anidada
      const keys = key.split(".");
      let value: any = translations[language];

      for (const k of keys) {
        if (value && typeof value === 'object') {
          value = value[k];
        } else {
          return key;
        }
      }

      return typeof value === 'string' ? value : key;
    } catch (error) {
      console.error(`Translation error for key: ${key}`, error);
      return key;
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}

