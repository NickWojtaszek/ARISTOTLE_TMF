import { sql } from "drizzle-orm";
import { 
  pgTable, 
  text, 
  varchar, 
  serial, 
  integer,
  timestamp 
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Categories table
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  displayName: varchar("display_name", { length: 255 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Document types table  
export const documentTypes = pgTable("document_types", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  displayName: varchar("display_name", { length: 255 }).notNull(),
  description: text("description"),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Documents table for the clinical research repository
export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  code: varchar("code", { length: 100 }).notNull().unique(), // System code (auto-generated, unique index)
  userCode: varchar("user_code", { length: 200 }), // User's custom document code/numbering
  sortOrder: integer("sort_order").default(0), // Custom user-defined sort order
  description: text("description").notNull(),
  version: varchar("version", { length: 50 }).notNull(),
  date: varchar("date", { length: 50 }).notNull(),
  status: varchar("status", { length: 50 }).notNull(), // 'Aktualna' | 'Archiwalna'
  type: varchar("type", { length: 50 }).notNull(), // Document type: 'SOP' | 'Protokół' | 'CRF' | 'Dokumenty Regulacyjne'
  color: varchar("color", { length: 7 }).default("#3B82F6"), // Kolor ikony dokumentu (hex)
  googleDocsUrl: text("google_docs_url"), // URL to Google Docs document
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertDocumentTypeSchema = createInsertSchema(documentTypes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  code: z.string().optional().default(""), // Allow empty code for auto-generation
  userCode: z.string().optional(), // User's custom code - optional
  googleDocsUrl: z.string().optional().default(""), // Make Google Docs URL optional
});

export const updateDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).partial().extend({
  sortOrder: z.number().optional(), // Allow sortOrder updates
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type DocumentType = typeof documentTypes.$inferSelect;
export type InsertDocumentType = z.infer<typeof insertDocumentTypeSchema>;
export type Document = typeof documents.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type UpdateDocument = z.infer<typeof updateDocumentSchema>;
