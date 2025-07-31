import { 
  type User, 
  type InsertUser,
  type Document,
  type InsertDocument,
  type UpdateDocument,
  type DocumentType,
  type InsertDocumentType,
  documents,
  documentTypes
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Document operations
  getAllDocuments(): Promise<Document[]>;
  getDocumentById(id: number): Promise<Document | undefined>;
  createDocument(document: InsertDocument): Promise<Document>;
  updateDocument(id: number, document: UpdateDocument): Promise<Document | undefined>;
  deleteDocument(id: number): Promise<boolean>;
  
  // Document type operations
  getAllDocumentTypes(): Promise<DocumentType[]>;
  getDocumentTypeById(id: number): Promise<DocumentType | undefined>;
  createDocumentType(documentType: InsertDocumentType): Promise<DocumentType>;
  updateDocumentType(id: number, documentType: Partial<InsertDocumentType>): Promise<DocumentType | undefined>;
  deleteDocumentType(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User operations (keeping existing memory storage for users as they are not the focus)
  private users: Map<string, User> = new Map();

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Document operations using database
  async getAllDocuments(): Promise<Document[]> {
    return await db.select().from(documents);
  }
  
  async getDocumentById(id: number): Promise<Document | undefined> {
    const [document] = await db.select().from(documents).where(eq(documents.id, id));
    return document || undefined;
  }
  
  async createDocument(document: InsertDocument): Promise<Document> {
    const [newDocument] = await db
      .insert(documents)
      .values(document)
      .returning();
    return newDocument;
  }
  
  async updateDocument(id: number, document: UpdateDocument): Promise<Document | undefined> {
    const [updatedDocument] = await db
      .update(documents)
      .set({...document, updatedAt: new Date()})
      .where(eq(documents.id, id))
      .returning();
    return updatedDocument || undefined;
  }
  
  async deleteDocument(id: number): Promise<boolean> {
    const result = await db
      .delete(documents)
      .where(eq(documents.id, id));
    return (result.rowCount ?? 0) > 0;
  }
  

  
  // Document type operations
  async getAllDocumentTypes(): Promise<DocumentType[]> {
    return await db.select().from(documentTypes);
  }
  
  async getDocumentTypeById(id: number): Promise<DocumentType | undefined> {
    const [documentType] = await db.select().from(documentTypes).where(eq(documentTypes.id, id));
    return documentType || undefined;
  }
  
  async createDocumentType(documentType: InsertDocumentType): Promise<DocumentType> {
    const [newDocumentType] = await db
      .insert(documentTypes)
      .values(documentType)
      .returning();
    return newDocumentType;
  }
  
  async updateDocumentType(id: number, documentType: Partial<InsertDocumentType>): Promise<DocumentType | undefined> {
    const [updated] = await db.update(documentTypes)
      .set(documentType)
      .where(eq(documentTypes.id, id))
      .returning();
    return updated;
  }

  async deleteDocumentType(id: number): Promise<boolean> {
    const result = await db
      .delete(documentTypes)
      .where(eq(documentTypes.id, id));
    return (result.rowCount ?? 0) > 0;
  }
}

export const storage = new DatabaseStorage();
