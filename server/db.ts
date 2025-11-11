import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.id) {
    throw new Error("User ID is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      id: user.id,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role === undefined) {
      if (user.id === ENV.ownerId) {
        user.role = 'admin';
        values.role = 'admin';
        updateSet.role = 'admin';
      }
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUser(id: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ EARTHQUAKES ============
import {
  earthquakes,
  InsertEarthquake,
  emergencyReports,
  InsertEmergencyReport,
  donationCampaigns,
  InsertDonationCampaign,
  donations,
  InsertDonation,
  notifications,
  InsertNotification,
} from "../drizzle/schema";
import { desc, and, gte, lte, sql } from "drizzle-orm";

export async function insertEarthquake(earthquake: InsertEarthquake) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(earthquakes).values(earthquake).onDuplicateKeyUpdate({
    set: {
      magnitude: earthquake.magnitude,
      location: earthquake.location,
      latitude: earthquake.latitude,
      longitude: earthquake.longitude,
      depth: earthquake.depth,
      time: earthquake.time,
      url: earthquake.url,
      place: earthquake.place,
    },
  });
}

export async function getRecentEarthquakes(limit: number = 50) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(earthquakes).orderBy(desc(earthquakes.time)).limit(limit);
}

export async function getEarthquakeById(id: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(earthquakes).where(eq(earthquakes.id, id)).limit(1);
  return result[0] || null;
}

export async function getEarthquakesByDateRange(startDate: Date, endDate: Date) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(earthquakes)
    .where(and(gte(earthquakes.time, startDate), lte(earthquakes.time, endDate)))
    .orderBy(desc(earthquakes.time));
}

// ============ EMERGENCY REPORTS ============
export async function createEmergencyReport(report: InsertEmergencyReport) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(emergencyReports).values(report);
}

export async function getEmergencyReports(limit: number = 100) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(emergencyReports).orderBy(desc(emergencyReports.createdAt)).limit(limit);
}

export async function getEmergencyReportById(id: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(emergencyReports).where(eq(emergencyReports.id, id)).limit(1);
  return result[0] || null;
}

export async function getEmergencyReportsByUserId(userId: string) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(emergencyReports)
    .where(eq(emergencyReports.userId, userId))
    .orderBy(desc(emergencyReports.createdAt));
}

export async function updateEmergencyReportStatus(
  id: string,
  status: "pending" | "verified" | "in_progress" | "resolved"
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db
    .update(emergencyReports)
    .set({ status, updatedAt: new Date() })
    .where(eq(emergencyReports.id, id));
}

// ============ DONATION CAMPAIGNS ============
export async function createDonationCampaign(campaign: InsertDonationCampaign) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(donationCampaigns).values(campaign);
}

export async function getDonationCampaigns(status?: "active" | "completed" | "closed") {
  const db = await getDb();
  if (!db) return [];
  if (status) {
    return await db
      .select()
      .from(donationCampaigns)
      .where(eq(donationCampaigns.status, status))
      .orderBy(desc(donationCampaigns.createdAt));
  }
  return await db.select().from(donationCampaigns).orderBy(desc(donationCampaigns.createdAt));
}

export async function getDonationCampaignById(id: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(donationCampaigns).where(eq(donationCampaigns.id, id)).limit(1);
  return result[0] || null;
}

export async function updateCampaignAmount(campaignId: string, amount: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const campaign = await getDonationCampaignById(campaignId);
  if (!campaign) throw new Error("Campaign not found");
  const currentAmount = parseFloat(campaign.currentAmount);
  const newAmount = currentAmount + parseFloat(amount);
  await db
    .update(donationCampaigns)
    .set({ currentAmount: newAmount.toString(), updatedAt: new Date() })
    .where(eq(donationCampaigns.id, campaignId));
}

// ============ DONATIONS ============
export async function createDonation(donation: InsertDonation) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(donations).values(donation);
  // Actualizar el monto de la campaña
  await updateCampaignAmount(donation.campaignId, donation.amount);
}

export async function getDonationsByCampaignId(campaignId: string) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(donations)
    .where(eq(donations.campaignId, campaignId))
    .orderBy(desc(donations.createdAt));
}

// ============ NOTIFICATIONS ============
export async function createNotification(notification: InsertNotification) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(notifications).values(notification);
}

export async function getUserNotifications(userId: string, limit: number = 50) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(limit);
}

export async function markNotificationAsRead(id: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(notifications).set({ isRead: "true" }).where(eq(notifications.id, id));
}
