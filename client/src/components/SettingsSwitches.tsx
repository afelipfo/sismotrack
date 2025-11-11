import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

export function SettingsSwitches() {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "es" ? "en" : "es");
  };

  return (
    <div className="flex items-center gap-2">
      {/* Language Toggle */}
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={toggleLanguage} 
        className="h-9 px-3 text-sm font-medium"
      >
        {language === "es" ? "🇪🇸 ES" : "🇺🇸 EN"}
      </Button>

      {/* Theme Toggle */}
      <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9">
        {theme === "dark" ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
      </Button>
    </div>
  );
}

