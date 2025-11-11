import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { getLoginUrl } from "@/const";

export default function ReportEmergency() {
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    reportType: "",
    severity: "",
    description: "",
    location: "",
    latitude: "",
    longitude: "",
    contactName: "",
    contactPhone: "",
  });

  const createReportMutation = trpc.emergencyReports.create.useMutation({
    onSuccess: () => {
      toast.success("Reporte enviado exitosamente. Nuestro equipo lo revisará pronto.");
      // Reset form
      setFormData({
        reportType: "",
        severity: "",
        description: "",
        location: "",
        latitude: "",
        longitude: "",
        contactName: "",
        contactPhone: "",
      });
    },
    onError: (error) => {
      toast.error(`Error al enviar el reporte: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.reportType || !formData.severity || !formData.description || !formData.location) {
      toast.error("Por favor completa todos los campos obligatorios");
      return;
    }

    createReportMutation.mutate(formData as any);
  };

  const handleGetLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          });
          toast.success("Ubicación obtenida exitosamente");
        },
        (error) => {
          toast.error("No se pudo obtener la ubicación: " + error.message);
        }
      );
    } else {
      toast.error("Tu navegador no soporta geolocalización");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container max-w-2xl py-12">
        <Card>
          <CardHeader>
            <CardTitle>Autenticación Requerida</CardTitle>
            <CardDescription>
              Debes iniciar sesión para reportar una emergencia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <a href={getLoginUrl()}>Iniciar Sesión</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Reportar Emergencia</h1>
        <p className="text-muted-foreground mt-2">
          Reporta daños, lesiones o situaciones de emergencia relacionadas con sismos
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            Formulario de Reporte
          </CardTitle>
          <CardDescription>
            Todos los campos marcados con * son obligatorios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tipo de reporte */}
            <div className="space-y-2">
              <Label htmlFor="reportType">Tipo de Reporte *</Label>
              <Select
                value={formData.reportType}
                onValueChange={(value) => setFormData({ ...formData, reportType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el tipo de reporte" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="damage">Daños Materiales</SelectItem>
                  <SelectItem value="injury">Lesiones/Heridos</SelectItem>
                  <SelectItem value="missing">Personas Desaparecidas</SelectItem>
                  <SelectItem value="infrastructure">Daños en Infraestructura</SelectItem>
                  <SelectItem value="other">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Severidad */}
            <div className="space-y-2">
              <Label htmlFor="severity">Severidad *</Label>
              <Select
                value={formData.severity}
                onValueChange={(value) => setFormData({ ...formData, severity: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona la severidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baja</SelectItem>
                  <SelectItem value="medium">Media</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="critical">Crítica</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <Label htmlFor="description">Descripción *</Label>
              <Textarea
                id="description"
                placeholder="Describe la situación de emergencia con el mayor detalle posible..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={5}
              />
            </div>

            {/* Ubicación */}
            <div className="space-y-2">
              <Label htmlFor="location">Ubicación *</Label>
              <Input
                id="location"
                placeholder="Dirección o descripción del lugar"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            {/* Coordenadas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitud</Label>
                <Input
                  id="latitude"
                  placeholder="-12.0464"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitud</Label>
                <Input
                  id="longitude"
                  placeholder="-77.0428"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                />
              </div>
            </div>

            <Button type="button" variant="outline" onClick={handleGetLocation} className="w-full">
              📍 Obtener Mi Ubicación Actual
            </Button>

            {/* Información de contacto */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactName">Nombre de Contacto</Label>
                <Input
                  id="contactName"
                  placeholder="Tu nombre"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Teléfono de Contacto</Label>
                <Input
                  id="contactPhone"
                  placeholder="+51 999 999 999"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                />
              </div>
            </div>

            {/* Botón de envío */}
            <Button
              type="submit"
              className="w-full"
              disabled={createReportMutation.isPending}
            >
              {createReportMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando Reporte...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Enviar Reporte
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Información adicional */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Información Importante</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Tu reporte será revisado por nuestro equipo lo antes posible.</p>
          <p>• Si es una emergencia médica, llama inmediatamente a los servicios de emergencia locales.</p>
          <p>• Mantén la calma y sigue las instrucciones de las autoridades locales.</p>
          <p>• Si es posible, toma fotografías de los daños para documentar la situación.</p>
        </CardContent>
      </Card>
    </div>
  );
}

