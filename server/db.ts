import {
  InsertUser,
  InsertEarthquake,
  InsertEmergencyReport,
  InsertDonationCampaign,
  InsertDonation,
  InsertNotification,
} from "../drizzle/schema";
import { ENV } from './_core/env';

// --- IN-MEMORY DATA STORE ---
const db = {
  users: new Map<string, any>(),
  earthquakes: new Map<string, any>(),
  emergencyReports: new Map<string, any>(),
  donationCampaigns: new Map<string, any>(),
  donations: new Map<string, any>(),
  notifications: new Map<string, any>(),
};

// --- USER FUNCTIONS ---

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.id) throw new Error("User ID is required");
  const existing = db.users.get(user.id) || {};

  // Merge logic similar to onDuplicateKeyUpdate
  const merged = { ...existing, ...user };

  if (merged.lastSignedIn === undefined) merged.lastSignedIn = new Date();
  if (merged.id === ENV.ownerId) merged.role = 'admin';

  db.users.set(user.id, merged);
}

export async function getUser(id: string) {
  return db.users.get(id);
}

// --- EARTHQUAKES ---

export async function insertEarthquake(earthquake: InsertEarthquake) {
  // Update if exists or insert new
  db.earthquakes.set(earthquake.id, earthquake);
}

export async function getRecentEarthquakes(limit: number = 50) {
  return Array.from(db.earthquakes.values())
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, limit);
}

export async function getEarthquakeById(id: string) {
  return db.earthquakes.get(id) || null;
}

export async function getEarthquakesByDateRange(startDate: Date, endDate: Date) {
  return Array.from(db.earthquakes.values())
    .filter(e => {
      const t = new Date(e.time);
      return t >= startDate && t <= endDate;
    })
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
}

// --- EMERGENCY REPORTS ---

export async function createEmergencyReport(report: InsertEmergencyReport) {
  db.emergencyReports.set(report.id, { ...report, createdAt: new Date(), status: 'pending' });
}

export async function getEmergencyReports(limit: number = 100) {
  return Array.from(db.emergencyReports.values())
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

export async function getEmergencyReportById(id: string) {
  return db.emergencyReports.get(id) || null;
}

export async function getEmergencyReportsByUserId(userId: string) {
  return Array.from(db.emergencyReports.values())
    .filter(r => r.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function updateEmergencyReportStatus(
  id: string,
  status: "pending" | "verified" | "in_progress" | "resolved"
) {
  const report = db.emergencyReports.get(id);
  if (report) {
    db.emergencyReports.set(id, { ...report, status, updatedAt: new Date() });
  }
}

// --- DONATION CAMPAIGNS ---

export async function createDonationCampaign(campaign: InsertDonationCampaign) {
  db.donationCampaigns.set(campaign.id, { ...campaign, createdAt: new Date(), currentAmount: '0' });
}

export async function getDonationCampaigns(status?: "active" | "completed" | "closed") {
  let campaigns = Array.from(db.donationCampaigns.values());
  if (status) {
    campaigns = campaigns.filter(c => c.status === status);
  }
  return campaigns.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getDonationCampaignById(id: string) {
  return db.donationCampaigns.get(id) || null;
}

export async function updateCampaignAmount(campaignId: string, amount: string) {
  const campaign = db.donationCampaigns.get(campaignId);
  if (campaign) {
    const current = parseFloat(campaign.currentAmount || "0");
    const added = parseFloat(amount || "0");
    db.donationCampaigns.set(campaignId, {
      ...campaign,
      currentAmount: (current + added).toString(),
      updatedAt: new Date()
    });
  }
}

// --- DONATIONS ---

export async function createDonation(donation: InsertDonation) {
  db.donations.set(donation.id, { ...donation, createdAt: new Date() });
  await updateCampaignAmount(donation.campaignId, donation.amount);
}

export async function getDonationsByCampaignId(campaignId: string) {
  return Array.from(db.donations.values())
    .filter(d => d.campaignId === campaignId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// --- NOTIFICATIONS ---

export async function createNotification(notification: InsertNotification) {
  const id = notification.id || `notif_${Date.now()}_${Math.random()}`;
  db.notifications.set(id, { ...notification, id, isRead: "false", createdAt: new Date() });
}

export async function getUserNotifications(userId: string, limit: number = 50) {
  return Array.from(db.notifications.values())
    .filter(n => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

export async function markNotificationAsRead(id: string) {
  const notif = db.notifications.get(id);
  if (notif) {
    db.notifications.set(id, { ...notif, isRead: "true" });
  }
}

// --- MOCK DATABASE HELPER ---
export async function getDb() {
  // Returns true to satisfy truthiness checks if needed, but not used by above functions
  return true;
}

