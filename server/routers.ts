import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";

export const appRouter = router({
  system: systemRouter,



  // Routers de funcionalidades
  earthquakes: router({
    // Obtener sismos recientes desde la base de datos
    list: publicProcedure.input(z.object({ limit: z.number().optional() }).optional()).query(async ({ input }) => {
      const { getRecentEarthquakes } = await import("./db");
      return await getRecentEarthquakes(input?.limit || 200);
    }),

    // Obtener un sismo por ID
    getById: publicProcedure.input(z.string()).query(async ({ input }) => {
      const { getEarthquakeById } = await import("./db");
      return await getEarthquakeById(input);
    }),

    // Sincronizar sismos desde USGS
    sync: publicProcedure
      .input(
        z.object({
          minMagnitude: z.number().optional(),
          daysBack: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { fetchRecentEarthquakes, convertUSGSFeatureToEarthquake } = await import(
          "./earthquakeService"
        );
        const { insertEarthquake } = await import("./db");

        const features = await fetchRecentEarthquakes(input.minMagnitude ?? 0, input.daysBack || 30);
        let inserted = 0;
        for (const feature of features) {
          try {
            const earthquake = convertUSGSFeatureToEarthquake(feature);
            await insertEarthquake(earthquake);
            inserted++;
          } catch (error) {
            console.error(`Error inserting earthquake ${feature.id}:`, error);
          }
        }
        return { total: features.length, inserted };
      }),

    // Buscar sismos cerca de una ubicación
    searchNearLocation: publicProcedure
      .input(
        z.object({
          latitude: z.number(),
          longitude: z.number(),
          radiusKm: z.number().optional(),
          minMagnitude: z.number().optional(),
          daysBack: z.number().optional(),
        })
      )
      .query(async ({ input }) => {
        const { fetchEarthquakesNearLocation, convertUSGSFeatureToEarthquake } = await import(
          "./earthquakeService"
        );
        const features = await fetchEarthquakesNearLocation(
          input.latitude,
          input.longitude,
          input.radiusKm || 500,
          input.minMagnitude ?? 0,
          input.daysBack || 30
        );
        return features.map(convertUSGSFeatureToEarthquake);
      }),
  }),

  emergencyReports: router({
    // Listar todos los reportes
    list: publicProcedure.input(z.object({ limit: z.number().optional() }).optional()).query(async ({ input }) => {
      const { getEmergencyReports } = await import("./db");
      return await getEmergencyReports(input?.limit || 100);
    }),

    // Obtener reportes del usuario actual
    myReports: protectedProcedure.query(async ({ ctx }) => {
      const { getEmergencyReportsByUserId } = await import("./db");
      return await getEmergencyReportsByUserId(ctx.user.id);
    }),

    // Crear un nuevo reporte
    create: protectedProcedure
      .input(
        z.object({
          earthquakeId: z.string().optional(),
          reportType: z.enum(["damage", "injury", "missing", "infrastructure", "other"]),
          severity: z.enum(["low", "medium", "high", "critical"]),
          description: z.string(),
          location: z.string(),
          latitude: z.string().optional(),
          longitude: z.string().optional(),
          contactName: z.string().optional(),
          contactPhone: z.string().optional(),
          imageUrls: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { createEmergencyReport } = await import("./db");
        const { notifyOwner } = await import("./_core/notification");
        const id = `report_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        await createEmergencyReport({
          id,
          userId: ctx.user.id,
          ...input,
        });
        // Notificar al administrador
        await notifyOwner({
          title: "Nuevo Reporte de Emergencia",
          content: `Usuario ${ctx.user.name || ctx.user.id} reportó: ${input.description.substring(0, 100)}...`,
        });
        return { id, success: true };
      }),

    // Actualizar el estado de un reporte (solo admin)
    updateStatus: protectedProcedure
      .input(
        z.object({
          id: z.string(),
          status: z.enum(["pending", "verified", "in_progress", "resolved"]),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }
        const { updateEmergencyReportStatus } = await import("./db");
        await updateEmergencyReportStatus(input.id, input.status);
        return { success: true };
      }),
  }),

  donationCampaigns: router({
    // Listar campañas
    list: publicProcedure
      .input(z.object({ status: z.enum(["active", "completed", "closed"]).optional() }).optional())
      .query(async ({ input }) => {
        const { getDonationCampaigns } = await import("./db");
        return await getDonationCampaigns(input?.status);
      }),

    // Obtener una campaña por ID
    getById: publicProcedure.input(z.string()).query(async ({ input }) => {
      const { getDonationCampaignById } = await import("./db");
      return await getDonationCampaignById(input);
    }),

    // Crear una nueva campaña (solo admin)
    create: protectedProcedure
      .input(
        z.object({
          title: z.string(),
          description: z.string(),
          earthquakeId: z.string().optional(),
          targetAmount: z.string(),
          beneficiaryInfo: z.string().optional(),
          imageUrl: z.string().optional(),
          endDate: z.date().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }
        const { createDonationCampaign } = await import("./db");
        const id = `campaign_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        await createDonationCampaign({
          id,
          createdBy: ctx.user.id,
          ...input,
        });
        return { id, success: true };
      }),
  }),

  donations: router({
    // Obtener donaciones de una campaña
    getByCampaign: publicProcedure.input(z.string()).query(async ({ input }) => {
      const { getDonationsByCampaignId } = await import("./db");
      return await getDonationsByCampaignId(input);
    }),

    // Crear una donación
    create: publicProcedure
      .input(
        z.object({
          campaignId: z.string(),
          donorName: z.string().optional(),
          donorEmail: z.string().optional(),
          amount: z.string(),
          message: z.string().optional(),
          isAnonymous: z.string().optional(),
          donorType: z.enum(["individual", "company", "organization"]).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { createDonation } = await import("./db");
        const { notifyOwner } = await import("./_core/notification");
        const id = `donation_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        await createDonation({
          id,
          donorId: ctx.user?.id,
          ...input,
        });
        // Notificar al administrador
        await notifyOwner({
          title: "Nueva Donación Recibida",
          content: `Donación de $${input.amount} para la campaña ${input.campaignId}`,
        });
        return { id, success: true };
      }),
  }),

  chatbot: router({
    // Consultar al chatbot
    query: publicProcedure
      .input(
        z.object({
          message: z.string(),
          conversationHistory: z
            .array(
              z.object({
                role: z.enum(["user", "assistant"]),
                content: z.string(),
              })
            )
            .optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { invokeLLM } = await import("./_core/llm");
        const {
          getRecentEarthquakes,
          getEmergencyReports,
          getDonationCampaigns,
        } = await import("./db");

        // Obtener datos relevantes para el contexto
        const earthquakes = await getRecentEarthquakes(10);
        const reports = await getEmergencyReports(10);
        const campaigns = await getDonationCampaigns("active");

        // Construir contexto para el LLM
        const contextData = {
          earthquakes: earthquakes.map((e) => ({
            magnitude: e.magnitude,
            location: e.place || e.location,
            time: e.time,
            depth: e.depth,
          })),
          emergencyReports: reports.map((r) => ({
            type: r.reportType,
            severity: r.severity,
            location: r.location,
            status: r.status,
            createdAt: r.createdAt,
          })),
          donationCampaigns: campaigns.map((c) => ({
            title: c.title,
            description: c.description,
            currentAmount: c.currentAmount,
            targetAmount: c.targetAmount,
            status: c.status,
          })),
        };

        // Preparar mensajes para el LLM
        const messages: any[] = [
          {
            role: "system",
            content: `Eres un asistente inteligente para SismoTracker, un sistema de seguimiento de sismos y ayuda humanitaria en Sudamérica.

Tu función es ayudar a los usuarios a:
1. Consultar información sobre sismos recientes en su área
2. Obtener detalles sobre reportes de emergencias activos
3. Conocer las campañas de donación disponibles
4. Proporcionar orientación sobre qué hacer en caso de sismo

Datos actuales del sistema:
${JSON.stringify(contextData, null, 2)}

Responde de manera clara, concisa y útil en español. Si el usuario pregunta sobre sismos cercanos a una ubicación específica, usa la información de los sismos recientes. Si pregunta sobre cómo ayudar, menciona las campañas de donación activas.`,
          },
        ];

        // Agregar historial de conversación si existe
        if (input.conversationHistory && input.conversationHistory.length > 0) {
          messages.push(...input.conversationHistory);
        }

        // Agregar mensaje del usuario
        messages.push({
          role: "user",
          content: input.message,
        });

        // Llamar al LLM
        const response = await invokeLLM({ messages });
        const content = response.choices[0].message.content;

        // Asegurar que siempre devolvemos un string
        const responseText = typeof content === 'string' ? content : JSON.stringify(content);

        return {
          response: responseText,
        };
      }),
  }),

  notifications: router({
    // Obtener notificaciones del usuario
    list: protectedProcedure.input(z.object({ limit: z.number().optional() }).optional()).query(async ({ ctx, input }) => {
      const { getUserNotifications } = await import("./db");
      return await getUserNotifications(ctx.user.id, input?.limit || 50);
    }),

    // Marcar notificación como leída
    markAsRead: protectedProcedure.input(z.string()).mutation(async ({ input }) => {
      const { markNotificationAsRead } = await import("./db");
      await markNotificationAsRead(input);
      return { success: true };
    }),
  }),
});

export type AppRouter = typeof appRouter;
