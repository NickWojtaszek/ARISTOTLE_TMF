import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertDocumentSchema, 
  updateDocumentSchema,
  insertDocumentTypeSchema 
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Document CRUD routes
  app.get("/api/documents", async (req, res) => {
    try {
      const documents = await storage.getAllDocuments();
      res.json(documents);
    } catch (error) {
      console.error("Error fetching documents:", error);
      res.status(500).json({ error: "Failed to fetch documents" });
    }
  });

  app.get("/api/documents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid document ID" });
      }
      
      const document = await storage.getDocumentById(id);
      if (!document) {
        return res.status(404).json({ error: "Document not found" });
      }
      
      res.json(document);
    } catch (error) {
      console.error("Error fetching document:", error);
      res.status(500).json({ error: "Failed to fetch document" });
    }
  });

  app.post("/api/documents", async (req, res) => {
    try {
      const validatedData = insertDocumentSchema.parse(req.body);
      
      // Generate unique code if not provided or empty
      if (!validatedData.code || validatedData.code.trim() === '') {
        const timestamp = Date.now().toString().slice(-6);
        const typePrefix = validatedData.type.toUpperCase().slice(0, 3);
        validatedData.code = `ARI-${typePrefix}-${timestamp}`;
      }
      
      const document = await storage.createDocument(validatedData);
      res.status(201).json(document);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid document data", details: error.errors });
      }
      
      // Handle duplicate code constraint
      if (error && typeof error === 'object' && 'code' in error && error.code === '23505') {
        const errorDetail = 'detail' in error ? String(error.detail) : '';
        if (errorDetail.includes('documents_code_unique')) {
          return res.status(400).json({ 
            error: "Document code already exists", 
            message: "Please use a unique document code. The code you entered is already in use." 
          });
        }
      }
      
      console.error("Error creating document:", error);
      res.status(500).json({ error: "Failed to create document" });
    }
  });

  app.patch("/api/documents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid document ID" });
      }
      
      const validatedData = updateDocumentSchema.parse(req.body);
      const document = await storage.updateDocument(id, validatedData);
      
      if (!document) {
        return res.status(404).json({ error: "Document not found" });
      }
      
      res.json(document);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid document data", details: error.errors });
      }
      console.error("Error updating document:", error);
      res.status(500).json({ error: "Failed to update document" });
    }
  });

  app.delete("/api/documents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid document ID" });
      }
      
      const deleted = await storage.deleteDocument(id);
      if (!deleted) {
        return res.status(404).json({ error: "Document not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting document:", error);
      res.status(500).json({ error: "Failed to delete document" });
    }
  });



  // Document type routes
  app.get("/api/document-types", async (req, res) => {
    try {
      const documentTypes = await storage.getAllDocumentTypes();
      res.json(documentTypes);
    } catch (error) {
      console.error("Error fetching document types:", error);
      res.status(500).json({ error: "Failed to fetch document types" });
    }
  });

  app.get("/api/document-types/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid document type ID" });
      }
      
      const documentType = await storage.getDocumentTypeById(id);
      if (!documentType) {
        return res.status(404).json({ error: "Document type not found" });
      }
      
      res.json(documentType);
    } catch (error) {
      console.error("Error fetching document type:", error);
      res.status(500).json({ error: "Failed to fetch document type" });
    }
  });

  app.post("/api/document-types", async (req, res) => {
    try {
      const validatedData = insertDocumentTypeSchema.parse(req.body);
      const documentType = await storage.createDocumentType(validatedData);
      res.status(201).json(documentType);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid document type data", details: error.errors });
      }
      console.error("Error creating document type:", error);
      res.status(500).json({ error: "Failed to create document type" });
    }
  });

  app.patch("/api/document-types/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid document type ID" });
      }

      const validatedData = insertDocumentTypeSchema.partial().parse(req.body);
      const documentType = await storage.updateDocumentType(id, validatedData);
      
      if (!documentType) {
        return res.status(404).json({ error: "Document type not found" });
      }
      
      res.json(documentType);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid document type data", details: error.errors });
      }
      console.error("Error updating document type:", error);
      res.status(500).json({ error: "Failed to update document type" });
    }
  });

  app.delete("/api/document-types/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid document type ID" });
      }
      
      const deleted = await storage.deleteDocumentType(id);
      if (!deleted) {
        return res.status(404).json({ error: "Document type not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting document type:", error);
      res.status(500).json({ error: "Failed to delete document type" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
