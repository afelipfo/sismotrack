import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, Heart, DollarSign } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

export default function Donations() {
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [donationAmount, setDonationAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorType, setDonorType] = useState("individual");
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Obtener campañas activas
  const { data: campaigns, isLoading, refetch } = trpc.donationCampaigns.list.useQuery({
    status: "active",
  });

  // Mutación para crear donación
  const createDonationMutation = trpc.donations.create.useMutation({
    onSuccess: () => {
      toast.success("¡Gracias por tu donación! Tu apoyo hace la diferencia.");
      setIsDialogOpen(false);
      setDonationAmount("");
      setDonorName("");
      setDonorEmail("");
      setMessage("");
      setIsAnonymous(false);
      refetch();
    },
    onError: (error) => {
      toast.error(`Error al procesar la donación: ${error.message}`);
    },
  });

  const handleDonate = () => {
    if (!selectedCampaign || !donationAmount) {
      toast.error("Por favor completa todos los campos obligatorios");
      return;
    }

    const amount = parseFloat(donationAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Por favor ingresa un monto válido");
      return;
    }

    createDonationMutation.mutate({
      campaignId: selectedCampaign,
      amount: donationAmount,
      donorName: isAnonymous ? undefined : donorName,
      donorEmail: isAnonymous ? undefined : donorEmail,
      message,
      isAnonymous: isAnonymous ? "true" : "false",
      donorType: donorType as any,
    });
  };

  const calculateProgress = (current: string, target: string) => {
    const currentAmount = parseFloat(current);
    const targetAmount = parseFloat(target);
    return (currentAmount / targetAmount) * 100;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Campañas de Donación</h1>
        <p className="text-muted-foreground mt-2">
          Apoya a las comunidades afectadas por sismos en Sudamérica
        </p>
      </div>

      {/* Estadísticas generales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Campañas Activas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaigns?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Recaudado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${campaigns?.reduce((sum, c) => sum + parseFloat(c.currentAmount), 0).toFixed(2) || "0.00"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Meta Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${campaigns?.reduce((sum, c) => sum + parseFloat(c.targetAmount), 0).toFixed(2) || "0.00"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de campañas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {campaigns && campaigns.length > 0 ? (
          campaigns.map((campaign) => {
            const progress = calculateProgress(campaign.currentAmount, campaign.targetAmount);
            return (
              <Card key={campaign.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{campaign.title}</CardTitle>
                    <Badge variant={campaign.status === "active" ? "default" : "secondary"}>
                      {campaign.status === "active" ? "Activa" : campaign.status}
                    </Badge>
                  </div>
                  <CardDescription className="mt-2">{campaign.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    {/* Progreso */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium">
                          ${parseFloat(campaign.currentAmount).toFixed(2)}
                        </span>
                        <span className="text-muted-foreground">
                          de ${parseFloat(campaign.targetAmount).toFixed(2)}
                        </span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        {progress.toFixed(1)}% completado
                      </p>
                    </div>

                    {/* Información adicional */}
                    {campaign.beneficiaryInfo && (
                      <div className="text-sm">
                        <p className="font-medium mb-1">Beneficiarios:</p>
                        <p className="text-muted-foreground">{campaign.beneficiaryInfo}</p>
                      </div>
                    )}

                    {campaign.endDate && (
                      <p className="text-xs text-muted-foreground">
                        Finaliza: {new Date(campaign.endDate).toLocaleDateString("es-ES")}
                      </p>
                    )}
                  </div>

                  {/* Botón de donación */}
                  <Dialog open={isDialogOpen && selectedCampaign === campaign.id} onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (open) setSelectedCampaign(campaign.id);
                  }}>
                    <DialogTrigger asChild>
                      <Button className="w-full mt-4" onClick={() => setSelectedCampaign(campaign.id)}>
                        <Heart className="mr-2 h-4 w-4" />
                        Donar Ahora
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Realizar Donación</DialogTitle>
                        <DialogDescription>{campaign.title}</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        {/* Monto */}
                        <div className="space-y-2">
                          <Label htmlFor="amount">Monto a Donar (USD) *</Label>
                          <Input
                            id="amount"
                            type="number"
                            placeholder="50.00"
                            value={donationAmount}
                            onChange={(e) => setDonationAmount(e.target.value)}
                          />
                        </div>

                        {/* Tipo de donante */}
                        <div className="space-y-2">
                          <Label htmlFor="donorType">Tipo de Donante</Label>
                          <Select value={donorType} onValueChange={setDonorType}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="individual">Persona Individual</SelectItem>
                              <SelectItem value="company">Empresa</SelectItem>
                              <SelectItem value="organization">Organización</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Información del donante */}
                        {!isAnonymous && (
                          <>
                            <div className="space-y-2">
                              <Label htmlFor="donorName">Nombre</Label>
                              <Input
                                id="donorName"
                                placeholder="Tu nombre o nombre de la organización"
                                value={donorName}
                                onChange={(e) => setDonorName(e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="donorEmail">Email</Label>
                              <Input
                                id="donorEmail"
                                type="email"
                                placeholder="tu@email.com"
                                value={donorEmail}
                                onChange={(e) => setDonorEmail(e.target.value)}
                              />
                            </div>
                          </>
                        )}

                        {/* Mensaje */}
                        <div className="space-y-2">
                          <Label htmlFor="message">Mensaje (Opcional)</Label>
                          <Textarea
                            id="message"
                            placeholder="Deja un mensaje de apoyo..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={3}
                          />
                        </div>

                        {/* Anónimo */}
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="anonymous"
                            checked={isAnonymous}
                            onChange={(e) => setIsAnonymous(e.target.checked)}
                            className="rounded"
                          />
                          <Label htmlFor="anonymous" className="cursor-pointer">
                            Donar de forma anónima
                          </Label>
                        </div>

                        <Button
                          onClick={handleDonate}
                          className="w-full"
                          disabled={createDonationMutation.isPending}
                        >
                          {createDonationMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Procesando...
                            </>
                          ) : (
                            <>
                              <DollarSign className="mr-2 h-4 w-4" />
                              Confirmar Donación
                            </>
                          )}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="col-span-2 text-center py-12">
            <p className="text-muted-foreground">No hay campañas activas en este momento</p>
          </div>
        )}
      </div>
    </div>
  );
}

