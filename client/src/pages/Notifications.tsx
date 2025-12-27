import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Loader2, CheckCircle2, AlertTriangle, Heart, Activity } from "lucide-react";

import { toast } from "sonner";

export default function Notifications() {
  const { user, isAuthenticated } = useAuth();

  const { data: notifications, isLoading, refetch } = trpc.notifications.list.useQuery(
    { limit: 50 },
    { enabled: isAuthenticated }
  );

  const markAsReadMutation = trpc.notifications.markAsRead.useMutation({
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "earthquake":
        return <Activity className="h-5 w-5 text-orange-500" />;
      case "emergency_report":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "donation":
        return <Heart className="h-5 w-5 text-pink-500" />;
      case "campaign":
        return <Heart className="h-5 w-5 text-blue-500" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getNotificationTypeName = (type: string) => {
    switch (type) {
      case "earthquake":
        return "Sismo";
      case "emergency_report":
        return "Reporte de Emergencia";
      case "donation":
        return "Donación";
      case "campaign":
        return "Campaña";
      default:
        return "Notificación";
    }
  };



  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Bell className="h-8 w-8" />
          Notificaciones
        </h1>
        <p className="text-muted-foreground mt-2">
          Mantente informado sobre sismos, reportes y campañas
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total de Notificaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">No Leídas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {notifications?.filter((n) => n.isRead === "false").length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de notificaciones */}
      <div className="space-y-4">
        {notifications && notifications.length > 0 ? (
          notifications.map((notification) => {
            const isUnread = notification.isRead === "false";
            return (
              <Card
                key={notification.id}
                className={`transition-all ${isUnread ? "border-primary bg-primary/5" : ""}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">{getNotificationIcon(notification.type)}</div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={isUnread ? "default" : "secondary"} className="text-xs">
                          {getNotificationTypeName(notification.type)}
                        </Badge>
                        {isUnread && (
                          <Badge variant="destructive" className="text-xs">
                            Nueva
                          </Badge>
                        )}
                      </div>

                      <h3 className="font-semibold mb-1">{notification.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>

                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          {notification.createdAt ? new Date(notification.createdAt).toLocaleString("es-ES") : "Fecha desconocida"}
                        </p>

                        {isUnread && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => markAsReadMutation.mutate(notification.id)}
                            disabled={markAsReadMutation.isPending}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Marcar como leída
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center">
                No tienes notificaciones en este momento
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

