import { mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Tabla de sismos registrados desde USGS
export const earthquakes = mysqlTable("earthquakes", {
  id: varchar("id", { length: 128 }).primaryKey(), // ID del USGS
  magnitude: varchar("magnitude", { length: 10 }).notNull(),
  location: text("location").notNull(),
  latitude: varchar("latitude", { length: 20 }).notNull(),
  longitude: varchar("longitude", { length: 20 }).notNull(),
  depth: varchar("depth", { length: 20 }).notNull(), // profundidad en km
  time: timestamp("time").notNull(), // timestamp del sismo
  url: text("url"), // URL de detalles en USGS
  place: text("place"), // descripción del lugar
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Earthquake = typeof earthquakes.$inferSelect;
export type InsertEarthquake = typeof earthquakes.$inferInsert;

// Tabla de reportes de emergencias/daños
export const emergencyReports = mysqlTable("emergencyReports", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  earthquakeId: varchar("earthquakeId", { length: 128 }), // opcional, puede estar relacionado a un sismo
  reportType: mysqlEnum("reportType", ["damage", "injury", "missing", "infrastructure", "other"]).notNull(),
  severity: mysqlEnum("severity", ["low", "medium", "high", "critical"]).notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  latitude: varchar("latitude", { length: 20 }),
  longitude: varchar("longitude", { length: 20 }),
  contactName: text("contactName"),
  contactPhone: varchar("contactPhone", { length: 20 }),
  status: mysqlEnum("status", ["pending", "verified", "in_progress", "resolved"]).default("pending").notNull(),
  imageUrls: text("imageUrls"), // JSON array de URLs de imágenes
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type EmergencyReport = typeof emergencyReports.$inferSelect;
export type InsertEmergencyReport = typeof emergencyReports.$inferInsert;

// Tabla de campañas de donación
export const donationCampaigns = mysqlTable("donationCampaigns", {
  id: varchar("id", { length: 64 }).primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  earthquakeId: varchar("earthquakeId", { length: 128 }), // relacionado a un sismo específico
  targetAmount: varchar("targetAmount", { length: 20 }).notNull(), // monto objetivo
  currentAmount: varchar("currentAmount", { length: 20 }).default("0").notNull(), // monto actual recaudado
  status: mysqlEnum("status", ["active", "completed", "closed"]).default("active").notNull(),
  startDate: timestamp("startDate").defaultNow(),
  endDate: timestamp("endDate"),
  beneficiaryInfo: text("beneficiaryInfo"), // información de beneficiarios
  imageUrl: text("imageUrl"),
  createdBy: varchar("createdBy", { length: 64 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type DonationCampaign = typeof donationCampaigns.$inferSelect;
export type InsertDonationCampaign = typeof donationCampaigns.$inferInsert;

// Tabla de donaciones individuales
export const donations = mysqlTable("donations", {
  id: varchar("id", { length: 64 }).primaryKey(),
  campaignId: varchar("campaignId", { length: 64 }).notNull(),
  donorId: varchar("donorId", { length: 64 }), // puede ser anónimo
  donorName: text("donorName"),
  donorEmail: varchar("donorEmail", { length: 320 }),
  amount: varchar("amount", { length: 20 }).notNull(),
  message: text("message"),
  isAnonymous: varchar("isAnonymous", { length: 5 }).default("false").notNull(),
  donorType: mysqlEnum("donorType", ["individual", "company", "organization"]).default("individual").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Donation = typeof donations.$inferSelect;
export type InsertDonation = typeof donations.$inferInsert;

// Tabla de notificaciones
export const notifications = mysqlTable("notifications", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  type: mysqlEnum("type", ["earthquake", "emergency_report", "donation", "campaign"]).notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  relatedId: varchar("relatedId", { length: 128 }), // ID del sismo, reporte o campaña relacionada
  isRead: varchar("isRead", { length: 5 }).default("false").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;
