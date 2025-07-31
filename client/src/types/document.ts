export interface Document {
  id: number;
  title: string;
  code: string; // System code (auto-generated)
  userCode?: string; // User's custom code
  sortOrder?: number; // Custom user-defined sort order
  description: string;
  version: string;
  date: string;
  status: 'Aktualna' | 'Archiwalna';
  type: 'Standardowe Procedury Operacyjne' | 'Protokoły Badania' | 'Formularze CRF' | 'Dokumenty Regulacyjne';
  color?: string;
  googleDocsUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type DocumentCategory = 'sops' | 'protocols' | 'forms' | 'regulatory';
export type FilterType = 'all' | 'current' | 'archived';
